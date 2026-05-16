import React, { useState } from "react";
import { Icons } from "./AuthIcons";

export const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-medium text-white tracking-tight">Welcome back</h2>
        <p className="text-xs text-zinc-500">Sign in to your WorkVerse office</p>
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

      <div className="space-y-4">
        <div className="space-y-2.5">
          <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Email address</label>
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
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em]">Password</label>
            <button className="text-[9px] font-black text-zinc-700 hover:text-zinc-400 uppercase tracking-[0.1em] transition-colors">Forgot password?</button>
          </div>
          <div className="relative group">
            <Icons.Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-white transition-colors" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-11 py-3 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-colors p-1"
            >
              {showPassword ? <Icons.EyeOff className="w-4 h-4" /> : <Icons.Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <button className="w-full bg-white text-black py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-2.5 group shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-[0.98]">
        Enter WorkVerse <Icons.ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
      </button>

      <div className="flex justify-center gap-8 pt-6 border-t border-zinc-900/50">
        <div className="flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
          <Icons.ShieldCheck className="w-3.5 h-3.5 text-zinc-600" /> SOC 2 READY
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black text-zinc-700 uppercase tracking-widest">
          <Icons.Lock className="w-3.5 h-3.5 text-zinc-600" /> ENCRYPTED
        </div>
      </div>
    </div>
  );
};
