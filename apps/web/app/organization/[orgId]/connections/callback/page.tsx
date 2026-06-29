"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

export default function OAuthCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orgId = params.orgId as string;
  const provider = searchParams.get("provider") || "github";
  const status = searchParams.get("status") || "error";
  const message = searchParams.get("message") || "";

  useEffect(() => {
    // Send result to parent window
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "oauth-result",
          provider,
          status,
          message,
          orgId,
        },
        window.location.origin
      );

      // Close popup after brief delay
      setTimeout(() => {
        window.close();
      }, 1500);
    }
  }, [provider, status, message, orgId]);

  const isSuccess = status === "success";

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        {isSuccess ? (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ti ti-check text-emerald-500 text-xl"></i>
            </div>
            <h1 className="text-lg font-bold text-white mb-2">
              {provider.charAt(0).toUpperCase() + provider.slice(1)} Connected
            </h1>
            <p className="text-sm text-zinc-500">
              Closing this window...
            </p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <i className="ti ti-x text-red-500 text-xl"></i>
            </div>
            <h1 className="text-lg font-bold text-white mb-2">
              Connection Failed
            </h1>
            <p className="text-sm text-zinc-500 mb-4">
              {message === "unauthorized"
                ? "You must be logged in to connect."
                : message === "no_code"
                ? "Authorization code not received."
                : "Something went wrong. Please try again."}
            </p>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
}
