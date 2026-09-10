import React from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Building2, 
  Sparkles, 
  RotateCcw, 
  Compass, 
  ExternalLink,
  Cpu
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'candidate' | 'hr';
  onSelectTab: (tab: 'landing' | 'candidate' | 'hr') => void;
  onResetDemo: () => void;
  candidateCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onResetDemo,
  candidateCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Proof<span className="text-indigo-600">CV</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  AI Evidence Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Don't just claim a skill. Prove it.
              </p>
            </div>
          </div>

          {/* User Type & View Switcher */}
          <nav className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onSelectTab('landing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'landing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Platform</span>
            </button>

            <button
              onClick={() => onSelectTab('candidate')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'candidate'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidate Hub</span>
            </button>

            <button
              onClick={() => onSelectTab('hr')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'hr'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>HR / Hiring</span>
              <span className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                currentTab === 'hr' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {candidateCount}
              </span>
            </button>
          </nav>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium">
              <Cpu className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Gemini 3.8 Flash Engine</span>
            </div>

            <button
              onClick={onResetDemo}
              title="Reset sample candidate and job data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1 text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
