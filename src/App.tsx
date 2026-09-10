import React, { useState, useEffect } from 'react';
import { 
  CandidateRecord, 
  JobPosting, 
  CompanyProfile, 
  HiringStatus 
} from './types';
import { 
  sampleCandidates, 
  sampleJobs, 
  initialCompanyProfile 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { CandidateView } from './components/candidate/CandidateView';
import { HrView } from './components/hr/HrView';
import { ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'landing' | 'candidate' | 'hr'>('landing');
  const [candidates, setCandidates] = useState<CandidateRecord[]>(sampleCandidates);
  const [jobs, setJobs] = useState<JobPosting[]>(sampleJobs);
  const [company, setCompany] = useState<CompanyProfile>(initialCompanyProfile);
  const [activeCandidateId, setActiveCandidateId] = useState<string>(sampleCandidates[0].id);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch initial data from server if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, jRes, compRes] = await Promise.all([
          fetch('/api/candidates'),
          fetch('/api/jobs'),
          fetch('/api/company')
        ]);

        if (cRes.ok) {
          const cData = await cRes.json();
          if (Array.isArray(cData) && cData.length > 0) {
            setCandidates(cData);
            setActiveCandidateId(cData[0].id);
          }
        }
        if (jRes.ok) {
          const jData = await jRes.json();
          if (Array.isArray(jData) && jData.length > 0) {
            setJobs(jData);
          }
        }
        if (compRes.ok) {
          const compData = await compRes.json();
          if (compData && compData.name) {
            setCompany(compData);
          }
        }
      } catch (err) {
        console.log('Using preloaded mock database state:', err);
      }
    };

    fetchData();
  }, []);

  // Quick auto-dismissing notifications
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Reset Demo State
  const handleResetDemo = () => {
    setCandidates(sampleCandidates);
    setJobs(sampleJobs);
    setCompany(initialCompanyProfile);
    setActiveCandidateId(sampleCandidates[0].id);
    triggerNotification('Demo data refreshed to initial state.');
  };

  // When a new analysis finishes in Candidate view
  const handleAnalysisCompleted = (newRecord: CandidateRecord) => {
    // Add or update candidate list
    const existingIndex = candidates.findIndex((c) => c.id === newRecord.id);
    let updatedList: CandidateRecord[];
    if (existingIndex >= 0) {
      updatedList = [...candidates];
      updatedList[existingIndex] = newRecord;
    } else {
      updatedList = [newRecord, ...candidates];
    }
    setCandidates(updatedList);
    setActiveCandidateId(newRecord.id);
    triggerNotification(`Verified ${newRecord.candidateProfile.name}'s resume! Overall Score: ${newRecord.analysis.scores.overallScore}/100.`);
  };

  // Update candidate hiring status & notes
  const handleUpdateCandidateStatus = (
    candidateId: string, 
    status: HiringStatus, 
    notes?: string, 
    interviewDate?: string
  ) => {
    const updated = candidates.map((c) => {
      if (c.id === candidateId) {
        const existingNotes = c.hrNotes || [];
        const updatedNotes = notes !== undefined && notes.trim()
          ? [
              {
                id: `hrn-${Date.now()}`,
                author: 'Jessica Miller',
                text: notes,
                createdAt: new Date().toISOString()
              },
              ...existingNotes
            ]
          : existingNotes;

        return {
          ...c,
          hiringStatus: status,
          hrNotes: updatedNotes,
          interviewDate: interviewDate !== undefined ? interviewDate : c.interviewDate
        };
      }
      return c;
    });

    setCandidates(updated);

    // Persist to server
    fetch(`/api/candidates/${candidateId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, hrNotes: notes, interviewDate })
    }).catch((err) => console.log('Status update error:', err));

    triggerNotification(`Updated status to "${status}".`);
  };

  // Add new job posting
  const handleAddJob = (newJob: JobPosting) => {
    setJobs([newJob, ...jobs]);

    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob)
    }).catch((err) => console.log('Save job error:', err));

    triggerNotification(`Published "${newJob.title}" job posting.`);
  };

  // Update company profile
  const handleUpdateCompany = (updated: CompanyProfile) => {
    setCompany(updated);
    triggerNotification('Updated company profile settings.');
  };

  // Toggle shortlist status
  const handleToggleShortlist = (candidateId: string) => {
    let nowShortlisted = false;
    const updated = candidates.map((c) => {
      if (c.id === candidateId) {
        nowShortlisted = !c.shortlisted;
        return { ...c, shortlisted: nowShortlisted };
      }
      return c;
    });
    setCandidates(updated);

    fetch(`/api/candidates/${candidateId}/shortlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shortlisted: nowShortlisted })
    }).catch((err) => console.log('Shortlist error:', err));

    triggerNotification(nowShortlisted ? 'Candidate added to Shortlist!' : 'Candidate removed from Shortlist.');
  };

  // Add batch analyzed candidates
  const handleBatchCandidatesAdded = (newBatch: CandidateRecord[]) => {
    setCandidates((prev) => [...newBatch, ...prev]);
    triggerNotification(`Successfully analyzed & ranked ${newBatch.length} candidate resumes!`);
  };

  const currentCandidateRecord = 
    candidates.find((c) => c.id === activeCandidateId) || candidates[0] || sampleCandidates[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onResetDemo={handleResetDemo}
        candidateCount={candidates.length}
      />

      {/* Main View Switcher */}
      <div className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onGoCandidate={() => setCurrentTab('candidate')}
            onGoHr={() => setCurrentTab('hr')}
          />
        )}

        {currentTab === 'candidate' && (
          <CandidateView
            currentRecord={currentCandidateRecord}
            jobs={jobs}
            onAnalysisCompleted={handleAnalysisCompleted}
          />
        )}

        {currentTab === 'hr' && (
          <HrView
            candidates={candidates}
            jobs={jobs}
            company={company}
            onUpdateCandidateStatus={handleUpdateCandidateStatus}
            onAddJob={handleAddJob}
            onUpdateCompany={handleUpdateCompany}
            onAddBatchCandidates={handleBatchCandidatesAdded}
            onToggleShortlist={handleToggleShortlist}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm">ProofCV</span>
              <span className="text-slate-400 text-[11px] ml-2 font-medium">
                "Don't just claim a skill. Prove it."
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <button onClick={() => setCurrentTab('landing')} className="hover:text-indigo-600 transition-colors">
              Platform Vision
            </button>
            <button onClick={() => setCurrentTab('candidate')} className="hover:text-indigo-600 transition-colors">
              Candidate Hub
            </button>
            <button onClick={() => setCurrentTab('hr')} className="hover:text-indigo-600 transition-colors">
              HR Hiring Suite
            </button>
          </div>

          <div className="text-slate-400 text-[11px]">
            Empirical Evidence Engine • Powered by Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
}
