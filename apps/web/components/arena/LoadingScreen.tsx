import React from 'react';

export function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 font-medium">Entering Arena...</p>
      </div>
    </div>
  );
}
