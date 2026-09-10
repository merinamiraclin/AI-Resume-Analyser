import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { CandidateScores, SkillVerification, JobPosting } from '../../types';
import { BarChart3, Radar as RadarIcon, Info } from 'lucide-react';

interface AnalysisChartsProps {
  scores: CandidateScores;
  job: JobPosting;
  skillVerifications: SkillVerification[];
}

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({
  scores,
  job,
  skillVerifications
}) => {
  // Radar data across the 7 empirical evaluation dimensions
  const radarData = [
    { subject: 'Job Fit', candidate: scores.jobFitScore, benchmark: 80, fullMark: 100 },
    { subject: 'Skills Match', candidate: scores.verifiedSkillsScore, benchmark: 80, fullMark: 100 },
    { subject: 'Experience', candidate: scores.experienceScore, benchmark: 75, fullMark: 100 },
    { subject: 'Projects', candidate: scores.projectsScore, benchmark: 80, fullMark: 100 },
    { subject: 'Education', candidate: scores.educationScore, benchmark: 80, fullMark: 100 },
    { subject: 'Evidence Strength', candidate: scores.evidenceStrengthScore, benchmark: 80, fullMark: 100 },
    { subject: 'ATS Score', candidate: scores.atsScore, benchmark: 85, fullMark: 100 },
  ];

  // Map skill levels to numeric ranks (1-4)
  const rankMap: Record<string, number> = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4,
    'Insufficient Evidence': 0.5
  };

  // Build comparative bar chart data for top skills
  const skillsToCompare = job.requiredSkills.slice(0, 6).map((req) => {
    const match = skillVerifications.find(
      (v) => v.skillName.toLowerCase().trim() === req.skillName.toLowerCase().trim()
    );
    const candidateRank = match 
      ? (rankMap[match.estimatedLevel] || rankMap[match.claimedLevel] || 1)
      : 0;
    const requiredRank = rankMap[req.requiredLevel] || 2;
    const evidence = match ? match.evidenceStrength : 0;

    return {
      skill: req.skillName,
      CandidateLevel: candidateRank,
      RequiredLevel: requiredRank,
      evidenceStrength: evidence,
      status: match ? match.verificationStatus : 'Missing',
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Radar Chart: 7-Vector Candidate vs Benchmark */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <RadarIcon className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Empirical Competency Radar</h4>
                <p className="text-xs text-slate-500">Comparing candidate scores against role benchmark</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" /> Deterministic
            </span>
          </div>

          <div className="w-full h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} 
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                />
                <Radar
                  name="Role Benchmark"
                  dataKey="benchmark"
                  stroke="#94a3b8"
                  fill="#94a3b8"
                  fillOpacity={0.15}
                  strokeDasharray="3 3"
                />
                <Radar
                  name="Candidate Profile"
                  dataKey="candidate"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '10px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any) => [`${value}/100`, name]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
            <span className="text-slate-700">Candidate Score</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1.5 border-b-2 border-dashed border-slate-400 inline-block"></span>
            <span className="text-slate-500">Role Benchmark (80%)</span>
          </div>
        </div>
      </div>

      {/* 2. Comparative Skill Level vs Job Requirement Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <BarChart3 className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Skill Level vs Requirement Depth</h4>
                <p className="text-xs text-slate-500">Verified proficiency rank (1=Beginner, 2=Inter., 3=Adv., 4=Expert)</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Proficiency Gap
            </span>
          </div>

          <div className="w-full h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={skillsToCompare}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="skill" 
                  tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis 
                  domain={[0, 4]} 
                  ticks={[1, 2, 3, 4]} 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(val) => ['None', 'Beg', 'Int', 'Adv', 'Exp'][val] || ''}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '10px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any, item: any) => {
                    const label = ['', 'Beginner (1)', 'Intermediate (2)', 'Advanced (3)', 'Expert (4)'][Math.floor(value)] || `${value}`;
                    if (name === 'Candidate Level') {
                      return [`${label} (Evidence: ${item.payload.evidenceStrength}%)`, name];
                    }
                    return [label, name];
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                <Bar dataKey="CandidateLevel" name="Candidate Level" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="RequiredLevel" name="Required Job Level" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
          Green bars matching or exceeding gray bars indicate proven qualification without proficiency deficit.
        </div>
      </div>
    </div>
  );
};
