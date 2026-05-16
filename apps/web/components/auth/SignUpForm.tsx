import React, { useState } from "react";
import Link from "next/link";
import { Icons } from "./AuthIcons";

export const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);

  const checkStrength = (val: string) => {
    setPassword(val);
    let s = 0;
    if (val.length >= 8) s++;
    if (/[A-Z]/.test(val)) s++;
    if (/[0-9]/.test(val)) s++;
    if (/[^A-Za-z0-9]/.test(val)) s++;
    setStrength(s);
  };

  const strengthCols = ["", "#ef4444", "#f59e0b", "#84cc16", "#10b981"];
  const strengthLabels = ["Enter a secure password", "Too weak", "Could be stronger", "Good password", "Strong password"];

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-medium text-white tracking-tight">Create office</h2>
        <p className="text-xs text-zinc-500">Setup WorkVerse in under 60 seconds</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="group flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all">
          <Icons.Chrome className="w-4 h-4 group-hover:scale-110 transition-transform" /> Google
        </button>
        <button className="group flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950/50 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all">
          <Icons.Github className="w-4 h-4 group-hover:scale-110 transition-transform" /> GitHub
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-zinc-900"></div>
        <span className="text-[9px] text-zinc-700 uppercase tracking-[0.3em] font-black">OR EMAIL</span>
        <div className="flex-1 h-px bg-zinc-900"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2.5">
          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">First name</label>
          <div className="relative group">
            <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Arjun"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-11 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>
        </div>
        <div className="space-y-2.5">
          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Last name</label>
          <div className="relative group">
            <Icons.User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Sharma"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-11 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Work email</label>
        <div className="relative group">
          <Icons.Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
          <input 
            type="email" 
            placeholder="you@company.com"
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-11 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Password</label>
        <div className="relative group">
          <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Min. 8 characters"
            onChange={(e) => checkStrength(e.target.value)}
            className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-11 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
          />
          <button 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors p-1"
          >
            {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-1.5 mt-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-1 h-1 rounded-full transition-all duration-500" 
              style={{ 
                background: i <= strength ? strengthCols[strength] : "#18181b",
                boxShadow: i <= strength ? `0 0 8px ${strengthCols[strength]}44` : "none"
              }}
            />
          ))}
        </div>
        <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mt-1.5">
          {password ? strengthLabels[strength] : "Enter a secure password"}
        </div>
      </div>

      <button className="w-full bg-white text-black py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2.5 group shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-[0.98]">
        Create office <Icons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
      </button>

      <p className="text-[9px] text-zinc-700 text-center leading-relaxed font-medium uppercase tracking-tight">
        By signing up you agree to our <Link href="/terms" className="text-zinc-400 hover:text-white underline underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-zinc-400 hover:text-white underline underline-offset-4">Privacy Policy</Link>.<br />
        <span className="text-zinc-800 mt-1.5 block">No credit card required. Cancel anytime.</span>
      </p>
    </div>
  );
};
