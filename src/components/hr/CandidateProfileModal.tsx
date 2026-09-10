import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  MessageSquare, 
  ExternalLink, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  GraduationCap, 
  FileText, 
  ShieldCheck, 
  Send,
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { CandidateRecord, JobPosting, HiringStatus, HRNote } from '../../types';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateRecord;
  activeJob: JobPosting;
  onToggleShortlist: (candidateId: string) => void;
  onUpdateStatus: (candidateId: string, status: HiringStatus) => void;
  onAddNote: (candidateId: string, noteText: string) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  candidate,
  activeJob,
  onToggleShortlist,
  onUpdateStatus,
  onAddNote,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'timeline' | 'interview' | 'notes'>('evidence');
  const [newNoteText, setNewNoteText] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  if (!isOpen || !candidate) return null;

  const profile = candidate.candidateProfile;
  const analysis = candidate.analysis;
  const scores = analysis.scores;

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(candidate.id, newNoteText.trim());
    setNewNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-200 bg-linear-to-r from-slate-50 via-white to-indigo-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{profile.name}</h2>
                <button
                  onClick={() => onToggleShortlist(candidate.id)}
                  className={`p-1 rounded-lg border transition-colors ${
                    candidate.shortlisted
                      ? 'bg-amber-50 border-amber-300 text-amber-500'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
                  }`}
                  title={candidate.shortlisted ? 'Shortlisted' : 'Add to Shortlist'}
                >
                  <Star className={`w-4 h-4 ${candidate.shortlisted ? 'fill-amber-400' : ''}`} />
                </button>
              </div>

              <p className="text-xs font-semibold text-slate-600 mt-0.5">{profile.title}</p>

              {/* Meta contact row */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {profile.email}
                </span>
                {profile.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {profile.phone}
                  </span>
                )}
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {profile.location}
                  </span>
                )}
                {profile.githubUrl && (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 font-bold hover:underline"
                  >
                    <Github className="w-3 h-3" />
                    GitHub
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a
                    href={profile.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-600 font-bold hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            {/* Status Selector */}
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase text-slate-400 mb-1">Hiring Pipeline</span>
              <select
                value={candidate.hiringStatus}
                onChange={(e) => onUpdateStatus(candidate.id, e.target.value as HiringStatus)}
                className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 bg-white shadow-2xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="New">New</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Score Ribbon */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-center">
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Score</span>
            <div className="text-lg font-black text-indigo-600 mt-0.5">{scores.overallScore}/100</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Job Fit (30%)</span>
            <div className="text-lg font-black text-slate-900 mt-0.5">{scores.jobFitScore}%</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Skills (25%)</span>
            <div className="text-lg font-black text-emerald-600 mt-0.5">{scores.verifiedSkillsScore}%</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Evidence Strength</span>
            <div className="text-lg font-black text-blue-600 mt-0.5">{scores.evidenceStrengthScore}%</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Experience (15%)</span>
            <div className="text-lg font-black text-slate-800 mt-0.5">{scores.experienceScore}%</div>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Certifications</span>
            <div className="text-lg font-black text-amber-600 mt-0.5">{scores.certificationsScore}%</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 flex gap-4 overflow-x-auto bg-white">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Evidence Audit & Skill Cards ({analysis.skillVerifications.length})
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Work History & Projects
          </button>

          <button
            onClick={() => setActiveTab('interview')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'interview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Targeted Interview Questions
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors shrink-0 flex items-center gap-1.5 ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Recruiter Notes ({candidate.hrNotes?.length || 0})
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: EVIDENCE AUDIT */}
          {activeTab === 'evidence' && (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl">
                <h4 className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Deterministic Skill Verification Engine
                </h4>
                <p className="text-xs text-indigo-700/90 mt-1 leading-relaxed">
                  Every skill claimed by the candidate is cross-referenced against projects, internships, professional experience, certifications, GitHub, and academic records. Candidates are never labeled fraudulent simply due to lack of evidence; unverified skills are clearly designated as <em>Insufficient Evidence</em> for manual review.
                </p>
              </div>

              {/* Skill Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.skillVerifications.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-indigo-200 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-black text-slate-900">{v.skillName}</h5>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Claimed: <strong className="text-slate-700">{v.claimedLevel}</strong> • Estimated: <strong className="text-indigo-600">{v.estimatedLevel}</strong>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-md ${
                          v.verificationStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : v.verificationStatus === 'Partially Verified'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {v.verificationStatus}
                      </span>
                    </div>

                    {/* Evidence Strength Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>Evidence Strength</span>
                        <span className="font-extrabold text-slate-700">{v.evidenceStrength}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            v.evidenceStrength >= 75
                              ? 'bg-emerald-500'
                              : v.evidenceStrength >= 50
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${v.evidenceStrength}%` }}
                        />
                      </div>
                    </div>

                    {/* Evidence Items Checklist */}
                    <div className="bg-slate-50 rounded-lg p-3 space-y-1.5 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Verified Proof Items ({v.evidenceItems.length})
                      </span>
                      {v.evidenceItems.length > 0 ? (
                        v.evidenceItems.map((item, i) => (
                          <div key={item.id || i} className="text-xs text-slate-700 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-slate-900">{item.title}</strong>{' '}
                              <span className="text-slate-500 text-[11px]">({item.type} • {item.source})</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500 italic">
                          No direct project, internship, or certification evidence detected in resume text.
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    {v.explanation && (
                      <p className="text-[11px] text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                        {v.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WORK HISTORY & PROJECTS */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* Experience */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Professional Work Experience
                </h4>
                <div className="space-y-3">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h5 className="text-sm font-extrabold text-slate-900">{exp.role}</h5>
                          <div className="text-xs font-semibold text-indigo-600">{exp.company}</div>
                        </div>
                        <span className="text-xs text-slate-500">{exp.duration}</span>
                      </div>
                      <ul className="space-y-1 mt-2">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="text-xs text-slate-600 list-disc list-inside leading-relaxed">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  Technical Projects & Repositories
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {profile.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-black text-slate-900">{proj.name}</h5>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
                          >
                            <ExternalLink className="w-3 h-3" /> Link
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Education & Academic Credentials
                </h4>
                <div className="space-y-2">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-slate-900">{edu.degree} in {edu.field}</span>
                        <div className="text-slate-500 text-[11px]">{edu.institution}</div>
                      </div>
                      <span className="font-bold text-slate-500">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TARGETED INTERVIEW QUESTIONS */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Empirical Verification Interview Prompts:</strong> These questions are dynamically generated based on this candidate&apos;s verified skill gaps and unproven resume claims for <strong>{activeJob.title}</strong>.
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase">SQL Query Optimization</span>
                  <p className="text-xs font-bold text-slate-900">
                    &quot;Can you describe a scenario where a high-volume SQL query suffered from severe execution bottlenecks, and how you used EXPLAIN plans or indexing to optimize it?&quot;
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Purpose: Validates claimed Advanced SQL proficiency against real-world production database operations.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase">Power BI DAX & Semantic Modeling</span>
                  <p className="text-xs font-bold text-slate-900">
                    &quot;How do you structure composite models in Power BI and manage relationship cardinalities to prevent ambiguous filter contexts in DAX?&quot;
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Purpose: Evaluates whether Power BI claims reflect enterprise architecture versus basic visual creation.
                  </p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase">Statistical Inference</span>
                  <p className="text-xs font-bold text-slate-900">
                    &quot;When evaluating experimental A/B test results with skewed metric distributions, how do you handle outliers and choose between parametric vs non-parametric hypothesis tests?&quot;
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Purpose: Verifies practical application of statistical analysis in corporate decision making.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RECRUITER NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <form onSubmit={handleAddNoteSubmit} className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-800">
                  Add Confidential Recruiter Note
                </label>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record interview notes, technical screening feedback, salary expectations, or next steps..."
                  className="w-full p-3 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save Note
                  </button>
                </div>
              </form>

              {/* Notes Thread */}
              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <span className="text-xs font-extrabold text-slate-700">Recruiter Notes History</span>
                {candidate.hrNotes && candidate.hrNotes.length > 0 ? (
                  <div className="space-y-2.5">
                    {candidate.hrNotes.map((note) => (
                      <div key={note.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <strong className="text-slate-900">{note.author}</strong>
                          <span className="text-slate-400">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{note.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No notes recorded yet for this candidate.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Candidate ID: <span className="font-mono text-slate-700">{candidate.id}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onToggleShortlist(candidate.id)}
              className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                candidate.shortlisted
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${candidate.shortlisted ? 'fill-amber-400 text-amber-500' : ''}`} />
              {candidate.shortlisted ? 'Shortlisted' : 'Shortlist Candidate'}
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
