import { Skeleton } from "../../../components/ui/skeleton";

export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-black text-zinc-400">
      <div className="h-[64px] border-b border-zinc-900 bg-black/80 px-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between gap-4">
          <Skeleton className="h-9 w-40 rounded-xl" />
          <Skeleton className="hidden h-11 w-[360px] rounded-xl md:block" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        <aside className="hidden w-[248px] shrink-0 border-r border-zinc-900 bg-black/95 p-4 md:block">
          <Skeleton className="h-28 rounded-2xl" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </aside>

        <main className="flex-1 overflow-hidden px-4 py-8 sm:px-6 md:px-8">
          <div className="mx-auto max-w-[1400px] space-y-6">
            <Skeleton className="h-56 rounded-[28px]" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-36 rounded-[24px]" />
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_380px]">
              <Skeleton className="h-[620px] rounded-[24px]" />
              <Skeleton className="h-[620px] rounded-[24px]" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
