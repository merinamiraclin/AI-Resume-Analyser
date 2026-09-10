import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  FileText, 
  Search, 
  BarChart3, 
  Cpu, 
  ExternalLink, 
  Users, 
  GraduationCap, 
  FolderGit2, 
  Award,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onGoCandidate: () => void;
  onGoHr: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoCandidate, onGoHr }) => {
  const [activeDemoTab, setActiveDemoTab] = useState<'verified' | 'unverified' | 'partial'>('verified');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200/80 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Next-Generation Evidence-Based Hiring & Verification</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            From Resume Claims to <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
              Empirically Verified Skills.
            </span>
          </h1>

          <p className="mt-5 text-xl sm:text-2xl font-medium text-indigo-900/80 italic">
            "Don't just claim a skill. Prove it."
          </p>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Traditional resume parsers reward keyword stuffing and blind ATS algorithms. 
            ProofCV connects <strong className="font-semibold text-slate-800">Claims → Evidence → Verification → Job Fit</strong> with deterministic mathematical scoring.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={onGoCandidate}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Analyze Resume as Candidate</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoHr}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold border border-slate-300 shadow-xs hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <span>Explore HR Hiring Suite</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </button>
          </div>

          {/* Interactive Evidence Pipeline Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden text-left">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>PROOF_ENGINE_PIPELINE // DEMO RUN</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">DETERMINISTIC WEIGHTING: 100%</span>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
                {/* Step 1 */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">1. Resume Claim</div>
                  <div className="font-bold text-slate-800 text-sm">Python (Advanced)</div>
                  <p className="text-[11px] text-slate-500 mt-1">Listed under Technical Skills header</p>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">2. Evidence Trace</div>
                  <div className="font-semibold text-indigo-950 text-xs">2 Repos + 1 Cert</div>
                  <p className="text-[11px] text-indigo-800 mt-1">Found GitHub Streamlit repo & AWS Data Analytics cert</p>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">3. Verification</div>
                  <div className="font-semibold text-emerald-950 text-xs">Level: Advanced</div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>90% Strength</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 bg-violet-50/70 border border-violet-200 rounded-xl">
                  <div className="text-[11px] font-bold text-violet-600 uppercase tracking-wider mb-1">4. Deterministic Fit</div>
                  <div className="font-semibold text-violet-950 text-xs">30% Job Weight</div>
                  <p className="text-[11px] text-violet-800 mt-1">Calculated via mathematical scoring formula</p>
                </div>

                {/* Step 5 */}
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">5. Verified Decision</div>
                  <div className="font-bold text-blue-900 text-sm">Shortlist (92/100)</div>
                  <p className="text-[11px] text-blue-700 mt-1">Evidence-backed hiring with confidence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            The Industry Challenge
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            The Resume Inflation Crisis
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            Why traditional ATS filters and standard AI resume scanners fail both recruiters and qualified candidates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Unverified Buzzword Stuffing</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Anyone can list "Kubernetes, PyTorch, BigQuery" on their resume without ever deploying a container or writing an ETL script. Traditional scanners award full marks for mere mentions.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">AI Fluff & Boilerplate Overload</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Large language models allow anyone to generate hundreds of tailored, generic resumes in seconds. Recruiters are overwhelmed with identical prose lacking verified project backing.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Randomized Black-Box Scores</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Typical AI resume tools prompt a model to randomly hallucinate an arbitrary "ATS Score 84%" with zero transparent mathematical formulation or proof breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE SOLUTION & CORE IDEA */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              The ProofCV Framework
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
              Resume Claims → Skills → Evidence → Verification → Job Fit
            </h2>
            <p className="text-slate-600 mt-2 text-base">
              Every score in ProofCV is anchored in verifiable empirical proof.
            </p>
          </div>

          {/* Verification Formula & Weights Table */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
            <h3 className="font-bold text-slate-800 text-lg mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              Deterministic Scoring Engine Weights (Total = 100%)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              AI provides qualitative extraction and deep artifact analysis, while strict mathematical formulas compute scores. No arbitrary hallucinated numbers.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">30%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Job Fit Score</span>
                <span className="text-[11px] text-slate-500">Required skills match</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">25%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Verified Skills</span>
                <span className="text-[11px] text-slate-500">Proved by artifacts</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">15%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Experience</span>
                <span className="text-[11px] text-slate-500">Years vs target role</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">10%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Projects</span>
                <span className="text-[11px] text-slate-500">Code repositories & impact</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">5%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Education</span>
                <span className="text-[11px] text-slate-500">Degree relevance</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">5%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Certifications</span>
                <span className="text-[11px] text-slate-500">Credential validation</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">5%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Resume Quality</span>
                <span className="text-[11px] text-slate-500">Clarity & metrics</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
                <span className="text-2xl font-extrabold text-indigo-600">5%</span>
                <span className="block text-xs font-bold text-slate-800 mt-1">Evidence Strength</span>
                <span className="text-[11px] text-slate-500">Proof depth across claims</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Workflow
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            How ProofCV Verifies Talent
          </h2>
          <p className="text-slate-600 mt-2 text-base">
            From raw document ingestion to evidence verification in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
              01
            </div>
            <h4 className="font-bold text-slate-800 text-base">Upload Document</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Upload PDF, DOCX, or paste text. ProofCV extracts 12 distinct dimensions including GitHub, portfolio, projects, and work history.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
              02
            </div>
            <h4 className="font-bold text-slate-800 text-base">Evidence Extraction</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              AI maps every claimed skill to 8 distinct evidence types: Internships, Projects, Certifications, Repos, Portfolios, Assessments, or Work History.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
              03
            </div>
            <h4 className="font-bold text-slate-800 text-base">Verification Matrix</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Compare Claimed Level vs Estimated Level. Missing evidence flags a helpful "Needs manual review" note without making unfair accusations.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mb-3">
              04
            </div>
            <h4 className="font-bold text-slate-800 text-base">Actionable Decision</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Candidates receive targeted learning projects to bridge gaps; HR teams receive ranked shortlists with side-by-side verification comparisons.
            </p>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE EVIDENCE SHOWCASE */}
      <section className="py-16 bg-slate-100/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Interactive Evidence Showcase
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Experience how ProofCV transparently handles various levels of proof.
            </p>

            <div className="flex items-center justify-center gap-2 mt-5">
              <button
                onClick={() => setActiveDemoTab('verified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'verified' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                1. High Evidence (Verified)
              </button>
              <button
                onClick={() => setActiveDemoTab('partial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'partial' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                2. Mixed Evidence (Partial)
              </button>
              <button
                onClick={() => setActiveDemoTab('unverified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeDemoTab === 'unverified' 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                3. Insufficient Evidence
              </button>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            {activeDemoTab === 'verified' && (
              <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Example: Python</span>
                    <h4 className="text-lg font-bold text-slate-900">Claimed: Advanced • Estimated: Advanced</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified (90%)
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">Evidence Found:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>GitHub Repo:</strong> OpenFin A/B Testing Evaluator (380 stars, automated test suite)</li>
                    <li><strong>Work Experience:</strong> 2.5 yrs writing production Snowflake + Python pipelines at LendVantage</li>
                    <li><strong>Certification:</strong> AWS Certified Data Analytics - Specialty</li>
                  </ul>
                </div>
              </div>
            )}

            {activeDemoTab === 'partial' && (
              <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Example: Statistical Modeling</span>
                    <h4 className="text-lg font-bold text-slate-900">Claimed: Advanced • Estimated: Intermediate</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Partially Verified (72%)
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">Evidence Found:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Coursework:</strong> UC Berkeley B.S. in Applied Mathematics & Statistics</li>
                    <li><strong>Work Model:</strong> Assisted senior data scientist on logistic regression scoring</li>
                    <li><strong className="text-blue-700">Verification Note:</strong> Claimed Advanced, but independent MLOps architecture was unevidenced. Re-rated to solid Intermediate.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeDemoTab === 'unverified' && (
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Example: Apache Spark & BigQuery</span>
                    <h4 className="text-lg font-bold text-slate-900">Claimed: Advanced • Estimated: Insufficient Evidence</h4>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Needs Verification (25%)
                  </span>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-semibold">Insufficient evidence — manual verification recommended.</p>
                  <p className="text-[11px] text-amber-800">
                    Candidate listed Spark in technical skills, but no repos, project deliverables, or work milestones mention cluster configurations or job scripts. ProofCV flags this for human interviewer inquiry instead of blindly rejecting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. BENEFITS FOR BOTH SIDES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Candidate Benefits */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4">
              <Users className="w-4 h-4" />
              For Candidates & Job Seekers
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Stand Out With Verifiable Craft
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No more getting lost in blind ATS filters:</strong> Your actual GitHub repos, projects, and certificates are evaluated directly.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Actionable Skill Gap Roadmap:</strong> Discover exact proof projects and timelines to turn unverified claims into hiring magnets.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Alternative Job Path Matches:</strong> See 2+ alternative career roles where your current evidence already matches 85%+ of requirements.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Constructive AI Content Review:</strong> Safe check to ensure your resume doesn't sound like generic robotic filler.</span>
              </li>
            </ul>
            <button
              onClick={onGoCandidate}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch Candidate Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* HR Benefits */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-4">
              <Users className="w-4 h-4" />
              For Hiring Teams & Recruiters
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Hire Proven Talent, Not Inflated Buzzwords
            </h3>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Deterministic Candidate Ranking:</strong> Ranked by empirical evidence and required skill cards, not subjective keyword counts.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Side-by-Side Comparison:</strong> Compare up to 4 candidates matrix-style across verified skills, projects, and evidence strength.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Evidence Strength Filters:</strong> Filter applicants by minimum verified skill levels, required certifications, and years of experience.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Built-in Shortlist Pipeline & Notes:</strong> Track status from Under Review to Interview Scheduled with collaborative recruiter notes.</span>
              </li>
            </ul>
            <button
              onClick={onGoHr}
              className="mt-6 w-full py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Launch HR Hiring Suite</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-16 text-center max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-10 sm:p-14 rounded-3xl shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Prove Your Skills or Hire Verified Talent?
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Try the hackathon demo now with pre-loaded realistic candidates or upload your own resume.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onGoCandidate}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Upload Candidate Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoHr}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Open HR Ranked Candidates</span>
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
