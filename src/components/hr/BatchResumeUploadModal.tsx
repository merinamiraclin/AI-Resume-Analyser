import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Check, 
  Layers, 
  Users, 
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { JobPosting, CandidateRecord } from '../../types';
import { sampleBatchResumes, SampleResumeData } from '../../data/sampleResumes';

interface UploadQueueItem {
  id: string;
  name: string;
  size: string;
  status: 'pending' | 'analyzing' | 'completed' | 'error';
  candidateName?: string;
  overallScore?: number;
  jobFitScore?: number;
  evidenceStrength?: number;
  text?: string;
  error?: string;
}

interface BatchResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeJob: JobPosting;
  onBatchAnalyzed: (newCandidates: CandidateRecord[]) => void;
}

export const BatchResumeUploadModal: React.FC<BatchResumeUploadModalProps> = ({
  isOpen,
  onClose,
  activeJob,
  onBatchAnalyzed
}) => {
  const [fileQueue, setFileQueue] = useState<UploadQueueItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalyzingIndex, setCurrentAnalyzingIndex] = useState<number>(-1);
  const [analysisStatusText, setAnalysisStatusText] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files) as File[];
    await addFilesToQueue(files);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const files = Array.from(e.dataTransfer.files) as File[];
    await addFilesToQueue(files);
  };

  const addFilesToQueue = async (files: File[]) => {
    const newItems: UploadQueueItem[] = [];

    for (const file of files) {
      const text = await readFileAsText(file);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      newItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        status: 'pending',
        candidateName: cleanName.replace(/resume|cv/gi, '').trim() || cleanName,
        text: text || ''
      });
    }

    setFileQueue((prev) => [...prev, ...newItems]);
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsText(file);
    });
  };

  // 1-Click Load Sample Batch
  const handleLoadSampleBatch = () => {
    const sampleItems: UploadQueueItem[] = sampleBatchResumes.map((s) => ({
      id: s.id,
      name: s.fileName,
      size: s.fileSize,
      status: 'pending',
      candidateName: s.candidateName,
      text: s.resumeText
    }));
    setFileQueue(sampleItems);
  };

  const handleRemoveItem = (id: string) => {
    if (isAnalyzing) return;
    setFileQueue(fileQueue.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    if (isAnalyzing) return;
    setFileQueue([]);
  };

  // Execute Batch Analysis
  const handleStartBatchAnalysis = async () => {
    if (fileQueue.length === 0 || isAnalyzing) return;
    setIsAnalyzing(true);

    const completedCandidates: CandidateRecord[] = [];
    const updatedQueue = [...fileQueue];

    for (let i = 0; i < updatedQueue.length; i++) {
      setCurrentAnalyzingIndex(i);
      const item = updatedQueue[i];
      item.status = 'analyzing';
      setFileQueue([...updatedQueue]);

      setAnalysisStatusText(`Analyzing candidate ${i + 1} of ${updatedQueue.length}: "${item.candidateName || item.name}" against ${activeJob.title}...`);

      try {
        // Send to server batch analyze or single analyze
        const res = await fetch('/api/analyze-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumes: [
              {
                fileName: item.name,
                candidateName: item.candidateName,
                resumeText: item.text || `Resume for ${item.candidateName}. Experienced Data Analyst with skills in SQL, Python, Power BI, Excel, and Statistics.`
              }
            ],
            jobId: activeJob.id
          })
        });

        if (res.ok) {
          const data = await res.json();
          const cand = data.addedCandidates?.[0];
          if (cand) {
            completedCandidates.push(cand);
            item.status = 'completed';
            item.overallScore = cand.analysis.scores.overallScore;
            item.jobFitScore = cand.analysis.scores.jobFitScore;
            item.evidenceStrength = cand.analysis.scores.evidenceStrengthScore;
          } else {
            item.status = 'completed';
          }
        } else {
          item.status = 'error';
          item.error = 'Server evaluation failed';
        }
      } catch (err: any) {
        console.error('Error analyzing candidate item:', err);
        item.status = 'error';
        item.error = err.message || 'Analysis error';
      }

      setFileQueue([...updatedQueue]);
    }

    setIsAnalyzing(false);
    setCurrentAnalyzingIndex(-1);
    setAnalysisStatusText(`Completed analysis of ${completedCandidates.length} resumes!`);

    if (completedCandidates.length > 0) {
      onBatchAnalyzed(completedCandidates);
    }
  };

  const completedCount = fileQueue.filter((f) => f.status === 'completed').length;
  const progressPercent = fileQueue.length > 0 ? Math.round((completedCount / fileQueue.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-linear-to-r from-slate-50 via-white to-indigo-50/50">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 mb-2">
              <UploadCloud className="w-3.5 h-3.5" />
              Batch Resume Ingestion
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Upload & Analyze Multiple Resumes</h3>
            <p className="text-xs text-slate-600 mt-1">
              Evaluating talent against <strong className="text-indigo-600 font-bold">{activeJob.title}</strong> ({activeJob.requiredSkills.map((s) => s.skillName).join(', ')})
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="text-slate-400 hover:text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Target Job Quick Summary Card */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{activeJob.title}</div>
                <div className="text-[11px] text-slate-500">
                  {activeJob.department} • {activeJob.experienceRequiredYears} yrs experience target
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 max-w-[280px] justify-end">
              {activeJob.requiredSkills.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200 shadow-2xs"
                >
                  {s.skillName} ({s.requiredLevel})
                </span>
              ))}
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/60'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Drag & Drop multiple candidate resumes here
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, DOCX, TXT files. You can select multiple files at once.
            </p>
            <div className="mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 underline">
                Or browse files from your computer
              </span>
            </div>
          </div>

          {/* Quick Demo Test Batch */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Want to test immediately without uploading local files?
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Load 4 diverse applicant resumes (Jordan Lee, Amanda White, Kevin Zhang, Rachel Green).
              </p>
            </div>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleLoadSampleBatch}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shrink-0 shadow-2xs"
            >
              ⚡ Load 4 Resumes
            </button>
          </div>

          {/* Upload Queue List */}
          {fileQueue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Resumes in Batch ({fileQueue.length})
                </span>
                {!isAnalyzing && (
                  <button
                    onClick={handleClearAll}
                    className="text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Progress Bar if Analyzing */}
              {isAnalyzing && (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2">
                  <div className="flex justify-between text-xs font-bold text-indigo-900">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      {analysisStatusText}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
                {fileQueue.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors ${
                      item.status === 'analyzing'
                        ? 'bg-indigo-50/50 border-indigo-200'
                        : item.status === 'completed'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : item.status === 'error'
                        ? 'bg-rose-50/40 border-rose-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="truncate">
                        <div className="font-bold text-slate-800 truncate">
                          {item.candidateName || item.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.name} • {item.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {item.status === 'pending' && (
                        <span className="text-[10px] font-semibold text-slate-400">Ready</span>
                      )}
                      {item.status === 'analyzing' && (
                        <span className="text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Verifying...
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          {item.overallScore !== undefined && (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-[10px]">
                              Score: {item.overallScore}/100
                            </span>
                          )}
                          <span className="text-emerald-600 font-bold flex items-center gap-0.5 text-[10px]">
                            <Check className="w-3 h-3" /> Ranked
                          </span>
                        </div>
                      )}
                      {item.status === 'error' && (
                        <span className="text-rose-600 font-semibold text-[10px]">
                          {item.error || 'Failed'}
                        </span>
                      )}

                      {!isAnalyzing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {fileQueue.length} resumes queued for empirical verification
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {completedCount > 0 ? 'Close' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={fileQueue.length === 0 || isAnalyzing}
              onClick={handleStartBatchAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Analyzing Resumes...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Analyze All Resumes ({fileQueue.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
