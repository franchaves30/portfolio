// This is your new Case Study Detail Page
// File: app/case-studies/how-i-built-this-portfolio/page.tsx
import { Breadcrumbs } from "@/components/breadcrumbs";

export default function CaseStudyPortfolio() {
  return (
    <main className="flex flex-col items-center p-12 md:p-24">
      <div className="w-full max-w-3xl text-left">

        <Breadcrumbs currentPage="How I Built This Portfolio" />

        {/* Main Title */}
        <h1 className="text-4xl font-bold mb-4">
          Building an AI-native portfolio: a product experiment
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Treating my portfolio as a product: solving the "time-poor hiring manager" problem with AI.
        </p>

        {/* Section: The Challenge */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">The challenge</h2>
          <p className="text-lg text-gray-300 mb-4">
            As a Growth PM, I know that friction kills conversion.
            The standard portfolio experience is high-friction: hiring managers have to dig through navigation bars,
            read long "About Me" pages, and guess if my skills match their specific needs.
          </p>
          <p className="text-lg text-gray-300">
            I wanted to flip the script. Instead of asking you to search for information,
            I wanted to give you a tool to <strong>ask exactly what you want to know</strong>.
          </p>
        </div>

        {/* Section: The Solution */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">The solution: an AI agent</h2>
          <p className="text-lg text-gray-300 mb-4">
            I built a custom RAG (Retrieval-Augmented Generation) chatbot that acts as a 24/7 representative.
            It has access to my full professional context—resume, case studies, and philosophy—and serves it up conversationally.
          </p>
          <p className="text-lg text-gray-300">
            This isn't just a wrapper around ChatGPT. It's a focused agent with a specific system prompt designed to
            represent my professional tone and prioritize relevant information.
          </p>
        </div>

        {/* Section: The Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Under the hood</h2>
          <p className="text-lg text-gray-300 mb-4">
            I chose a stack that balances performance with capability. I didn't just want "cool tech";
            I wanted a snappy, responsive user experience.
          </p>
          <ul className="list-disc list-inside text-lg text-gray-300 space-y-2">
            <li><strong>Next.js 14:</strong> For a blazing fast, server-rendered frontend.</li>
            <li><strong>Python & FastAPI:</strong> Because Python is the native language of AI. I built a dedicated API to handle the logic.</li>
            <li><strong>LangChain:</strong> To orchestrate the conversation flow and manage context.</li>
            <li><strong>Vercel:</strong> For seamless deployment of both the frontend and the Python backend in a single repo.</li>
          </ul>
        </div>

        {/* Section: The Workflow */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">The workflow: vibecoding + control</h2>
          <p className="text-lg text-gray-300 mb-4">
            This project is also an experiment in vibecoding". I used Google's Gemini models to accelerate the development (and Antigravity since it&apos;s launch),
            iterating rapidly on ideas and implementation details.
          </p>
          <p className="text-lg text-gray-300">
            However, speed didn't mean sacrificing quality. I maintained full ownership of the code review and git flow,
            ensuring that every commit was clean, understood, and aligned with the architectural vision. It's the perfect blend of
            AI speed and human rigor.
          </p>
        </div>

        {/* Section: Key Learnings */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Key product learnings</h2>
          <p className="text-lg text-gray-300 mb-4">
            <strong>1. Latency Matters:</strong> Streaming the response token-by-token makes the AI feel "alive" and reduces perceived wait time.
          </p>
          <p className="text-lg text-gray-300 mb-4">
            <strong>2. Context is King:</strong> The bot is only as smart as the data I feed it. I spent more time refining the `data.txt` source file than writing code.
          </p>
          <p className="text-lg text-gray-300">
            <strong>3. UX Details:</strong> Small things like auto-focusing the input field and preventing page scroll jumps (which I iterated on!) make the difference between a "demo" and a "product."
          </p>
        </div>

      </div>
    </main>
  );
}