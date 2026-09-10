export type UserRole = 'candidate' | 'hr';

export type SkillLevel = 'Basic' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type SkillImportance = 'Critical' | 'High' | 'Medium' | 'Low' | 'Nice-to-have';

export type EvidenceType = 
  | 'Internship'
  | 'Project'
  | 'Certification'
  | 'GitHub'
  | 'Portfolio'
  | 'Coding assessment'
  | 'Work experience'
  | 'Course'
  | 'Other';

export type VerificationStatus = 
  | 'Verified' 
  | 'Partially Verified' 
  | 'Insufficient Evidence' 
  | 'Needs Manual Review'
  | 'Unverified';

export type CandidateHiringStatus = 
  | 'New'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview Scheduled'
  | 'Offer Extended'
  | 'Rejected';

export type HiringStatus = CandidateHiringStatus;

export interface EvidenceCheckItem {
  category: 
    | 'project' 
    | 'internship' 
    | 'experience' 
    | 'certification' 
    | 'github' 
    | 'portfolio' 
    | 'assessment' 
    | 'course';
  label: string;
  present: boolean;
  evidenceTitle?: string;
  evidenceSnippet?: string;
}

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  title: string;
  source: string;
  description: string;
  relevanceScore: number; // 0-100
  link?: string;
  dateRange?: string;
}

export interface SkillVerification {
  skillName: string;
  claimedLevel: SkillLevel;
  estimatedLevel: SkillLevel | 'Insufficient Evidence';
  evidenceStrength: number; // 0-100%
  verificationStatus: VerificationStatus;
  evidenceItems: EvidenceItem[];
  checklist?: EvidenceCheckItem[]; // Detailed checklist: ✓ project, ✓ internship, ✗ assessment, etc.
  explanation?: string; // Direct textual explanation of verification and evidence strength
  missingProofNote?: string;
  recommendation?: string;
}

export interface CandidateScores {
  overallScore: number; // 0-100 (deterministic weighted)
  jobFitScore: number; // 30% weight
  verifiedSkillsScore: number; // 25% weight
  experienceScore: number; // 15% weight
  projectsScore: number; // 10% weight
  educationScore: number; // 5% weight
  certificationsScore: number; // 5% weight
  resumeQualityScore: number; // 5% weight
  evidenceStrengthScore: number; // 5% weight
  atsScore: number; // 0-100 (ATS readability & standard sections)
}

export interface AIContentReview {
  possibleAIContentIndicator: boolean;
  aiContentLabel: 'Unlikely AI-generated' | 'Possible AI-generated content' | 'Needs manual review';
  aiConfidenceNote: string;
  possibleSimilarityIndicator: boolean;
  similarityLabel: 'Original structure detected' | 'Possible similarity' | 'Needs manual review';
  similarityNote: string;
  manualReviewFlags: string[];
}

export interface ResumeClaimIssue {
  claim: string;
  issueType: 'Unsupported Claim' | 'Vague Metric' | 'Inflated Level' | 'Missing Proof';
  explanation: string;
  howToFix: string;
}

export interface JobRoleRecommendation {
  roleTitle: string;
  matchScore: number; // 0-100
  rationale: string;
  keyStrengths: string[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  githubUrl?: string;
  portfolioUrl?: string;
  codingProfiles?: { platform: string; url: string; score?: string }[];
  education: {
    degree: string;
    field: string;
    institution: string;
    year: string;
    gpa?: string;
  }[];
  experience: {
    role: string;
    company: string;
    duration: string;
    years: number;
    description: string[];
    highlights: string[];
  }[];
  internships: {
    role: string;
    company: string;
    duration: string;
    projects: string[];
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    impact?: string;
  }[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
    credentialId?: string;
  }[];
  achievements: string[];
  allExtractedSkills: string[];
}

export interface WeakSkillItem {
  skillName: string;
  claimedOrDetectedLevel: string;
  evidenceStrength: number;
  issue: string;
  suggestedRemedy: string;
}

export interface AIStructuredExplanation {
  executiveSummary: string;
  fitAssessment: string;
  strengthsExplanation: string[];
  gapsAndWeaknesses: string[];
  atsAnalysis: string;
  strategicActionPlan: string[];
}

export interface AnalysisResult {
  candidateId: string;
  jobId: string;
  analyzedAt: string;
  scores: CandidateScores;
  scoreExplanation: string;
  skillVerifications: SkillVerification[];
  matchedSkills: string[];
  missingSkills: string[];
  weakSkills?: WeakSkillItem[];
  recommendedSkillsToLearn: {
    skill: string;
    importance: string;
    estimatedTimeToLearn: string;
    suggestedProofProject: string;
  }[];
  alternativeJobRoles: JobRoleRecommendation[];
  resumeImprovements: {
    category: 'Formatting' | 'Content' | 'Proof' | 'Impact Metrics';
    title: string;
    feedback: string;
    example: string;
  }[];
  missingSections: string[];
  missingContent?: string[];
  unsupportedClaims: ResumeClaimIssue[];
  aiContentReview: AIContentReview;
  aiStructuredExplanation?: AIStructuredExplanation;
}

export interface RequiredSkillCard {
  id: string;
  skillName: string;
  requiredLevel: SkillLevel;
  importance: SkillImportance;
}

export type RequiredSkill = RequiredSkillCard;

export interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceRequiredYears: number;
  salaryRange: string;
  description: string;
  requiredSkills: RequiredSkillCard[];
  createdAt: string;
  active: boolean;
  totalApplicants: number;
}

export interface HRNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface CandidateRecord {
  id: string;
  candidateProfile: CandidateProfile;
  jobId: string;
  analysis: AnalysisResult;
  hiringStatus: CandidateHiringStatus;
  hrNotes: HRNote[];
  shortlisted: boolean;
  interviewDate?: string;
  appliedDate: string;
}

export interface CompanyProfile {
  name: string;
  tagline: string;
  industry: string;
  size: string;
  website: string;
  location: string;
  about: string;
  recruiterName: string;
  recruiterEmail: string;
}

export interface CandidateComparisonAnalysis {
  strongestOverall: {
    candidateId: string;
    candidateName: string;
    score: number;
    headline: string;
    rationale: string;
    keyAdvantages: string[];
  };
  strongestEvidence: {
    candidateId: string;
    candidateName: string;
    evidenceScore: number;
    rationale: string;
    proofHighlights: string[];
  };
  strongestTechnicalSkills: {
    candidateId: string;
    candidateName: string;
    technicalScore: number;
    rationale: string;
    standoutSkills: string[];
  };
  skillGaps: {
    candidateId: string;
    candidateName: string;
    gaps: {
      skillName: string;
      requiredLevel: string;
      detectedLevel: string;
      gapSeverity: 'Critical' | 'Moderate' | 'Minor';
      impact: string;
    }[];
  }[];
  verificationConcerns: {
    candidateId: string;
    candidateName: string;
    concernCount: number;
    concerns: {
      claim: string;
      issueType: string;
      details: string;
      suggestedInterviewQuestion: string;
    }[];
  }[];
  executiveRecommendation: string;
  interviewQuestions: {
    candidateName: string;
    questions: string[];
  }[];
}
