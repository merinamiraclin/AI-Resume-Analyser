import React from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  weight?: string;
  color?: string;
  sublabel?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  label,
  size = 'md',
  weight,
  color,
  sublabel
}) => {
  const clampedScore = Math.max(0, Math.min(100, Math.round(score)));

  // Determine color if not custom
  let ringColor = color;
  if (!ringColor) {
    if (clampedScore >= 85) ringColor = '#10b981'; // emerald
    else if (clampedScore >= 70) ringColor = '#6366f1'; // indigo
    else if (clampedScore >= 50) ringColor = '#f59e0b'; // amber
    else ringColor = '#ef4444'; // red
  }

  const dimensions = {
    sm: { width: 72, height: 72, stroke: 6, radius: 28, fontSize: 'text-lg' },
    md: { width: 104, height: 104, stroke: 8, radius: 42, fontSize: 'text-2xl' },
    lg: { width: 140, height: 140, stroke: 10, radius: 56, fontSize: 'text-3xl' },
  }[size];

  const circumference = 2 * Math.PI * dimensions.radius;
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={dimensions.radius}
            stroke="#e2e8f0"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={dimensions.radius}
            stroke={ringColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold tracking-tight text-slate-800 ${dimensions.fontSize}`}>
            {clampedScore}
          </span>
          {size !== 'sm' && <span className="text-[10px] uppercase font-semibold text-slate-400">/100</span>}
        </div>
      </div>

      <span className="mt-2 text-xs font-semibold text-slate-700 leading-tight">
        {label}
      </span>
      {weight && (
        <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full mt-0.5">
          {weight} weight
        </span>
      )}
      {sublabel && (
        <span className="text-[11px] text-slate-500 mt-0.5 max-w-[110px] truncate">
          {sublabel}
        </span>
      )}
    </div>
  );
};
