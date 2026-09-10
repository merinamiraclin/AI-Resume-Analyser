import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  PlusCircle, 
  Users, 
  SlidersHorizontal, 
  Layers, 
  Star, 
  Briefcase, 
  CheckCircle2, 
  UploadCloud, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  FileText
} from 'lucide-react';
import { 
  CandidateRecord, 
  JobPosting, 
  CompanyProfile, 
  HiringStatus 
} from '../../types';
import { JobCreationForm } from './JobCreationForm';
import { BatchResumeUploadModal } from './BatchResumeUploadModal';
import { CompareModal } from './CompareModal';
import { CandidateProfileModal } from './CandidateProfileModal';
import { RankedCandidateTable } from './RankedCandidateTable';
import { calculateDeterministicScores } from '../../lib/scoringEngine';
import { verifyAllCandidateSkills } from '../../lib/evidenceEngine';

interface HrViewProps {
  candidates: CandidateRecord[];
  jobs: JobPosting[];
  company: CompanyProfile;
  onUpdateCandidateStatus: (candidateId: string, status: HiringStatus, notes?: string, interviewDate?: string) => void;
  onAddJob: (newJob: JobPosting) => void;
  onUpdateCompany: (updated: CompanyProfile) => void;
  onAddBatchCandidates?: (newCandidates: CandidateRecord[]) => void;
  onToggleShortlist?: (candidateId: string) => void;
}

