import { 
  CandidateProfile, 
  SkillVerification, 
  SkillLevel, 
  VerificationStatus, 
  EvidenceItem, 
  EvidenceCheckItem 
} from '../types';

/**
 * Deterministic Evidence-Based Skill Verification Engine
 * 
 * Core Philosophy: "Don't just claim a skill. Prove it."
 * 
 * For every skill claimed or extracted from a resume, this engine:
 * 1. Searches candidate data across 8 distinct evidence vectors:
 *    - projects
 *    - internships
 *    - work experience
 *    - certifications
 *    - GitHub repositories
 *    - portfolio / live demos
 *    - coding assessments / competitive platforms
 *    - courses / academic coursework
 * 2. Compiles a verifiable Evidence Checklist (✓ found, ✗ missing)
 * 3. Calculates Evidence Strength (0-100%) using mathematical rules
 * 4. Determines Estimated Proficiency vs Claimed Level
 * 5. Assigns Verification Status:
 *    - Verified
 *    - Partially Verified
 *    - Insufficient Evidence
 *    - Needs Manual Review
 * 6. Generates an objective, respectful, and actionable explanation
 *    (Crucial rule: Never call a candidate fake simply because evidence is missing).
 */

// Helper to check if a text string contains the skill keyword (word boundary aware)
function containsSkill(text: string | undefined | null, skill: string): boolean {
  if (!text || !skill) return false;
  const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(text);
}

// Convert numeric level score to standard SkillLevel
function scoreToLevel(score: number): SkillLevel | 'Insufficient Evidence' {
  if (score >= 85) return 'Expert';
  if (score >= 68) return 'Advanced';
  if (score >= 38) return 'Intermediate';
  if (score >= 18) return 'Beginner';
  return 'Insufficient Evidence';
}

