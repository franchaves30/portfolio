// This is your correct "named export" import
import { Chat } from "@/components/chat";

// This is your correct function name
export default function Page() {
  return (
    // This is the new <main> wrapper to hold everything
    <main className="flex flex-col items-center p-12 md:p-12">
      
      {/* === THIS IS YOUR NEW HEADER === */}
      <div className="w-full max-w-5xl mb-16 text-left">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Fran Chaves - Growth PM Portfolio
        </h1>
        <p className="text-xl text-gray-400">
          Welcome to my (wip) site. Here are my case studies.
        </p>
      </div>
      {/* === END OF NEW HEADER === */}

      {/* This is your original Chat component, now in its own <div> */}
      <div className="w-full max-w-5xl flex flex-col">
        <Chat />
      </div>
      {/* === START: FEATURED CASE STUDIES SECTION === */}
      
      <div className="w-full max-w-5xl mt-24 text-left">
        
        {/* Section Title */}
        <h2 className="text-3xl font-bold mb-8">
          Featured Case Studies
        </h2>

        {/* Grid for the cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Your Portfolio */}
          <a href="#" className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors">
            <h3 className="text-2xl font-bold mb-3">
              How I Built This Portfolio
            </h3>
            <p className="text-gray-400 mb-4">
              A case study on building a full-stack AI app with Next.js, Python, and Vercel.
            </p>
            <span className="font-semibold text-white">Read Case Study &rarr;</span>
          </a>

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

        </div>
      </div>
      {/* === END: FEATURED CASE STUDIES SECTION === */}
    </main>
  );
}