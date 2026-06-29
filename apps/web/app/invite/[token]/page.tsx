"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  validateInvite,
  acceptInvite,
  type InviteDetails,
} from "@/lib/api/invite.api";

type PageState =
  | "loading"
  | "valid"
  | "expired"
  | "invalid"
  | "joining"
  | "success"
  | "already-accepted";

const ORG_COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD"];

function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function InvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [state, setState] = useState<PageState>("loading");
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const loadInvite = useCallback(async () => {
    try {
      setState("loading");
      const data = await validateInvite(token);
      if (data) {
        setInvite(data);
        setState("valid");
      } else {
        setState("invalid");
        setErrorMsg("Invalid invitation data received.");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";

      if (status === 404) {
        setState("invalid");
        setErrorMsg(message);
      } else if (status === 410) {
        setState("expired");
        setErrorMsg(message);
      } else if (status === 400 && message.toLowerCase().includes("already")) {
        setState("already-accepted");
      } else {
        setState("invalid");
        setErrorMsg(message);
      }
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setState("invalid");
      setErrorMsg("No invitation token provided.");
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      sessionStorage.setItem("inviteRedirect", `/invite/${token}`);
      router.push("/auth");
      return;
    }

    loadInvite();
  }, [token, loadInvite, router]);

  useEffect(() => {
    if (state !== "loading") return;
    const timeout = setTimeout(() => {
      if (state === "loading") {
        setState("invalid");
        setErrorMsg("Request timed out. Please check your connection and try again.");
      }
    }, 12000);
    return () => clearTimeout(timeout);
  }, [state]);

  useEffect(() => {
    if (state === "already-accepted" && invite) {
      const timer = setTimeout(() => {
        router.push(`/organization`);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state, invite, router]);

  const handleAccept = async () => {
    if (!invite) return;
    try {
      setState("joining");
      const result = await acceptInvite(token);
      setState("success");
      setTimeout(() => {
        router.push(`/organization/${result.organizationId}`);
      }, 2500);
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.message || "Failed to accept invitation";

      if (status === 400 && message.toLowerCase().includes("already")) {
        setState("already-accepted");
      } else {
        setErrorMsg(message);
        setState("expired");
      }
    }
  };

  const handleDecline = () => {
    router.push("/home");
  };

  const initials = invite
    ? invite.organizationName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "WS";

  const accentColor =
    ORG_COLORS[
      invite
        ? invite.organizationName.charCodeAt(0) % ORG_COLORS.length
        : 0
    ];

  return (
    <div className="flex min-h-dvh flex-col bg-[#050505] text-zinc-400 antialiased [color-scheme:dark]">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute left-1/2 top-[-160px] -translate-x-1/2"
          style={{
            width: "700px",
            height: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      <header
        role="banner"
        className="relative z-10 flex h-[52px] items-center border-b border-white/[0.08] px-6"
      >
        <Link
          href="/"
          className="text-base font-medium tracking-tight text-[#fafafa] no-underline"
          aria-label="WorkVerse home"
        >
          Work<span className="text-zinc-500">Verse</span>
        </Link>
      </header>

      <main
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6"
        id="main-content"
      >
        <div className="w-full max-w-[480px] rounded-[20px] border border-zinc-800 bg-[#111113]/90 p-8 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10">

          {state === "loading" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner size={32} />
              <p className="text-sm text-zinc-500">Loading invitation...</p>
            </div>
          )}

          {(state === "valid" || state === "joining" || state === "success") &&
            invite && (
              <div className="text-center">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  You&apos;ve been invited to join
                </p>

                <div
                  className="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800 text-xl font-bold"
                  style={{ color: accentColor }}
                >
                  {initials}
                </div>

                <h1 className="mb-1 text-xl font-bold tracking-tight text-white">
                  {invite.organizationName}
                </h1>

                <p className="mb-4 text-[13px] text-zinc-500">
                  @{invite.organizationSlug}
                </p>

                <p className="mb-6 text-sm leading-relaxed text-zinc-400 max-w-[380px] mx-auto">
                  {invite.description ||
                    "Accept this invitation to access workspaces, projects, AI Labs, automations, and team resources."}
                </p>

                <div className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-800/40 p-4 text-[13px]">
                  <span
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      borderColor: `${accentColor}50`,
                      backgroundColor: `${accentColor}18`,
                      color: accentColor,
                    }}
                  >
                    {invite.role}
                  </span>
                  <div className="h-4 w-px bg-zinc-700" />
                  <span className="text-zinc-300">
                    <i className="ti ti-users mr-1 text-zinc-400" />
                    {invite.memberCount}{" "}
                    {invite.memberCount === 1 ? "member" : "members"}
                  </span>
                  <div className="h-4 w-px bg-zinc-700" />
                  <span className="text-zinc-300">
                    <i className="ti ti-user mr-1 text-zinc-400" />
                    {invite.invitedByName}
                  </span>
                  {invite.email && (
                    <>
                      <div className="h-4 w-px bg-zinc-700" />
                      <span className="text-zinc-300">
                        <i className="ti ti-mail mr-1 text-zinc-400" />
                        {invite.email}
                      </span>
                    </>
                  )}
                  {invite.expiresAt && (
                    <>
                      <div className="h-4 w-px bg-zinc-700" />
                      <span className="text-zinc-300">
                        <i className="ti ti-clock mr-1 text-zinc-400" />
                        Expires {formatDate(invite.expiresAt)}
                      </span>
                    </>
                  )}
                </div>

                <div className="mb-6 h-px bg-zinc-800" />

                {state === "success" ? (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                      <i className="ti ti-check text-xl text-emerald-400" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Welcome to {invite.organizationName}
                    </p>
                    <p className="text-xs text-zinc-500">Redirecting...</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleAccept}
                      disabled={state === "joining"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 shadow-[0_8px_32px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {state === "joining" ? (
                        <>
                          <Spinner />
                          Joining {invite.organizationName}...
                        </>
                      ) : (
                        <>
                          <i className="ti ti-plus text-[15px]" />
                          Join {invite.organizationName}
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDecline}
                      disabled={state === "joining"}
                      className="mt-3 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            )}

          {state === "already-accepted" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                <i className="ti ti-check text-2xl text-emerald-400" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Already a member
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400 max-w-[340px]">
                {invite
                  ? `You've already joined ${invite.organizationName}. Redirecting...`
                  : "You've already joined this organization. Redirecting..."}
              </p>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Spinner size={14} />
                <span>Redirecting to organization...</span>
              </div>
            </div>
          )}

          {state === "expired" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15">
                <i className="ti ti-clock-off text-2xl text-amber-400" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Invitation Expired
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400 max-w-[340px]">
                {errorMsg ||
                  "This invitation link is no longer valid. Please ask your team to send a new one."}
              </p>
              <Link
                href="/home"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-600 hover:bg-zinc-700 no-underline"
              >
                <i className="ti ti-arrow-left text-[14px]" />
                Return Home
              </Link>
            </div>
          )}

          {state === "invalid" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-800">
                <i className="ti ti-link-x text-2xl text-zinc-400" />
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Invitation Not Found
              </h1>
              <p className="text-sm leading-relaxed text-zinc-400 max-w-[340px]">
                {errorMsg ||
                  "This invite link does not exist or has been revoked."}
              </p>
              <Link
                href="/home"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-600 hover:bg-zinc-700 no-underline"
              >
                <i className="ti ti-arrow-left text-[14px]" />
                Return Home
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-4 text-center">
        <p className="text-[11px] text-zinc-600">
          &copy; {new Date().getFullYear()} WorkVerse. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