export const HrView: React.FC<HrViewProps> = ({
  candidates,
  jobs,
  company,
  onUpdateCandidateStatus,
  onAddJob,
  onUpdateCompany,
  onAddBatchCandidates,
  onToggleShortlist
}) => {
  // Navigation tabs in HR View
  const [activeTab, setActiveTab] = useState<'ranked_table' | 'create_job' | 'pipeline' | 'company'>('ranked_table');

  // Currently Active Job for evaluation
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || 'job-data-analyst');

  // Modals
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [profileModalCandidate, setProfileModalCandidate] = useState<CandidateRecord | null>(null);
  const [compareCandidatesList, setCompareCandidatesList] = useState<CandidateRecord[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Active Job resolution
  const activeJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || jobs[0] || {
      id: 'job-data-analyst',
      title: 'Data Analyst',
      department: 'Data Intelligence',
      location: 'Remote / Hybrid',
      type: 'Full-time',
      experienceRequiredYears: 3,
      salaryRange: '$115,000 - $145,000',
      description: 'Seeking a skilled Data Analyst to extract, model, and visualize data across enterprise databases and BI tools.',
      requiredSkills: [
        { id: 'sk-1', skillName: 'SQL', requiredLevel: 'Advanced', importance: 'High' },
        { id: 'sk-2', skillName: 'Python', requiredLevel: 'Intermediate', importance: 'High' },
        { id: 'sk-3', skillName: 'Power BI', requiredLevel: 'Intermediate', importance: 'High' },
        { id: 'sk-4', skillName: 'Excel', requiredLevel: 'Intermediate', importance: 'Medium' },
        { id: 'sk-5', skillName: 'Statistics', requiredLevel: 'Basic', importance: 'Medium' },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
      totalApplicants: candidates.length
    };
  }, [jobs, selectedJobId, candidates.length]);

  // Dynamically evaluate each candidate against the currently selected activeJob
  // Ensures Job Fit %, Verified Skills %, and Overall Score strictly reflect the active job's requirements
  const evaluatedCandidatesForJob = useMemo(() => {
    return candidates.map((candidate) => {
      // If the candidate was specifically analyzed for another job, re-score deterministically
      const verifications = verifyAllCandidateSkills(
        candidate.candidateProfile,
        candidate.analysis.skillVerifications
      );
      const deterministic = calculateDeterministicScores(
        candidate.candidateProfile,
        activeJob,
        verifications
      );

      return {
        ...candidate,
        jobId: activeJob.id,
        analysis: {
          ...candidate.analysis,
          scores: deterministic.scores,
          scoreExplanation: deterministic.explanation,
          weakSkills: deterministic.weakSkills,
          missingContent: deterministic.missingContent,
          skillVerifications: verifications,
        }
      };
    });
  }, [candidates, activeJob]);

  // Handle Shortlist toggle
  const handleToggleShortlist = (candidateId: string) => {
    if (onToggleShortlist) {
      onToggleShortlist(candidateId);
    } else {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (candidate) {
        onUpdateCandidateStatus(
          candidateId,
          candidate.shortlisted ? 'New' : 'Shortlisted'
        );
      }
    }
  };

  // Handle Add Recruiter Note
  const handleAddNote = (candidateId: string, noteText: string) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (candidate) {
      onUpdateCandidateStatus(candidateId, candidate.hiringStatus, noteText);
    }
  };

  // Handle Launching Compare Modal
  const handleCompareCandidates = (selectedCandidates: CandidateRecord[]) => {
    setCompareCandidatesList(selectedCandidates);
    setIsCompareModalOpen(true);
  };

  // Handle New Job Creation
  const handleJobCreated = (newJob: JobPosting) => {
    onAddJob(newJob);
    setSelectedJobId(newJob.id);
    setActiveTab('ranked_table');
  };

  // Handle Batch Resumes Analyzed
  const handleBatchAnalyzed = (newCandidates: CandidateRecord[]) => {
    if (onAddBatchCandidates) {
      onAddBatchCandidates(newCandidates);
    }
    setIsBatchUploadOpen(false);
    setActiveTab('ranked_table');
  };

  // Pipeline stats
  const totalCount = evaluatedCandidatesForJob.length;
  const shortlistedCount = evaluatedCandidatesForJob.filter((c) => c.shortlisted).length;
  const interviewingCount = evaluatedCandidatesForJob.filter((c) => c.hiringStatus === 'Interview Scheduled').length;
  const avgOverallScore = totalCount > 0 
    ? Math.round(evaluatedCandidatesForJob.reduce((acc, c) => acc + c.analysis.scores.overallScore, 0) / totalCount)
    : 0;
  const avgJobFit = totalCount > 0 
    ? Math.round(evaluatedCandidatesForJob.reduce((acc, c) => acc + c.analysis.scores.jobFitScore, 0) / totalCount)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top HR Executive Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-700">
              {company.name} • Talent Intelligence Suite
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            Evidence-Based HR Hiring Suite
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Verify every resume claim empirically against code repos, production experience, and credentials. Filter, rank, shortlist, and compare candidates side-by-side.
          </p>
        </div>

        {/* Quick Action Buttons & Job Switcher */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Active Job Selector Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
            <Briefcase className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-500">Active Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-transparent text-xs font-extrabold text-slate-900 focus:outline-none cursor-pointer pr-2"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>

          {/* Upload Resumes Trigger */}
          <button
            onClick={() => setIsBatchUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Resumes
          </button>

          {/* Create Job Trigger */}
          <button
            onClick={() => setActiveTab('create_job')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Target Job Quick Summary Ribbon */}
      <div className="bg-linear-to-r from-indigo-50/80 via-white to-slate-50 border border-indigo-100 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900">Current Evaluation Target:</span>
            <span className="text-xs font-bold text-indigo-700 px-2 py-0.5 rounded-md bg-indigo-100">
              {activeJob.title}
            </span>
            <span className="text-xs text-slate-500">
              • {activeJob.experienceRequiredYears} yrs exp target • {activeJob.salaryRange}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-500">Required Skills & Weights:</span>
            {activeJob.requiredSkills.map((s) => (
              <span
                key={s.id}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs"
              >
                {s.skillName} <strong className="text-indigo-600">({s.requiredLevel})</strong>
                <span className="text-[10px] text-slate-400 ml-1 font-normal">• {s.importance}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Aggregate KPI Pills */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Applicants</span>
            <div className="text-sm font-black text-slate-900">{totalCount}</div>
          </div>
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Overall</span>
            <div className="text-sm font-black text-indigo-600">{avgOverallScore}/100</div>
          </div>
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Job Fit</span>
            <div className="text-sm font-black text-emerald-600">{avgJobFit}%</div>
          </div>
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-center shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</span>
            <div className="text-sm font-black text-amber-500">{shortlistedCount}</div>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab('ranked_table')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ranked_table'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Ranked Candidate Table ({totalCount})
        </button>

        <button
          onClick={() => setActiveTab('create_job')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'create_job'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Create Job & Define Skills
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'pipeline'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-400" />
          Shortlist & Pipeline ({shortlistedCount})
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'company'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Company Profile
        </button>
      </div>

      {/* VIEW 1: RANKED CANDIDATE TABLE (Core requested feature) */}
      {activeTab === 'ranked_table' && (
        <RankedCandidateTable
          candidates={evaluatedCandidatesForJob}
          activeJob={activeJob}
          onSelectCandidateProfile={(candidate) => setProfileModalCandidate(candidate)}
          onToggleShortlist={handleToggleShortlist}
          onUpdateStatus={onUpdateCandidateStatus}
          onAddNote={handleAddNote}
          onCompareCandidates={handleCompareCandidates}
          onOpenBatchUpload={() => setIsBatchUploadOpen(true)}
        />
      )}

      {/* VIEW 2: CREATE JOB FORM (Core requested feature) */}
      {activeTab === 'create_job' && (
        <JobCreationForm
          onCreateJob={handleJobCreated}
          onCancel={() => setActiveTab('ranked_table')}
        />
      )}

      {/* VIEW 3: SHORTLIST & PIPELINE */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                Shortlisted Candidates & Hiring Stages
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage interview schedules, review stages, and offer stages for shortlisted talent.
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
              {shortlistedCount} Candidates in Pipeline
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stage: Shortlisted */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Shortlisted for Review</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  {evaluatedCandidatesForJob.filter((c) => c.shortlisted && c.hiringStatus !== 'Interview Scheduled' && c.hiringStatus !== 'Offer Extended').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {evaluatedCandidatesForJob
                  .filter((c) => c.shortlisted && c.hiringStatus !== 'Interview Scheduled' && c.hiringStatus !== 'Offer Extended')
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setProfileModalCandidate(c)}
                      className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-slate-900">{c.candidateProfile.name}</strong>
                        <span className="text-xs font-extrabold text-indigo-600">
                          {c.analysis.scores.overallScore}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{c.candidateProfile.title}</div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Fit: {c.analysis.scores.jobFitScore}%</span>
                        <span>Evidence: {c.analysis.scores.evidenceStrengthScore}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Stage: Interview Scheduled */}
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">Interview Scheduled</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-800">
                  {interviewingCount}
                </span>
              </div>
              <div className="space-y-2.5">
                {evaluatedCandidatesForJob
                  .filter((c) => c.hiringStatus === 'Interview Scheduled')
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setProfileModalCandidate(c)}
                      className="p-3.5 bg-white rounded-xl border border-indigo-200 shadow-2xs hover:border-indigo-400 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-slate-900">{c.candidateProfile.name}</strong>
                        <span className="text-xs font-extrabold text-indigo-600">
                          {c.analysis.scores.overallScore}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{c.candidateProfile.title}</div>
                      <div className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                        📅 {c.interviewDate ? `Scheduled: ${c.interviewDate}` : 'Technical Deep-Dive'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Stage: Offer Extended */}
            <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Offer Extended / Hired</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                  {evaluatedCandidatesForJob.filter((c) => c.hiringStatus === 'Offer Extended' || c.hiringStatus === 'Hired').length}
                </span>
              </div>
              <div className="space-y-2.5">
                {evaluatedCandidatesForJob
                  .filter((c) => c.hiringStatus === 'Offer Extended' || c.hiringStatus === 'Hired')
                  .map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setProfileModalCandidate(c)}
                      className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-black text-slate-900">{c.candidateProfile.name}</strong>
                        <span className="text-xs font-extrabold text-emerald-600">
                          {c.analysis.scores.overallScore}/100
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{c.candidateProfile.title}</div>
                      <div className="text-[10px] text-emerald-700 font-bold">
                        ✓ Offer Stage Active
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-2xl space-y-5">
          <div>
            <h3 className="text-lg font-black text-slate-900">Company & Hiring Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Employer branding and recruiter profile details.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={company.name}
                onChange={(e) => onUpdateCompany({ ...company, name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Industry
              </label>
              <input
                type="text"
                value={company.industry}
                onChange={(e) => onUpdateCompany({ ...company, industry: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headquarters
              </label>
              <input
                type="text"
                value={company.location}
                onChange={(e) => onUpdateCompany({ ...company, location: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* BATCH RESUME UPLOAD MODAL */}
      <BatchResumeUploadModal
        isOpen={isBatchUploadOpen}
        onClose={() => setIsBatchUploadOpen(false)}
        activeJob={activeJob}
        onBatchAnalyzed={handleBatchAnalyzed}
      />

      {/* CANDIDATE PROFILE DOSSIER MODAL */}
      {profileModalCandidate && (
        <CandidateProfileModal
          isOpen={Boolean(profileModalCandidate)}
          onClose={() => setProfileModalCandidate(null)}
          candidate={profileModalCandidate}
          activeJob={activeJob}
          onToggleShortlist={handleToggleShortlist}
          onUpdateStatus={onUpdateCandidateStatus}
          onAddNote={handleAddNote}
        />
      )}

      {/* SIDE-BY-SIDE COMPARE MODAL */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        candidates={compareCandidatesList}
        allCandidates={evaluatedCandidatesForJob}
        activeJob={activeJob}
        onToggleShortlist={handleToggleShortlist}
        onUpdateStatus={onUpdateCandidateStatus}
        onSelectCandidateProfile={(cand) => {
          setIsCompareModalOpen(false);
          setProfileModalCandidate(cand);
        }}
      />
    </div>
  );
};
