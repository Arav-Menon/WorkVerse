"use client";

import React, { useState } from "react";
import { AuthBackground } from "../../components/auth/AuthBackground";
import { BrandingPanel } from "../../components/auth/BrandingPanel";
import { SignInForm } from "../../components/auth/SignInForm";
import { SignUpForm } from "../../components/auth/SignUpForm";

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
