import React from "react";

export const AuthBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#050505] to-black"></div>
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)] blur-[140px] animate-pulse"></div>
    <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] blur-[120px]"></div>
    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg%20viewBox=%220%200%20200%20200%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter%20id=%22noiseFilter%22%3E%3CfeTurbulence%20type=%22fractalNoise%22%20baseFrequency=%220.65%22%20numOctaves=%223%22%20stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect%20width=%22100%25%22%20height=%22100%25%22%20filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none"></div>
  </div>
);
