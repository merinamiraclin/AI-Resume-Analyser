import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Briefcase, 
  Award, 
  CheckCircle2, 
  Layers, 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock 
} from 'lucide-react';
import { JobPosting, RequiredSkillCard, SkillLevel, SkillImportance } from '../../types';

interface JobCreationFormProps {
  onCreateJob: (newJob: JobPosting) => void;
  onCancel?: () => void;
}

export const JobCreationForm: React.FC<JobCreationFormProps> = ({ onCreateJob, onCancel }) => {
  const [title, setTitle] = useState('Data Analyst');
  const [department, setDepartment] = useState('Data Intelligence & Analytics');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [experienceRequiredYears, setExperienceRequiredYears] = useState<number>(3);
  const [salaryRange, setSalaryRange] = useState('$115,000 - $145,000');
  const [description, setDescription] = useState(
    'Seeking a skilled Data Analyst to extract, model, and visualize data across enterprise databases and BI tools. Responsible for writing complex SQL queries, building automated Python pipelines, creating Power BI dashboards, advanced Excel modeling, and statistical analysis to drive business growth.'
  );

  // Required skills initialized with the user's exact specification
  const [requiredSkills, setRequiredSkills] = useState<RequiredSkillCard[]>([
    { id: 'sk-1', skillName: 'SQL', requiredLevel: 'Advanced', importance: 'High' },
    { id: 'sk-2', skillName: 'Python', requiredLevel: 'Intermediate', importance: 'High' },
    { id: 'sk-3', skillName: 'Power BI', requiredLevel: 'Intermediate', importance: 'High' },
    { id: 'sk-4', skillName: 'Excel', requiredLevel: 'Intermediate', importance: 'Medium' },
    { id: 'sk-5', skillName: 'Statistics', requiredLevel: 'Basic', importance: 'Medium' },
  ]);

  // Temporary skill input row
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [newSkillImportance, setNewSkillImportance] = useState<SkillImportance>('High');

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setRequiredSkills([
      ...requiredSkills,
      {
        id: `rs-${Date.now()}-${requiredSkills.length}`,
        skillName: newSkillName.trim(),
        requiredLevel: newSkillLevel,
        importance: newSkillImportance,
      },
    ]);
    setNewSkillName('');
    setNewSkillLevel('Intermediate');
    setNewSkillImportance('High');
  };

  const handleRemoveSkill = (id: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s.id !== id));
  };

  const handleUpdateSkill = (id: string, field: 'skillName' | 'requiredLevel' | 'importance', value: any) => {
    setRequiredSkills(
      requiredSkills.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleLoadUserExample = () => {
    setTitle('Data Analyst');
    setDepartment('Data Intelligence & Analytics');
    setDescription(
      'Seeking a skilled Data Analyst to extract, model, and visualize data across enterprise databases and BI tools. Responsible for writing complex SQL queries, building automated Python pipelines, creating Power BI dashboards, advanced Excel modeling, and statistical analysis to drive business growth.'
    );
    setRequiredSkills([
      { id: 'sk-ex-1', skillName: 'SQL', requiredLevel: 'Advanced', importance: 'High' },
      { id: 'sk-ex-2', skillName: 'Python', requiredLevel: 'Intermediate', importance: 'High' },
      { id: 'sk-ex-3', skillName: 'Power BI', requiredLevel: 'Intermediate', importance: 'High' },
      { id: 'sk-ex-4', skillName: 'Excel', requiredLevel: 'Intermediate', importance: 'Medium' },
      { id: 'sk-ex-5', skillName: 'Statistics', requiredLevel: 'Basic', importance: 'Medium' },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newJob: JobPosting = {
      id: `job-${Date.now()}`,
      title: title.trim(),
      department: department.trim() || 'Data Intelligence',
      location: location.trim() || 'Remote',
      type: 'Full-time',
      experienceRequiredYears: Number(experienceRequiredYears) || 2,
      salaryRange: salaryRange.trim() || '$110,000 - $140,000',
      description: description.trim() || `Position for ${title}`,
      requiredSkills: requiredSkills.length > 0 ? requiredSkills : [
        { id: 'default-1', skillName: 'SQL', requiredLevel: 'Advanced', importance: 'High' },
        { id: 'default-2', skillName: 'Python', requiredLevel: 'Intermediate', importance: 'High' }
      ],
      createdAt: new Date().toISOString().split('T')[0],
      active: true,
      totalApplicants: 0,
    };

    onCreateJob(newJob);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Form Header */}
      <div className="p-6 border-b border-slate-200 bg-linear-to-r from-indigo-50/70 via-white to-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Job Creation Studio
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Define Job & Required Skills</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Every required skill will be empirically evaluated against incoming candidate evidence (projects, certifications, code repos, experience).
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadUserExample}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          ⚡ Load Example: Data Analyst
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Job Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Data Analyst"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Department
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Data Intelligence & Analytics"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            />
          </div>

          {/* Experience Required */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Experience Required (Years)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="number"
                min={0}
                max={25}
                value={experienceRequiredYears}
                onChange={(e) => setExperienceRequiredYears(Number(e.target.value))}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Salary Range
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                placeholder="e.g. $115,000 - $145,000"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            Job Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe core responsibilities, day-to-day deliverables, and role expectations..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white leading-relaxed"
          />
        </div>

        {/* Required Skills Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                Required Skills & Proficiency Weights ({requiredSkills.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Specify the required proficiency level (Basic, Intermediate, Advanced, Expert) and ranking importance.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Deterministic Weights: Critical (1.5x), High (1.2x), Medium (1.0x), Low (0.7x)
            </span>
          </div>

          {/* Current Skills Table / List */}
          <div className="space-y-2.5">
            {requiredSkills.map((skill, idx) => (
              <div
                key={skill.id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-200 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
                  {idx + 1}
                </div>

                <div className="flex-1 min-w-[140px]">
                  <input
                    type="text"
                    value={skill.skillName}
                    onChange={(e) => handleUpdateSkill(skill.id, 'skillName', e.target.value)}
                    placeholder="Skill Name"
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Level selector */}
                <div className="w-full sm:w-40">
                  <select
                    value={skill.requiredLevel}
                    onChange={(e) => handleUpdateSkill(skill.id, 'requiredLevel', e.target.value as SkillLevel)}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Basic">Basic</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                {/* Importance selector */}
                <div className="w-full sm:w-36">
                  <select
                    value={skill.importance}
                    onChange={(e) => handleUpdateSkill(skill.id, 'importance', e.target.value as SkillImportance)}
                    className={`w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border focus:outline-none ${
                      skill.importance === 'Critical'
                        ? 'bg-rose-50 border-rose-200 text-rose-700'
                        : skill.importance === 'High'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : skill.importance === 'Medium'
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="Critical">Critical (1.5x)</option>
                    <option value="High">High (1.2x)</option>
                    <option value="Medium">Medium (1.0x)</option>
                    <option value="Low">Low (0.7x)</option>
                    <option value="Nice-to-have">Nice-to-have (0.6x)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.id)}
                  title="Remove Skill"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Skill Input Row */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add another skill (e.g. Tableau, Snowflake, dbt)..."
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:outline-none"
            >
              <option value="Basic">Basic</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <select
              value={newSkillImportance}
              onChange={(e) => setNewSkillImportance(e.target.value as SkillImportance)}
              className="px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-white focus:outline-none"
            >
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Nice-to-have">Nice-to-have</option>
            </select>

            <button
              type="button"
              onClick={handleAddSkill}
              className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Publish Job & Evaluate Talent Pool
          </button>
        </div>
      </form>
    </div>
  );
};
