import React from 'react';
import { Bot, ShieldAlert, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { AIContentReview } from '../types';

interface AIReviewBannerProps {
  review: AIContentReview;
  compact?: boolean;
}

export const AIReviewBanner: React.FC<AIReviewBannerProps> = ({ review, compact = false }) => {
  const hasFlags = review.possibleAIContentIndicator || review.possibleSimilarityIndicator || review.manualReviewFlags?.length > 0;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {hasFlags ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            Needs manual review
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Authentic structure
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all ${
      hasFlags 
        ? 'bg-amber-50/70 border-amber-200' 
        : 'bg-emerald-50/60 border-emerald-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${hasFlags ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              Integrity & AI-Content Indicators
            </h4>
            <p className="text-xs text-slate-500">
              Empirical review notes. AI flags are heuristic guidelines, not definitive judgements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            review.possibleAIContentIndicator 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}>
            {review.aiContentLabel}
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
            review.possibleSimilarityIndicator 
              ? 'bg-amber-100 text-amber-900 border-amber-300' 
              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
          }`}>
            {review.similarityLabel}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200/60">
        <div>
          <span className="font-semibold text-slate-700 block mb-1">AI Generation Review</span>
          <p className="leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/80">
            {review.aiConfidenceNote || 'Resume text exhibits standard individual variation and verifiable milestones.'}
          </p>
        </div>
        <div>
          <span className="font-semibold text-slate-700 block mb-1">Originality / Template Similarity</span>
          <p className="leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-200/80">
            {review.similarityNote || 'Work history and project achievements demonstrate bespoke original contributions.'}
          </p>
        </div>
      </div>

      {review.manualReviewFlags && review.manualReviewFlags.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-amber-200/60">
          <span className="text-xs font-bold text-amber-900 flex items-center gap-1 mb-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
            Specific Items Flagged for Human Review:
          </span>
          <ul className="space-y-1 pl-5 list-disc text-xs text-amber-800">
            {review.manualReviewFlags.map((flag, idx) => (
              <li key={idx}>{flag}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
