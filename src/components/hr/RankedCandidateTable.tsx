import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Layers, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpDown, 
  RotateCcw, 
  ChevronDown, 
  Award, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  CandidateRecord, 
  JobPosting, 
  HiringStatus, 
  SkillLevel 
} from '../../types';

interface RankedCandidateTableProps {
  candidates: CandidateRecord[];
  activeJob: JobPosting;
  onSelectCandidateProfile: (candidate: CandidateRecord) => void;
  onToggleShortlist: (candidateId: string) => void;
  onUpdateStatus: (candidateId: string, status: HiringStatus) => void;
  onAddNote: (candidateId: string, noteText: string) => void;
  onCompareCandidates: (candidates: CandidateRecord[]) => void;
  onOpenBatchUpload: () => void;
}

export const RankedCandidateTable: React.FC<RankedCandidateTableProps> = ({
  candidates,
  activeJob,
  onSelectCandidateProfile,
  onToggleShortlist,
  onUpdateStatus,
  onAddNote,
  onCompareCandidates,
  onOpenBatchUpload,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>('all');
  const [minJobFit, setMinJobFit] = useState<number>(0);
  const [minEvidenceStrength, setMinEvidenceStrength] = useState<number>(0);
  const [minExperienceYears, setMinExperienceYears] = useState<number>(0);
  const [certificationFilter, setCertificationFilter] = useState<string>('all'); // 'all' | 'certified'
  const [educationFilter, setEducationFilter] = useState<string>('all'); // 'all' | 'bachelors' | 'masters' | 'phd'
  const [shortlistedOnly, setShortlistedOnly] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Sorting
  const [sortField, setSortField] = useState<'overall' | 'jobFit' | 'verifiedSkills' | 'evidenceStrength' | 'experience'>('overall');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Candidate Selection for Compare Matrix
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

  // Quick Note Popover
  const [quickNoteCandidateId, setQuickNoteCandidateId] = useState<string | null>(null);
  const [quickNoteText, setQuickNoteText] = useState('');

  // Extract all unique skills available across all candidates & job
  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    activeJob.requiredSkills.forEach((s) => set.add(s.skillName));
    candidates.forEach((c) => {
      c.analysis.skillVerifications.forEach((sv) => set.add(sv.skillName));
      c.candidateProfile.allExtractedSkills?.forEach((s) => set.add(s));
    });
    return Array.from(set).sort();
  }, [candidates, activeJob]);

  // Handle Candidate Selection for Compare (2 or 3 candidates)
  const toggleSelectCandidate = (id: string) => {
    if (selectedCandidateIds.includes(id)) {
      setSelectedCandidateIds(selectedCandidateIds.filter((cid) => cid !== id));
    } else {
      if (selectedCandidateIds.length >= 3) {
        alert('You can select 2 or 3 candidates for side-by-side comparison. Please uncheck one to choose another.');
        return;
      }
      setSelectedCandidateIds([...selectedCandidateIds, id]);
    }
  };

  const handleLaunchCompare = () => {
    const selected = candidates.filter((c) => selectedCandidateIds.includes(c.id));
    if (selected.length < 2) {
      alert('Please select 2 or 3 candidates to compare side-by-side.');
      return;
    }
    onCompareCandidates(selected);
  };

  const handleQuickCompareTop2 = () => {
    const top2 = filteredAndRankedCandidates.slice(0, 2);
    if (top2.length < 2) {
      alert('At least 2 candidates are required to compare.');
      return;
    }
    setSelectedCandidateIds(top2.map((c) => c.id));
    onCompareCandidates(top2);
  };

  const handleQuickCompareTop3 = () => {
    const top3 = filteredAndRankedCandidates.slice(0, 3);
    if (top3.length < 2) {
      alert('At least 2 candidates are required to compare.');
      return;
    }
    setSelectedCandidateIds(top3.map((c) => c.id));
    onCompareCandidates(top3);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkill('all');
    setSelectedSkillLevel('all');
    setMinJobFit(0);
    setMinEvidenceStrength(0);
    setMinExperienceYears(0);
    setCertificationFilter('all');
    setEducationFilter('all');
    setShortlistedOnly(false);
  };

  // Skill level hierarchy rank helper
  const getLevelWeight = (lvl?: string): number => {
    if (!lvl) return 0;
    const l = lvl.toLowerCase();
    if (l.includes('expert')) return 5;
    if (l.includes('advanced')) return 4;
    if (l.includes('intermediate')) return 3;
    if (l.includes('beginner') || l.includes('basic')) return 2;
    return 1;
  };

  // Filter and sort candidates
  const filteredAndRankedCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        const profile = c.candidateProfile;
        const analysis = c.analysis;
        const scores = analysis.scores;

        // Search Query (name, title, skills, summary)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = profile.name.toLowerCase().includes(q);
          const matchesTitle = profile.title.toLowerCase().includes(q);
          const matchesSkills = profile.allExtractedSkills?.some((s) => s.toLowerCase().includes(q)) || false;
          if (!matchesName && !matchesTitle && !matchesSkills) {
            return false;
          }
        }

        // Shortlisted Only
        if (shortlistedOnly && !c.shortlisted) {
          return false;
        }

        // Job Fit minimum threshold
        if (minJobFit > 0 && scores.jobFitScore < minJobFit) {
          return false;
        }

        // Evidence Strength minimum threshold
        if (minEvidenceStrength > 0 && scores.evidenceStrengthScore < minEvidenceStrength) {
          return false;
        }

        // Experience minimum years
        const totalExpYears = profile.experience.reduce((acc, e) => acc + (e.years || 1), 0);
        if (minExperienceYears > 0 && totalExpYears < minExperienceYears) {
          return false;
        }

        // Certification filter
        if (certificationFilter === 'certified') {
          if (!profile.certifications || profile.certifications.length === 0) {
            return false;
          }
        }

        // Education filter
        if (educationFilter !== 'all') {
          const hasEdu = profile.education.some((edu) => {
            const deg = (edu.degree || '').toLowerCase();
            if (educationFilter === 'phd') return deg.includes('ph.d') || deg.includes('doctor');
            if (educationFilter === 'masters') return deg.includes('master') || deg.includes('m.s') || deg.includes('mba') || deg.includes('ph.d');
            if (educationFilter === 'bachelors') return deg.includes('bachelor') || deg.includes('b.s') || deg.includes('b.a') || deg.includes('master') || deg.includes('m.s');
            return true;
          });
          if (!hasEdu) return false;
        }

        // Skill & Skill Level Filter
        if (selectedSkill !== 'all') {
          const targetVerification = analysis.skillVerifications.find(
            (v) => v.skillName.toLowerCase() === selectedSkill.toLowerCase()
          );
          const hasInExtracted = profile.allExtractedSkills?.some(
            (s) => s.toLowerCase() === selectedSkill.toLowerCase()
          );

          if (!targetVerification && !hasInExtracted) {
            return false;
          }

          if (selectedSkillLevel !== 'all' && targetVerification) {
            const reqWeight = getLevelWeight(selectedSkillLevel);
            const candWeight = Math.max(
              getLevelWeight(targetVerification.estimatedLevel),
              getLevelWeight(targetVerification.claimedLevel)
            );
            if (candWeight < reqWeight) {
              return false;
            }
          }
        } else if (selectedSkillLevel !== 'all') {
          // No specific skill selected, check if candidate has any skill at this level
          const reqWeight = getLevelWeight(selectedSkillLevel);
          const hasLevel = analysis.skillVerifications.some(
            (v) => Math.max(getLevelWeight(v.estimatedLevel), getLevelWeight(v.claimedLevel)) >= reqWeight
          );
          if (!hasLevel) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;

        if (sortField === 'overall') {
          valA = a.analysis.scores.overallScore;
          valB = b.analysis.scores.overallScore;
        } else if (sortField === 'jobFit') {
          valA = a.analysis.scores.jobFitScore;
          valB = b.analysis.scores.jobFitScore;
        } else if (sortField === 'verifiedSkills') {
          valA = a.analysis.scores.verifiedSkillsScore;
          valB = b.analysis.scores.verifiedSkillsScore;
        } else if (sortField === 'evidenceStrength') {
          valA = a.analysis.scores.evidenceStrengthScore;
          valB = b.analysis.scores.evidenceStrengthScore;
        } else if (sortField === 'experience') {
          valA = a.candidateProfile.experience.reduce((acc, e) => acc + (e.years || 1), 0);
          valB = b.candidateProfile.experience.reduce((acc, e) => acc + (e.years || 1), 0);
        }

        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [
    candidates,
    searchQuery,
    selectedSkill,
    selectedSkillLevel,
    minJobFit,
    minEvidenceStrength,
    minExperienceYears,
    certificationFilter,
    educationFilter,
    shortlistedOnly,
    sortField,
    sortOrder,
  ]);

  const activeFilterCount = [
    searchQuery.trim() !== '',
    selectedSkill !== 'all',
    selectedSkillLevel !== 'all',
    minJobFit > 0,
    minEvidenceStrength > 0,
    minExperienceYears > 0,
    certificationFilter !== 'all',
    educationFilter !== 'all',
    shortlistedOnly,
  ].filter(Boolean).length;

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteCandidateId || !quickNoteText.trim()) return;
    onAddNote(quickNoteCandidateId, quickNoteText.trim());
    setQuickNoteText('');
    setQuickNoteCandidateId(null);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Quick Filters & Actions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search across ${candidates.length} candidates by name, title, or skills...`}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50/50 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Toggles & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Shortlisted Only Toggle */}
            <button
              onClick={() => setShortlistedOnly(!shortlistedOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                shortlistedOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${shortlistedOnly ? 'fill-white' : ''}`} />
              Shortlisted ({candidates.filter((c) => c.shortlisted).length})
            </button>

            {/* Toggle Advanced Filters Drawer */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                showAdvancedFilters || activeFilterCount > 0
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors flex items-center gap-1"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}

            {/* Quick Top 2 / Top 3 Compare Buttons */}
            {filteredAndRankedCandidates.length >= 2 && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={handleQuickCompareTop2}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white transition-all flex items-center gap-1"
                  title="Compare Top 2 Ranked Candidates"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Top 2
                </button>
                {filteredAndRankedCandidates.length >= 3 && (
                  <button
                    type="button"
                    onClick={handleQuickCompareTop3}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white transition-all flex items-center gap-1"
                    title="Compare Top 3 Ranked Candidates"
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Top 3
                  </button>
                )}
              </div>
            )}

            {/* Bulk Upload Button */}
            <button
              onClick={onOpenBatchUpload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload Resumes
            </button>
          </div>
        </div>

        {/* Dedicated Interactive Filter Bar: Skill, Skill Level, Job Fit, Evidence Strength, Experience, Certification, Education */}
        <div className={`pt-3 border-t border-slate-100 ${showAdvancedFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* 1. Skill Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Skill
              </label>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Skills</option>
                <optgroup label="Target Job Skills">
                  {activeJob.requiredSkills.map((s) => (
                    <option key={s.id} value={s.skillName}>
                      {s.skillName} (Required)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other Extracted Skills">
                  {availableSkills
                    .filter((s) => !activeJob.requiredSkills.some((rs) => rs.skillName.toLowerCase() === s.toLowerCase()))
                    .map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            {/* 2. Skill Level Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Skill Level
              </label>
              <select
                value={selectedSkillLevel}
                onChange={(e) => setSelectedSkillLevel(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Levels</option>
                <option value="Basic">Basic+</option>
                <option value="Intermediate">Intermediate+</option>
                <option value="Advanced">Advanced+</option>
                <option value="Expert">Expert Only</option>
              </select>
            </div>

            {/* 3. Job Fit Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Job Fit
              </label>
              <select
                value={minJobFit}
                onChange={(e) => setMinJobFit(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={0}>Any Fit %</option>
                <option value={60}>≥ 60% Match</option>
                <option value={75}>≥ 75% Strong</option>
                <option value={85}>≥ 85% Top Fit</option>
                <option value={90}>≥ 90% Elite Fit</option>
              </select>
            </div>

            {/* 4. Evidence Strength Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Evidence Strength
              </label>
              <select
                value={minEvidenceStrength}
                onChange={(e) => setMinEvidenceStrength(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={0}>Any Strength</option>
                <option value={50}>≥ 50% Verified</option>
                <option value={70}>≥ 70% Strong Proof</option>
                <option value={80}>≥ 80% Rigorous</option>
                <option value={90}>≥ 90% Comprehensive</option>
              </select>
            </div>

            {/* 5. Experience Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Experience
              </label>
              <select
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value={0}>All Experience</option>
                <option value={1}>1+ Years</option>
                <option value={2}>2+ Years</option>
                <option value={3}>3+ Years</option>
                <option value={5}>5+ Years</option>
              </select>
            </div>

            {/* 6. Certification Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Certification
              </label>
              <select
                value={certificationFilter}
                onChange={(e) => setCertificationFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Candidates</option>
                <option value="certified">Has Verified Certifications</option>
              </select>
            </div>

            {/* 7. Education Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Education
              </label>
              <select
                value={educationFilter}
                onChange={(e) => setEducationFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="all">All Degrees</option>
                <option value="bachelors">Bachelor&apos;s or higher</option>
                <option value="masters">Master&apos;s or higher</option>
                <option value="phd">Ph.D. / Doctorate</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header Info */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-900 font-bold">{filteredAndRankedCandidates.length}</strong> of{' '}
          {candidates.length} candidates ranked against{' '}
          <strong className="text-indigo-600 font-bold">{activeJob.title}</strong>
        </div>

        {selectedCandidateIds.length > 0 && (
          <div className="text-indigo-600 font-bold">
            {selectedCandidateIds.length} candidates selected for comparison
          </div>
        )}
      </div>

      {/* Main Ranked Candidate Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                {/* Compare Checkbox Column */}
                <th className="py-3.5 pl-4 pr-2 w-10 text-center">
                  <span className="sr-only">Compare</span>
                </th>

                {/* Rank */}
                <th className="py-3.5 px-3 w-16 text-center">
                  Rank
                </th>

                {/* Candidate */}
                <th className="py-3.5 px-4 min-w-[220px]">
                  Candidate
                </th>

                {/* Overall Score */}
                <th 
                  onClick={() => handleSort('overall')}
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Overall Score
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Job Fit */}
                <th 
                  onClick={() => handleSort('jobFit')}
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Job Fit
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Verified Skills */}
                <th 
                  onClick={() => handleSort('verifiedSkills')}
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Verified Skills
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Evidence Strength */}
                <th 
                  onClick={() => handleSort('evidenceStrength')}
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Evidence Strength
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Experience */}
                <th 
                  onClick={() => handleSort('experience')}
                  className="py-3.5 px-3 cursor-pointer hover:text-indigo-600 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    Experience
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>

                {/* Status */}
                <th className="py-3.5 px-3 min-w-[150px]">
                  Status
                </th>

                {/* Actions */}
                <th className="py-3.5 pr-4 pl-2 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAndRankedCandidates.length > 0 ? (
                filteredAndRankedCandidates.map((candidate, idx) => {
                  const rank = idx + 1;
                  const profile = candidate.candidateProfile;
                  const scores = candidate.analysis.scores;
                  const totalExpYears = profile.experience.reduce((acc, e) => acc + (e.years || 1), 0);
                  const isSelected = selectedCandidateIds.includes(candidate.id);

                  // Verified skills count
                  const verifiedSkillsCount = candidate.analysis.skillVerifications.filter(
                    (v) => v.verificationStatus === 'Verified' || v.verificationStatus === 'Partially Verified'
                  ).length;
                  const totalSkillsCount = candidate.analysis.skillVerifications.length;

                  return (
                    <tr
                      key={candidate.id}
                      className={`hover:bg-indigo-50/30 transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      {/* Compare Checkbox */}
                      <td className="py-3.5 pl-4 pr-2 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectCandidate(candidate.id)}
                          title="Select to compare"
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* Rank Badge */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center">
                          {rank === 1 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
                              🥇 1
                            </span>
                          ) : rank === 2 ? (
                            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-xs flex items-center justify-center shadow-xs">
                              🥈 2
                            </span>
                          ) : rank === 3 ? (
                            <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs flex items-center justify-center shadow-xs">
                              🥉 3
                            </span>
                          ) : (
                            <span className="font-bold text-slate-500 text-xs">
                              #{rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {/* Shortlist star */}
                          <button
                            type="button"
                            onClick={() => onToggleShortlist(candidate.id)}
                            className={`p-1 rounded-md transition-colors ${
                              candidate.shortlisted
                                ? 'text-amber-500 hover:text-amber-600'
                                : 'text-slate-300 hover:text-amber-400'
                            }`}
                            title={candidate.shortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                          >
                            <Star className={`w-4 h-4 ${candidate.shortlisted ? 'fill-amber-400' : ''}`} />
                          </button>

                          {/* Avatar Initials */}
                          <div 
                            onClick={() => onSelectCandidateProfile(candidate)}
                            className="w-9 h-9 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
                          >
                            {profile.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>

                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => onSelectCandidateProfile(candidate)}
                              className="font-extrabold text-slate-900 hover:text-indigo-600 text-xs text-left truncate block max-w-[200px]"
                            >
                              {profile.name}
                            </button>
                            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                              {profile.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                              {profile.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {scores.overallScore}/100
                        </span>
                      </td>

                      {/* Job Fit */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                            scores.jobFitScore >= 85
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : scores.jobFitScore >= 70
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {scores.jobFitScore}%
                        </span>
                      </td>

                      {/* Verified Skills */}
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="font-extrabold text-slate-800 text-xs">
                            {scores.verifiedSkillsScore}%
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {verifiedSkillsCount} of {totalSkillsCount} verified
                          </span>
                        </div>
                      </td>

                      {/* Evidence Strength */}
                      <td className="py-3.5 px-3">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-extrabold text-slate-700">{scores.evidenceStrengthScore}%</span>
                            <span className="text-[10px] text-slate-400">
                              {scores.evidenceStrengthScore >= 75 ? 'Strong' : scores.evidenceStrengthScore >= 50 ? 'Moderate' : 'Low'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                scores.evidenceStrengthScore >= 75
                                  ? 'bg-emerald-500'
                                  : scores.evidenceStrengthScore >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                              style={{ width: `${scores.evidenceStrengthScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="py-3.5 px-3">
                        <div>
                          <span className="font-extrabold text-slate-800 text-xs">
                            {totalExpYears.toFixed(1)} yrs
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                            {profile.experience[0]?.company || 'Prior Roles'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <select
                          value={candidate.hiringStatus}
                          onChange={(e) => onUpdateStatus(candidate.id, e.target.value as HiringStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                            candidate.hiringStatus === 'Shortlisted'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : candidate.hiringStatus === 'Interview Scheduled'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : candidate.hiringStatus === 'Offer Extended' || candidate.hiringStatus === 'Hired'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : candidate.hiringStatus === 'Rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Offer Extended">Offer Extended</option>
                          <option value="Hired">Hired</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-4 pl-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Notes Button */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickNoteCandidateId(
                                  quickNoteCandidateId === candidate.id ? null : candidate.id
                                );
                                setQuickNoteText('');
                              }}
                              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                                candidate.hrNotes && candidate.hrNotes.length > 0
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                              }`}
                              title="Recruiter Notes"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              {candidate.hrNotes && candidate.hrNotes.length > 0 && (
                                <span className="text-[10px] font-extrabold">
                                  {candidate.hrNotes.length}
                                </span>
                              )}
                            </button>

                            {/* Quick Note Popover */}
                            {quickNoteCandidateId === candidate.id && (
                              <div className="absolute right-0 top-full mt-1 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-30 text-left">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-slate-800">
                                    Notes for {profile.name}
                                  </span>
                                  <button
                                    onClick={() => setQuickNoteCandidateId(null)}
                                    className="text-slate-400 hover:text-slate-600 text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>

                                {candidate.hrNotes && candidate.hrNotes.length > 0 && (
                                  <div className="max-h-24 overflow-y-auto space-y-1.5 mb-2 pr-1 divide-y divide-slate-100">
                                    {candidate.hrNotes.map((n) => (
                                      <div key={n.id} className="pt-1 text-[11px] text-slate-600">
                                        <div className="font-bold text-slate-800 text-[10px]">{n.author}</div>
                                        <p>{n.text}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <form onSubmit={handleSaveQuickNote} className="space-y-1.5">
                                  <textarea
                                    rows={2}
                                    value={quickNoteText}
                                    onChange={(e) => setQuickNoteText(e.target.value)}
                                    placeholder="Add recruiter feedback or interview notes..."
                                    className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                  />
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setQuickNoteCandidateId(null)}
                                      className="px-2 py-1 text-[10px] font-semibold text-slate-500"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="submit"
                                      disabled={!quickNoteText.trim()}
                                      className="px-2.5 py-1 text-[10px] font-bold bg-indigo-600 text-white rounded-md disabled:bg-slate-200"
                                    >
                                      Save Note
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}
                          </div>

                          {/* View Profile Button */}
                          <button
                            type="button"
                            onClick={() => onSelectCandidateProfile(candidate)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-lg transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="max-w-sm mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Filter className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">No candidates match active filters</h4>
                      <p className="text-xs text-slate-400">
                        Try resetting or loosening your filter criteria, or upload additional candidate resumes.
                      </p>
                      <button
                        onClick={handleResetFilters}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bottom Comparison Action Bar when candidates are selected (2 or 3 candidates) */}
      {selectedCandidateIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex flex-wrap items-center gap-4 border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
              {selectedCandidateIds.length}
            </span>
            <div className="text-xs">
              <span className="font-bold text-slate-100">
                {selectedCandidateIds.length} of 3 Candidates Selected
              </span>
              {selectedCandidateIds.length === 1 && (
                <span className="text-slate-400 block text-[10px]">
                  Select 1 or 2 more to compare side-by-side
                </span>
              )}
              {selectedCandidateIds.length === 3 && (
                <span className="text-indigo-400 block text-[10px]">
                  Maximum 3 candidates selected for side-by-side view
                </span>
              )}
            </div>
          </div>

          <div className="h-5 w-px bg-slate-700 hidden sm:block" />

          <button
            type="button"
            onClick={handleLaunchCompare}
            disabled={selectedCandidateIds.length < 2}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Layers className="w-4 h-4" />
            {selectedCandidateIds.length >= 2 
              ? `Compare ${selectedCandidateIds.length} Candidates Side-by-Side`
              : 'Select 2 or 3 Candidates'}
          </button>

          <button
            type="button"
            onClick={() => setSelectedCandidateIds([])}
            className="text-xs text-slate-400 hover:text-white transition-colors underline-offset-2 hover:underline"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};
