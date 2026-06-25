"use client";

import React from "react";

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ background: "#050505" }}
    >
      {children}
    </div>
  );
}
