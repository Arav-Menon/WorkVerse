import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import Comparison from "@/components/landing/Comparison";
import TechStack from "@/components/landing/TechStack";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-zinc-50 font-sans selection:bg-white/10 selection:text-white relative overflow-hidden">
      {/* "Electric Lab" Advanced Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Global Vertical Gradient (Monochrome) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        {/* Top Ambient White Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] animate-pulse"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] blur-[120px]"></div>

        {/* Vertical Electric Rays (Dynamic) */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-[0.1] flex justify-end gap-6 px-12 overflow-hidden">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white/50 to-transparent animate-slow-drift"></div>
          <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-white/40 to-transparent ml-4 animate-slow-drift-reverse"></div>
          <div className="w-[1px] h-full bg-white/20 ml-12"></div>
          <div className="w-[20px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent blur-md"></div>
          <div className="w-[1px] h-full bg-white/10 ml-8 animate-pulse"></div>
          <div className="w-[4px] h-full bg-gradient-to-b from-transparent via-white/30 to-transparent blur-sm ml-16"></div>
          <div className="w-[40px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent blur-2xl"></div>
        </div>

        {/* Floating Particles (Simulated with small radial gradients) */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-white rounded-full blur-[2px] animate-slow-drift opacity-30"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse opacity-40 delay-700"></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white rounded-full blur-[3px] animate-slow-drift-reverse opacity-20"></div>
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        
        {/* Decorative dividers between sections */}
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full max-w-5xl mx-auto"></div>
        <ProblemSection />
        
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full max-w-5xl mx-auto"></div>
        <HowItWorks />
        
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full max-w-5xl mx-auto"></div>
        <UseCases />
        
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full max-w-5xl mx-auto"></div>
        <Comparison />
        
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent w-full max-w-5xl mx-auto"></div>
        <TechStack />
        
        <CTASection />
        <Footer />
      </div>
    </main>
  );
}
