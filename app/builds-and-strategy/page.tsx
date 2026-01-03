// This is your new Case Studies Gallery Page
// File: app/builds-and-strategy/page.tsx

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buildsAndStrategy } from "@/lib/data";

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
          {buildsAndStrategy.map((post) => (
            <Link
              key={post.id}
              href={`/builds-and-strategy/${post.slug}`}
              className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge variant={post.tag === "What I Built" ? "built" : "strategy"}>
                  {post.tag}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-400 mb-4">
                {post.description}
              </p>
              <span className="font-semibold text-white group-hover:translate-x-1 transition-transform inline-block">
                Read More &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}