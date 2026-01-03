import Link from "next/link";
import { Chat } from "@/components/chat";
import { buildsAndStrategy } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  return (
    <main className="flex flex-col items-center p-6 md:p-24">

      {/* HEADER */}
      <div className="w-full max-w-5xl mb-12 text-left">
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Fran Chaves - Growth Product Manager
        </h1>
        <p className="text-xl text-gray-400">
          Welcome! Chat to my AI-powered CV 24-7.
        </p>
      </div>

      {/* EL NUEVO CHAT */}
      <div className="w-full max-w-3xl mb-24">
        <Chat />
      </div>

      {/* CASE STUDIES SECTION */}
      <div className="w-full max-w-5xl text-left">
        <h2 className="text-3xl font-bold mb-8">
          Featured Builds & Ideas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {buildsAndStrategy.map((post) => (
            <Link
              key={post.id}
              href={`/builds-and-strategy/${post.slug}`}
              className="group p-5 bg-gray-900/50 rounded-xl border border-white/5 hover:border-blue-500/50 hover:bg-gray-800/80 transition-all flex flex-col h-full"
            >
              <div className="mb-3">
                <Badge variant={post.tag === "What I Built" ? "built" : "strategy"} className="text-[10px] px-2 py-0">
                  {post.tag}
                </Badge>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {post.description}
              </p>
              <div className="mt-auto pt-2 flex items-center text-xs font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Read More &rarr;
              </div>
            </Link>
          ))}


        </div>
      </div>
    </main>
  );
}