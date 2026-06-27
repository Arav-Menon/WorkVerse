'use client';

import React, { useEffect, useState, useCallback } from 'react';
import type { ProximityUser } from '../../lib/phaser/systems/ProximitySystem';

interface ProximityPopupProps {
  users: ProximityUser[];
  onConnect: (userId: string, username: string) => void;
  onIgnore: (userId: string) => void;
}

interface PopupEntry {
  user: ProximityUser;
  dismissed: boolean;
}

export function ProximityPopup({ users, onConnect, onIgnore }: ProximityPopupProps) {
  const [entries, setEntries] = useState<PopupEntry[]>([]);

  useEffect(() => {
    setEntries(prev => {
      const existing = new Map(prev.map(e => [e.user.userId, e]));
      const next: PopupEntry[] = users.map(user => {
        const old = existing.get(user.userId);
        return { user, dismissed: old?.dismissed || false };
      });
      return next;
    });
  }, [users]);

  useEffect(() => {
    if (entries.length === 0) return;
    const timer = setTimeout(() => {
      setEntries(prev => prev.map(e => ({ ...e, dismissed: true })));
    }, 10000);
    return () => clearTimeout(timer);
  }, [entries.length]);

  const handleConnect = useCallback((userId: string, username: string) => {
    setEntries(prev => prev.map(e =>
      e.user.userId === userId ? { ...e, dismissed: true } : e
    ));
    onConnect(userId, username);
  }, [onConnect]);

  const handleIgnore = useCallback((userId: string) => {
    setEntries(prev => prev.map(e =>
      e.user.userId === userId ? { ...e, dismissed: true } : e
    ));
    onIgnore(userId);
  }, [onIgnore]);

  const visibleEntries = entries.filter(e => !e.dismissed);
  if (visibleEntries.length === 0) return null;

  return (
    <div className="fixed left-1/2 top-24 -translate-x-1/2 flex flex-col gap-3 z-50">
      {visibleEntries.map(entry => (
        <ProximityPopupCard
          key={entry.user.userId}
          user={entry.user}
          onConnect={() => handleConnect(entry.user.userId, entry.user.username)}
          onIgnore={() => handleIgnore(entry.user.userId)}
        />
      ))}
    </div>
  );
}

interface ProximityPopupCardProps {
  user: ProximityUser;
  onConnect: () => void;
  onIgnore: () => void;
}

function ProximityPopupCard({ user, onConnect, onIgnore }: ProximityPopupCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className="flex items-center gap-4 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300"
      style={{
        background: 'rgba(9, 9, 11, 0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ background: user.color || '#6366f1' }}
      >
        {user.username.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-white text-sm font-semibold truncate">{user.username}</span>
        <span className="text-gray-400 text-xs">is nearby</span>
      </div>

      <div className="flex items-center gap-2 ml-2 shrink-0">
        <button
          onClick={onIgnore}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          Ignore
        </button>
        <button
          onClick={onConnect}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          Connect
        </button>
      </div>
    </div>
  );
}