export function verifySingleSkill(
  skillName: string,
  claimedLevel: SkillLevel = 'Intermediate',
  profile: CandidateProfile
): SkillVerification {
  const normSkill = skillName.trim();
  const evidenceItems: EvidenceItem[] = [];
  const checklist: EvidenceCheckItem[] = [];

  // ================= 1. SEARCH WORK EXPERIENCE =================
  let experienceYears = 0;
  let experienceCount = 0;
  const matchingExperience: { role: string; company: string; duration: string; snippet: string }[] = [];

  if (profile.experience && profile.experience.length > 0) {
    profile.experience.forEach((exp) => {
      const matchRole = containsSkill(exp.role, normSkill);
      const matchDesc = exp.description?.some((d) => containsSkill(d, normSkill));
      const matchHigh = exp.highlights?.some((h) => containsSkill(h, normSkill));

      if (matchRole || matchDesc || matchHigh) {
        experienceCount++;
        experienceYears += exp.years || 1;
        const snippet = exp.highlights?.[0] || exp.description?.[0] || `Worked with ${normSkill} as ${exp.role}`;
        matchingExperience.push({
          role: exp.role,
          company: exp.company,
          duration: exp.duration,
          snippet
        });

        evidenceItems.push({
          id: `ev-exp-${evidenceItems.length + 1}`,
          type: 'Work experience',
          title: `${exp.role} at ${exp.company}`,
          source: 'Work History',
          description: snippet,
          relevanceScore: Math.min(95, 75 + (exp.years || 1) * 8),
          dateRange: exp.duration
        });
      }
    });
  }

  // ================= 2. SEARCH PROJECTS =================
  let projectCount = 0;
  let hasProjectRepo = false;
  let hasProjectLiveLink = false;
  const matchingProjects: { name: string; desc: string; link?: string }[] = [];

  if (profile.projects && profile.projects.length > 0) {
    profile.projects.forEach((proj) => {
      const matchName = containsSkill(proj.name, normSkill);
      const matchDesc = containsSkill(proj.description, normSkill);
      const matchTech = proj.technologies?.some((t) => containsSkill(t, normSkill));

      if (matchName || matchDesc || matchTech) {
        projectCount++;
        if (proj.link) {
          if (proj.link.includes('github') || proj.link.includes('gitlab')) {
            hasProjectRepo = true;
          } else {
            hasProjectLiveLink = true;
          }
        }
        matchingProjects.push({
          name: proj.name,
          desc: proj.description,
          link: proj.link
        });

        evidenceItems.push({
          id: `ev-proj-${evidenceItems.length + 1}`,
          type: 'Project',
          title: proj.name,
          source: 'Projects Portfolio',
          description: proj.impact ? `${proj.description} (${proj.impact})` : proj.description,
          relevanceScore: proj.link ? 92 : 80,
          link: proj.link
        });
      }
    });
  }

  // ================= 3. SEARCH INTERNSHIPS =================
  let internshipCount = 0;
  const matchingInternships: { role: string; company: string; desc: string }[] = [];

  if (profile.internships && profile.internships.length > 0) {
    profile.internships.forEach((intern) => {
      const matchRole = containsSkill(intern.role, normSkill);
      const matchCompany = containsSkill(intern.company, normSkill);
      const matchProjects = intern.projects?.some((p) => containsSkill(p, normSkill));

      if (matchRole || matchCompany || matchProjects) {
        internshipCount++;
        const desc = intern.projects?.[0] || `Internship application of ${normSkill}`;
        matchingInternships.push({
          role: intern.role,
          company: intern.company,
          desc
        });

        evidenceItems.push({
          id: `ev-int-${evidenceItems.length + 1}`,
          type: 'Internship',
          title: `${intern.role} - ${intern.company}`,
          source: 'Internships',
          description: desc,
          relevanceScore: 84,
          dateRange: intern.duration
        });
      }
    });
  }

  // ================= 4. SEARCH CERTIFICATIONS =================
  let certificationCount = 0;
  const matchingCerts: { name: string; issuer: string; id?: string }[] = [];

  if (profile.certifications && profile.certifications.length > 0) {
    profile.certifications.forEach((cert) => {
      if (containsSkill(cert.name, normSkill) || containsSkill(cert.issuer, normSkill)) {
        certificationCount++;
        matchingCerts.push({
          name: cert.name,
          issuer: cert.issuer,
          id: cert.credentialId
        });

        evidenceItems.push({
          id: `ev-cert-${evidenceItems.length + 1}`,
          type: 'Certification',
          title: cert.name,
          source: cert.issuer,
          description: cert.credentialId ? `Credential ID: ${cert.credentialId}` : `Issued by ${cert.issuer}`,
          relevanceScore: 88,
          dateRange: cert.date
        });
      }
    });
  }

  // ================= 5. SEARCH GITHUB & CODE REPOSITORIES =================
  const hasGithub = Boolean(profile.githubUrl) || hasProjectRepo;
  if (hasGithub && (projectCount > 0 || experienceCount > 0)) {
    evidenceItems.push({
      id: `ev-gh-${evidenceItems.length + 1}`,
      type: 'GitHub',
      title: `${normSkill} Code Repository & Implementation Artifacts`,
      source: 'GitHub / Version Control',
      description: `Public code implementations and commit history corroborating hands-on ${normSkill} usage`,
      relevanceScore: 85,
      link: profile.githubUrl || matchingProjects.find((p) => p.link)?.link
    });
  }

  // ================= 6. SEARCH PORTFOLIO & LIVE DEPLOYMENTS =================
  const hasPortfolio = Boolean(profile.portfolioUrl) || hasProjectLiveLink;
  if (hasPortfolio && projectCount > 0) {
    evidenceItems.push({
      id: `ev-port-${evidenceItems.length + 1}`,
      type: 'Portfolio',
      title: `${normSkill} Live Production Demo / Portfolio`,
      source: 'Portfolio',
      description: `Interactive deployment or portfolio case study showcasing ${normSkill}`,
      relevanceScore: 82,
      link: profile.portfolioUrl || matchingProjects.find((p) => p.link)?.link
    });
  }

  // ================= 7. SEARCH CODING ASSESSMENTS & PROFILES =================
  const hasCodingProfile = Boolean(profile.codingProfiles && profile.codingProfiles.length > 0);
  let assessmentDetails: string | undefined;
  if (hasCodingProfile) {
    const relevantPlatform = profile.codingProfiles?.find((cp) => 
      containsSkill(cp.platform, normSkill) || 
      containsSkill(cp.score, normSkill) ||
      ['leetcode', 'hackerrank', 'codeforces', 'kaggle'].some((p) => cp.platform.toLowerCase().includes(p))
    );

    if (relevantPlatform) {
      assessmentDetails = `${relevantPlatform.platform} (Score/Rating: ${relevantPlatform.score || 'Active Verified Profile'})`;
      evidenceItems.push({
        id: `ev-assess-${evidenceItems.length + 1}`,
        type: 'Coding assessment',
        title: `${normSkill} Coding Assessment / Challenge Profile`,
        source: relevantPlatform.platform,
        description: `Empirical problem solving demonstrated on ${relevantPlatform.platform}`,
        relevanceScore: 90,
        link: relevantPlatform.url
      });
    }
  }

  // ================= 8. SEARCH COURSES & ACADEMIC COURSEWORK =================
  let hasCourse = false;
  let courseDetails: string | undefined;
  if (profile.education && profile.education.length > 0) {
    profile.education.forEach((edu) => {
      const matchDegree = containsSkill(edu.degree, normSkill) || containsSkill(edu.field, normSkill);
      if (matchDegree) {
        hasCourse = true;
        courseDetails = `${edu.degree} in ${edu.field} at ${edu.institution}`;
        evidenceItems.push({
          id: `ev-course-${evidenceItems.length + 1}`,
          type: 'Course',
          title: `Academic Coursework in ${normSkill}`,
          source: edu.institution,
          description: courseDetails,
          relevanceScore: 75,
          dateRange: edu.year
        });
      }
    });
  }

  // ================= COMPILE EVIDENCE CHECKLIST =================
  // Checklist Item 1: Project
  if (projectCount > 0) {
    const firstProj = matchingProjects[0];
    checklist.push({
      category: 'project',
      label: `${normSkill} project`,
      present: true,
      evidenceTitle: firstProj.name,
      evidenceSnippet: firstProj.desc
    });
  } else {
    checklist.push({
      category: 'project',
      label: `${normSkill} project`,
      present: false,
      evidenceSnippet: `No standalone ${normSkill} project cited in portfolio`
    });
  }

  // Checklist Item 2: Internship
  if (internshipCount > 0) {
    const firstInt = matchingInternships[0];
    checklist.push({
      category: 'internship',
      label: `${normSkill} internship`,
      present: true,
      evidenceTitle: `${firstInt.role} at ${firstInt.company}`,
      evidenceSnippet: firstInt.desc
    });
  } else {
    checklist.push({
      category: 'internship',
      label: `${normSkill} internship`,
      present: false,
      evidenceSnippet: `No formal internship utilizing ${normSkill}`
    });
  }

  // Checklist Item 3: Certification
  if (certificationCount > 0) {
    const firstCert = matchingCerts[0];
    checklist.push({
      category: 'certification',
      label: `${normSkill} certification`,
      present: true,
      evidenceTitle: firstCert.name,
      evidenceSnippet: `Issued by ${firstCert.issuer}`
    });
  } else {
    checklist.push({
      category: 'certification',
      label: `${normSkill} certification`,
      present: false,
      evidenceSnippet: `No industry certification listed for ${normSkill}`
    });
  }

  // Checklist Item 4: Coding Assessment
  if (assessmentDetails) {
    checklist.push({
      category: 'assessment',
      label: `${normSkill} coding assessment`,
      present: true,
      evidenceTitle: assessmentDetails,
      evidenceSnippet: 'Verified competitive or benchmark coding track'
    });
  } else {
    checklist.push({
      category: 'assessment',
      label: `Advanced coding assessment`,
      present: false,
      evidenceSnippet: 'No LeetCode, HackerRank, or proctored assessment score'
    });
  }

  // Checklist Item 5: Professional Experience
  if (experienceCount > 0) {
    const firstExp = matchingExperience[0];
    checklist.push({
      category: 'experience',
      label: `Professional ${normSkill} experience`,
      present: true,
      evidenceTitle: `${firstExp.role} (${experienceYears}+ yrs)`,
      evidenceSnippet: firstExp.snippet
    });
  } else {
    checklist.push({
      category: 'experience',
      label: `Professional ${normSkill} experience`,
      present: false,
      evidenceSnippet: `0 full-time industry years in dedicated ${normSkill} roles`
    });
  }

  // Checklist Item 6: GitHub Repo
  if (hasGithub) {
    checklist.push({
      category: 'github',
      label: `GitHub repository / code sample`,
      present: true,
      evidenceTitle: profile.githubUrl || 'Linked GitHub Repository',
      evidenceSnippet: 'Verifiable commit history & implementation source'
    });
  } else {
    checklist.push({
      category: 'github',
      label: `GitHub repository / code sample`,
      present: false,
      evidenceSnippet: 'No public code repository link provided in resume'
    });
  }

  // Checklist Item 7: Portfolio / Live Demo
  if (hasPortfolio) {
    checklist.push({
      category: 'portfolio',
      label: `Portfolio / live deployment`,
      present: true,
      evidenceTitle: profile.portfolioUrl || 'Live Deployment URL',
      evidenceSnippet: 'Interactive demo available for review'
    });
  }

  // Checklist Item 8: Course / Education
  if (hasCourse) {
    checklist.push({
      category: 'course',
      label: `Academic course / degree in ${normSkill}`,
      present: true,
      evidenceTitle: courseDetails || 'Academic Coursework',
      evidenceSnippet: 'Formal foundational training'
    });
  }

  // ================= DETERMINISTIC STRENGTH CALCULATION =================
  // Mathematical weighted formula (max 100):
  // Work Experience: 25 max (1 yr = 15, 2+ yrs = 25)
  // Projects: 25 max (1 proj = 15, 2+ projs = 23, +2 if repo link)
  // Internships: 15 max
  // Certifications: 15 max
  // GitHub Repos: 10 max
  // Coding Assessment: 10 max
  // Live Portfolio: 5 max
  // Academic Coursework: 5 max
  let strengthRaw = 0;

  if (experienceCount > 0) {
    strengthRaw += experienceYears >= 2 ? 25 : 16;
  }
  if (projectCount > 0) {
    strengthRaw += projectCount >= 2 ? 23 : 15;
    if (hasProjectRepo) strengthRaw += 2;
  }
  if (internshipCount > 0) {
    strengthRaw += 15;
  }
  if (certificationCount > 0) {
    strengthRaw += 15;
  }
  if (hasGithub) {
    strengthRaw += 10;
  }
  if (assessmentDetails) {
    strengthRaw += 10;
  }
  if (hasPortfolio) {
    strengthRaw += 5;
  }
  if (hasCourse) {
    strengthRaw += 5;
  }

  // Clamp strength between 0 and 100
  const evidenceStrength = Math.min(100, Math.max(8, strengthRaw));
  const estimatedLevel = scoreToLevel(evidenceStrength);

  // ================= VERIFICATION STATUS DETERMINATION =================
  let verificationStatus: VerificationStatus = 'Insufficient Evidence';

  const presentCount = checklist.filter((c) => c.present).length;

  if (evidenceStrength >= 75) {
    if (claimedLevel === 'Expert' && estimatedLevel !== 'Expert') {
      verificationStatus = 'Partially Verified';
    } else {
      verificationStatus = 'Verified';
    }
  } else if (evidenceStrength >= 38 || presentCount >= 2) {
    if (claimedLevel === 'Expert' && evidenceStrength < 50) {
      verificationStatus = 'Needs Manual Review';
    } else if (claimedLevel === 'Advanced' && estimatedLevel === 'Intermediate') {
      verificationStatus = 'Partially Verified';
    } else if (claimedLevel === 'Intermediate' && estimatedLevel === 'Intermediate') {
      verificationStatus = 'Verified';
    } else {
      verificationStatus = 'Partially Verified';
    }
  } else if (evidenceStrength >= 18 || presentCount === 1) {
    if (claimedLevel === 'Advanced' || claimedLevel === 'Expert') {
      verificationStatus = 'Needs Manual Review';
    } else {
      verificationStatus = 'Partially Verified';
    }
  } else {
    if (claimedLevel === 'Advanced' || claimedLevel === 'Expert') {
      verificationStatus = 'Needs Manual Review';
    } else {
      verificationStatus = 'Insufficient Evidence';
    }
  }

  // ================= GENERATE OBJECTIVE EXPLANATION =================
  let explanation = '';
  const verifiedPieces: string[] = [];
  if (projectCount > 0) verifiedPieces.push(`${projectCount} project${projectCount > 1 ? 's' : ''}`);
  if (internshipCount > 0) verifiedPieces.push(`${internshipCount} internship`);
  if (certificationCount > 0) verifiedPieces.push(`${certificationCount} certification`);
  if (experienceCount > 0) verifiedPieces.push(`${experienceYears}+ years of work experience`);
  if (assessmentDetails) verifiedPieces.push('verified coding assessments');

  const missingPieces: string[] = [];
  if (experienceCount === 0) missingPieces.push(`senior industry work experience`);
  if (!assessmentDetails) missingPieces.push(`formal coding assessments`);
  if (certificationCount === 0) missingPieces.push(`external certifications`);
  if (projectCount === 0) missingPieces.push(`linked code projects`);

  if (verificationStatus === 'Verified') {
    explanation = `Candidate claims ${claimedLevel} proficiency. Verified by ${verifiedPieces.join(', ')}. The empirical evidence strength (${evidenceStrength}%) meets or exceeds the claimed competency benchmark.`;
  } else if (verificationStatus === 'Partially Verified') {
    explanation = `Candidate claims ${claimedLevel} proficiency. Concrete evidence confirms ${verifiedPieces.length > 0 ? verifiedPieces.join(' and ') : 'foundational exposure'}. However, absence of ${missingPieces.slice(0, 2).join(' or ')} places estimated depth at ${estimatedLevel} (${evidenceStrength}% strength). Recommend validating advanced architectural nuances during technical interview.`;
  } else if (verificationStatus === 'Needs Manual Review') {
    explanation = `Candidate claimed ${claimedLevel} level, but available resume artifacts demonstrate ${estimatedLevel === 'Insufficient Evidence' ? 'limited empirical documentation' : `${estimatedLevel} evidence (${evidenceStrength}%)`}. This does not imply inaccurate claims; rather, recruiters are advised to ask the candidate to walk through specific ${normSkill} code samples or problem-solving scenarios during interviews.`;
  } else {
    explanation = `Claimed ${claimedLevel} proficiency with minimal tangible artifacts detected in the resume (${evidenceStrength}% evidence strength). Note: Lack of documented evidence does not denote absence of skill—it indicates the candidate should add specific projects, metrics, or credentials to substantiate this skill.`;
  }

  // Missing proof note & recommendations
  let missingProofNote: string | undefined;
  let recommendation: string | undefined;

  if (verificationStatus !== 'Verified') {
    if (projectCount === 0) {
      missingProofNote = `No dedicated ${normSkill} repository or project link found in the resume.`;
      recommendation = `Publish a production-grade ${normSkill} project with a README, test coverage, and a public GitHub link.`;
    } else if (experienceCount === 0 && (claimedLevel === 'Advanced' || claimedLevel === 'Expert')) {
      missingProofNote = `Lack of documented professional work experience in ${normSkill}.`;
      recommendation = `Complete a recognized certification or verified coding assessment (e.g. HackerRank / LeetCode) to corroborate advanced proficiency.`;
    } else if (certificationCount === 0) {
      missingProofNote = `Independent third-party certification is absent.`;
      recommendation = `Earn an accredited certification in ${normSkill} to elevate evidence strength from ${evidenceStrength}% to 85%+.`;
    }
  }

  return {
    skillName: normSkill,
    claimedLevel,
    estimatedLevel,
    evidenceStrength,
    verificationStatus,
    evidenceItems,
    checklist,
    explanation,
    missingProofNote,
    recommendation
  };
}

