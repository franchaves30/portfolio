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
            Case Study: How I Built This Portfolio
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Building a full-stack, AI-powered portfolio with Next.js, Python, and Vercel.
          </p>
  
          {/* Section: The Problem */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">The Problem</h2>
            <p className="text-lg text-gray-300">
              I needed a portfolio that wasn't just a static resume. I wanted to 
              demonstrate my skills as a technical, product-minded PM by building 
              the portfolio itself as a product.
            </p>
          </div>
  
          {/* Section: The Process */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">The Stack & Process</h2>
            <p className="text-lg text-gray-300 mb-4">
              I chose a modern, high-performance stack to handle a demanding
              set of features, including a real-time AI chat.
            </p>
            <ul className="list-disc list-inside text-lg text-gray-300 space-y-2">
              <li><strong>Next.js (React):</strong> For a fast, component-based frontend.</li>
              <li><strong>Python (FastAPI):</strong> To create a serverless backend API to power the AI.</li>
              <li><strong>Vercel:</strong> For seamless CI/CD (Continuous Integration / Continuous Deployment).</li>
              <li><strong>Git & GitHub:</strong> For version control, following a 'commit small, commit often' workflow.</li>
            </ul>
          </div>
  
          {/* Section: The Outcome */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">The Outcome</h2>
            <p className="text-lg text-gray-300">
              The result is the site you're on right now. A 100% free-to-host, 
              serverless web application that I can update just by pushing to GitHub.
              The AI chatbot is fully functional and streams responses from my Python API.
            </p>
          </div>
  
        </div>
      </main>
    );
  }