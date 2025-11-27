// This is your new Case Studies Gallery Page
// File: app/case-studies/page.tsx

import Link from "next/link"; // <-- Don't forget to import Link!
import { Badge } from "@/components/ui/badge";

export default function CaseStudiesPage() {
  return (
    <main className="flex flex-col items-center p-12 md:p-24">
      <div className="w-full max-w-5xl text-left">

        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            &larr; Back to Home
          </Link>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl font-bold mb-12">
          Builds & Strategy
        </h1>

        {/* Grid for the cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Card 1: Your Portfolio */}
          <Link
            href="/case-studies/how-i-built-this-portfolio"
            className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <Badge variant="built">What I Built</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
              How I Built This Portfolio
            </h3>
            <p className="text-gray-400 mb-4">
              A case study on building a full-stack AI app with Next.js, Python, and Vercel.
            </p>
            <span className="font-semibold text-white group-hover:translate-x-1 transition-transform inline-block">Read Case Study &rarr;</span>
          </Link>

          {/* Card 2: Placeholder Strategy */}
          <div className="block p-6 bg-gray-800/50 rounded-lg border border-gray-800">
            <div className="flex justify-between items-start mb-4">
              <Badge variant="strategy">How I Think</Badge>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-500">
              Product Philosophy: AI First
            </h3>
            <p className="text-gray-600 mb-4">
              Thoughts on how AI is reshaping product management and user expectations.
            </p>
            <span className="font-semibold text-gray-600">Coming Soon...</span>
          </div>

        </div>
      </div>
    </main>
  );
}