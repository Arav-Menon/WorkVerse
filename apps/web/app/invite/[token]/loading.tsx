import { Skeleton } from "@/components/ui/skeleton";

export default function InviteLoading() {
  return (
    <div className="flex min-h-dvh flex-col bg-black font-sans text-zinc-400 antialiased [color-scheme:dark]">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: "-140px",
            width: "640px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 68%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex h-[52px] items-center border-b border-white/[0.08] px-6">
        <span className="text-base font-medium tracking-[-0.3px] text-[#fafafa]">
          Work<span className="text-[#71717a]">Verse</span>
        </span>
      </header>

      {/* Main */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-[480px] rounded-[24px] border border-zinc-900/90 bg-[linear-gradient(180deg,rgba(24,24,27,0.78),rgba(9,9,11,0.94))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {/* Eyebrow */}
          <Skeleton className="mx-auto mb-6 h-3 w-40 rounded-full" />

          {/* Avatar */}
          <Skeleton className="mx-auto mb-5 h-14 w-14 rounded-2xl" />

          {/* Heading */}
          <Skeleton className="mx-auto mb-2 h-6 w-56 rounded-lg" />

          {/* Subline */}
          <Skeleton className="mx-auto mb-5 h-3.5 w-28 rounded-lg" />

          {/* Description lines */}
          <Skeleton className="mb-2 h-3.5 w-full rounded-lg" />
          <Skeleton className="mb-6 h-3.5 w-3/4 rounded-lg" />

          {/* Info row */}
          <Skeleton className="mb-6 h-[72px] w-full rounded-xl" />

          {/* Divider */}
          <div className="mb-6 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          {/* Button */}
          <Skeleton className="h-12 w-full rounded-xl" />

          {/* Decline text */}
          <Skeleton className="mx-auto mt-4 h-3 w-16 rounded-lg" />
        </div>
      </main>
    </div>
  );
}
