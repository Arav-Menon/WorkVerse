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
  | "success";

const ORG_COLORS = ["#7F77DD", "#1D9E75", "#D85A30", "#378ADD"];

function Spinner() {
  return (
    <svg
      className="animate-spin h-3.5 w-3.5"
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
      setInvite(data);
      setState("valid");
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
      router.push("/(home)/auth");
      return;
    }

    loadInvite();
  }, [token, loadInvite, router]);

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
      const message =
        err?.response?.data?.message || "Failed to accept invitation";
      setErrorMsg(message);
      setState("expired");
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
    <div className="flex min-h-dvh flex-col bg-black font-sans text-zinc-400 antialiased [color-scheme:dark]">
      {/* Ambient background */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse 80% 55% at 50% 0%, black 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full"
          style={{
            top: "-140px",
            width: "640px",
            height: "400px",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 68%)",
          }}
        />
      </div>

      {/* Header */}
      <header
        role="banner"
        className="relative z-10 flex h-[52px] items-center border-b border-white/[0.08] px-6"
      >
        <Link
          href="/"
          className="text-base font-medium tracking-[-0.3px] text-[#fafafa] no-underline"
          aria-label="WorkVerse home"
        >
          Work<span className="text-[#71717a]">Verse</span>
        </Link>
      </header>

      {/* Main */}
      <main
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6"
        id="main-content"
      >
        <div className="w-full max-w-[480px] rounded-[24px] border border-zinc-900/90 bg-[linear-gradient(180deg,rgba(24,24,27,0.78),rgba(9,9,11,0.94))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 sm:p-10">

          {/* ── LOADING STATE ── */}
          {state === "loading" && (
            <div className="animate-pulse">
              <div className="mx-auto mb-6 h-3 w-40 rounded-full bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mx-auto mb-5 h-14 w-14 rounded-2xl bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mx-auto mb-2 h-6 w-56 rounded-lg bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mx-auto mb-5 h-3.5 w-28 rounded-lg bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mb-2 h-3.5 w-full rounded-lg bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mb-6 h-3.5 w-3/4 rounded-lg bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mb-6 h-[72px] w-full rounded-xl bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mb-6 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
              <div className="h-12 w-full rounded-xl bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
              <div className="mx-auto mt-4 h-3 w-16 rounded-lg bg-[linear-gradient(90deg,rgba(39,39,42,0.9),rgba(63,63,70,0.7),rgba(39,39,42,0.9))] bg-[length:200%_100%]" />
            </div>
          )}

          {/* ── VALID STATE ── */}
          {(state === "valid" || state === "joining" || state === "success") &&
            invite && (
              <div className="text-center">
                {/* Eyebrow */}
                <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                  You&apos;ve been invited to join
                </p>

                {/* Workspace avatar */}
                <div
                  className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 text-lg font-bold"
                  style={{ color: accentColor }}
                >
                  {initials}
                </div>

                {/* Workspace name */}
                <h1 className="mb-1 text-xl font-bold tracking-tight text-white">
                  {invite.organizationName}
                </h1>

                {/* Org slug */}
                <p className="mb-4 text-xs text-zinc-500">
                  @{invite.organizationSlug}
                </p>

                {/* Description */}
                {invite.description && (
                  <p className="mb-6 text-sm leading-relaxed text-zinc-400 max-w-[380px] mx-auto">
                    {invite.description}
                  </p>
                )}

                {/* Info row */}
                <div className="mb-6 flex items-center justify-center gap-4 rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 text-[13px]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        borderColor: `${accentColor}40`,
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                      }}
                    >
                      {invite.role}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-zinc-800" />
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <i className="ti ti-users text-[13px] text-zinc-500" />
                    <span>
                      {invite.memberCount}{" "}
                      {invite.memberCount === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-zinc-800" />
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <i className="ti ti-user text-[13px] text-zinc-500" />
                    <span>{invite.invitedByName}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="mb-6 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

                {/* Success state */}
                {state === "success" ? (
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <i className="ti ti-check text-xl text-emerald-400" />
                    </div>
                    <p className="text-sm font-semibold text-white">
                      Workspace Joined Successfully
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Redirecting...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Accept button */}
                    <button
                      onClick={handleAccept}
                      disabled={state === "joining"}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-zinc-200 shadow-[0_12px_40px_rgba(255,255,255,0.08)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {state === "joining" ? (
                        <>
                          <Spinner />
                          Joining workspace...
                        </>
                      ) : (
                        <>
                          <i className="ti ti-plus text-[15px]" />
                          Accept Invitation
                        </>
                      )}
                    </button>

                    {/* Decline */}
                    <button
                      onClick={handleDecline}
                      disabled={state === "joining"}
                      className="mt-4 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            )}

          {/* ── EXPIRED STATE ── */}
          {state === "expired" && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                <i className="ti ti-clock-off text-2xl text-amber-500/70" />
              </div>
              <h1 className="mb-2 text-lg font-bold tracking-tight text-white">
                Invitation Expired
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-zinc-400 max-w-[340px] mx-auto">
                {errorMsg ||
                  "This invitation link is no longer valid. Please ask your team to send a new one."}
              </p>
              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-700 hover:bg-zinc-900 no-underline"
              >
                <i className="ti ti-arrow-left text-[14px]" />
                Return Home
              </Link>
            </div>
          )}

          {/* ── INVALID STATE ── */}
          {state === "invalid" && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80">
                <i className="ti ti-link-x text-2xl text-zinc-600" />
              </div>
              <h1 className="mb-2 text-lg font-bold tracking-tight text-white">
                Invalid Invitation
              </h1>
              <p className="mb-8 text-sm leading-relaxed text-zinc-400 max-w-[340px] mx-auto">
                {errorMsg ||
                  "This invite link does not exist or has been revoked."}
              </p>
              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/80 px-6 py-3 text-sm font-medium text-zinc-100 transition-all hover:border-zinc-700 hover:bg-zinc-900 no-underline"
              >
                <i className="ti ti-arrow-left text-[14px]" />
                Return Home
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-4 text-center">
        <p className="text-[11px] text-[#71717a]">
          &copy; {new Date().getFullYear()} WorkVerse. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
