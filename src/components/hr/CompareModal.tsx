import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  Star, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  BarChart2, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  FileText, 
  Code2, 
  Scale, 
  Copy, 
  CheckCheck, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  CandidateRecord, 
  JobPosting, 
  HiringStatus, 
  CandidateComparisonAnalysis,
  SkillLevel 
} from '../../types';
import { generateCandidateComparisonAnalysis } from '../../lib/comparisonEngine';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateRecord[];
  allCandidates?: CandidateRecord[];
  activeJob: JobPosting;
  onToggleShortlist: (candidateId: string) => void;
  onUpdateStatus: (candidateId: string, status: HiringStatus) => void;
  onSelectCandidateProfile: (candidate: CandidateRecord) => void;
}

const LEVEL_RANKS: Record<string, number> = {
  'basic': 1,
  'beginner': 1,
  'intermediate': 2,
  'advanced': 3,
  'expert': 4,
};

const CANDIDATE_LABELS = ['Candidate A', 'Candidate B', 'Candidate C'];
const CANDIDATE_THEME_COLORS = [
  { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', badge: 'bg-indigo-600' },
  { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-600' },
  { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', badge: 'bg-purple-600' },
];

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  candidates: initialCandidates,
  allCandidates = [],
  activeJob,
  onToggleShortlist,
  onUpdateStatus,
  onSelectCandidateProfile
}) => {
  // Candidate pool within modal (supports 2 or 3 candidates)
  const [currentCandidates, setCurrentCandidates] = useState<CandidateRecord[]>([]);
  const [analysisData, setAnalysisData] = useState<CandidateComparisonAnalysis | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiSource, setAiSource] = useState<string>('engine');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [isAddCandidateDropdownOpen, setIsAddCandidateDropdownOpen] = useState<boolean>(false);

  // Synchronize initial candidates when modal opens or selection changes
  useEffect(() => {
    if (isOpen && initialCandidates.length > 0) {
      const slice = initialCandidates.slice(0, 3);
      setCurrentCandidates(slice);
    }
  }, [isOpen, initialCandidates]);

  // Generate or fetch AI comparison analysis whenever currentCandidates change
  useEffect(() => {
    if (!isOpen || currentCandidates.length < 2) return;

    let isMounted = true;
    setIsLoadingAI(true);

    // Immediate fallback generation to ensure 0ms lag
    const deterministic = generateCandidateComparisonAnalysis(currentCandidates, activeJob);
    setAnalysisData(deterministic);
    setAiSource('deterministic-engine');

    // Attempt server-side Gemini generation for rich context
    fetch('/api/compare-candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateIds: currentCandidates.map((c) => c.id),
        jobId: activeJob.id,
        candidatesPayload: currentCandidates,
        activeJobPayload: activeJob
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Comparison API returned ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && data.strongestOverall) {
          setAnalysisData(data);
          setAiSource(data.source || 'gemini-3.8-flash');
        }
      })
      .catch((err) => {
        console.log('Using local empirical comparison engine:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsLoadingAI(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentCandidates, activeJob]);

  // Helper to add a 3rd candidate if currently 2
  const handleAddCandidate = (candidate: CandidateRecord) => {
    if (currentCandidates.length >= 3) return;
    if (currentCandidates.some((c) => c.id === candidate.id)) return;
    setCurrentCandidates([...currentCandidates, candidate]);
    setIsAddCandidateDropdownOpen(false);
  };

  // Helper to remove a candidate (must keep at least 2)
  const handleRemoveCandidate = (candidateId: string) => {
    if (currentCandidates.length <= 2) {
      alert('A minimum of 2 candidates is required for side-by-side comparison.');
      return;
    }
    setCurrentCandidates(currentCandidates.filter((c) => c.id !== candidateId));
  };

  // Available candidates in the job pool that are not currently in the comparison list
  const availableToAdd = useMemo(() => {
    const currentIds = new Set(currentCandidates.map((c) => c.id));
    return allCandidates.filter((c) => !currentIds.has(c.id));
  }, [allCandidates, currentCandidates]);

  // Skill Match calculation (% of activeJob.requiredSkills candidate matches)
  const getSkillMatchPercentage = (candidate: CandidateRecord) => {
    if (activeJob.requiredSkills.length === 0) return 100;
    const matchedCount = activeJob.requiredSkills.filter((req) => {
      return candidate.analysis.skillVerifications.some(
        (v) => v.skillName.toLowerCase().trim() === req.skillName.toLowerCase().trim()
      );
    }).length;
    return Math.round((matchedCount / activeJob.requiredSkills.length) * 100);
  };

  // Experience calculation
  const getExperienceYears = (candidate: CandidateRecord) => {
    return candidate.candidateProfile.experience.reduce((acc, e) => acc + (e.years || 1), 0);
  };

  // Copy structured AI comparison summary to clipboard
  const handleCopySummary = () => {
    if (!analysisData) return;
    const text = `
PROOF-CV AI-ASSISTED CANDIDATE COMPARISON REPORT
Role: ${activeJob.title}
Candidates Evaluated: ${currentCandidates.map((c, i) => `${CANDIDATE_LABELS[i]} (${c.candidateProfile.name})`).join(' vs ')}

1. STRONGEST CANDIDATE OVERALL:
   ${analysisData.strongestOverall.candidateName} (Score: ${analysisData.strongestOverall.score}/100)
   ${analysisData.strongestOverall.rationale}
   Key Advantages:
   ${analysisData.strongestOverall.keyAdvantages.map((a) => `   • ${a}`).join('\n')}

2. CANDIDATE WITH STRONGEST EVIDENCE:
   ${analysisData.strongestEvidence.candidateName} (Evidence: ${analysisData.strongestEvidence.evidenceScore}%)
   ${analysisData.strongestEvidence.rationale}
   Proof Highlights:
   ${analysisData.strongestEvidence.proofHighlights.map((p) => `   • ${p}`).join('\n')}

3. CANDIDATE WITH STRONGEST TECHNICAL SKILLS:
   ${analysisData.strongestTechnicalSkills.candidateName}
   ${analysisData.strongestTechnicalSkills.rationale}
   Standout Competencies:
   ${analysisData.strongestTechnicalSkills.standoutSkills.map((s) => `   • ${s}`).join('\n')}

4. IMPORTANT SKILL GAPS:
${analysisData.skillGaps.map((sg) => `   ${sg.candidateName}:\n` + sg.gaps.map((g) => `     - ${g.skillName} (${g.requiredLevel} req vs ${g.detectedLevel}): ${g.impact}`).join('\n')).join('\n')}

5. VERIFICATION CONCERNS:
${analysisData.verificationConcerns.map((vc) => `   ${vc.candidateName} (${vc.concernCount} flags):\n` + vc.concerns.map((c) => `     - [${c.issueType}] ${c.claim}: ${c.details}`).join('\n')).join('\n')}

AI-ASSISTED RECOMMENDATION:
${analysisData.executiveRecommendation}

DISCLAIMER:
AI-assisted recommendation only. Never make hiring decisions automatically. Final decisions rest solely with human hiring managers.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  if (!isOpen || currentCandidates.length === 0) return null;

  // Max values for relative comparisons
  const maxOverall = Math.max(...currentCandidates.map((c) => c.analysis.scores.overallScore));
  const minOverall = Math.min(...currentCandidates.map((c) => c.analysis.scores.overallScore));

  const maxJobFit = Math.max(...currentCandidates.map((c) => c.analysis.scores.jobFitScore));
  const minJobFit = Math.min(...currentCandidates.map((c) => c.analysis.scores.jobFitScore));

  const maxAts = Math.max(...currentCandidates.map((c) => c.analysis.scores.atsScore || 75));
  const minAts = Math.min(...currentCandidates.map((c) => c.analysis.scores.atsScore || 75));

  const maxSkillMatch = Math.max(...currentCandidates.map((c) => getSkillMatchPercentage(c)));
  const minSkillMatch = Math.min(...currentCandidates.map((c) => getSkillMatchPercentage(c)));

  const maxVerified = Math.max(...currentCandidates.map((c) => c.analysis.scores.verifiedSkillsScore));
  const minVerified = Math.min(...currentCandidates.map((c) => c.analysis.scores.verifiedSkillsScore));

  const maxEvidence = Math.max(...currentCandidates.map((c) => c.analysis.scores.evidenceStrengthScore));
  const minEvidence = Math.min(...currentCandidates.map((c) => c.analysis.scores.evidenceStrengthScore));

  const maxExp = Math.max(...currentCandidates.map((c) => getExperienceYears(c)));
  const minExp = Math.min(...currentCandidates.map((c) => getExperienceYears(c)));

  const maxProjects = Math.max(...currentCandidates.map((c) => c.candidateProfile.projects.length));
  const minProjects = Math.min(...currentCandidates.map((c) => c.candidateProfile.projects.length));

  const maxCerts = Math.max(...currentCandidates.map((c) => c.candidateProfile.certifications.length));
  const minCerts = Math.min(...currentCandidates.map((c) => c.candidateProfile.certifications.length));

  const gridColsClass = currentCandidates.length === 2 
    ? 'grid-cols-1 md:grid-cols-2' 
    : 'grid-cols-1 md:grid-cols-3';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-7xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* ==================== HEADER ==================== */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <Layers className="w-3.5 h-3.5" />
                Side-by-Side Comparison
              </span>
              <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {currentCandidates.length} of 3 Candidates Selected
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              Comparing Candidates for <span className="text-indigo-600">{activeJob.title}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Add 3rd Candidate Dropdown if only 2 currently selected */}
            {currentCandidates.length < 3 && availableToAdd.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsAddCandidateDropdownOpen(!isAddCandidateDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                  Add 3rd Candidate
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isAddCandidateDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in duration-150">
                    <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Add to Comparison (Max 3)
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                      {availableToAdd.map((cand) => (
                        <button
                          key={cand.id}
                          onClick={() => handleAddCandidate(cand)}
                          className="w-full px-3 py-2 text-left hover:bg-indigo-50 flex items-center justify-between text-xs transition-colors"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{cand.candidateProfile.name}</div>
                            <div className="text-[11px] text-slate-500">{cand.candidateProfile.title}</div>
                          </div>
                          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded">
                            {cand.analysis.scores.overallScore}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Copy Summary Button */}
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs"
              title="Copy Comparison Report to Clipboard"
            >
              {copiedSummary ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Report</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================== SCROLLABLE CONTENT ==================== */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* ==================== 1. CANDIDATE PROFILE CARDS (A, B, C) ==================== */}
          <div className={`grid gap-4 ${gridColsClass}`}>
            {currentCandidates.map((candidate, index) => {
              const label = CANDIDATE_LABELS[index];
              const color = CANDIDATE_THEME_COLORS[index];
              const isLeader = candidate.analysis.scores.overallScore === maxOverall;

              return (
                <div
                  key={candidate.id}
                  className={`p-4 rounded-xl border relative transition-all ${
                    isLeader
                      ? 'bg-linear-to-b from-indigo-50/50 via-white to-white border-indigo-300 shadow-sm'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Top Candidate Tag & Leader Pill */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-md text-white ${color.badge} tracking-wider uppercase`}>
                      {label}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isLeader && (
                        <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Top Overall
                        </span>
                      )}

                      {/* Remove candidate if at least 3 present */}
                      {currentCandidates.length > 2 && (
                        <button
                          onClick={() => handleRemoveCandidate(candidate.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Candidate Details */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {candidate.candidateProfile.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-extrabold text-slate-900 truncate">
                        {candidate.candidateProfile.name}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {candidate.candidateProfile.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {candidate.hiringStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {candidate.candidateProfile.location || 'Remote'}
                        </span>
                      </div>
                    </div>

                    {/* Shortlist Toggle */}
                    <button
                      onClick={() => onToggleShortlist(candidate.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        candidate.shortlisted
                          ? 'bg-amber-50 border-amber-300 text-amber-500'
                          : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-amber-500'
                      }`}
                      title={candidate.shortlisted ? 'Shortlisted' : 'Add to Shortlist'}
                    >
                      <Star className={`w-4 h-4 ${candidate.shortlisted ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Overall Score Highlight */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Overall Score
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        {candidate.analysis.scoreExplanation?.slice(0, 40) || 'Weighted composite evaluation'}...
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-indigo-600">
                        {candidate.analysis.scores.overallScore}
                      </span>
                      <span className="text-xs text-slate-400">/100</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectCandidateProfile(candidate);
                      }}
                      className="w-full py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Full Dossier
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==================== 2. CORE PERFORMANCE METRICS COMPARISON ==================== */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Core Metric-by-Metric Comparison
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Visual indicators highlight group leaders and lagging values
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">

              {/* 1. OVERALL SCORE */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    1. Overall Composite Score
                    <span className="text-[10px] font-bold text-slate-400">(0-100 Scale)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const isStrongest = c.analysis.scores.overallScore === maxOverall && maxOverall !== minOverall;
                    const isWeaker = c.analysis.scores.overallScore === minOverall && maxOverall !== minOverall;
                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Strongest
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" /> Weaker
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-black text-slate-900">
                            {c.analysis.scores.overallScore}
                          </span>
                          <span className="text-xs text-slate-400">/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${isStrongest ? 'bg-emerald-500' : isWeaker ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                            style={{ width: `${c.analysis.scores.overallScore}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. JOB FIT */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    2. Job Fit Alignment
                    <span className="text-[10px] font-bold text-slate-400">(30% Weight)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const isStrongest = c.analysis.scores.jobFitScore === maxJobFit && maxJobFit !== minJobFit;
                    const isWeaker = c.analysis.scores.jobFitScore === minJobFit && maxJobFit !== minJobFit;
                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ⭐ Best Fit
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Lower Alignment
                            </span>
                          )}
                        </div>
                        <div className="text-lg font-black text-indigo-700">
                          {c.analysis.scores.jobFitScore}%
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${isStrongest ? 'bg-emerald-500' : isWeaker ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                            style={{ width: `${c.analysis.scores.jobFitScore}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. ATS SCORE */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    3. ATS Formatting & Parsing Score
                    <span className="text-[10px] font-bold text-slate-400">(Standard Section Compliance)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const score = c.analysis.scores.atsScore || 75;
                    const isStrongest = score === maxAts && maxAts !== minAts;
                    const isWeaker = score === minAts && maxAts !== minAts;
                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Clean ATS Parsing
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Parsing Friction
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-slate-900">{score}%</span>
                          <span className="text-[10px] text-slate-400">
                            {score >= 85 ? 'High Readability' : score >= 70 ? 'Acceptable' : 'Needs Optimization'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${score}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. SKILL MATCH */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    4. Skill Match Ratio
                    <span className="text-[10px] font-bold text-slate-400">(Against {activeJob.requiredSkills.length} Required Skills)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const matchPct = getSkillMatchPercentage(c);
                    const isStrongest = matchPct === maxSkillMatch && maxSkillMatch !== minSkillMatch;
                    const isWeaker = matchPct === minSkillMatch && maxSkillMatch !== minSkillMatch;
                    const matchedCount = activeJob.requiredSkills.filter((req) => 
                      c.analysis.skillVerifications.some((v) => v.skillName.toLowerCase() === req.skillName.toLowerCase())
                    ).length;

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Full Match
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Gaps Detected
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-indigo-700">{matchPct}%</span>
                          <span className="text-[11px] font-bold text-slate-600">
                            {matchedCount}/{activeJob.requiredSkills.length} Skills
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${matchPct >= 90 ? 'bg-emerald-500' : matchPct >= 70 ? 'bg-indigo-600' : 'bg-amber-500'}`} 
                            style={{ width: `${matchPct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. VERIFIED SKILLS */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    5. Verified Skills Score
                    <span className="text-[10px] font-bold text-slate-400">(25% Weight — Rigorously Confirmed Claims)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const score = c.analysis.scores.verifiedSkillsScore;
                    const isStrongest = score === maxVerified && maxVerified !== minVerified;
                    const isWeaker = score === minVerified && maxVerified !== minVerified;
                    const verifiedCount = c.analysis.skillVerifications.filter((v) => v.verificationStatus === 'Verified').length;

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ⭐ Highest Verified
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Weaker Verification
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-emerald-700">{score}%</span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            {verifiedCount} fully verified
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${score >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                            style={{ width: `${score}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. EVIDENCE STRENGTH */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    6. Evidence Strength
                    <span className="text-[10px] font-bold text-slate-400">(Proof Quality & Artifact Backing)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const score = c.analysis.scores.evidenceStrengthScore;
                    const isStrongest = score === maxEvidence && maxEvidence !== minEvidence;
                    const isWeaker = score === minEvidence && maxEvidence !== minEvidence;

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                              🛡️ Strongest Proof
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Lacks Artifacts
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-lg font-black text-blue-700">{score}%</span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {score >= 80 ? 'Rigorous Proof' : score >= 65 ? 'Moderate Proof' : 'Cursory Claims'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                          <div 
                            className={`h-full rounded-full ${score >= 80 ? 'bg-blue-600' : 'bg-amber-500'}`} 
                            style={{ width: `${score}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 7. EXPERIENCE */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    7. Professional Experience Tenure
                    <span className="text-[10px] font-bold text-slate-400">(Required: {activeJob.experienceRequiredYears}+ Years)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const expYears = getExperienceYears(c);
                    const isStrongest = expYears === maxExp && maxExp !== minExp;
                    const isWeaker = expYears === minExp && maxExp !== minExp;
                    const recentRole = c.candidateProfile.experience[0];

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Most Senior
                            </span>
                          )}
                          {isWeaker && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                              Earlier Career
                            </span>
                          )}
                        </div>
                        <div className="text-base font-black text-slate-900">
                          {expYears.toFixed(1)} Years Total
                        </div>
                        <div className="text-[11px] font-bold text-slate-700 truncate mt-1">
                          {recentRole?.role || 'Data Professional'}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {recentRole?.company ? `@ ${recentRole.company}` : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 8. PROJECTS */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    8. Documented Projects & Code Repositories
                    <span className="text-[10px] font-bold text-slate-400">(Production Data & Analytics Systems)</span>
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const count = c.candidateProfile.projects.length;
                    const isStrongest = count === maxProjects && maxProjects !== minProjects;
                    const hasGit = Boolean(c.candidateProfile.githubUrl || c.candidateProfile.portfolioUrl);

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Largest Portfolio
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-slate-900">
                            {count} Documented Project{count !== 1 ? 's' : ''}
                          </span>
                          {hasGit && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
                              GitHub/Live
                            </span>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          {c.candidateProfile.projects.slice(0, 2).map((proj, pIdx) => (
                            <div key={pIdx} className="text-[11px] text-slate-700 font-medium truncate">
                              • <span className="font-bold">{proj.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 9. EDUCATION */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    9. Education & Academic Background
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const edu = c.candidateProfile.education[0];
                    const isAdvancedDegree = edu?.degree?.toLowerCase().includes('master') || edu?.degree?.toLowerCase().includes('phd');

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isAdvancedDegree && (
                            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                              Advanced Degree
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-black text-slate-900">
                          {edu?.degree || 'Undergraduate Degree'} in {edu?.field || 'Relevant Field'}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5">
                          {edu?.institution || 'Accredited University'}
                        </div>
                        {edu?.year && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Class of {edu.year}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 10. CERTIFICATIONS */}
              <div className="p-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    10. Certifications & Credentials
                  </span>
                </div>
                <div className={`grid gap-4 ${gridColsClass}`}>
                  {currentCandidates.map((c, i) => {
                    const certs = c.candidateProfile.certifications;
                    const isStrongest = certs.length === maxCerts && maxCerts > 0;

                    return (
                      <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-500">{CANDIDATE_LABELS[i]}</span>
                          {isStrongest && (
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              Most Certified
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-black text-slate-900 mb-1">
                          {certs.length} Credential{certs.length !== 1 ? 's' : ''}
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {certs.length > 0 ? (
                            certs.map((cert, cIdx) => (
                              <div key={cIdx} className="text-[10px] font-medium text-slate-700 truncate">
                                • {cert.name}
                              </div>
                            ))
                          ) : (
                            <div className="text-[10px] text-slate-400 italic">No credentials listed</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* ==================== 3. MAJOR SKILLS COMPARISON MATRIX ==================== */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Major Skills Verification Matrix ({activeJob.requiredSkills.length} Skills)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Comparing Candidate A, Candidate B{currentCandidates.length > 2 ? ', & Candidate C' : ''} with visual indicators
              </span>
            </div>

            <div className="p-4 space-y-4">
              {activeJob.requiredSkills.map((reqSkill) => {
                // Find top performer for this specific skill across the group
                let topRank = 0;
                let topEvidence = 0;
                let topCandId = '';

                currentCandidates.forEach((c) => {
                  const v = c.analysis.skillVerifications.find(
                    (sv) => sv.skillName.toLowerCase() === reqSkill.skillName.toLowerCase()
                  );
                  if (v) {
                    const rank = LEVEL_RANKS[v.estimatedLevel?.toLowerCase() || ''] || 0;
                    const ev = v.evidenceStrength || 0;
                    if (rank > topRank || (rank === topRank && ev > topEvidence)) {
                      topRank = rank;
                      topEvidence = ev;
                      topCandId = c.id;
                    }
                  }
                });

                return (
                  <div key={reqSkill.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                    {/* Skill Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{reqSkill.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                          Required Level: {reqSkill.requiredLevel}
                        </span>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        reqSkill.importance === 'Critical' || reqSkill.importance === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {reqSkill.importance} Importance
                      </span>
                    </div>

                    {/* Candidate Columns for this Skill */}
                    <div className={`grid gap-4 ${gridColsClass}`}>
                      {currentCandidates.map((cand, i) => {
                        const v = cand.analysis.skillVerifications.find(
                          (sv) => sv.skillName.toLowerCase() === reqSkill.skillName.toLowerCase()
                        );
                        const isTop = cand.id === topCandId && topRank > 0;
                        const reqWeight = LEVEL_RANKS[reqSkill.requiredLevel.toLowerCase()] || 2;
                        const candWeight = v ? LEVEL_RANKS[v.estimatedLevel?.toLowerCase() || ''] || 0 : 0;
                        const meetsRequirement = candWeight >= reqWeight && v?.verificationStatus !== 'Insufficient Evidence';

                        if (!v) {
                          return (
                            <div key={cand.id} className="p-3 bg-white rounded-xl border border-rose-200 text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-600">{CANDIDATE_LABELS[i]}</span>
                                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> No Claim
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 italic">
                                Skill not explicitly cited or demonstrated with project evidence in resume.
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={cand.id} 
                            className={`p-3 bg-white rounded-xl border text-xs space-y-2 transition-all ${
                              isTop 
                                ? 'border-emerald-300 shadow-2xs ring-1 ring-emerald-200' 
                                : meetsRequirement 
                                ? 'border-slate-200' 
                                : 'border-amber-200 bg-amber-50/20'
                            }`}
                          >
                            {/* Candidate Label & Visual Indicator */}
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-700">{CANDIDATE_LABELS[i]}</span>

                              {isTop ? (
                                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                                  Strongest
                                </span>
                              ) : meetsRequirement ? (
                                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  Meets Target
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Below Target
                                </span>
                              )}
                            </div>

                            {/* Claimed vs Estimated Level */}
                            <div className="flex items-center justify-between text-[11px]">
                              <div>
                                <span className="text-slate-400">Claimed: </span>
                                <span className="font-bold text-slate-700">{v.claimedLevel}</span>
                              </div>
                              <div>
                                <span className="text-slate-400">Verified: </span>
                                <span className={`font-black ${
                                  v.estimatedLevel === 'Advanced' || v.estimatedLevel === 'Expert' 
                                    ? 'text-emerald-700' 
                                    : 'text-indigo-700'
                                }`}>
                                  {v.estimatedLevel}
                                </span>
                              </div>
                            </div>

                            {/* Verification Status & Proof Strength */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className={`font-extrabold px-1.5 py-0.5 rounded ${
                                  v.verificationStatus === 'Verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : v.verificationStatus === 'Partially Verified'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {v.verificationStatus}
                                </span>
                                <span className="font-black text-slate-700">{v.evidenceStrength}% Proof</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    v.evidenceStrength >= 75 ? 'bg-emerald-500' : v.evidenceStrength >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                                  }`} 
                                  style={{ width: `${v.evidenceStrength}%` }} 
                                />
                              </div>
                            </div>

                            {/* Evidence Count */}
                            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                              <span>{v.evidenceItems.length} verifiable item{v.evidenceItems.length !== 1 ? 's' : ''}</span>
                              {v.missingProofNote && (
                                <span className="text-amber-600 font-semibold truncate max-w-[120px]" title={v.missingProofNote}>
                                  {v.missingProofNote}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ==================== 4. AI-GENERATED COMPARISON SUMMARY ==================== */}
          <div className="bg-linear-to-b from-indigo-50/40 via-white to-white border border-indigo-200 rounded-2xl p-5 shadow-sm space-y-6">
            
            {/* Header with AI Badge & Regeneration button */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">
                      AI-Assisted Comparative Intelligence
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300">
                      AI-assisted recommendation
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Comprehensive evidence synthesis, gap detection, and verification audit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">
                  Model: {aiSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Deterministic Empirical Engine'}
                </span>
                {isLoadingAI && (
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                )}
              </div>
            </div>

            {analysisData ? (
              <div className="space-y-6 text-xs">

                {/* 1. STRONGEST CANDIDATE OVERALL */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h4 className="text-xs font-black text-emerald-900 uppercase tracking-wider">
                      Strongest Candidate Overall: <span className="underline">{analysisData.strongestOverall.candidateName}</span>
                    </h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {analysisData.strongestOverall.rationale}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider block mb-1.5">
                      Key Deciding Factors:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {analysisData.strongestOverall.keyAdvantages.map((adv, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. CANDIDATE WITH STRONGEST EVIDENCE */}
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider">
                      Candidate with Strongest Evidence: <span className="underline">{analysisData.strongestEvidence.candidateName}</span>
                    </h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {analysisData.strongestEvidence.rationale}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider block mb-1.5">
                      Empirical Proof Points:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {analysisData.strongestEvidence.proofHighlights.map((hl, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 3. CANDIDATE WITH STRONGEST TECHNICAL SKILLS */}
                <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider">
                      Candidate with Strongest Technical Skills: <span className="underline">{analysisData.strongestTechnicalSkills.candidateName}</span>
                    </h4>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {analysisData.strongestTechnicalSkills.rationale}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-wider mr-1">
                      Standout Competencies:
                    </span>
                    {analysisData.strongestTechnicalSkills.standoutSkills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white text-purple-800 border border-purple-200 shadow-2xs">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. IMPORTANT SKILL GAPS */}
                <div className="p-4 bg-amber-50/40 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center">
                      4
                    </span>
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider">
                      Important Skill Gaps & Deficiencies
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Identifies where candidates fall below required seniority or lack direct evidence in target job competencies.
                  </p>

                  <div className={`grid gap-3 ${gridColsClass}`}>
                    {analysisData.skillGaps.map((candGaps) => (
                      <div key={candGaps.candidateId} className="p-3 bg-white rounded-xl border border-amber-200/80 space-y-2">
                        <div className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center justify-between">
                          <span>{candGaps.candidateName}</span>
                          <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                            {candGaps.gaps.length} Gap{candGaps.gaps.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {candGaps.gaps.length > 0 ? (
                          <div className="space-y-2">
                            {candGaps.gaps.map((gap, gIdx) => (
                              <div key={gIdx} className="text-[11px] space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-slate-800">{gap.skillName}</span>
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                    Req: {gap.requiredLevel} • Det: {gap.detectedLevel}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                  {gap.impact}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            No major skill gaps identified against requirements
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. VERIFICATION CONCERNS */}
                <div className="p-4 bg-rose-50/40 border border-rose-200 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                      5
                    </span>
                    <h4 className="text-xs font-black text-rose-900 uppercase tracking-wider">
                      Verification Concerns & Red Flags
                    </h4>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Flags unsupported claims, inflated skill declarations, or missing proof that require interview validation.
                  </p>

                  <div className={`grid gap-3 ${gridColsClass}`}>
                    {analysisData.verificationConcerns.map((candConcerns) => (
                      <div key={candConcerns.candidateId} className="p-3 bg-white rounded-xl border border-rose-200/80 space-y-2">
                        <div className="font-extrabold text-slate-900 text-xs border-b border-slate-100 pb-1 flex items-center justify-between">
                          <span>{candConcerns.candidateName}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            candConcerns.concernCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {candConcerns.concernCount} Flag{candConcerns.concernCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {candConcerns.concerns.length > 0 ? (
                          <div className="space-y-2">
                            {candConcerns.concerns.slice(0, 3).map((c, cIdx) => (
                              <div key={cIdx} className="text-[11px] space-y-0.5">
                                <div className="font-bold text-rose-800 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{c.issueType}: {c.claim}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-tight">
                                  {c.details}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Clean verification record — no high-severity flags
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* TAILORED INTERVIEW QUESTIONS TO VALIDATE FINDINGS */}
                {analysisData.interviewQuestions && analysisData.interviewQuestions.length > 0 && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Suggested Technical Probing Questions for Human Interviews
                      </h4>
                    </div>
                    <div className={`grid gap-3 ${gridColsClass}`}>
                      {analysisData.interviewQuestions.map((iq, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                          <div className="font-bold text-slate-800 text-[11px]">{iq.candidateName}</div>
                          <ul className="space-y-1.5 text-[10px] text-slate-600">
                            {iq.questions.map((q, qIdx) => (
                              <li key={qIdx} className="flex items-start gap-1">
                                <span className="text-indigo-600 font-bold">Q{qIdx + 1}:</span>
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EXECUTIVE NARRATIVE & MANDATORY DISCLAIMER */}
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Scale className="w-4 h-4" />
                    <span className="text-xs font-extrabold uppercase tracking-wider">
                      AI-Assisted Recommendation (Decision Support)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {analysisData.executiveRecommendation}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300/90 leading-normal flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <span>
                      <strong>Compliance & Ethics Notice:</strong> Never make hiring decisions automatically. This system provides objective, evidence-based data points and is strictly designed as an <strong>"AI-assisted recommendation"</strong>. Final hiring decisions must always be made by authorized human hiring managers and interview panels.
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-8 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                <p>Generating comparative intelligence...</p>
              </div>
            )}

          </div>

        </div>

        {/* ==================== FOOTER ==================== */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Comparing <strong className="text-slate-800">{currentCandidates.length}</strong> candidates • All scores dynamically verified against <strong className="text-indigo-700">{activeJob.title}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5"
            >
              {copiedSummary ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              {copiedSummary ? 'Copied to Clipboard' : 'Copy Full Comparison'}
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Close Comparison
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
