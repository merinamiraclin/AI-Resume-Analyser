import React from 'react';
import { 
  CandidateScores, 
  JobPosting 
} from '../../types';
import { ScoreRing } from '../ScoreRing';
import { 
  Target, 
  ShieldCheck, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Sparkles, 
  FileCheck2, 
  Award,
  Info
} from 'lucide-react';

interface ScoreCardsGridProps {
  scores: CandidateScores;
  job: JobPosting;
}

export const ScoreCardsGrid: React.FC<ScoreCardsGridProps> = ({ scores, job }) => {
  const getScoreStatus = (val: number) => {
    if (val >= 85) return { label: 'Outstanding', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (val >= 70) return { label: 'Competitive', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    if (val >= 55) return { label: 'Moderate', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: 'Needs Proof', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  return (
    <div className="space-y-4">
      {/* Primary Highlights: Overall Score & ATS Score */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. OVERALL SCORE */}
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-white border border-indigo-100 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">Overall Deterministic Score</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mt-1">
              Weighted aggregate of Job Fit (30%), Skills Match (25%), Experience (15%), Projects (10%), Education (5%), Certifications (5%), Resume Quality (5%), and Evidence Strength (5%).
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreStatus(scores.overallScore).badgeClass}`}>
                {getScoreStatus(scores.overallScore).label} Alignment
              </span>
              <span className="text-[11px] text-slate-400 font-medium">100% Calculated Logic</span>
            </div>
          </div>
          <div className="shrink-0">
            <ScoreRing score={scores.overallScore} label="Overall Score" size="lg" weight="Weighted Sum" />
          </div>
        </div>

        {/* 2. ATS SCORE */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <FileCheck2 className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">ATS Readability Score</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mt-1">
              Evaluates standard formatting, contact integrity, bullet structure, action verbs, and keyword density for automated applicant tracking systems.
            </p>
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreStatus(scores.atsScore).badgeClass}`}>
                {scores.atsScore >= 80 ? 'ATS Friendly' : 'Formatting Warning'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Machine Parser Test</span>
            </div>
          </div>
          <div className="shrink-0">
            <ScoreRing score={scores.atsScore} label="ATS Score" size="lg" color="#10b981" weight="Readability" />
          </div>
        </div>
      </div>

      {/* Remaining 6 Component Score Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 3. Job Fit (30%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">30% wt</span>
          </div>
          <ScoreRing score={scores.jobFitScore} label="" size="sm" />
          <div className="mt-2">
            <h4 className="font-bold text-slate-800 text-xs">Job Fit</h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">Core Req Match</span>
          </div>
        </div>

        {/* 4. Skills Match / Verified Skills (25%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">25% wt</span>
          </div>
          <ScoreRing score={scores.verifiedSkillsScore} label="" size="sm" />
          <div className="mt-2">
            <h4 className="font-bold text-slate-800 text-xs">Skills Match</h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">Verified Proof</span>
          </div>
        </div>

        {/* 5. Experience (15%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">15% wt</span>
          </div>
          <ScoreRing score={scores.experienceScore} label="" size="sm" />
          <div className="mt-2">
            <h4 className="font-bold text-slate-800 text-xs">Experience</h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">Years vs Req</span>
          </div>
        </div>

        {/* 6. Projects (10%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">10% wt</span>
          </div>
          <ScoreRing score={scores.projectsScore} label="" size="sm" />
          <div className="mt-2">
            <h4 className="font-bold text-slate-800 text-xs">Projects</h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">Code & Impact</span>
          </div>
        </div>

        {/* 7. Education (5%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
            <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">5% wt</span>
          </div>
          <ScoreRing score={scores.educationScore} label="" size="sm" />
          <div className="mt-2">
            <h4 className="font-bold text-slate-800 text-xs">Education</h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">Degree Tier</span>
          </div>
        </div>

        {/* 8. Evidence Strength (5%) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mb-2">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">5% wt</span>
          </div>
          <ScoreRing score={scores.evidenceStrengthScore} label="" size="sm" />
          <div className="mt-2">
            <h4 className="font-bold text-slate-800 text-xs">Evidence</h4>
            <span className="text-[10px] text-slate-400 block mt-0.5">Artifact Depth</span>
          </div>
        </div>
      </div>
    </div>
  );
};
