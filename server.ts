import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { 
  JobPosting, 
  CandidateRecord, 
  CompanyProfile, 
  AnalysisResult,
  CandidateProfile,
  SkillVerification,
  EvidenceItem,
  SkillLevel,
  SkillImportance
} from './src/types';
import { 
  sampleJobs, 
  sampleCandidates, 
  initialCompanyProfile,
  sampleDataAnalystJob
} from './src/data/mockData';
import { calculateDeterministicScores } from './src/lib/scoringEngine';
import { verifyAllCandidateSkills } from './src/lib/evidenceEngine';
import { generateCandidateComparisonAnalysis } from './src/lib/comparisonEngine';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// In-memory / file-backed persistent database store for MVP
let jobs: JobPosting[] = [...sampleJobs];
let candidates: CandidateRecord[] = [...sampleCandidates];
let companyProfile: CompanyProfile = { ...initialCompanyProfile };

// Initialize Gemini Client safely
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    candidatesCount: candidates.length,
    jobsCount: jobs.length
  });
});

// Company profile
app.get('/api/company-profile', (req, res) => {
  res.json(companyProfile);
});

app.get('/api/company', (req, res) => {
  res.json(companyProfile);
});

app.put('/api/company-profile', (req, res) => {
  companyProfile = { ...companyProfile, ...req.body };
  res.json(companyProfile);
});

app.put('/api/company', (req, res) => {
  companyProfile = { ...companyProfile, ...req.body };
  res.json(companyProfile);
});

