import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  SkillVerification, 
  JobPosting, 
  WeakSkillItem,
  EvidenceType
} from '../../types';

interface SkillBreakdownSectionProps {
  matchedSkills: string[];
  missingSkills: string[];
  weakSkills?: WeakSkillItem[];
  skillVerifications: SkillVerification[];
  job: JobPosting;
}

export const SkillBreakdownSection: React.FC<SkillBreakdownSectionProps> = ({
  matchedSkills,
  missingSkills,
  weakSkills = [],
  skillVerifications,
  job
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'matched' | 'weak' | 'missing'>('all');
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  const toggleExpand = (skillName: string) => {
    setExpandedSkill(expandedSkill === skillName ? null : skillName);
  };

  const getEvidenceIcon = (type: EvidenceType) => {
    switch (type) {
      case 'Project':
      case 'GitHub':
        return '💻';
      case 'Work experience':
      case 'Internship':
        return '🏢';
      case 'Certification':
      case 'Course':
        return '📜';
      case 'Coding assessment':
        return '⚡';
      default:
        return '📎';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            Skill Verification & Alignment Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every claimed competency verified against concrete project and employment artifacts
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Skills ({matchedSkills.length + weakSkills.length + missingSkills.length})
          </button>
          <button
            onClick={() => setActiveFilter('matched')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeFilter === 'matched'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Matched ({matchedSkills.length})
          </button>
          <button
            onClick={() => setActiveFilter('weak')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeFilter === 'weak'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Weak ({weakSkills.length})
          </button>
          <button
            onClick={() => setActiveFilter('missing')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeFilter === 'missing'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Missing ({missingSkills.length})
          </button>
        </div>
      </div>

      {/* Quick Summary Badges Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Matched Badges Box */}
        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
          <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Matched & Verified ({matchedSkills.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 text-[11px] font-semibold flex items-center gap-1">
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Weak Badges Box */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
          <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Weak / Under-supported ({weakSkills.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {weakSkills.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">No weak skills detected</span>
            ) : (
              weakSkills.map((ws, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-800 text-[11px] font-semibold flex items-center gap-1">
                  ⚠ {ws.skillName} ({ws.evidenceStrength}%)
                </span>
              ))
            )}
          </div>
        </div>

        {/* Missing Badges Box */}
        <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
          <div className="text-xs font-bold text-rose-900 flex items-center gap-1.5 mb-2">
            <XCircle className="w-4 h-4 text-rose-600" />
            Missing From Resume ({missingSkills.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.length === 0 ? (
              <span className="text-[11px] text-slate-500 italic">All required job skills present</span>
            ) : (
              missingSkills.map((ms, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-white border border-rose-300 text-rose-800 text-[11px] font-semibold flex items-center gap-1">
                  ✕ {ms}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Detailed Cards List */}
      <div className="space-y-3">
        {/* Render Matched & Verifications */}
        {(activeFilter === 'all' || activeFilter === 'matched') &&
          skillVerifications
            .filter((v) => matchedSkills.some((m) => m.toLowerCase() === v.skillName.toLowerCase()))
            .map((v, idx) => {
              const isExpanded = expandedSkill === v.skillName;
              return (
                <div
                  key={`matched-${idx}`}
                  className="border border-slate-200 rounded-xl bg-white hover:border-indigo-300 transition-all overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(v.skillName)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                        ✓
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{v.skillName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {v.verificationStatus}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 mt-0.5 block">
                          Claimed: <strong className="text-slate-700">{v.claimedLevel}</strong> • Verified: <strong className="text-emerald-700">{v.estimatedLevel}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <span className="font-extrabold text-sm text-emerald-700">{v.evidenceStrength}%</span>
                        <span className="block text-[10px] text-slate-400 font-medium">Evidence Strength</span>
                      </div>
                      <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Evidence Detail */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 space-y-2.5 text-xs">
                      <div className="font-bold text-slate-700 text-xs">
                        Concrete Evidenced Artifacts ({v.evidenceItems.length}):
                      </div>
                      {v.evidenceItems.length === 0 ? (
                        <p className="text-slate-500 italic">No formal external citations linked.</p>
                      ) : (
                        v.evidenceItems.map((item, i) => (
                          <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-800">
                              <span className="flex items-center gap-1.5">
                                <span>{getEvidenceIcon(item.type)}</span>
                                <span>{item.title}</span>
                              </span>
                              <span className="text-[10px] text-indigo-600 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                                {item.source} • {item.relevanceScore}% rel
                              </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">{item.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}

        {/* Render Weak Skills */}
        {(activeFilter === 'all' || activeFilter === 'weak') &&
          weakSkills.map((ws, idx) => (
            <div
              key={`weak-${idx}`}
              className="border border-amber-200 bg-amber-50/30 rounded-xl p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                    ⚠
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{ws.skillName}</h4>
                    <span className="text-[11px] text-slate-500">
                      Detected Level: <strong className="text-slate-700">{ws.claimedOrDetectedLevel}</strong>
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {ws.evidenceStrength}% Evidence Strength
                </span>
              </div>

              <div className="p-3 bg-white border border-amber-200 rounded-lg space-y-1 mt-2">
                <div className="text-amber-950 font-bold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Issue Identified:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{ws.issue}</p>
                <div className="pt-1 text-slate-700 font-medium">
                  <strong className="text-emerald-700">Recommended Proof Action: </strong>
                  {ws.suggestedRemedy}
                </div>
              </div>
            </div>
          ))}

        {/* Render Missing Skills */}
        {(activeFilter === 'all' || activeFilter === 'missing') &&
          missingSkills.map((ms, idx) => {
            const req = job.requiredSkills.find((r) => r.skillName.toLowerCase() === ms.toLowerCase());
            return (
              <div
                key={`missing-${idx}`}
                className="border border-rose-200 bg-rose-50/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0">
                    ✕
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{ms}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Missing From Resume
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      Target Role Requirement: {req ? `${req.requiredLevel} • ${req.importance} Priority` : 'Required Skill'}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-rose-700 font-bold block">0% Evidence Found</span>
                  <span className="text-[10px] text-slate-500">Add hands-on project or certification</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
