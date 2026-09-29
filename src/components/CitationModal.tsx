'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText, Bookmark } from 'lucide-react';
import { BIBTEX_CITATION, RESEARCH_METADATA } from '@/data/researchData';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BIBTEX_CITATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBib = () => {
    const blob = new Blob([BIBTEX_CITATION], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'slm_quantization_hallucination_2026.bib';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border-slate-700 shadow-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Cite This Research Proposal
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Standard BibTeX &amp; APA Citation Format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BibTeX Code Snippet */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>BibTeX Reference:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadBib}
                className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.bib</span>
              </button>
            </div>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-60">
            <code>{BIBTEX_CITATION}</code>
          </pre>
        </div>

        {/* APA Text format */}
        <div className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 font-sans">
          <span className="text-[10px] uppercase font-mono font-semibold text-slate-400 block mb-1">
            APA Style:
          </span>
          <p className="leading-relaxed">
            Project Team &amp; Safe AI Lab. (2026). <em>Evaluating Quantization-Induced Factual Hallucinations in Lightweight Small Language Models (SLMs)</em>. Cognitive Systems &amp; Safe AI Laboratory.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-2 shadow-lg shadow-cyan-400/20 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-950" />
                <span>Copy BibTeX</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
