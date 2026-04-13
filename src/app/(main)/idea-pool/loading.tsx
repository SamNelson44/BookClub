export default function IdeaPoolLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="h-9 w-36 bg-sage-100 dark:bg-stone-800 rounded-xl" />
          <div className="h-4 w-64 bg-sage-50 dark:bg-stone-800/50 rounded-lg mt-2" />
        </div>
        <div className="h-10 w-36 bg-sage-100 dark:bg-stone-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
            <div className="h-40 bg-sage-50 dark:bg-stone-800" />
            <div className="p-5 space-y-3">
              <div className="h-3 w-16 bg-sage-100 dark:bg-stone-700 rounded-full" />
              <div className="h-5 w-40 bg-sage-50 dark:bg-stone-800 rounded-lg" />
              <div className="h-3 w-24 bg-sage-50 dark:bg-stone-800 rounded-lg" />
              <div className="h-3 w-full bg-sage-50 dark:bg-stone-800 rounded-lg" />
              <div className="h-3 w-3/4 bg-sage-50 dark:bg-stone-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
