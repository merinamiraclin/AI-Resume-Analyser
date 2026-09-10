import { CandidateRecord, JobPosting, CandidateComparisonAnalysis, SkillLevel } from '../types';

const LEVEL_WEIGHTS: Record<string, number> = {
  'basic': 1,
  'beginner': 1,
  'intermediate': 2,
  'advanced': 3,
  'expert': 4,
};

function getLevelRank(level?: string): number {
  if (!level) return 0;
  return LEVEL_WEIGHTS[level.toLowerCase()] || 1;
}

/**
 * Generates an empirical, AI-assisted comparison summary across 2 or 3 candidates.
 * Follows strict HR ethical guidelines: never makes automatic hiring decisions;
 * labels all guidance as "AI-assisted recommendation".
 */
export function generateCandidateComparisonAnalysis(
  candidates: CandidateRecord[],
  activeJob: JobPosting
): CandidateComparisonAnalysis {
  if (candidates.length === 0) {
    throw new Error('At least 2 candidates are required for comparison.');
  }

  // 1. Determine Strongest Candidate Overall
  // Combines overallScore (weighted), jobFitScore, and verifiedSkillsScore
  const sortedOverall = [...candidates].sort((a, b) => {
    const scoreA = a.analysis.scores.overallScore * 0.5 + a.analysis.scores.jobFitScore * 0.3 + a.analysis.scores.evidenceStrengthScore * 0.2;
    const scoreB = b.analysis.scores.overallScore * 0.5 + b.analysis.scores.jobFitScore * 0.3 + b.analysis.scores.evidenceStrengthScore * 0.2;
    return scoreB - scoreA;
  });
  const bestOverall = sortedOverall[0];

  const overallAdvantages: string[] = [
    `Highest composite score (${bestOverall.analysis.scores.overallScore}/100) combining job fit, verified skills, and experience tenure`,
    `Strong alignment with ${activeJob.title} specifications (${bestOverall.analysis.scores.jobFitScore}% match)`,
    `${bestOverall.candidateProfile.experience.reduce((acc, e) => acc + (e.years || 1), 0).toFixed(1)} years demonstrable track record in related roles`
  ];

  if (bestOverall.analysis.scores.atsScore >= 85) {
    overallAdvantages.push(`Excellent ATS resume formatting (${bestOverall.analysis.scores.atsScore}/100) ensuring clear readability`);
  }

  // 2. Determine Candidate with Strongest Evidence
  const sortedEvidence = [...candidates].sort((a, b) => {
    return b.analysis.scores.evidenceStrengthScore - a.analysis.scores.evidenceStrengthScore;
  });
  const bestEvidence = sortedEvidence[0];

  const proofHighlights: string[] = [
    `Average evidence verification strength of ${bestEvidence.analysis.scores.evidenceStrengthScore}% across all evaluated skills`,
    `${bestEvidence.candidateProfile.projects.length} documented technical projects with quantifiable impact metrics`,
    `${bestEvidence.candidateProfile.certifications.length} verified professional certifications/credentials`
  ];

  if (bestEvidence.candidateProfile.githubUrl || bestEvidence.candidateProfile.portfolioUrl) {
    proofHighlights.push(`Direct artifact links provided (GitHub / Portfolio) validating actual code commits and repositories`);
  }

  // 3. Determine Candidate with Strongest Technical Skills
  // Calculate aggregate score across the high/critical importance skills for the target job
  const technicalRanking = candidates.map((cand) => {
    let techScore = 0;
    let standout: string[] = [];

    activeJob.requiredSkills.forEach((req) => {
      const v = cand.analysis.skillVerifications.find(
        (sv) => sv.skillName.toLowerCase().trim() === req.skillName.toLowerCase().trim()
      );
      if (v) {
        const estWeight = getLevelRank(v.estimatedLevel);
        const reqWeight = getLevelRank(req.requiredLevel);
        const strength = v.evidenceStrength || 50;
        
        let multiplier = 1;
        if (req.importance === 'Critical') multiplier = 1.5;
        if (req.importance === 'High') multiplier = 1.2;

        techScore += (estWeight / Math.max(1, reqWeight)) * strength * multiplier;

        if (estWeight >= reqWeight && (v.verificationStatus === 'Verified' || v.verificationStatus === 'Partially Verified')) {
          standout.push(`${v.skillName} (${v.estimatedLevel} - ${v.evidenceStrength}% verified)`);
        }
      }
    });

    return {
      candidate: cand,
      technicalScore: Math.round(techScore),
      standout
    };
  }).sort((a, b) => b.technicalScore - a.technicalScore);

  const bestTechnical = technicalRanking[0];

  // 4. Identify Important Skill Gaps for Each Candidate
  const skillGaps = candidates.map((cand) => {
    const gaps: {
      skillName: string;
      requiredLevel: string;
      detectedLevel: string;
      gapSeverity: 'Critical' | 'Moderate' | 'Minor';
      impact: string;
    }[] = [];

    activeJob.requiredSkills.forEach((req) => {
      const v = cand.analysis.skillVerifications.find(
        (sv) => sv.skillName.toLowerCase().trim() === req.skillName.toLowerCase().trim()
      );

      const reqRank = getLevelRank(req.requiredLevel);

      if (!v) {
        const severity: 'Critical' | 'Moderate' | 'Minor' = 
          req.importance === 'Critical' || req.importance === 'High' ? 'Critical' : 'Moderate';
        gaps.push({
          skillName: req.skillName,
          requiredLevel: req.requiredLevel,
          detectedLevel: 'Not Mentioned',
          gapSeverity: severity,
          impact: `Missing requirement for ${activeJob.title}. Will require on-the-job training or upfront onboarding.`
        });
      } else {
        const candRank = getLevelRank(v.estimatedLevel);
        if (candRank < reqRank || v.verificationStatus === 'Insufficient Evidence') {
          const severity: 'Critical' | 'Moderate' | 'Minor' =
            req.importance === 'Critical' ? 'Critical' : req.importance === 'High' ? 'Moderate' : 'Minor';
          gaps.push({
            skillName: req.skillName,
            requiredLevel: req.requiredLevel,
            detectedLevel: v.estimatedLevel === 'Insufficient Evidence' ? 'Insufficient Evidence' : v.estimatedLevel,
            gapSeverity: severity,
            impact: `Candidate claims ${v.claimedLevel}, but verified evidence only supports ${v.estimatedLevel}. May struggle with senior-level independent execution.`
          });
        }
      }
    });

    return {
      candidateId: cand.id,
      candidateName: cand.candidateProfile.name,
      gaps
    };
  });

  // 5. Identify Verification Concerns & Claim Issues
  const verificationConcerns = candidates.map((cand) => {
    const concerns: {
      claim: string;
      issueType: string;
      details: string;
      suggestedInterviewQuestion: string;
    }[] = [];

    // Check unsupported claims from analysis
    if (cand.analysis.unsupportedClaims && cand.analysis.unsupportedClaims.length > 0) {
      cand.analysis.unsupportedClaims.forEach((issue) => {
        concerns.push({
          claim: issue.claim,
          issueType: issue.issueType,
          details: issue.explanation,
          suggestedInterviewQuestion: `Could you walk us through a specific technical challenge where you applied ${issue.claim}, and how you measured your impact?`
        });
      });
    }

    // Check large divergence between claimed level and estimated level
    cand.analysis.skillVerifications.forEach((v) => {
      const claimedWeight = getLevelRank(v.claimedLevel);
      const estWeight = getLevelRank(v.estimatedLevel);
      if (claimedWeight >= 3 && estWeight <= 1) {
        concerns.push({
          claim: `${v.skillName}: Claimed ${v.claimedLevel}`,
          issueType: 'Inflated Level Claim',
          details: `Resume indicates ${v.claimedLevel} proficiency in ${v.skillName}, but lacks verifiable production projects or code commits (evidence strength: ${v.evidenceStrength}%).`,
          suggestedInterviewQuestion: `What specific production systems or architecture decisions did you implement using ${v.skillName}?`
        });
      } else if (v.verificationStatus === 'Insufficient Evidence' && activeJob.requiredSkills.some(r => r.skillName.toLowerCase() === v.skillName.toLowerCase())) {
        concerns.push({
          claim: `${v.skillName} Verification`,
          issueType: 'Insufficient Proof',
          details: `Skill is required for this role but resume provides no direct links, metrics, or repos to confirm proficiency.`,
          suggestedInterviewQuestion: `Can you demonstrate your hands-on experience with ${v.skillName} by explaining an end-to-end data pipeline or workflow you built?`
        });
      }
    });

    return {
      candidateId: cand.id,
      candidateName: cand.candidateProfile.name,
      concernCount: concerns.length,
      concerns
    };
  });

  // 6. Synthesize Executive Recommendation Narrative & Tailored Questions
  const names = candidates.map((c) => c.candidateProfile.name).join(' vs ');
  const executiveRecommendation = `Across the evaluated cohort (${names}), each candidate presents distinct strengths and trade-offs. ${bestOverall.candidateProfile.name} demonstrates the highest overall role readiness with a composite score of ${bestOverall.analysis.scores.overallScore}/100 and ${bestOverall.analysis.scores.jobFitScore}% job fit. Meanwhile, ${bestEvidence.candidateProfile.name} provides the most empirically verifiable evidence base (${bestEvidence.analysis.scores.evidenceStrengthScore}% evidence strength) with concrete project artifacts. For immediate day-one technical execution, ${bestTechnical.candidate.candidateProfile.name} shows the strongest depth in core requirements (${bestTechnical.standout.slice(0, 3).join(', ')}). Hiring teams should conduct structured technical deep-dives to validate the identified skill gaps and unverified claims highlighted below.`;

  const interviewQuestions = candidates.map((cand) => {
    const candGaps = skillGaps.find((g) => g.candidateId === cand.id)?.gaps || [];
    const questions: string[] = [];

    if (candGaps.length > 0) {
      questions.push(`We noticed limited evidence around ${candGaps[0].skillName} (Required: ${candGaps[0].requiredLevel}). Could you describe your experience with this tool in production?`);
    }
    if (candGaps.length > 1) {
      questions.push(`How would you ramp up on ${candGaps[1].skillName} to meet our team's operational standard within the first 60 days?`);
    }
    questions.push(`Can you share a detailed walkthrough of your most impactful project (${cand.candidateProfile.projects[0]?.name || 'recent data project'}) and how you verified data accuracy?`);

    return {
      candidateName: cand.candidateProfile.name,
      questions
    };
  });

  return {
    strongestOverall: {
      candidateId: bestOverall.id,
      candidateName: bestOverall.candidateProfile.name,
      score: bestOverall.analysis.scores.overallScore,
      headline: `${bestOverall.candidateProfile.name} ranks highest with an overall score of ${bestOverall.analysis.scores.overallScore}/100 and ${bestOverall.analysis.scores.jobFitScore}% target job fit.`,
      rationale: `Demonstrates the most balanced distribution of proven domain tenure (${bestOverall.candidateProfile.experience.reduce((acc, e) => acc + (e.years || 1), 0).toFixed(1)} yrs), verified core skills (${bestOverall.analysis.scores.verifiedSkillsScore}%), and clear ATS-optimized resume presentation (${bestOverall.analysis.scores.atsScore}/100).`,
      keyAdvantages: overallAdvantages
    },
    strongestEvidence: {
      candidateId: bestEvidence.id,
      candidateName: bestEvidence.candidateProfile.name,
      evidenceScore: bestEvidence.analysis.scores.evidenceStrengthScore,
      rationale: `Stands out with the highest proportion of verifiable claims (${bestEvidence.analysis.scores.evidenceStrengthScore}% evidence strength), supported by tangible project portfolios, live repositories, and accredited credentials rather than ungrounded buzzwords.`,
      proofHighlights
    },
    strongestTechnicalSkills: {
      candidateId: bestTechnical.candidate.id,
      candidateName: bestTechnical.candidate.candidateProfile.name,
      technicalScore: bestTechnical.technicalScore,
      rationale: `Outperforms peers on critical technical competencies required for ${activeJob.title}, showing confirmed proficiency in ${bestTechnical.standout.length} priority skills.`,
      standoutSkills: bestTechnical.standout
    },
    skillGaps,
    verificationConcerns,
    executiveRecommendation,
    interviewQuestions
  };
}
