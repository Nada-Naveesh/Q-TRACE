'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AbstractProblemSection } from '@/components/AbstractProblemSection';
import { SimulatorWidget } from '@/components/SimulatorWidget';
import { MethodologyPipeline } from '@/components/MethodologyPipeline';
import { BenchmarkSection } from '@/components/BenchmarkSection';
import { RoadmapOutcomes } from '@/components/RoadmapOutcomes';
import { TechStackSection } from '@/components/TechStackSection';
import { CitationModal } from '@/components/CitationModal';
import { ProposalSummaryModal } from '@/components/ProposalSummaryModal';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [citationModalOpen, setCitationModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F3F4F6] bg-grid-pattern relative">
      {/* Top Navbar */}
      <Navbar
        onOpenCitation={() => setCitationModalOpen(true)}
        onOpenProposal={() => setProposalModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* 1. Header / Hero Section */}
        <HeroSection
          onExploreSimulator={() => scrollToSection('simulator')}
          onViewArchitecture={() => scrollToSection('pipeline')}
          onReadAbstract={() => scrollToSection('abstract')}
        />

        {/* 2. Abstract & Problem Statement Section */}
        <AbstractProblemSection />

        {/* 3. Interactive Quantization vs. Hallucination Simulator */}
        <SimulatorWidget />

        {/* 4. Methodology Pipeline & Step-by-Step Flowchart */}
        <MethodologyPipeline />

        {/* 5. Interactive Benchmark Table & Pareto Trade-Off Chart */}
        <BenchmarkSection />

        {/* 6. Expected Outcomes & Research Roadmap */}
        <RoadmapOutcomes />

        {/* 7. Tech Stack & Environment Architecture */}
        <TechStackSection />
      </main>

      {/* Modals */}
      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
      />

      <ProposalSummaryModal
        isOpen={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
