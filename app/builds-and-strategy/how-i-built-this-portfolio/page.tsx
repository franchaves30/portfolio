// This is your new Case Study Detail Page
// File: app/case-studies/how-i-built-this-portfolio/page.tsx
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function CaseStudyPortfolio() {
  return (
    <main className="flex flex-col items-center p-12 md:p-24">
      <div className="w-full max-w-3xl text-left">
        <Breadcrumbs currentPage="How I Built This Portfolio" />

        <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
          How I built this portfolio: a product experiment
        </h1>

        <p className="text-xl text-white font-medium italic mb-12">
          I bridge the gap between Business Strategy and Engineering. I don&apos;t just ask for features; I build them.
        </p>

        <div className="prose prose-invert prose-lg max-w-none space-y-8 text-gray-300">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">The challenge: friction kills conversion</h2>
            <p>
              As a Growth PM, I know that every extra click is a drop-off point. The standard portfolio experience is high-friction: hiring managers have to dig through navigation bars, read generic &quot;About Me&quot; pages, and guess if my skills match their specific needs.
            </p>
            <p>
              The Goal: Create a zero-friction interface where anyone can ask exactly what they need to know and get an immediate, data-backed answer.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">The solution: a full-stack AI digital twin</h2>
            <p>
              This isn't just a static site; it's an AI-native application designed to serve as my 24/7 professional representative. It uses a RAG (Retrieval-Augmented Generation) architecture to ensure every answer is grounded in the truth of my career data, metrics, and philosophy.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">The tech stack</h2>
            <p>
              I chose a stack that balances rapid prototyping with production-grade performance:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Next.js 16 (React 19) for extreme speed and SEO optimization.</li>
              <li>FastAPI (Python) to handle the AI orchestration and streaming logic.</li>
              <li>OpenAI (GPT-4o-mini) for text logic and ElevenLabs for my own personal cloned voice.</li>
              <li>Vercel (Edge Functions) to minimize latency across the globe.</li>
            </ul>
          </div>

          <div className="bg-gray-800/30 border border-gray-700 p-8 rounded-2xl border-l-4 border-l-blue-500">
            <h3 className="text-xl font-bold text-white mb-4">The voice pivot: from TTS to conversational AI</h3>
            <p>
              The original version used a simple backend-driven Text-To-Speech (TTS) flow. It was slow and felt like a robot. I pivoted to the ElevenLabs Conversational AI agent, integrating their SDK directly into the frontend.
            </p>
            <p className="mt-4">
              The result: A natural-sounding interface using my own cloned voice that understands interruptions and maintains context.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Workflow: vibecoding + engineering rigor</h2>
            <p>
              This project was built using vibecoding principles. I used Gemini and Antigravity (AI Coding Agent) to accelerate the build from 0 to 1.
            </p>
            <p>
              But speed didn&apos;t mean sacrificing quality. I maintained strict engineering control, reviewing every line of code (while also learning from it), managing the git flow, and ensuring the architecture didn&apos;t become a &quot;black box&quot;. It&apos;s a demonstration of how AI can scale human output without losing technical integrity.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-2xl">
            <h3 className="text-xl font-bold text-blue-400 mb-2">The Takeaway</h3>
            <p className="text-white">
              Innovation isn&apos;t about complexity; it&apos;s about solving problems with the best tools available. I treated my own career as the product, and AI as the leverage to scale it.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}