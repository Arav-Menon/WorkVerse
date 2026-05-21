"use client";

import React from "react";
import ProfileNavbar from "./components/ProfileNavbar";
import ProfileHero from "./components/ProfileHero";
import StatsBar from "./components/StatsBar";
import RowThreeCards from "./components/RowThreeCards";
import RowTwoCards from "./components/RowTwoCards";
import RowBottomCards from "./components/RowBottomCards";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans antialiased selection:bg-white/10 selection:text-white flex flex-col relative overflow-hidden">
      
      {/* Premium Deeper Ambient Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Richer Vertical Gradient (Neutral gray matching landing page) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>

        {/* Faint white grid lines matching landing page */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_65%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Dynamic ambient white glows (pure neutral white matching landing page) */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[55%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[50%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.015),transparent_75%)] blur-[130px] pointer-events-none"></div>
      </div>

      <ProfileNavbar />

      <main className="flex-1 w-full max-w-none px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 py-8 md:py-12 relative z-10 mx-auto">
        <ProfileHero />
        <StatsBar />
        <RowThreeCards />
        <RowTwoCards />
        <RowBottomCards />
      </main>

    </div>
  );
}
