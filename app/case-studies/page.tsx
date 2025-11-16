// This is your new Case Studies Gallery Page
// File: app/case-studies/page.tsx

import Link from "next/link"; // <-- Don't forget to import Link!

export default function CaseStudiesPage() {
  return (
    <main className="flex flex-col items-center p-12 md:p-24">
      <div className="w-full max-w-5xl text-left">
        
        {/* Main Title */}
        <h1 className="text-4xl font-bold mb-12">
          Case Studies
        </h1>

        {/* Grid for the cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Your Portfolio */}
          <Link 
            href="/case-studies/how-i-built-this-portfolio" 
            className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-2xl font-bold mb-3">
              How I Built This Portfolio
            </h3>
            <p className="text-gray-400 mb-4">
              A case study on building a full-stack AI app with Next.js, Python, and Vercel.
            </p>
            <span className="font-semibold text-white">Read Case Study &rarr;</span>
          </Link>

          {/* Card 2: Placeholder */}
          <a href="#" className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
            <h3 className="text-2xl font-bold mb-3">
              Project Title 2
            </h3>
            <p className="text-gray-400 mb-4">
              A summary of your second-best project. What was the problem and the outcome?
            </p>
            <span className="font-semibold text-white">Read Case Study &rarr;</span>
          </a>

          {/* Add more cards here as you build them... */}

        </div>
      </div>
    </main>
  );
}