"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-dvh flex-col bg-black font-sans text-[#a1a1aa] antialiased [color-scheme:dark]">

      {/* Ambient layer — decorative dot grid + glow */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Dot grid via inline style — not expressible cleanly in TW utilities */}
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
        {/* Top-center glow */}
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

      {/* ── Navbar ── */}
      <header role="banner" className="relative z-10">
        <nav
          className="flex h-[52px] items-center justify-between border-b border-white/[0.08] px-6"
          aria-label="WorkVerse main navigation"
        >
          <Link
            href="/"
            className="text-base font-medium tracking-[-0.3px] text-[#fafafa] no-underline"
            aria-label="WorkVerse home"
          >
            Work<span className="text-[#71717a]">Verse</span>
          </Link>

          <ul className="hidden items-center gap-6 sm:flex" role="list">
            {[
              { href: "/features",   label: "Features"   },
              { href: "/workspaces", label: "Workspaces" },
              { href: "/ai",         label: "AI Lab"     },
              { href: "/pricing",    label: "Pricing"    },
              { href: "/docs",       label: "Docs"       },
              { href: "/blog",       label: "Blog"       },
              { href: "/changelog",  label: "Changelog"  },
              { href: "/signin",     label: "Sign in"    },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-lg px-2 py-1.5 text-[13px] text-[#a1a1aa] transition-colors duration-150 hover:text-[#fafafa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* ── Main 404 content ── */}
      <main
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center"
        id="main-content"
        aria-labelledby="error-heading"
      >
        {/* 404 glyph with subtle glowing accent */}
        <div className="relative mb-8 group" aria-hidden="true">
          {/* Subtle animated glow behind */}
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div
            className="relative select-none font-mono font-bold leading-none tracking-[-0.05em] transition-transform duration-500 group-hover:scale-105"
            style={{
              fontSize: "clamp(80px, 15vw, 140px)",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.15)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.1) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 40px rgba(255,255,255,0.05))",
            }}
          >
            404
          </div>
          {/* Glowing underline */}
          <div
            className="absolute -bottom-2 left-1/2 h-px w-[80%] -translate-x-1/2 transition-all duration-500 group-hover:w-[100%] group-hover:bg-white/30"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
              boxShadow: "0 0 20px rgba(255,255,255,0.15)",
            }}
          />
        </div>

        {/* Status chip & AI Message */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] font-semibold tracking-widest text-[#71717a] uppercase"
            style={{
              boxShadow: "0 10px 20px rgba(255,255,255,0.02)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
            Node Unreachable
          </div>
        </div>

        {/* Heading */}
        <h1
          className="mb-3 max-w-[480px] font-bold leading-[1.1] tracking-tight text-[#fafafa]"
          id="error-heading"
          style={{ fontSize: "clamp(24px, 4vw, 32px)" }}
        >
          Lost in the void
        </h1>

        {/* Smarter Subtext */}
        <p className="mb-8 max-w-[440px] text-[14px] leading-relaxed text-[#a1a1aa]">
          Our AI agents couldn't map this coordinate. The workspace may have been archived, the document deleted, or you might have followed a dead link.
        </p>

        {/* Command Palette Hint */}
        <div className="mb-10 flex items-center justify-center gap-2 text-[12px] text-zinc-500 font-medium">
           Press <kbd className="font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 shadow-sm text-[10px]">⌘</kbd> <kbd className="font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-300 shadow-sm text-[10px]">K</kbd> to jump anywhere
        </div>

        {/* Quick Navigation Actions */}
        <div
          className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mx-auto"
          role="group"
          aria-label="Recovery actions"
        >
          <Link
            href="/workspace"
            className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-5 no-underline transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 group"
          >
            <i className="ti ti-layout-grid text-[20px] text-zinc-500 group-hover:text-white transition-colors" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Workspaces</span>
            <span className="text-[11px] text-zinc-600">Return to your team</span>
          </Link>

          <Link
            href="/ai-lab"
            className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-5 no-underline transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 group"
          >
            <i className="ti ti-robot text-[20px] text-zinc-500 group-hover:text-white transition-colors" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-zinc-300 group-hover:text-white transition-colors">AI Lab</span>
            <span className="text-[11px] text-zinc-600">Open command center</span>
          </Link>

          <Link
            href="/docs"
            className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-5 no-underline transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:-translate-y-1 group"
          >
            <i className="ti ti-file-text text-[20px] text-zinc-500 group-hover:text-white transition-colors" aria-hidden="true" />
            <span className="text-[13px] font-semibold text-zinc-300 group-hover:text-white transition-colors">Documentation</span>
            <span className="text-[11px] text-zinc-600">Read the guides</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-auto mb-10 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Recent Destinations */}
        <div className="w-full max-w-lg mx-auto">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4 text-center">Recent Destinations</h3>
           <div className="flex flex-col gap-2">
               <Link href="/organization" className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200 group text-left bg-transparent">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                       <i className="ti ti-code text-zinc-400 text-[14px] group-hover:text-white transition-colors"></i>
                    </div>
                    <div>
                       <p className="text-[13px] font-bold text-zinc-300 group-hover:text-white transition-colors">Engineering Team</p>
                       <p className="text-[11px] font-medium text-zinc-600 group-hover:text-zinc-500 transition-colors">Backend Tasks</p>
                    </div>
                 </div>
                 <i className="ti ti-arrow-right text-zinc-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-3 group-hover:translate-x-0"></i>
              </Link>
              
               <Link href="/organization" className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-200 group text-left bg-transparent">
                 <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                       <i className="ti ti-palette text-zinc-400 text-[14px] group-hover:text-white transition-colors"></i>
                    </div>
                    <div>
                       <p className="text-[13px] font-bold text-zinc-300 group-hover:text-white transition-colors">Design Team</p>
                       <p className="text-[11px] font-medium text-zinc-600 group-hover:text-zinc-500 transition-colors">Brand Assets</p>
                    </div>
                 </div>
                 <i className="ti ti-arrow-right text-zinc-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-3 group-hover:translate-x-0"></i>
              </Link>
           </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-6 py-4 sm:px-6"
        role="contentinfo"
      >
        <span className="text-[11px] text-[#71717a]">
          &copy; {year} WorkVerse. All rights reserved.
        </span>
        <nav className="flex gap-4" aria-label="Footer navigation">
          {[
            { href: "/privacy",  label: "Privacy"  },
            { href: "/terms",    label: "Terms"    },
            { href: "/security", label: "Security" },
            { href: "/sitemap",  label: "Sitemap"  },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded px-1.5 py-0.5 text-[11px] text-[#71717a] no-underline transition-colors duration-150 hover:text-[#a1a1aa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
