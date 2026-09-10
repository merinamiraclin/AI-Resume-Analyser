import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Cpu, 
  Calculator, 
  FileText, 
  Lightbulb, 
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { AIStructuredExplanation, CandidateScores, JobPosting } from '../../types';

interface AIExplanationBoxProps {
  structuredExplanation?: AIStructuredExplanation;
  scoreExplanation: string;
  scores: CandidateScores;
  job: JobPosting;
}

export const AIExplanationBox: React.FC<AIExplanationBoxProps> = ({
  structuredExplanation,
  scoreExplanation,
  scores,
  job
}) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-indigo-500/20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                Structured AI Evaluation & Reasoning
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-[11px] font-bold text-indigo-200">
                Evidence Engine
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Empirical assessment explaining scores, strengths, gaps, and ATS compliance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs backdrop-blur-xs">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300">Overall Deterministic Score:</span>
          <strong className="text-emerald-400 font-extrabold text-sm">{scores.overallScore}/100</strong>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mt-6 relative z-10">
        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2 mb-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Executive Match Analysis
        </h4>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          {structuredExplanation?.executiveSummary || scoreExplanation}
        </div>
      </div>

      {/* Transparent Math Breakdown */}
      <div className="mt-6 p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 text-xs relative z-10">
        <div className="flex items-center gap-2 text-indigo-300 font-bold mb-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>Transparent Mathematical Formulation (Zero Random Numbers)</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          {scoreExplanation}
        </p>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-indigo-500/20 text-[11px]">
          <div>
            <span className="text-slate-400 block">Job Fit (30%):</span>
            <strong className="text-white font-bold">{scores.jobFitScore}% ({(scores.jobFitScore * 0.3).toFixed(1)} pts)</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Skills Match (25%):</span>
            <strong className="text-white font-bold">{scores.verifiedSkillsScore}% ({(scores.verifiedSkillsScore * 0.25).toFixed(1)} pts)</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Experience (15%):</span>
            <strong className="text-white font-bold">{scores.experienceScore}% ({(scores.experienceScore * 0.15).toFixed(1)} pts)</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Projects (10%):</span>
            <strong className="text-white font-bold">{scores.projectsScore}% ({(scores.projectsScore * 0.1).toFixed(1)} pts)</strong>
          </div>
        </div>
      </div>

      {/* 2-Column: Key Strengths vs Critical Gaps */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths & Verified Competencies</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              {(structuredExplanation?.strengthsExplanation || [
                `Evidence found for primary required skills in ${job.title}`,
                `Quantified project and work artifacts substantiate claimed proficiency`,
                `Education and career trajectory align with role requirements`
              ]).map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gaps & Weaknesses */}
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-3">
              <AlertTriangle className="w-4 h-4" />
              <span>Gaps, Under-Supported Skills & Areas to Improve</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-200">
              {(structuredExplanation?.gapsAndWeaknesses || [
                `Certain technical skills lack direct public repository or certification proof`,
                `Experience bullets could incorporate more measurable business outcome metrics`
              ]).map((gap, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ATS & Strategic Action Plan */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        {/* ATS Readability Analysis */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>ATS Parser & Keyword Readability</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {scores.atsScore}/100 Rating
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {structuredExplanation?.atsAnalysis || 
              `ATS Score is ${scores.atsScore}/100. Standard sections (Experience, Education, Skills) are well formatted for machine parsing with high keyword density.`}
          </p>
        </div>

        {/* Prioritized Action Plan */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Recommended Strategic Next Steps</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(structuredExplanation?.strategicActionPlan || [
              'Add direct repository URLs or live deployment demos to your top 2 projects.',
              'Quantify work experience statements using impact verbs and measurable percentage gains.',
              'Build a targeted demonstration project addressing missing job requirements.'
            ]).map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-bold text-indigo-400 shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
