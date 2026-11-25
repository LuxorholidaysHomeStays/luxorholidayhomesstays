import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useServerStatus } from "../context/ServerStatusContext";

export default function ServerStatusBanner() {
  const { isServerDown, checking, checkServerHealth } = useServerStatus();

  if (!isServerDown) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 text-white px-4 py-2.5 shadow-lg border-b border-amber-300/40"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-yellow-200 flex-shrink-0 animate-pulse" />
          <span>
            <strong>We will be back soon!</strong> Our booking &amp; search server is temporarily down for maintenance. Active sessions have been safely signed out.
          </span>
        </div>
        <button
          onClick={checkServerHealth}
          disabled={checking}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors disabled:opacity-60 cursor-pointer"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${checking ? "animate-spin" : ""}`} />
          <span>{checking ? "Checking..." : "Retry"}</span>
        </button>
      </div>
    </div>
  );
}
