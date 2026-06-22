"use client";

import React, { useState } from "react";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { BrandingPanel } from "@/components/auth/BrandingPanel";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"in" | "up">("in");

  return (
    <main className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-white/10 selection:text-white relative overflow-hidden flex flex-col md:flex-row">
      <AuthBackground />

      {/* Left Side - Branding & Features */}
      <BrandingPanel />

      {/* Right Side - Auth Form */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 bg-black/40">
        <div className="w-full max-w-[380px]">
          {/* Logo on Mobile only */}
          <div className="flex items-center gap-2.5 mb-8 md:hidden justify-center w-full">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2H9V9H2V2Z" fill="white" />
                <path d="M15 15H22V22H15V15Z" fill="white" />
                <path d="M11 2H22V13L11 2Z" fill="white" />
                <path d="M2 11V22H13L2 11Z" fill="white" />
              </svg>
            </div>
            <div className="text-xl font-bold tracking-tighter text-white">
              Work<span className="text-zinc-500">Verse</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-10">
            <div className="relative flex bg-zinc-900/80 border border-zinc-800 p-1 rounded-2xl backdrop-blur-md w-fit">
              {/* Sliding Pill Background */}
              <div 
                className={`absolute top-1 bottom-1 transition-all duration-300 ease-out bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] z-0`}
                style={{
                  left: activeTab === "in" ? "4px" : "calc(50% + 2px)",
                  width: "calc(50% - 6px)"
                }}
              />
              <button 
                onClick={() => setActiveTab("in")}
                className={`relative z-10 text-[11px] font-black uppercase tracking-widest px-8 py-2.5 rounded-xl transition-colors duration-300 ${activeTab === "in" ? "text-black" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Sign in
              </button>
              <button 
                onClick={() => setActiveTab("up")}
                className={`relative z-10 text-[11px] font-black uppercase tracking-widest px-8 py-2.5 rounded-xl transition-colors duration-300 ${activeTab === "up" ? "text-black" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                Sign up
              </button>
            </div>
          </div>

          {activeTab === "in" ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </main>
  );
}
