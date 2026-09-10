import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Search,
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Briefcase, 
  FolderGit2, 
  Award, 
  GraduationCap, 
  Globe, 
  Code2, 
  Layers,
  XCircle,
  Sparkles,
  Info,
  MessageSquare
} from 'lucide-react';
import { SkillVerification, EvidenceType, VerificationStatus } from '../types';

interface SkillCardProps {
  verification: SkillVerification;
  showDetailsDefault?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  verification,
  showDetailsDefault = false,
}) => {
  const [expanded, setExpanded] = useState(showDetailsDefault);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified
          </span>
        );
      case 'Partially Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Partially Verified
          </span>
        );
      case 'Needs Manual Review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs">
            <Search className="w-3.5 h-3.5 text-purple-600" />
            Needs Manual Review
          </span>
        );
      case 'Insufficient Evidence':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Insufficient Evidence
          </span>
        );
    }
  };

  const getEvidenceTypeIcon = (type: EvidenceType) => {
    switch (type) {
      case 'Work experience':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Project':
        return <FolderGit2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Internship':
        return <Briefcase className="w-3.5 h-3.5 text-sky-600" />;
      case 'Certification':
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      case 'GitHub':
        return <Code2 className="w-3.5 h-3.5 text-slate-800" />;
      case 'Portfolio':
        return <Globe className="w-3.5 h-3.5 text-teal-600" />;
      case 'Coding assessment':
        return <Code2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Course':
        return <GraduationCap className="w-3.5 h-3.5 text-purple-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const isLevelGap = 
    verification.estimatedLevel !== 'Insufficient Evidence' && 
    verification.claimedLevel !== verification.estimatedLevel;

  // Fallback checklist if not explicitly provided in older records
  const checklist = verification.checklist || [
    {
      category: 'project' as const,
      label: `${verification.skillName} project`,
      present: verification.evidenceItems.some((e) => e.type === 'Project'),
      evidenceTitle: verification.evidenceItems.find((e) => e.type === 'Project')?.title
    },
    {
      category: 'internship' as const,
      label: `${verification.skillName} internship`,
      present: verification.evidenceItems.some((e) => e.type === 'Internship'),
      evidenceTitle: verification.evidenceItems.find((e) => e.type === 'Internship')?.title
    },
    {
      category: 'certification' as const,
      label: `${verification.skillName} certification`,
      present: verification.evidenceItems.some((e) => e.type === 'Certification'),
      evidenceTitle: verification.evidenceItems.find((e) => e.type === 'Certification')?.title
    },
    {
      category: 'assessment' as const,
      label: `Advanced coding assessment`,
      present: verification.evidenceItems.some((e) => e.type === 'Coding assessment'),
      evidenceTitle: verification.evidenceItems.find((e) => e.type === 'Coding assessment')?.title
    },
    {
      category: 'experience' as const,
      label: `Professional ${verification.skillName} experience`,
      present: verification.evidenceItems.some((e) => e.type === 'Work experience'),
      evidenceTitle: verification.evidenceItems.find((e) => e.type === 'Work experience')?.title
    }
  ];

  const presentCount = checklist.filter((c) => c.present).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs transition-all hover:border-indigo-300 hover:shadow-sm overflow-hidden">
      {/* CARD HEADER */}
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 select-none transition-colors"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h4 className="font-extrabold text-slate-900 text-base tracking-tight">{verification.skillName}</h4>
              {getStatusBadge(verification.verificationStatus)}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              <span>Claimed: <strong className="text-slate-800 font-semibold">{verification.claimedLevel}</strong></span>
              <span className="text-slate-300">•</span>
              <span>Estimated: <strong className={verification.estimatedLevel === 'Insufficient Evidence' ? 'text-amber-700 font-semibold' : 'text-slate-800 font-semibold'}>{verification.estimatedLevel}</strong></span>
              {isLevelGap && (
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-[11px] font-bold border border-amber-200">
                  Level Gap ({verification.claimedLevel} → {verification.estimatedLevel})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Metric: Evidence Strength & Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-13 sm:pl-0">
          <div className="text-left sm:text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Evidence Strength</span>
              <span className={`text-base font-extrabold ${
                verification.evidenceStrength >= 75 ? 'text-emerald-700' :
                verification.evidenceStrength >= 45 ? 'text-indigo-700' : 'text-amber-700'
              }`}>
                {verification.evidenceStrength}%
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  verification.evidenceStrength >= 75 ? 'bg-emerald-500' :
                  verification.evidenceStrength >= 45 ? 'bg-indigo-500' : 'bg-amber-500'
                }`}
                style={{ width: `${verification.evidenceStrength}%` }}
              />
            </div>
          </div>

          <button 
            type="button" 
            aria-label="Toggle details"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* QUICK CHECKLIST PREVIEW WHEN COLLAPSED */}
      {!expanded && (
        <div className="px-5 pb-4 pt-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Artifacts:</span>
            {checklist.slice(0, 4).map((c, idx) => (
              <span 
                key={idx}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                  c.present 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' 
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                {c.present ? '✓' : '✗'} {c.label}
              </span>
            ))}
            {checklist.length > 4 && (
              <span className="text-[11px] text-indigo-600 font-medium cursor-pointer" onClick={() => setExpanded(true)}>
                +{checklist.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* EXPANDED DETAILS BODY */}
      {expanded && (
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-600 space-y-4">
          
          {/* 1. EVIDENCE CHECKLIST SECTION */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h5 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                Evidence Verification Checklist ({presentCount}/{checklist.length} Corroborated)
              </h5>
              <span className="text-[11px] text-slate-400">Deterministic scan of all resume sections</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {checklist.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-colors ${
                    item.present 
                      ? 'bg-white border-emerald-200 text-slate-800 shadow-2xs' 
                      : 'bg-white/60 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.present ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-xs ${item.present ? 'text-slate-800' : 'text-slate-400'}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.evidenceTitle && (
                      <p className={`text-[11px] ${item.present ? 'text-indigo-700 font-medium' : 'text-slate-400 italic'}`}>
                        {item.evidenceTitle}
                      </p>
                    )}
                    {item.evidenceSnippet && !item.evidenceTitle && (
                      <p className="text-[11px] text-slate-400 italic">
                        {item.evidenceSnippet}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. OBJECTIVE EXPLANATION BOX */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                AI & Deterministic Verification Assessment
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Audited
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed text-xs">
              {verification.explanation || `Claimed ${verification.claimedLevel} proficiency with ${verification.evidenceStrength}% empirical evidence strength.`}
            </p>

            {/* Ethical Proof Notice */}
            <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-700">
              <Info className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ethical Evaluation Notice:</strong> Missing documentation never implies candidate falsehood or deceit. It flags areas where hiring teams can invite the candidate to share project code or architectural experiences during the interview.
              </span>
            </div>
          </div>

          {/* 3. DETAILED EVIDENCE ARTIFACTS LIST */}
          {verification.evidenceItems.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                  Verifiable Source Artifacts ({verification.evidenceItems.length})
                </span>
              </div>

              <div className="space-y-2">
                {verification.evidenceItems.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold border border-slate-200">
                          {getEvidenceTypeIcon(item.type)}
                          {item.type}
                        </span>
                        <span className="font-bold text-slate-800 text-xs">{item.title}</span>
                        {item.source && (
                          <span className="text-slate-400 text-[11px]">via {item.source}</span>
                        )}
                        {item.dateRange && (
                          <span className="text-slate-400 text-[10px]">({item.dateRange})</span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.relevanceScore}% match
                      </span>
                      {item.link && (
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5 text-xs font-bold"
                        >
                          View Artifact <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. RECOMMENDATION / INTERVIEW QUESTION PROMPT */}
          {verification.recommendation && (
            <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                Recommended Action / Interview Inquiries:
              </span>
              <p className="text-indigo-900 text-[11px] leading-relaxed">
                {verification.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
