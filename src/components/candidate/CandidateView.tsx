import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Target, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Briefcase, 
  User, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  FileCode, 
  ExternalLink, 
  BookOpen, 
  Award, 
  GraduationCap, 
  Clock, 
  Lightbulb, 
  AlertCircle, 
  Cpu, 
  RefreshCw,
  FolderGit2,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Search,
  Info
} from 'lucide-react';
import { 
  CandidateRecord, 
  JobPosting, 
  AnalysisResult, 
  CandidateProfile, 
  SkillVerification,
  EvidenceType
} from '../../types';
import { sampleCandidateResumeTexts } from '../../data/mockData';
import { ScoreRing } from '../ScoreRing';
import { SkillCard } from '../SkillCard';
import { AIReviewBanner } from '../AIReviewBanner';
import { ScoreCardsGrid } from './ScoreCardsGrid';
import { AnalysisCharts } from './AnalysisCharts';
import { AIExplanationBox } from './AIExplanationBox';
import { SkillBreakdownSection } from './SkillBreakdownSection';
import { RecommendationsSection } from './RecommendationsSection';

interface CandidateViewProps {
  currentRecord: CandidateRecord;
  jobs: JobPosting[];
  onAnalysisCompleted: (newRecord: CandidateRecord) => void;
}

export const CandidateView: React.FC<CandidateViewProps> = ({
  currentRecord,
  jobs,
  onAnalysisCompleted
}) => {
  const [activeSidebar, setActiveSidebar] = useState<
    'dashboard' | 'analysis' | 'job_match' | 'skill_evidence' | 'skill_gap' | 'recommendations' | 'job_roles' | 'profile'
  >('dashboard');

  // Analysis form state
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [resumeTextInput, setResumeTextInput] = useState<string>('');
  const [customJobDesc, setCustomJobDesc] = useState<string>('');
  const [useCustomJob, setUseCustomJob] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [evidenceFilterStatus, setEvidenceFilterStatus] = useState<string>('ALL');
  const [evidenceSearchQuery, setEvidenceSearchQuery] = useState<string>('');

  const activeJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const profile = currentRecord.candidateProfile;
  const analysis = currentRecord.analysis;
  const scores = analysis.scores;

  // Handle File Upload (PDF, DOCX, TXT)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setAnalysisError(null);

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');

    if (isPdf) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPdfBase64(result);
        // Set placeholder text indicating PDF is loaded
        setResumeTextInput(`[Loaded PDF Document: ${file.name} - Ready for Multimodal Parsing]`);
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text or standard file read
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setResumeTextInput(text);
        setPdfBase64(null);
      };
      reader.readAsText(file);
    }
  };

  // Handle Quick Pre-load sample
  const handleLoadSample = (sampleIndex: number) => {
    const sample = sampleCandidateResumeTexts[sampleIndex];
    if (sample) {
      setResumeTextInput(sample.text);
      setUploadedFileName(sample.title + '.txt');
      setPdfBase64(null);
    }
  };

  // Trigger Resume Analysis with 5-phase deterministic flow
  const handleRunAnalysis = async () => {
    if (!resumeTextInput.trim() && !pdfBase64) {
      setAnalysisError('Please provide resume text or upload a PDF/DOCX file.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1); // 1. Extract resume information
    setAnalysisError(null);

    // Visual step progression: 1=Extract resume, 2=Extract job reqs, 3=Compare skills, 4=Calculate scores, 5=Generate AI explanation
    const stepInterval = setInterval(() => {
      setAnalysisStep((current) => (current < 4 ? current + 1 : current));
    }, 850);

    try {
      const payload: any = {
        resumeText: resumeTextInput,
        jobId: useCustomJob ? undefined : selectedJobId,
        customJobDescription: useCustomJob ? customJobDesc : undefined,
        jobTitle: useCustomJob ? 'Custom Target Role' : undefined,
      };

      if (pdfBase64) {
        payload.pdfBase64 = pdfBase64;
      }

      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      clearInterval(stepInterval);
      setAnalysisStep(5); // 5. Structured explanation & recommendations

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.candidate) {
        setTimeout(() => {
          onAnalysisCompleted(data.candidate);
          setActiveSidebar('dashboard');
          setIsAnalyzing(false);
          setAnalysisStep(0);
        }, 500);
      } else {
        setIsAnalyzing(false);
        setAnalysisStep(0);
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Analysis failed:', err);
      setAnalysisError('Analysis failed. The demo engine will utilize fallback structured extraction.');
      setIsAnalyzing(false);
      setAnalysisStep(0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs shrink-0 sticky top-24">
          <div className="px-3 py-2 mb-3 border-b border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Candidate Mode</div>
            <div className="font-bold text-slate-800 text-sm truncate mt-0.5">{profile.name}</div>
            <div className="text-xs text-indigo-600 truncate">{profile.title}</div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveSidebar('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSidebar('analysis')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'analysis'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <UploadCloud className="w-4 h-4" />
                <span>Resume Analysis</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">New</span>
            </button>

            <button
              onClick={() => setActiveSidebar('job_match')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'job_match'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Job Match</span>
            </button>

            <button
              onClick={() => setActiveSidebar('skill_evidence')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'skill_evidence'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Skill Evidence</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                {analysis.skillVerifications.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSidebar('skill_gap')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'skill_gap'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Skill Gap</span>
            </button>

            <button
              onClick={() => setActiveSidebar('recommendations')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'recommendations'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Recommendations</span>
            </button>

            <button
              onClick={() => setActiveSidebar('job_roles')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'job_roles'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Job Roles</span>
            </button>

            <button
              onClick={() => setActiveSidebar('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeSidebar === 'profile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Details</span>
            </button>
          </nav>

          {/* Target Job Quick Pill */}
          <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Position</span>
            <span className="font-bold text-slate-800 block truncate mt-0.5">{activeJob.title}</span>
            <span className="text-slate-500 text-[11px] block">{activeJob.department}</span>
          </div>
        </aside>

        {/* MAIN VIEW AREA */}
        <main className="flex-1 w-full space-y-6">
          {/* ================= VIEW 1: DASHBOARD ================= */}
          {activeSidebar === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Hero Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AI-Powered Evidence Verification Engine
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{profile.name}</h2>
                  <p className="text-sm text-slate-600 mt-0.5">{profile.title} • {profile.location}</p>
                  <p className="text-xs text-slate-500 mt-2 max-w-2xl line-clamp-2">
                    {profile.summary}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveSidebar('analysis')}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Analyze Another Resume</span>
                  </button>
                  <button
                    onClick={() => setActiveSidebar('job_match')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span>Target: {activeJob.title}</span>
                  </button>
                </div>
              </div>

              {/* 1. EIGHT PROMINENT SCORE CARDS WITH CIRCULAR PROGRESS INDICATORS */}
              <ScoreCardsGrid scores={scores} job={activeJob} />

              {/* 2. STRUCTURED AI EXPLANATION & REASONING BOX */}
              <AIExplanationBox 
                structuredExplanation={analysis.aiStructuredExplanation}
                scoreExplanation={analysis.scoreExplanation}
                scores={scores}
                job={activeJob}
              />

              {/* 3. INTERACTIVE ANALYTICAL CHARTS (RADAR & SKILL COMPARISON) */}
              <AnalysisCharts 
                scores={scores} 
                job={activeJob} 
                skillVerifications={analysis.skillVerifications} 
              />

              {/* 4. MATCHED, WEAK, AND MISSING SKILLS SECTION WITH BADGES */}
              <SkillBreakdownSection 
                matchedSkills={analysis.matchedSkills}
                missingSkills={analysis.missingSkills}
                weakSkills={analysis.weakSkills}
                skillVerifications={analysis.skillVerifications}
                job={activeJob}
              />

              {/* 5. RECOMMENDATION CARDS & MISSING CONTENT */}
              <RecommendationsSection 
                recommendedSkills={analysis.recommendedSkillsToLearn}
                alternativeJobRoles={analysis.alternativeJobRoles}
                resumeImprovements={analysis.resumeImprovements}
                missingSections={analysis.missingSections}
                missingContent={analysis.missingContent}
              />

              {/* AI & Plagiarism Heuristic Review Banner */}
              <AIReviewBanner review={analysis.aiContentReview} />
            </div>
          )}

          {/* ================= VIEW 2: RESUME ANALYSIS / UPLOAD ================= */}
          {activeSidebar === 'analysis' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Flow Explanation Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    Candidate AI Resume & Evidence Analyzer
                  </h3>
                </div>
                <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
                  Evaluate any resume against a specific target job. ProofCV deterministically extracts skills, traces concrete project/work evidence, calculates 8 empirical scores (no random numbers), and generates structured AI reasoning.
                </p>

                {/* Flow Diagram Chips */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="px-2 py-0.5 bg-white rounded shadow-2xs text-indigo-700">1. Upload Resume</span>
                  <span>+</span>
                  <span className="px-2 py-0.5 bg-white rounded shadow-2xs text-indigo-700">2. Enter Job Description</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-white rounded shadow-2xs text-slate-700">3. Extract Claims</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-white rounded shadow-2xs text-slate-700">4. Match Skills</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-white rounded shadow-2xs text-emerald-700">5. Calculate Deterministic Scores</span>
                  <span>→</span>
                  <span className="px-2 py-0.5 bg-white rounded shadow-2xs text-purple-700">6. AI Structured Explanation</span>
                </div>
              </div>

              {/* Sample Quick Loader */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
                <span className="text-xs font-bold text-indigo-950 block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Quick Hackathon Testing Presets (1-Click Load):
                </span>
                <div className="flex flex-wrap gap-2">
                  {sampleCandidateResumeTexts.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleLoadSample(idx)}
                      className="px-3 py-1.5 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 text-indigo-900 text-xs font-semibold rounded-lg shadow-2xs transition-all"
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Column Input Grid: Resume Upload & Job Description */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUMN 1: RESUME UPLOAD */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block flex items-center justify-between">
                      <span>Step 1: Upload Candidate Resume</span>
                      <span className="text-[11px] text-slate-400 font-normal">PDF, DOCX, or Text</span>
                    </label>
                  </div>

                  {/* Dropzone */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      id="resume-file-input"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="resume-file-input" className="cursor-pointer space-y-2 block">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-bold text-slate-800">
                        {uploadedFileName ? (
                          <span className="text-indigo-600 flex items-center justify-center gap-1.5">
                            <FileCheck2 className="w-4 h-4" /> {uploadedFileName}
                          </span>
                        ) : (
                          'Click to upload or drag & drop resume'
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Multimodal Gemini extraction supports direct PDF documents
                      </p>
                    </label>
                  </div>

                  {/* Text Input Area */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Or Edit / Paste Resume Text Directly:
                    </label>
                    <textarea
                      value={resumeTextInput}
                      onChange={(e) => setResumeTextInput(e.target.value)}
                      placeholder="Paste resume content here..."
                      rows={9}
                      className="w-full p-3.5 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* COLUMN 2: JOB SPECIFICATION */}
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block flex items-center justify-between">
                      <span>Step 2: Target Job Description</span>
                      <span className="text-[11px] text-indigo-600 font-semibold cursor-pointer" onClick={() => setUseCustomJob(!useCustomJob)}>
                        {useCustomJob ? '← Choose Preset Job' : '+ Custom Job Description'}
                      </span>
                    </label>
                  </div>

                  {!useCustomJob ? (
                    <div className="space-y-2.5">
                      <span className="text-[11px] text-slate-500 block">Select active job posting to match against:</span>
                      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            onClick={() => { setSelectedJobId(job.id); setUseCustomJob(false); }}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              selectedJobId === job.id
                                ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900 text-xs">{job.title}</h4>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {job.experienceRequiredYears}+ yrs exp
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{job.department} • {job.location}</div>
                            <div className="text-[11px] text-indigo-700 mt-1.5 flex flex-wrap gap-1">
                              {job.requiredSkills.map((s, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 bg-indigo-100/70 rounded text-[10px] font-medium">
                                  {s.skillName}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Target Role Title</label>
                        <input
                          type="text"
                          value={customJobDesc.split('\n')[0] || 'Target Role'}
                          onChange={(e) => {
                            const rest = customJobDesc.split('\n').slice(1).join('\n');
                            setCustomJobDesc(e.target.value + '\n' + rest);
                          }}
                          placeholder="e.g. Senior Machine Learning Engineer"
                          className="w-full p-2.5 text-xs border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Job Description & Required Skills</label>
                        <textarea
                          value={customJobDesc}
                          onChange={(e) => setCustomJobDesc(e.target.value)}
                          placeholder="Paste complete job requirements, must-have skills, experience expectations..."
                          rows={8}
                          className="w-full p-3 text-xs font-sans border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Notice */}
              {analysisError && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{analysisError}</span>
                </div>
              )}

              {/* Live Processing Stepper (When analyzing) */}
              {isAnalyzing && (
                <div className="p-5 bg-indigo-950 text-white rounded-2xl border border-indigo-500/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-300 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                      Deterministic AI Resume Evaluation in Progress...
                    </span>
                    <span className="font-mono text-indigo-300 font-bold">Phase {Math.min(5, Math.max(1, analysisStep))} of 5</span>
                  </div>

                  <div className="w-full bg-indigo-900/60 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-400 h-2 transition-all duration-500 rounded-full"
                      style={{ width: `${(analysisStep / 5) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 text-[11px]">
                    <div className={`p-2 rounded-lg ${analysisStep >= 1 ? 'bg-indigo-500/30 text-white font-bold' : 'text-slate-400'}`}>
                      1. Extract Resume Profile
                    </div>
                    <div className={`p-2 rounded-lg ${analysisStep >= 2 ? 'bg-indigo-500/30 text-white font-bold' : 'text-slate-400'}`}>
                      2. Extract Job Requirements
                    </div>
                    <div className={`p-2 rounded-lg ${analysisStep >= 3 ? 'bg-indigo-500/30 text-white font-bold' : 'text-slate-400'}`}>
                      3. Compare Skills & Artifacts
                    </div>
                    <div className={`p-2 rounded-lg ${analysisStep >= 4 ? 'bg-indigo-500/30 text-white font-bold' : 'text-slate-400'}`}>
                      4. Calculate Deterministic Scores
                    </div>
                    <div className={`p-2 rounded-lg ${analysisStep >= 5 ? 'bg-emerald-500/30 text-emerald-200 font-bold' : 'text-slate-400'}`}>
                      5. Structured AI Reasoning
                    </div>
                  </div>
                </div>
              )}

              {/* Action Trigger Button */}
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2.5"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing Evidence Engine & Scoring Models...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze Resume Against Target Role</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= VIEW 3: JOB MATCH ================= */}
          {activeSidebar === 'job_match' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Evaluation Against</span>
                    <h3 className="text-2xl font-extrabold text-slate-900">{activeJob.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{activeJob.department} • {activeJob.location} • {activeJob.salaryRange}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-3xl font-extrabold text-indigo-600">{scores.jobFitScore}%</span>
                    <span className="block text-xs font-semibold text-slate-500">Job Fit Score (30% Weight)</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm mb-3">Required Skill Card Verification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeJob.requiredSkills.map((req, idx) => {
                      const verification = analysis.skillVerifications.find(
                        (v) => v.skillName.toLowerCase() === req.skillName.toLowerCase()
                      );
                      const isFound = Boolean(verification);

                      return (
                        <div 
                          key={idx} 
                          className={`p-3.5 rounded-xl border ${
                            isFound && verification?.verificationStatus === 'Verified'
                              ? 'bg-emerald-50/40 border-emerald-200'
                              : isFound
                              ? 'bg-blue-50/40 border-blue-200'
                              : 'bg-amber-50/40 border-amber-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{req.skillName}</span>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              Req: {req.requiredLevel} • {req.importance}
                            </span>
                          </div>
                          <div className="text-xs mt-2 flex items-center justify-between">
                            <span className="text-slate-600">
                              Status: <strong>{verification ? verification.verificationStatus : 'Not Found on Resume'}</strong>
                            </span>
                            <span className="text-slate-500">
                              Evidence: <strong>{verification ? `${verification.evidenceStrength}%` : '0%'}</strong>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Job Description Text Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Job Description Context</h4>
                <div className="text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed font-sans">
                  {activeJob.description}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 4: SKILL EVIDENCE ================= */}
          {activeSidebar === 'skill_evidence' && (() => {
            const verifications = analysis.skillVerifications || [];
            const verifiedCount = verifications.filter((v) => v.verificationStatus === 'Verified').length;
            const partiallyCount = verifications.filter((v) => v.verificationStatus === 'Partially Verified').length;
            const manualReviewCount = verifications.filter((v) => v.verificationStatus === 'Needs Manual Review').length;
            const insufficientCount = verifications.filter((v) => v.verificationStatus === 'Insufficient Evidence').length;
            const levelGapCount = verifications.filter((v) => v.estimatedLevel !== 'Insufficient Evidence' && v.claimedLevel !== v.estimatedLevel).length;
            const avgStrength = verifications.length > 0 
              ? Math.round(verifications.reduce((acc, v) => acc + (v.evidenceStrength || 0), 0) / verifications.length)
              : 0;

            const filtered = verifications.filter((v) => {
              if (evidenceFilterStatus !== 'ALL' && v.verificationStatus !== evidenceFilterStatus) return false;
              if (evidenceSearchQuery && !v.skillName.toLowerCase().includes(evidenceSearchQuery.toLowerCase())) return false;
              return true;
            });

            return (
              <div className="space-y-6">
                {/* Header & Empirical Summary */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        Evidence-Based Skill Verification Engine
                      </div>
                      <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Claimed Skills vs. Concrete Evidence</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Every skill claimed in the resume is systematically cross-referenced against projects, internships, work experience, certifications, repositories, and assessments.
                      </p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-3xl font-extrabold text-indigo-600 block">{scores.verifiedSkillsScore}%</span>
                      <span className="text-xs font-semibold text-slate-500">Verified Skills Score (25% Weight)</span>
                    </div>
                  </div>

                  {/* 4 Stat KPI Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                      <span className="text-xs font-bold text-emerald-800 block">Verified Skills</span>
                      <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block">{verifiedCount}</span>
                      <span className="text-[11px] text-emerald-600">{Math.round((verifiedCount / (verifications.length || 1)) * 100)}% of claims verified</span>
                    </div>
                    <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl">
                      <span className="text-xs font-bold text-blue-800 block">Partially Verified</span>
                      <span className="text-2xl font-extrabold text-blue-700 mt-0.5 block">{partiallyCount}</span>
                      <span className="text-[11px] text-blue-600">Intermediate evidence present</span>
                    </div>
                    <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl">
                      <span className="text-xs font-bold text-purple-800 block">Needs Manual Review</span>
                      <span className="text-2xl font-extrabold text-purple-700 mt-0.5 block">{manualReviewCount}</span>
                      <span className="text-[11px] text-purple-600">Discrepancy for interview</span>
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-xs font-bold text-slate-700 block">Avg Evidence Strength</span>
                      <span className="text-2xl font-extrabold text-slate-900 mt-0.5 block">{avgStrength}%</span>
                      <span className="text-[11px] text-slate-500">{levelGapCount} Level gap(s) noted</span>
                    </div>
                  </div>

                  {/* Ethical Verification Principle */}
                  <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-indigo-950">Ethical Verification Standard:</strong> Lack of tangible evidence in a resume never implies deceit or fraudulence. It informs recruiters and candidates which technical areas are best explored through live conversation and coding walk-throughs.
                    </div>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Status Filter Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: 'ALL', label: 'All Skills', count: verifications.length },
                      { id: 'Verified', label: 'Verified', count: verifiedCount, color: 'text-emerald-700' },
                      { id: 'Partially Verified', label: 'Partially Verified', count: partiallyCount, color: 'text-blue-700' },
                      { id: 'Needs Manual Review', label: 'Needs Review', count: manualReviewCount, color: 'text-purple-700' },
                      { id: 'Insufficient Evidence', label: 'Insufficient', count: insufficientCount, color: 'text-amber-700' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setEvidenceFilterStatus(tab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          evidenceFilterStatus === tab.id
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                          evidenceFilterStatus === tab.id
                            ? 'bg-white/20 text-white'
                            : 'bg-white text-slate-700 shadow-2xs'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search input */}
                  <div className="relative sm:w-64 shrink-0">
                    <input
                      type="text"
                      value={evidenceSearchQuery}
                      onChange={(e) => setEvidenceSearchQuery(e.target.value)}
                      placeholder="Search skill (e.g. Python, SQL)..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Evidence Cards List */}
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2 shadow-xs">
                      <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-sm">No skills found matching this criteria</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try selecting another status tab or clearing your search term to see other evaluated skills.
                      </p>
                      <button
                        onClick={() => { setEvidenceFilterStatus('ALL'); setEvidenceSearchQuery(''); }}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 mt-2"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filtered.map((v, idx) => (
                      <SkillCard key={idx} verification={v} showDetailsDefault={idx === 0} />
                    ))
                  )}
                </div>
              </div>
            );
          })()}

          {/* ================= VIEW 5: SKILL GAP & LEARNING ================= */}
          {activeSidebar === 'skill_gap' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900">Skill Gap Analysis & Learning Roadmap</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Concrete projects you can build and link in your resume to satisfy required skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.recommendedSkillsToLearn.map((item, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md text-xs font-bold">
                          {item.importance} Priority
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Est: {item.estimatedTimeToLearn}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base">{item.skill}</h4>
                      
                      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                          <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                          Suggested Proof Project:
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {item.suggestedProofProject}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
                      <span>Add to Learning Queue</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= VIEW 6: RECOMMENDATIONS ================= */}
          {activeSidebar === 'recommendations' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900">Resume Improvements & Claim Auditing</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Suggestions to strengthen unsupported claims, improve ATS structure, and add high-impact metrics.
                </p>
              </div>

              {/* Unsupported or Weak Claims */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Unsupported or Weak Claims ({analysis.unsupportedClaims.length})
                </h4>

                {analysis.unsupportedClaims.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No exaggerated or unevidenced claims detected.</p>
                ) : (
                  <div className="space-y-3">
                    {analysis.unsupportedClaims.map((claim, idx) => (
                      <div key={idx} className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-amber-950 font-bold">"{claim.claim}"</strong>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-semibold text-[11px]">
                            {claim.issueType}
                          </span>
                        </div>
                        <p className="text-amber-800">{claim.explanation}</p>
                        <div className="pt-1 text-slate-700">
                          <span className="font-semibold text-emerald-700">How to Fix: </span>
                          {claim.howToFix}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Improvements by Category */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h4 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  Structural & Metric Recommendations
                </h4>

                <div className="space-y-3">
                  {analysis.resumeImprovements.map((imp, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-900 text-sm">{imp.title}</h5>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded font-medium text-[11px]">
                          {imp.category}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{imp.feedback}</p>
                      <div className="mt-2 p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700">
                        <strong className="text-indigo-600">Suggested Example: </strong>
                        {imp.example}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Resume Sections */}
              {analysis.missingSections.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h4 className="font-bold text-slate-800 text-sm mb-2">Missing Recommended Sections</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSections.map((sec, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
                        + Add {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW 7: ALTERNATIVE JOB ROLES ================= */}
          {activeSidebar === 'job_roles' && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-xl font-bold text-slate-900">Alternative Job Role Matches</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Based on your verified skills and project evidence, you are also strongly qualified for these roles:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.alternativeJobRoles.map((role, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{role.roleTitle}</h4>
                        <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          {role.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-2">
                        {role.rationale}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Key Strengths Applied:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {role.keyStrengths.map((str, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
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
          )}

          {/* ================= VIEW 8: EXTRACTED PROFILE ================= */}
          {activeSidebar === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Candidate Extracted Profile</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Comprehensive records extracted from resume: education, internships, projects, links, and achievements.
                </p>
              </div>

              {/* Contact and Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-semibold">Email</span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">{profile.email || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-semibold">Phone</span>
                  <span className="font-bold text-slate-800 truncate block mt-0.5">{profile.phone || 'N/A'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-semibold">GitHub</span>
                  {profile.githubUrl ? (
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 truncate block mt-0.5 hover:underline">
                      {profile.githubUrl.replace('https://', '')}
                    </a>
                  ) : (
                    <span className="text-slate-400 block mt-0.5">None cited</span>
                  )}
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block font-semibold">Portfolio</span>
                  {profile.portfolioUrl ? (
                    <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 truncate block mt-0.5 hover:underline">
                      {profile.portfolioUrl.replace('https://', '')}
                    </a>
                  ) : (
                    <span className="text-slate-400 block mt-0.5">None cited</span>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Work Experience
                </h4>
                <div className="space-y-3">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{exp.role} @ {exp.company}</span>
                        <span className="text-slate-500 text-[11px]">{exp.duration}</span>
                      </div>
                      <ul className="list-disc pl-5 text-slate-600 space-y-0.5 mt-1">
                        {exp.description.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  Key Projects & Deliverables
                </h4>
                <div className="space-y-3">
                  {profile.projects.map((proj, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{proj.name}</span>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-slate-600">{proj.description}</p>
                      {proj.impact && (
                        <p className="text-emerald-700 font-medium">Impact: {proj.impact}</p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Certs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" /> Education
                  </h5>
                  {profile.education.map((edu, i) => (
                    <div key={i} className="border-t border-slate-200 pt-2 first:border-0 first:pt-0">
                      <div className="font-bold text-slate-800">{edu.degree} in {edu.field}</div>
                      <div className="text-slate-500">{edu.institution} • {edu.year} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
                  <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" /> Certifications
                  </h5>
                  {profile.certifications.length === 0 ? (
                    <div className="text-slate-400 italic">No formal certifications listed.</div>
                  ) : (
                    profile.certifications.map((cert, i) => (
                      <div key={i} className="border-t border-slate-200 pt-2 first:border-0 first:pt-0">
                        <div className="font-bold text-slate-800">{cert.name}</div>
                        <div className="text-slate-500">{cert.issuer} • {cert.date}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