// Jobs
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.post('/api/jobs', (req, res) => {
  const newJob: JobPosting = {
    id: `job-${Date.now()}`,
    title: req.body.title || 'Untitled Role',
    department: req.body.department || 'General',
    location: req.body.location || 'Remote',
    type: req.body.type || 'Full-time',
    experienceRequiredYears: Number(req.body.experienceRequiredYears) || 2,
    salaryRange: req.body.salaryRange || '$100,000 - $130,000',
    description: req.body.description || '',
    requiredSkills: req.body.requiredSkills || [],
    createdAt: new Date().toISOString().split('T')[0],
    active: true,
    totalApplicants: 0,
  };
  jobs.unshift(newJob);
  res.status(201).json(newJob);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Candidates
app.get('/api/candidates', (req, res) => {
  const { jobId, search, skill, status } = req.query;
  let filtered = [...candidates];

  if (jobId && typeof jobId === 'string') {
    filtered = filtered.filter((c) => c.jobId === jobId);
  }
  if (status && typeof status === 'string') {
    filtered = filtered.filter((c) => c.hiringStatus === status);
  }
  if (skill && typeof skill === 'string') {
    const sLower = skill.toLowerCase();
    filtered = filtered.filter((c) =>
      c.candidateProfile.allExtractedSkills.some((s) => s.toLowerCase().includes(sLower)) ||
      c.analysis.skillVerifications.some((v) => v.skillName.toLowerCase().includes(sLower))
    );
  }
  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter((c) =>
      c.candidateProfile.name.toLowerCase().includes(q) ||
      c.candidateProfile.title.toLowerCase().includes(q) ||
      c.candidateProfile.allExtractedSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  // Sort by overall score descending by default
  filtered.sort((a, b) => b.analysis.scores.overallScore - a.analysis.scores.overallScore);

  res.json(filtered);
});

app.get('/api/candidates/:id', (req, res) => {
  const candidate = candidates.find((c) => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  res.json(candidate);
});

// Update candidate status
const updateStatusHandler = (req: express.Request, res: express.Response) => {
  const candidate = candidates.find((c) => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  if (req.body.status) {
    candidate.hiringStatus = req.body.status;
  }
  if (req.body.interviewDate !== undefined) {
    candidate.interviewDate = req.body.interviewDate;
  }
  if (req.body.hrNotes) {
    candidate.hrNotes = candidate.hrNotes || [];
    candidate.hrNotes.unshift({
      id: `hrn-${Date.now()}`,
      author: companyProfile.recruiterName || 'Jessica Miller',
      text: req.body.hrNotes,
      createdAt: new Date().toISOString()
    });
  }
  res.json(candidate);
};

app.post('/api/candidates/:id/status', updateStatusHandler);
app.patch('/api/candidates/:id/status', updateStatusHandler);

// Toggle shortlist
app.post('/api/candidates/:id/shortlist', (req, res) => {
  const candidate = candidates.find((c) => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  candidate.shortlisted = !candidate.shortlisted;
  if (candidate.shortlisted && candidate.hiringStatus === 'New') {
    candidate.hiringStatus = 'Shortlisted';
  }
  res.json(candidate);
});

// Add HR note
app.post('/api/candidates/:id/note', (req, res) => {
  const candidate = candidates.find((c) => c.id === req.params.id);
  if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
  const note = {
    id: `note-${Date.now()}`,
    author: req.body.author || companyProfile.recruiterName || 'HR Recruiter',
    text: req.body.text || '',
    createdAt: new Date().toISOString(),
  };
  candidate.hrNotes.push(note);
  res.json(candidate);
});

// Reset demo data
app.post('/api/reset-demo', (req, res) => {
  jobs = [...sampleJobs];
  candidates = [...sampleCandidates];
  companyProfile = { ...initialCompanyProfile };
  res.json({ message: 'Demo data reset successfully', candidatesCount: candidates.length });
});

// ==================== CANDIDATE COMPARISON & AI-ASSISTED RECOMMENDATION ====================

app.post('/api/compare-candidates', async (req, res) => {
  try {
    const { candidateIds, jobId, candidatesPayload, activeJobPayload } = req.body;

    let targetCandidates: CandidateRecord[] = [];

    if (Array.isArray(candidatesPayload) && candidatesPayload.length >= 2) {
      targetCandidates = candidatesPayload;
    } else if (Array.isArray(candidateIds) && candidateIds.length >= 2) {
      targetCandidates = candidateIds
        .map((id: string) => candidates.find((c) => c.id === id))
        .filter(Boolean) as CandidateRecord[];
    }

    if (targetCandidates.length < 2 || targetCandidates.length > 4) {
      return res.status(400).json({ 
        error: 'Please select 2 or 3 candidates for side-by-side comparison.' 
      });
    }

    let targetJob = activeJobPayload || jobs.find((j) => j.id === jobId) || jobs[0] || sampleDataAnalystJob;

    // 1. Generate guaranteed deterministic comparison base
    const baseAnalysis = generateCandidateComparisonAnalysis(targetCandidates, targetJob);

    // 2. Enhance with Gemini 3.8 Flash if configured
    const ai = getGeminiClient();
    if (ai) {
      try {
        console.log('Invoking Gemini 3.8 Flash for AI-assisted candidate comparison summary...');
        const candidateSummaries = targetCandidates.map((c) => ({
          id: c.id,
          name: c.candidateProfile.name,
          title: c.candidateProfile.title,
          overallScore: c.analysis.scores.overallScore,
          jobFitScore: c.analysis.scores.jobFitScore,
          atsScore: c.analysis.scores.atsScore,
          verifiedSkillsScore: c.analysis.scores.verifiedSkillsScore,
          evidenceStrengthScore: c.analysis.scores.evidenceStrengthScore,
          experienceYears: c.candidateProfile.experience.reduce((acc, e) => acc + (e.years || 1), 0),
          verifiedSkills: c.analysis.skillVerifications.map((v) => ({
            skill: v.skillName,
            claimed: v.claimedLevel,
            estimated: v.estimatedLevel,
            status: v.verificationStatus,
            evidenceStrength: v.evidenceStrength
          })),
          projectsCount: c.candidateProfile.projects.length,
          certificationsCount: c.candidateProfile.certifications.length,
          unsupportedClaims: c.analysis.unsupportedClaims
        }));

        const prompt = `You are ProofCV's expert AI-assisted hiring decision support intelligence.
Evaluate and compare these ${targetCandidates.length} candidates side-by-side for the target job "${targetJob.title}".

CRITICAL ETHICAL CONSTRAINT:
- NEVER make hiring decisions automatically.
- Frame all findings strictly as an "AI-assisted recommendation" and decision support for the hiring team.
- Base every insight on empirical evidence (projects, repositories, work tenure, certifications), not subjective hype.

TARGET JOB TITLE: ${targetJob.title}
TARGET JOB REQUIRED SKILLS:
${JSON.stringify(targetJob.requiredSkills, null, 2)}

CANDIDATES DATA:
${JSON.stringify(candidateSummaries, null, 2)}

Analyze and return strict JSON with these fields:
1. "strongestOverall": {
     "candidateId": string,
     "candidateName": string,
     "score": number,
     "headline": string,
     "rationale": string (thorough explanation of composite score leadership and balance),
     "keyAdvantages": string[] (3-4 bullet points)
   }
2. "strongestEvidence": {
     "candidateId": string,
     "candidateName": string,
     "evidenceScore": number,
     "rationale": string (explanation of empirical proof rigor, live artifacts, project substance),
     "proofHighlights": string[] (3-4 bullet points)
   }
3. "strongestTechnicalSkills": {
     "candidateId": string,
     "candidateName": string,
     "technicalScore": number,
     "rationale": string (explanation of core stack mastery against ${targetJob.title} needs),
     "standoutSkills": string[] (3-4 standout competencies with estimated level)
   }
4. "skillGaps": array for each candidate of {
     "candidateId": string,
     "candidateName": string,
     "gaps": array of {
       "skillName": string,
       "requiredLevel": string,
       "detectedLevel": string,
       "gapSeverity": 'Critical' | 'Moderate' | 'Minor',
       "impact": string
     }
   }
5. "verificationConcerns": array for each candidate of {
     "candidateId": string,
     "candidateName": string,
     "concernCount": number,
     "concerns": array of {
       "claim": string,
       "issueType": string,
       "details": string,
       "suggestedInterviewQuestion": string
     }
   }
6. "executiveRecommendation": string (concise 3-5 sentence synthesis highlighting comparative trade-offs between Candidate A, B, and C; reminder that final decision rests with human hiring manager)
7. "interviewQuestions": array for each candidate of {
     "candidateName": string,
     "questions": string[] (2-3 targeted technical questions to verify unverified claims or probe skill gaps)
   }
`;

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [{ text: prompt }],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          }
        });

        const rawText = geminiResponse.text?.trim();
        if (rawText) {
          const parsed = JSON.parse(rawText);
          return res.json({
            ...baseAnalysis,
            ...parsed,
            source: 'gemini-3.8-flash'
          });
        }
      } catch (aiErr: any) {
        console.warn('Gemini comparison call failed or timed out, using deterministic fallback:', aiErr.message);
      }
    }

    // Return deterministic fallback
    res.json({
      ...baseAnalysis,
      source: 'deterministic-engine'
    });

  } catch (err: any) {
    console.error('Error in compare-candidates API:', err);
    res.status(500).json({ error: err.message || 'Failed to compare candidates' });
  }
});

// ==================== RESUME ANALYSIS & VERIFICATION ENGINE ====================

app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, pdfBase64, jobId, customJobDescription, jobTitle } = req.body;

    if (!resumeText && !pdfBase64) {
      return res.status(400).json({ error: 'Either resumeText or pdfBase64 is required.' });
    }

    // Resolve target job (or extract requirements from custom job description)
    let targetJob = jobs.find((j) => j.id === jobId);
    if (!targetJob) {
      if (customJobDescription) {
        targetJob = extractJobRequirementsFromText(customJobDescription, jobTitle);
      } else {
        targetJob = sampleDataAnalystJob;
      }
    }

    const ai = getGeminiClient();
    let analysisResult: AnalysisResult;
    let extractedProfile: CandidateProfile;

    if (ai) {
      try {
        console.log('Invoking Gemini 3.8 Flash for evidence-based resume extraction...');
        const prompt = `You are ProofCV's expert Evidence-Based Technical Resume Evaluator.
Analyze the following resume against the target job.
Don't just look for buzzwords. Trace every claimed skill to verifiable evidence (Projects, Work experience, Certifications, GitHub, Portfolio, Courses).

TARGET JOB TITLE: ${targetJob.title}
TARGET JOB DESCRIPTION:
${targetJob.description}

REQUIRED SKILLS:
${JSON.stringify(targetJob.requiredSkills, null, 2)}

RESUME TEXT:
${resumeText || '(Extracted from uploaded PDF document)'}

Follow these strict rules:
1. Extract complete profile: name, email, phone, location, title, summary, githubUrl, portfolioUrl, codingProfiles, education, experience, internships, projects, certifications, achievements, allExtractedSkills.
2. For EVERY claimed or highlighted skill:
   - "claimedLevel": 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
   - "evidenceFound": list of concrete evidence items found in the resume. Each evidence item must have: type ('Internship' | 'Project' | 'Certification' | 'GitHub' | 'Portfolio' | 'Coding assessment' | 'Work experience' | 'Course' | 'Other'), title, source, description, relevanceScore (0-100).
   - "estimatedLevel": 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Insufficient Evidence'
   - "evidenceStrength": number 0-100
   - "verificationStatus": 'Verified' | 'Partially Verified' | 'Insufficient Evidence' | 'Unverified'
   - If evidence is insufficient, set verificationStatus to 'Insufficient Evidence' and missingProofNote to "Insufficient evidence — manual verification recommended."
   - IMPORTANT: Do NOT automatically call a person fake merely because evidence is missing.
3. Identify Matched Skills, Missing Skills, and Weak Skills:
   - "matchedSkills": array of skill names that match the job requirements with solid evidence.
   - "missingSkills": array of required job skills that are NOT present in the candidate's resume.
   - "weakSkills": array of objects { skillName, claimedOrDetectedLevel, evidenceStrength, issue, suggestedRemedy } for skills with weak evidence (<65%), cursory mentions without projects, or below required seniority.
4. Identify Unsupported or Weak Claims:
   - List claims where the candidate wrote high-level keywords or buzzwords without corresponding project or work experience proof.
5. AI Content & Similarity Review:
   - IMPORTANT: Never claim certainty when detecting AI-generated or plagiarized content.
   - Use labels: "Possible AI-generated content", "Possible similarity", "Needs manual review", or "Unlikely AI-generated" / "Original structure detected".
   - Specify constructive, objective observations.
6. Provide:
   - recommendedSkillsToLearn (array of { skill, importance, estimatedTimeToLearn, suggestedProofProject })
   - alternativeJobRoles (array of { roleTitle, matchScore (0-100), rationale, keyStrengths })
   - resumeImprovements (array of { category: 'Formatting' | 'Content' | 'Proof' | 'Impact Metrics', title, feedback, example })
   - missingSections (array of strings)
   - missingContent (array of strings detailing missing links, missing metrics, or incomplete sections)
   - aiStructuredExplanation: {
       executiveSummary: string,
       fitAssessment: string,
       strengthsExplanation: string[],
       gapsAndWeaknesses: string[],
       atsAnalysis: string,
       strategicActionPlan: string[]
     }

Respond strictly in valid JSON matching this schema.`;

        const contentsPayload: any[] = [];
        if (pdfBase64) {
          contentsPayload.push({
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64.replace(/^data:application\/pdf;base64,/, '')
            }
          });
        }
        contentsPayload.push({ text: prompt });

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsPayload,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          }
        });

        const rawJsonText = geminiResponse.text?.trim() || '{}';
        const parsed = JSON.parse(rawJsonText);

        extractedProfile = {
          id: `cand-${Date.now()}`,
          name: parsed.profile?.name || parsed.name || 'Candidate',
          email: parsed.profile?.email || parsed.email || 'candidate@example.com',
          phone: parsed.profile?.phone || parsed.phone || '',
          location: parsed.profile?.location || parsed.location || 'Remote',
          title: parsed.profile?.title || parsed.title || 'Professional',
          summary: parsed.profile?.summary || parsed.summary || '',
          githubUrl: parsed.profile?.githubUrl || parsed.githubUrl,
          portfolioUrl: parsed.profile?.portfolioUrl || parsed.portfolioUrl,
          codingProfiles: parsed.profile?.codingProfiles || parsed.codingProfiles || [],
          education: parsed.profile?.education || parsed.education || [],
          experience: parsed.profile?.experience || parsed.experience || [],
          internships: parsed.profile?.internships || parsed.internships || [],
          projects: parsed.profile?.projects || parsed.projects || [],
          certifications: parsed.profile?.certifications || parsed.certifications || [],
          achievements: parsed.profile?.achievements || parsed.achievements || [],
          allExtractedSkills: parsed.profile?.allExtractedSkills || parsed.allExtractedSkills || parsed.skills || []
        };

        const skillVerifications: SkillVerification[] = (parsed.skillVerifications || []).map((sv: any) => ({
          skillName: sv.skillName || 'Skill',
          claimedLevel: sv.claimedLevel || 'Intermediate',
          estimatedLevel: sv.estimatedLevel || 'Intermediate',
          evidenceStrength: typeof sv.evidenceStrength === 'number' ? sv.evidenceStrength : 65,
          verificationStatus: sv.verificationStatus || 'Partially Verified',
          evidenceItems: sv.evidenceItems || sv.evidenceFound || [],
          missingProofNote: sv.missingProofNote || (sv.evidenceStrength < 50 ? 'Insufficient evidence — manual verification recommended.' : undefined),
          recommendation: sv.recommendation
        }));

        // Run DETERMINISTIC SCORING ENGINE
        const { 
          scores, 
          explanation, 
          weakSkills, 
          missingContent, 
          structuredExplanation 
        } = calculateDeterministicScores(extractedProfile, targetJob, skillVerifications);

        analysisResult = {
          candidateId: extractedProfile.id,
          jobId: targetJob.id,
          analyzedAt: new Date().toISOString(),
          scores,
          scoreExplanation: explanation,
          skillVerifications,
          matchedSkills: parsed.matchedSkills || [],
          missingSkills: parsed.missingSkills || [],
          weakSkills: parsed.weakSkills && parsed.weakSkills.length > 0 ? parsed.weakSkills : weakSkills,
          recommendedSkillsToLearn: parsed.recommendedSkillsToLearn || [],
          alternativeJobRoles: parsed.alternativeJobRoles || [],
          resumeImprovements: parsed.resumeImprovements || [],
          missingSections: parsed.missingSections || [],
          missingContent: parsed.missingContent && parsed.missingContent.length > 0 ? parsed.missingContent : missingContent,
          unsupportedClaims: parsed.unsupportedClaims || [],
          aiContentReview: parsed.aiContentReview || {
            possibleAIContentIndicator: false,
            aiContentLabel: 'Unlikely AI-generated',
            aiConfidenceNote: 'Natural varied syntax with verifiable career milestones.',
            possibleSimilarityIndicator: false,
            similarityLabel: 'Original structure detected',
            similarityNote: 'Standard career background formatting.',
            manualReviewFlags: []
          },
          aiStructuredExplanation: parsed.aiStructuredExplanation || structuredExplanation
        };

      } catch (geminiError) {
        console.warn('Gemini API call failed or timed out. Falling back to local deterministic analyzer...', geminiError);
        const fallback = generateFallbackAnalysis(resumeText || 'Sample Resume', targetJob);
        extractedProfile = fallback.profile;
        analysisResult = fallback.analysis;
      }
    } else {
      console.log('Gemini API key not found in environment. Using robust local deterministic analyzer...');
      const fallback = generateFallbackAnalysis(resumeText || 'Sample Resume', targetJob);
      extractedProfile = fallback.profile;
      analysisResult = fallback.analysis;
    }

    // Run deterministic Evidence-Based Skill Verification Engine
    const enrichedVerifications = verifyAllCandidateSkills(extractedProfile, analysisResult.skillVerifications);
    analysisResult.skillVerifications = enrichedVerifications;

    // Recalculate deterministic composite scores using enriched verification data
    const deterministicCalc = calculateDeterministicScores(extractedProfile, targetJob, enrichedVerifications);
    analysisResult.scores = deterministicCalc.scores;
    if (!analysisResult.weakSkills || analysisResult.weakSkills.length === 0) {
      analysisResult.weakSkills = deterministicCalc.weakSkills;
    }
    if (!analysisResult.missingContent || analysisResult.missingContent.length === 0) {
      analysisResult.missingContent = deterministicCalc.missingContent;
    }
    if (!analysisResult.aiStructuredExplanation) {
      analysisResult.aiStructuredExplanation = deterministicCalc.structuredExplanation;
    }
    if (!analysisResult.scoreExplanation) {
      analysisResult.scoreExplanation = deterministicCalc.explanation;
    }

    // Save as candidate record in memory database
    const newCandidateRecord: CandidateRecord = {
      id: extractedProfile.id,
      jobId: targetJob.id,
      candidateProfile: extractedProfile,
      analysis: analysisResult,
      hiringStatus: 'New',
      shortlisted: false,
      hrNotes: [],
      appliedDate: new Date().toISOString().split('T')[0]
    };

    candidates.unshift(newCandidateRecord);
    targetJob.totalApplicants = (targetJob.totalApplicants || 0) + 1;

    res.json({
      candidate: newCandidateRecord,
      profile: extractedProfile,
      analysis: analysisResult,
      targetJob
    });

  } catch (err: any) {
    console.error('Error analyzing resume:', err);
    res.status(500).json({ error: err.message || 'Failed to analyze resume' });
  }
});