/**
 * Run deterministic verification across all candidate skills
 */
export function verifyAllCandidateSkills(
  profile: CandidateProfile,
  existingVerifications?: SkillVerification[]
): SkillVerification[] {
  // Collect all unique skills
  const skillMap = new Map<string, SkillLevel>();

  // If existing verifications exist, preserve claimed level
  if (existingVerifications) {
    existingVerifications.forEach((v) => {
      skillMap.set(v.skillName.toLowerCase(), v.claimedLevel || 'Intermediate');
    });
  }

  // Also include all extracted skills from profile
  if (profile.allExtractedSkills) {
    profile.allExtractedSkills.forEach((skill) => {
      const lower = skill.toLowerCase();
      if (!skillMap.has(lower)) {
        skillMap.set(lower, 'Intermediate');
      }
    });
  }

  // Verify each skill
  const results: SkillVerification[] = [];
  const processed = new Set<string>();

  skillMap.forEach((claimedLevel, key) => {
    // Find matching proper-cased name
    const properName = 
      existingVerifications?.find((v) => v.skillName.toLowerCase() === key)?.skillName ||
      profile.allExtractedSkills?.find((s) => s.toLowerCase() === key) ||
      key.charAt(0).toUpperCase() + key.slice(1);

    if (!processed.has(properName.toLowerCase())) {
      processed.add(properName.toLowerCase());
      results.push(verifySingleSkill(properName, claimedLevel, profile));
    }
  });

  // Sort: Verified first, then Partially Verified, then Needs Manual Review, descending by evidence strength
  return results.sort((a, b) => {
    const statusOrder: Record<VerificationStatus, number> = {
      'Verified': 1,
      'Partially Verified': 2,
      'Needs Manual Review': 3,
      'Insufficient Evidence': 4,
      'Unverified': 5
    };
    const diff = (statusOrder[a.verificationStatus] || 9) - (statusOrder[b.verificationStatus] || 9);
    if (diff !== 0) return diff;
    return b.evidenceStrength - a.evidenceStrength;
  });
}
