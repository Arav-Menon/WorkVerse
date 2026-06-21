"use client";

import React from "react";

export default function ProfileActions() {
  const actions = [
    { icon: "ti-pencil", label: "Edit profile", href: "/profile" },
    { icon: "ti-camera", label: "Change avatar", href: "/profile" },
    { icon: "ti-settings", label: "Account settings", href: "/profile" },
  ];

  return (
    <div className="flex items-center gap-1 pt-2">
      {actions.map((action, i) => (
        <React.Fragment key={action.label}>
          <a
            href={action.href}
            className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 hover:text-white transition-colors"
          >
            <i className={`ti ${action.icon} text-sm`} />
            {action.label}
          </a>
          {i < actions.length - 1 && (
            <span className="text-zinc-700 mx-1">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
