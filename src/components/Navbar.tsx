'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  BarChart3, 
  FileText, 
  Bookmark, 
  Check, 
  Copy, 
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { RESEARCH_METADATA } from '@/data/researchData';

interface NavbarProps {
  onOpenCitation: () => void;
  onOpenProposal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCitation, onOpenProposal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const navLinks = [
    { label: "Abstract", href: "#abstract", icon: FileText },
    { label: "Simulator", href: "#simulator", icon: Cpu },
    { label: "Pipeline", href: "#pipeline", icon: Layers },
    { label: "Benchmarks", href: "#benchmarks", icon: BarChart3 },
    { label: "Roadmap", href: "#roadmap", icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Research Domain */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/60 transition-colors shadow-sm shadow-cyan-500/10">
                <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-100 tracking-tight group-hover:text-cyan-300 transition-colors">
                    SLM-Hallucination
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/50">
                    Proposal
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Model Compression & AI Safety
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-all"
                >
                  <Icon className="w-3.5 h-3.5 opacity-70" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenCitation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/60 hover:border-slate-600 transition-all"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cite BibTeX</span>
            </button>

            <button
              onClick={onOpenProposal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-cyan-950 bg-gradient-to-r from-cyan-400 to-indigo-300 hover:from-cyan-300 hover:to-indigo-200 transition-all shadow-sm shadow-cyan-500/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Proposal</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0B0F19]/95 px-4 pt-2 pb-4 space-y-2 backdrop-blur-2xl">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-md"
            >
              <span className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-cyan-400" />
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-slate-800/80">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCitation();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium rounded-lg text-slate-200 bg-slate-800/80 border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Cite Proposal (BibTeX)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProposal();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold rounded-lg text-cyan-950 bg-cyan-400"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Full Research Proposal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
