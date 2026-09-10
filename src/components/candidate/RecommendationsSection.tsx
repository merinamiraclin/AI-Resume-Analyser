import React from 'react';
import { 
  Lightbulb, 
  Clock, 
  FolderGit2, 
  ChevronRight, 
  AlertCircle, 
  Briefcase, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { JobRoleRecommendation } from '../../types';

interface RecommendationsSectionProps {
  recommendedSkills: {
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
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendedSkills,
  alternativeJobRoles,
  resumeImprovements,
  missingSections,
  missingContent = []
}) => {
  const combinedMissing = Array.from(new Set([...missingSections, ...missingContent]));

  return (
    <div className="space-y-6">
      {/* 1. MISSING CONTENT ALERT BANNER */}
      {combinedMissing.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm mb-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Missing Content & Structural Elements Detected ({combinedMissing.length})</span>
          </div>
          <p className="text-xs text-rose-800 mb-3 leading-relaxed">
            Applicant tracking systems and evidence evaluators look for specific standard sections and verifiable links:
          </p>
          <div className="flex flex-wrap gap-2">
            {combinedMissing.map((item, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-white border border-rose-300 text-rose-900 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 2. RECOMMENDED SKILLS TO ACQUIRE / PROVE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Recommended Skills & Proof Roadmap
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              High-impact skills you can acquire or prove to maximize hiring match
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            {recommendedSkills.length} Actionable
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedSkills.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.importance} Priority
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Est: {item.estimatedTimeToLearn}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-base">{item.skill}</h4>

                <div className="mt-3 p-3 bg-white rounded-lg border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1 mb-1">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                    Suggested Proof Project:
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">{item.suggestedProofProject}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RESUME IMPROVEMENTS (WITH BEFORE/AFTER EXAMPLES) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Resume Bullet & Proof Improvements
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn passive task descriptions into empirical, evidenced achievements
          </p>
        </div>

        <div className="space-y-3">
          {resumeImprovements.map((imp, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{imp.title}</h4>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {imp.category}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">{imp.feedback}</p>
              
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1 mt-1">
                <span className="font-bold text-indigo-700 block">Recommended Evidenced Phrasing:</span>
                <p className="text-slate-800 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                  "{imp.example}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. RECOMMENDED ALTERNATIVE JOB ROLES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-600" />
            Recommended Alternative Job Roles
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Roles where your verified skills and background achieve strong statistical fit
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternativeJobRoles.map((role, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-purple-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-extrabold text-slate-900 text-base">{role.roleTitle}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {role.matchScore}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">{role.rationale}</p>

                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Key Strengths Applied:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {role.keyStrengths.map((str, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
