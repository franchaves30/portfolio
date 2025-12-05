import Link from "next/link";
import { Chat } from "@/components/chat"; // Importamos el nuevo componente limpio

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1 */}
          <Link
            href="/case-studies/how-i-built-this-portfolio"
            className="block p-6 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <h3 className="text-2xl font-bold mb-3">
              How I Built This Portfolio
            </h3>
            <p className="text-gray-400 mb-4">
              A case study on building a full-stack AI app with Next.js, Python, and LangChain.
            </p>
            <span className="font-semibold text-white">Read Case Study &rarr;</span>
          </Link>

          {/* Card 2 Placeholder */}
          <div className="block p-6 bg-gray-800/50 rounded-lg border border-gray-800">
            <h3 className="text-2xl font-bold mb-3 text-gray-500">
              More Coming Soon...
            </h3>
            <p className="text-gray-600 mb-4">
              Working on documenting my experience and putting my thoughts on paper.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}