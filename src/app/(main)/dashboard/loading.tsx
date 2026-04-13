export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-40 bg-sage-100 dark:bg-stone-800 rounded-xl" />
        <div className="h-4 w-56 bg-sage-50 dark:bg-stone-800/50 rounded-lg mt-2" />
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 p-6 flex items-start gap-5">
        <div className="w-16 h-24 bg-sage-50 dark:bg-stone-800 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-20 bg-sage-100 dark:bg-stone-700 rounded-full" />
          <div className="h-6 w-48 bg-sage-50 dark:bg-stone-800 rounded-lg" />
          <div className="h-3 w-32 bg-sage-50 dark:bg-stone-800 rounded-lg" />
        </div>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-cozy shadow-cozy border border-sage-100 dark:border-stone-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-sage-50 dark:border-stone-800">
          <div className="h-5 w-36 bg-sage-100 dark:bg-stone-700 rounded-lg" />
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4 border-b border-sage-50 dark:border-stone-800 last:border-0">
            <div className="w-9 h-9 bg-sage-100 dark:bg-stone-700 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-28 bg-sage-50 dark:bg-stone-800 rounded-lg" />
              <div className="h-2.5 bg-sage-50 dark:bg-stone-800 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
