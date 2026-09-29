import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Evaluating Quantization-Induced Factual Hallucinations in SLMs | AI Research Proposal",
  description: "A comprehensive AI research project proposal investigating the Perplexity Paradox and factual hallucinations under 4-bit Post-Training Quantization (AWQ/GPTQ) in lightweight Small Language Models (Llama 3.2 1B & Qwen 2.5 1.5B).",
  keywords: [
    "Small Language Models",
    "Quantization",
    "Hallucination",
    "TruthfulQA",
    "AutoAWQ",
    "AutoGPTQ",
    "AI Safety",
    "Model Compression"
  ],
  authors: [{ name: "AI Research Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0F19] text-[#F3F4F6] selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