// Batch analyze resumes against a job
app.post('/api/analyze-batch', async (req, res) => {
  try {
    const { resumes, jobId } = req.body;
    if (!Array.isArray(resumes) || resumes.length === 0) {
      return res.status(400).json({ error: 'Array of resumes is required.' });
    }

    let targetJob = jobs.find((j) => j.id === jobId) || jobs[0] || sampleDataAnalystJob;
    const addedCandidates: CandidateRecord[] = [];

    for (const item of resumes) {
      const resumeText = item.resumeText || '';
      const { profile, analysis } = generateFallbackAnalysis(resumeText, targetJob);

      if (item.candidateName && item.candidateName.trim()) {
        profile.name = item.candidateName.trim();
      } else if (item.fileName) {
        const clean = item.fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/resume|cv/gi, '').trim();
        if (clean.length > 2) {
          profile.name = clean.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }

      if (item.title && item.title.trim()) {
        profile.title = item.title.trim();
      }

      const enrichedVerifications = verifyAllCandidateSkills(profile, analysis.skillVerifications);
      profile.allExtractedSkills = Array.from(new Set([
        ...profile.allExtractedSkills,
        ...enrichedVerifications.map((v) => v.skillName)
      ]));
      analysis.skillVerifications = enrichedVerifications;

      const deterministicCalc = calculateDeterministicScores(profile, targetJob, enrichedVerifications);
      analysis.scores = deterministicCalc.scores;
      analysis.scoreExplanation = deterministicCalc.explanation;
      analysis.weakSkills = deterministicCalc.weakSkills;
      analysis.missingContent = deterministicCalc.missingContent;
      analysis.aiStructuredExplanation = deterministicCalc.structuredExplanation;

      const newRecord: CandidateRecord = {
        id: `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        jobId: targetJob.id,
        candidateProfile: profile,
        analysis,
        hiringStatus: 'New',
        shortlisted: false,
        hrNotes: [],
        appliedDate: new Date().toISOString().split('T')[0]
      };

      candidates.unshift(newRecord);
      addedCandidates.push(newRecord);
    }

    targetJob.totalApplicants = (targetJob.totalApplicants || 0) + addedCandidates.length;

    res.json({
      success: true,
      addedCandidates,
      totalCount: candidates.length,
      targetJob
    });
  } catch (err: any) {
    console.error('Error in batch analysis:', err);
    res.status(500).json({ error: err.message || 'Failed batch analysis' });
  }
});

// ==================== FALLBACK DEMO-ANALYSIS ENGINE ====================
// Required: "The application must work even if an external AI call temporarily fails.
// Create a fallback demo-analysis mode using structured sample data so the hackathon demo never becomes a blank screen."

function extractJobRequirementsFromText(description: string, title?: string): JobPosting {
  const commonTech = [
    'Python', 'SQL', 'Tableau', 'Power BI', 'Snowflake', 'BigQuery', 'A/B Testing',
    'Machine Learning', 'Statistical Modeling', 'Excel', 'dbt', 'Git', 'AWS', 'Docker',
    'Kubernetes', 'TypeScript', 'React', 'Node.js', 'Pandas', 'NumPy', 'R', 'Java', 'Go',
    'GraphQL', 'PostgreSQL', 'MongoDB', 'System Design', 'CI/CD'
  ];

  const detectedSkills = commonTech.filter((skill) =>
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(description)
  );

  const skillsList = detectedSkills.length > 0 ? detectedSkills : ['Core Technical Competency', 'Problem Solving', 'Data Analysis'];

  // Experience extraction (e.g. "3+ years", "5 years")
  const expMatch = description.match(/(\d+)\+?\s*years?/i);
  const years = expMatch ? parseInt(expMatch[1], 10) : 2;

  // Title extraction
  const resolvedTitle = title && title.trim().length > 2 
    ? title 
    : (description.split('\n')[0]?.replace(/^#+\s*/, '').slice(0, 60) || 'Target Professional Role');

  const requiredSkills = skillsList.slice(0, 8).map((skillName, idx) => {
    const isCritical = idx < 2 || /must have|required|essential/i.test(description);
    return {
      id: `req-skill-${idx + 1}`,
      skillName,
      requiredLevel: (idx === 0 ? 'Advanced' : 'Intermediate') as SkillLevel,
      importance: (isCritical ? 'Critical' : idx % 2 === 0 ? 'High' : 'Medium') as SkillImportance
    };
  });

  return {
    id: `custom-job-${Date.now()}`,
    title: resolvedTitle,
    department: 'Engineering & Analytics',
    location: 'Remote / Flexible',
    type: 'Full-time',
    experienceRequiredYears: years,
    salaryRange: '$110,000 - $155,000',
    description,
    requiredSkills,
    createdAt: new Date().toISOString().split('T')[0],
    active: true,
    totalApplicants: 1
  };
}

function generateFallbackAnalysis(
  text: string, 
  job: JobPosting
): { profile: CandidateProfile; analysis: AnalysisResult } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const candidateName = lines[0] || 'Alex Morgan';

  // Heuristic extraction of contact info
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : 'alex.morgan@example.com';

  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '+1 (415) 555-0182';

  const githubMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const githubUrl = githubMatch ? `https://${githubMatch[0]}` : undefined;

  // Detect skills mentioned in text
  const commonTech = [
    'Python', 'SQL', 'Tableau', 'Power BI', 'Snowflake', 'BigQuery', 'A/B Testing',
    'Machine Learning', 'Statistical Modeling', 'Excel', 'dbt', 'Git', 'AWS', 'Docker',
    'TypeScript', 'React', 'Node.js', 'Pandas', 'NumPy', 'R'
  ];

  const detectedSkills = commonTech.filter((skill) =>
    new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
  );

  const allSkills = detectedSkills.length > 0 ? detectedSkills : ['SQL', 'Python', 'Tableau', 'Excel', 'Statistical Modeling'];

  const profile: CandidateProfile = {
    id: `cand-fb-${Date.now()}`,
    name: candidateName,
    email,
    phone,
    location: 'San Francisco, CA',
    title: `${job.title} Applicant`,
    summary: lines.find((l) => l.length > 50 && !l.includes('@')) || `Experienced professional with demonstrated background in data analytics, reporting, and technical problem solving.`,
    githubUrl,
    portfolioUrl: text.includes('portfolio') ? 'https://portfolio.demo.dev' : undefined,
    codingProfiles: githubUrl ? [{ platform: 'GitHub', url: githubUrl }] : [],
    education: [
      {
        degree: 'Bachelor of Science',
        field: 'Computer Science / Analytics',
        institution: 'State University',
        year: '2022',
        gpa: '3.75'
      }
    ],
    experience: [
      {
        role: 'Data Analyst / Associate',
        company: 'Vanguard Systems',
        duration: '2022 - 2024 (2 yrs)',
        years: 2.0,
        description: [
          'Extracted relational database records and prepared automated metric dashboards.',
          'Conducted exploratory cohort analyses and cross-functional presentations.'
        ],
        highlights: [
          'Streamlined monthly KPI distribution across 12 product squads.'
        ]
      }
    ],
    internships: [
      {
        role: 'Analytics Intern',
        company: 'Apex Data Labs',
        duration: 'Summer 2021',
        projects: ['Telemetry log ingestion pipeline']
      }
    ],
    projects: [
      {
        name: 'Open Data Metrics Dashboard',
        description: 'Interactive analytical web application querying public financial transactions with automated aggregations.',
        technologies: ['Python', 'SQL', 'Tableau'],
        link: githubUrl ? `${githubUrl}/metrics-dashboard` : undefined,
        impact: 'Delivered insights for municipal finance research group'
      }
    ],
    certifications: [
      {
        name: 'Certified Data Analytics Specialist',
        issuer: 'Industry Analytics Institute',
        date: '2023'
      }
    ],
    achievements: [
      'Dean Honor List 2021-2022'
    ],
    allExtractedSkills: allSkills
  };

  // Build skill verifications for each skill
  const skillVerifications: SkillVerification[] = allSkills.map((skill) => {
    const isJobRequired = job.requiredSkills.some(
      (rs) => rs.skillName.toLowerCase() === skill.toLowerCase()
    );
    const mentionsProject = text.toLowerCase().includes('project') || text.toLowerCase().includes('github');
    const mentionsWork = text.toLowerCase().includes('experience') || text.toLowerCase().includes('company');

    let strength = 60;
    let status: SkillVerification['verificationStatus'] = 'Partially Verified';
    const evidenceItems: EvidenceItem[] = [];

    if (mentionsWork) {
      strength += 20;
      evidenceItems.push({
        id: `ev-${skill}-1`,
        type: 'Work experience',
        title: `${skill} Professional Application`,
        source: 'Work Experience Section',
        description: `Applied ${skill} in business operations and reporting workflows.`,
        relevanceScore: 82
      });
    }

    if (mentionsProject) {
      strength += 15;
      evidenceItems.push({
        id: `ev-${skill}-2`,
        type: 'Project',
        title: `${skill} Implementation Project`,
        source: 'Projects Section',
        description: `Built hands-on pipeline utilizing ${skill} and related libraries.`,
        relevanceScore: 80
      });
    }

    strength = Math.min(95, strength);
    if (strength >= 80) status = 'Verified';
    else if (strength < 45) status = 'Insufficient Evidence';

    return {
      skillName: skill,
      claimedLevel: 'Advanced',
      estimatedLevel: strength >= 80 ? 'Advanced' : strength >= 55 ? 'Intermediate' : 'Insufficient Evidence',
      evidenceStrength: strength,
      verificationStatus: status,
      evidenceItems,
      missingProofNote: status === 'Insufficient Evidence' ? 'Insufficient evidence — manual verification recommended.' : undefined
    };
  });

  const { 
    scores, 
    explanation, 
    weakSkills, 
    missingContent, 
    structuredExplanation 
  } = calculateDeterministicScores(profile, job, skillVerifications);

  const matchedSkills = allSkills.filter((s) =>
    job.requiredSkills.some((rs) => rs.skillName.toLowerCase() === s.toLowerCase())
  );

  const missingSkills = job.requiredSkills
    .filter((rs) => !allSkills.some((s) => s.toLowerCase() === rs.skillName.toLowerCase()))
    .map((rs) => rs.skillName);

  const analysis: AnalysisResult = {
    candidateId: profile.id,
    jobId: job.id,
    analyzedAt: new Date().toISOString(),
    scores,
    scoreExplanation: explanation,
    skillVerifications,
    matchedSkills,
    missingSkills,
    weakSkills,
    missingContent,
    aiStructuredExplanation: structuredExplanation,
    recommendedSkillsToLearn: missingSkills.map((ms) => ({
      skill: ms,
      importance: 'High',
      estimatedTimeToLearn: '2-3 weeks',
      suggestedProofProject: `Build an end-to-end demonstration repo highlighting ${ms} best practices.`
    })),
    alternativeJobRoles: [
      {
        roleTitle: 'Business Intelligence Analyst',
        matchScore: 88,
        rationale: 'Strong foundation in SQL, dashboard delivery, and business metric reporting.',
        keyStrengths: ['SQL', 'Dashboard Delivery', 'Communication']
      },
      {
        roleTitle: 'Associate Analytics Engineer',
        matchScore: 81,
        rationale: 'Experience maintaining transformation models and data quality checks.',
        keyStrengths: ['Data Modeling', 'Python', 'Relational Databases']
      }
    ],
    resumeImprovements: [
      {
        category: 'Proof',
        title: 'Include Direct Artifact URLs',
        feedback: 'Add direct GitHub or portfolio links next to key project accomplishments.',
        example: 'github.com/username/project-repo'
      },
      {
        category: 'Impact Metrics',
        title: 'Quantify Achievement Outcomes',
        feedback: 'Transform passive responsibility statements into measurable business impact.',
        example: 'Automated 12 reporting pipelines, saving 15 engineering hours per week.'
      }
    ],
    missingSections: profile.projects.length === 0 ? ['Projects'] : [],
    unsupportedClaims: [
      {
        claim: 'Self-described Advanced Mastery without Assessment Score',
        issueType: 'Missing Proof',
        explanation: 'Skills marked as Advanced lack corresponding code repository test suites or third-party certification.',
        howToFix: 'Include verified GitHub repos or credential IDs to support claimed level.'
      }
    ],
    aiContentReview: {
      possibleAIContentIndicator: false,
      aiContentLabel: 'Unlikely AI-generated',
      aiConfidenceNote: 'Natural sentence variety with specific project metrics. Low indicator.',
      possibleSimilarityIndicator: false,
      similarityLabel: 'Original structure detected',
      similarityNote: 'Standard professional chronological template.',
      manualReviewFlags: []
    }
  };

  return { profile, analysis };
}

// ==================== VITE MIDDLEWARE & SERVER START ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProofCV Server running on http://0.0.0.0:${PORT}`);
    console.log(`Gemini API Key configured: ${Boolean(process.env.GEMINI_API_KEY)}`);
  });
}

startServer();
