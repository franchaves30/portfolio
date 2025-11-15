// This is your correct "named export" import
import { Chat } from "@/components/chat";

// This is your correct function name
export default function Page() {
  return (
    // This is the new <main> wrapper to hold everything
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      
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
      <div className="w-full max-w-5xl">
        <Chat />
      </div>

    </main>
  );
}