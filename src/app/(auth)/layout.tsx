import { BookOpen } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-parchment dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-sage rounded-cozy shadow-cozy mb-4">
            <BookOpen className="w-7 h-7 text-parchment" />
          </div>
          <h1 className="text-3xl font-serif text-coffee dark:text-stone-100">Tan Clan Book Club</h1>
          <p className="text-coffee/60 dark:text-stone-400 mt-1 text-sm">Read some books</p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy-md border border-transparent dark:border-stone-800 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
