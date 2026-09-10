import { 
  CandidateProfile, 
  CandidateScores, 
  JobPosting, 
  SkillVerification,
  RequiredSkillCard,
  SkillLevel,
  SkillImportance,
  WeakSkillItem,
  AIStructuredExplanation
} from '../types';

const LEVEL_RANKS: Record<SkillLevel, number> = {
  'Basic': 1,
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
  'Expert': 4,
};

const IMPORTANCE_WEIGHTS: Record<SkillImportance, number> = {
  'Critical': 1.5,
  'High': 1.2,
  'Medium': 1.0,
  'Low': 0.7,
  'Nice-to-have': 0.6,
};

/**
 * Deterministic calculation of Candidate Scores based on empirical evidence and job requirements.
 * Weight breakdown:
 * - Job Fit: 30%
 * - Verified Skills (Skills Match): 25%
 * - Experience: 15%
 * - Projects: 10%
 * - Education: 5%
 * - Certifications: 5%
 * - Resume Quality: 5%
 * - Evidence Strength: 5%
 * Total = 100%
 */
export function calculateDeterministicScores(
  profile: CandidateProfile,
  job: JobPosting,
  verifications: SkillVerification[]
): { 
  scores: CandidateScores; 
  explanation: string;
  weakSkills: WeakSkillItem[];
  missingContent: string[];
  structuredExplanation: AIStructuredExplanation;
} {
  // 1. Job Fit Score (30%) - How closely candidate profile meets required skills & job expectations
  let weightedSkillScoreSum = 0;
  let totalSkillWeight = 0;
  const matchedSkillsList: string[] = [];
  const missingSkillsList: string[] = [];

  for (const reqSkill of job.requiredSkills) {
    const weight = IMPORTANCE_WEIGHTS[reqSkill.importance] || 1.0;
    totalSkillWeight += weight;

    // Find verification matching this required skill
    const match = verifications.find(
      (v) => v.skillName.toLowerCase().trim() === reqSkill.skillName.toLowerCase().trim()
    );

    if (match) {
      matchedSkillsList.push(match.skillName);
      const candidateRank = match.estimatedLevel !== 'Insufficient Evidence' 
        ? LEVEL_RANKS[match.estimatedLevel as SkillLevel] || 1
        : (LEVEL_RANKS[match.claimedLevel] ? LEVEL_RANKS[match.claimedLevel] * 0.5 : 1);
      
      const requiredRank = LEVEL_RANKS[reqSkill.requiredLevel] || 2;
      
      // ratio of verified rank to required rank
      let skillRatio = Math.min(1.2, candidateRank / requiredRank);
      
      // Factor in evidence strength
      const evidenceFactor = (match.evidenceStrength / 100) * 0.4 + 0.6;
      const skillScore = Math.min(100, Math.round(skillRatio * 100 * evidenceFactor));
      
      weightedSkillScoreSum += skillScore * weight;
    } else {
      missingSkillsList.push(reqSkill.skillName);
      // Missing required skill
      weightedSkillScoreSum += 0;
    }
  }

  const jobFitScore = totalSkillWeight > 0 
    ? Math.min(100, Math.round(weightedSkillScoreSum / totalSkillWeight))
    : 75;

  // 2. Verified Skills / Skills Match Score (25%) - Proportion of skills with Verified/Partially Verified status
  let verifiedSkillPoints = 0;
  if (verifications.length > 0) {
    for (const v of verifications) {
      if (v.verificationStatus === 'Verified') {
        verifiedSkillPoints += 100;
      } else if (v.verificationStatus === 'Partially Verified') {
        verifiedSkillPoints += 70;
      } else if (v.verificationStatus === 'Insufficient Evidence') {
        verifiedSkillPoints += 30;
      } else {
        verifiedSkillPoints += 10;
      }
    }
    var verifiedSkillsScore = Math.min(100, Math.round(verifiedSkillPoints / verifications.length));
  } else {
    var verifiedSkillsScore = 50;
  }

  // 3. Experience Score (15%) - Total years relative to job requirement
  const totalYearsExp = profile.experience.reduce((acc, exp) => acc + (exp.years || 1), 0);
  const targetYears = job.experienceRequiredYears || 2;
  const expRatio = targetYears > 0 ? totalYearsExp / targetYears : 1;
  const experienceScore = Math.min(100, Math.round(Math.max(20, Math.min(100, expRatio * 85 + (profile.experience.length > 1 ? 15 : 0)))));

  // 4. Projects Score (10%) - Project count, detail depth, GitHub / link presence
  let projectPoints = 0;
  for (const proj of profile.projects) {
    let itemScore = 50;
    if (proj.technologies && proj.technologies.length >= 2) itemScore += 20;
    if (proj.impact && proj.impact.trim().length > 15) itemScore += 20;
    if (proj.link) itemScore += 10;
    projectPoints += itemScore;
  }
  const avgProjectScore = profile.projects.length > 0 
    ? Math.min(100, Math.round(projectPoints / Math.max(1, profile.projects.length)))
    : 30;
  const projectVolumeBonus = Math.min(20, profile.projects.length * 6);
  const projectsScore = Math.min(100, Math.round(avgProjectScore * 0.8 + projectVolumeBonus));

  // 5. Education Score (5%)
  let educationScore = 70; // baseline
  if (profile.education.length > 0) {
    const hasMasterOrPhD = profile.education.some(
      (e) => e.degree.toLowerCase().includes('master') || e.degree.toLowerCase().includes('ms') || e.degree.toLowerCase().includes('phd')
    );
    const hasBachelor = profile.education.some(
      (e) => e.degree.toLowerCase().includes('bachelor') || e.degree.toLowerCase().includes('bs') || e.degree.toLowerCase().includes('b.tech')
    );
    if (hasMasterOrPhD) educationScore = 95;
    else if (hasBachelor) educationScore = 85;
    else educationScore = 75;
  }

  // 6. Certifications Score (5%)
  const certCount = profile.certifications ? profile.certifications.length : 0;
  const certificationsScore = Math.min(100, certCount === 0 ? 30 : certCount === 1 ? 75 : certCount >= 3 ? 95 : 85);

  // 7. Evidence Strength Score (5%)
  let totalEvidenceStrength = 0;
  if (verifications.length > 0) {
    for (const v of verifications) {
      totalEvidenceStrength += v.evidenceStrength;
    }
    var evidenceStrengthScore = Math.round(totalEvidenceStrength / verifications.length);
  } else {
    var evidenceStrengthScore = 50;
  }

  // 8. Resume Quality & ATS Score (5% & ATS standalone)
  let qualityPoints = 60;
  if (profile.email && profile.phone) qualityPoints += 10;
  if (profile.summary && profile.summary.length > 30) qualityPoints += 10;
  if (profile.experience.length > 0 && profile.experience[0].highlights?.length > 0) qualityPoints += 10;
  if (profile.githubUrl || profile.portfolioUrl) qualityPoints += 10;
  const resumeQualityScore = Math.min(100, qualityPoints);

  // Standalone ATS Score (Standard format compliance, readability, metrics)
  let atsBase = 65;
  if (profile.name && profile.email && profile.phone) atsBase += 10;
  if (profile.education.length > 0 && profile.experience.length > 0) atsBase += 10;
  if (profile.allExtractedSkills.length >= 6) atsBase += 8;
  if (profile.projects.length > 0) atsBase += 7;
  const atsScore = Math.min(98, atsBase);

  // DETERMINISTIC OVERALL WEIGHTED CALCULATION
  const overallScore = Math.round(
    jobFitScore * 0.30 +
    verifiedSkillsScore * 0.25 +
    experienceScore * 0.15 +
    projectsScore * 0.10 +
    educationScore * 0.05 +
    certificationsScore * 0.05 +
    resumeQualityScore * 0.05 +
    evidenceStrengthScore * 0.05
  );

  const scores: CandidateScores = {
    overallScore,
    jobFitScore,
    verifiedSkillsScore,
    experienceScore,
    projectsScore,
    educationScore,
    certificationsScore,
    resumeQualityScore,
    evidenceStrengthScore,
    atsScore,
  };

  // Determine WEAK SKILLS
  // Weak skills are skills present on the resume where evidence strength is < 70%,
  // or where estimated level is below claimed level, or where evidence is insufficient.
  const weakSkills: WeakSkillItem[] = [];
  for (const v of verifications) {
    const isWeak = 
      v.evidenceStrength < 70 || 
      v.verificationStatus === 'Insufficient Evidence' ||
      (v.estimatedLevel !== 'Insufficient Evidence' && LEVEL_RANKS[v.claimedLevel] > LEVEL_RANKS[v.estimatedLevel as SkillLevel]);

    if (isWeak) {
      let issue = 'Cursory mention without dedicated repository or quantified project impact.';
      if (v.verificationStatus === 'Insufficient Evidence') {
        issue = 'Listed in skill tags but not referenced in work experience bullets or projects.';
      } else if (v.estimatedLevel !== 'Insufficient Evidence' && LEVEL_RANKS[v.claimedLevel] > LEVEL_RANKS[v.estimatedLevel as SkillLevel]) {
        issue = `Claimed ${v.claimedLevel} proficiency, but verified evidence aligns with ${v.estimatedLevel}.`;
      } else if (v.evidenceStrength < 60) {
        issue = 'Lacks public code repo, architecture diagram, or measurable KPI metrics.';
      }

      weakSkills.push({
        skillName: v.skillName,
        claimedOrDetectedLevel: v.claimedLevel,
        evidenceStrength: v.evidenceStrength,
        issue,
        suggestedRemedy: v.missingProofNote || `Publish a focused GitHub repository or add a bullet detailing production ${v.skillName} usage with business outcomes.`
      });
    }
  }

  // Determine MISSING CONTENT
  const missingContent: string[] = [];
  if (profile.projects.length === 0) {
    missingContent.push('Technical Projects Section: Missing concrete engineering deliverables.');
  }
  if (!profile.githubUrl && !profile.portfolioUrl) {
    missingContent.push('Public Proof URLs: No GitHub, GitLab, or personal portfolio link provided.');
  }
  if (profile.certifications.length === 0) {
    missingContent.push('Standard Certifications: No professional credentials or vendor accreditations.');
  }
  if (!profile.phone || !profile.location) {
    missingContent.push('Contact Header Details: Ensure full location and direct telephone contact are present.');
  }
  const hasQuantifiedMetrics = profile.experience.some(e => 
    e.description.some(d => /\d+%|\$\d+|\d+\s*(users|queries|hours|requests|teams)/i.test(d)) ||
    (e.highlights && e.highlights.some(h => /\d+/i.test(h)))
  );
  if (!hasQuantifiedMetrics) {
    missingContent.push('Quantified Metric Outcomes: Experience bullets lack numeric impact (e.g. percentages, scale, latency).');
  }

  // Structured AI Explanation
  const explanation = `Evaluated deterministically against ${job.title}: Overall Score (${overallScore}/100) comprises Job Fit (${jobFitScore}/100 @ 30%), Skills Match (${verifiedSkillsScore}/100 @ 25%), Experience (${experienceScore}/100 @ 15%), Projects (${projectsScore}/100 @ 10%), Education (${educationScore}/100 @ 5%), Certifications (${certificationsScore}/100 @ 5%), Resume Quality (${resumeQualityScore}/100 @ 5%), and Evidence Strength (${evidenceStrengthScore}/100 @ 5%). ATS Readability is rated at ${atsScore}/100.`;

  const structuredExplanation: AIStructuredExplanation = {
    executiveSummary: `Candidate ${profile.name} scores ${overallScore}/100 for the ${job.title} requisition with an ATS readability score of ${atsScore}/100. The candidate demonstrates strong competencies across ${matchedSkillsList.slice(0, 4).join(', ')}, while showing notable opportunities to reinforce proof in ${weakSkills.length > 0 ? weakSkills.map(w => w.skillName).slice(0, 3).join(', ') : 'niche required skills'}.`,
    fitAssessment: `Job Fit is evaluated at ${jobFitScore}/100 based on weighted requirements (${job.requiredSkills.map(r => `${r.skillName} [${r.importance}]`).join(', ')}). The candidate has ${matchedSkillsList.length} of ${job.requiredSkills.length} required skills verified, with an average evidence strength of ${evidenceStrengthScore}%.`,
    strengthsExplanation: [
      `Demonstrated verifiable technical capabilities in ${matchedSkillsList.slice(0, 3).join(', ')} through concrete project artifacts.`,
      `Accumulated ${totalYearsExp.toFixed(1)} years of relevant experience against the role's ${targetYears}-year threshold (${experienceScore}% experience rating).`,
      `Portfolio includes ${profile.projects.length} documented projects demonstrating applied problem-solving and stack fluency.`
    ],
    gapsAndWeaknesses: [
      missingSkillsList.length > 0 
        ? `Missing critical job requirements: ${missingSkillsList.join(', ')}.` 
        : `All required core job skills are represented, but evidence depth varies.`,
      weakSkills.length > 0
        ? `Weak or under-supported skills: ${weakSkills.map(w => `${w.skillName} (${w.evidenceStrength}% strength)`).join(', ')}.`
        : `Strong evidence density across all submitted skills.`
    ],
    atsAnalysis: `ATS score is ${atsScore}/100. Standard sections (Experience, Education, Skills) are well-structured for machine parsing. ${missingContent.length > 0 ? `Enhance parsing by addressing: ${missingContent[0]}` : 'Structure complies with modern ATS scanners.'}`,
    strategicActionPlan: [
      `Add explicit project artifacts or repository links for weak skills (${weakSkills.slice(0, 2).map(w => w.skillName).join(', ') || 'claimed skills'}).`,
      `Address missing required skills (${missingSkillsList.slice(0, 2).join(', ') || 'advanced ecosystem tooling'}) via targeted demonstration projects.`,
      `Incorporate measurable metric verbs into work experience bullets to boost evidence strength above 90%.`
    ]
  };

  return { 
    scores, 
    explanation,
    weakSkills,
    missingContent,
    structuredExplanation
  };
}
