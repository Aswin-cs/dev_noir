"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Network quality tiers — maps to asset directory suffixes.
 * "high" → assets_high, "medium" → assets_medium, etc.
 */
export type NetworkQuality = "high" | "medium" | "low" | "lowest";

/**
 * Extend Navigator to include the Network Information API
 * (available in Chromium-based browsers).
 */
interface NetworkInformation extends EventTarget {
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  downlink: number; // Mbps
  saveData: boolean;
  addEventListener(type: "change", listener: () => void): void;
  removeEventListener(type: "change", listener: () => void): void;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

/** Resolve quality tier from the Network Information API. */
function resolveFromConnectionAPI(conn: NetworkInformation): NetworkQuality {
  const { effectiveType, downlink, saveData } = conn;

  // Data-saver always gets lower tier
  if (saveData) {
    return effectiveType === "4g" ? "low" : "lowest";
  }

  switch (effectiveType) {
    case "slow-2g":
    case "2g":
      return "lowest";
    case "3g":
      return "low";
    case "4g":
      if (downlink < 2) return "medium";
      return "high";
    default:
      return "medium";
  }
}

/**
 * Download speed probe fallback.
 * Downloads a small test image and measures the elapsed time
 * to estimate connection speed in Mbps.
 */
async function probeDownloadSpeed(): Promise<NetworkQuality> {
  const PROBE_URL = "/network-probe.png"; // ~5 KB test file
  const PROBE_SIZE_BYTES = 10 * 1024; // approximate size (~10 KB)

  try {
    const startTime = performance.now();
    const response = await fetch(`${PROBE_URL}?t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return "medium"; // fallback on fetch error
    }

    await response.arrayBuffer();
    const endTime = performance.now();

    const durationSeconds = (endTime - startTime) / 1000;
    const bitsLoaded = PROBE_SIZE_BYTES * 8;
    const speedMbps = bitsLoaded / durationSeconds / 1_000_000;

    if (speedMbps < 0.5) return "lowest";
    if (speedMbps < 1.5) return "low";
    if (speedMbps < 5) return "medium";
    return "high";
  } catch {
    return "medium"; // safe default on network error
  }
}

/** Get the Network Information API connection object, if available. */
function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as NavigatorWithConnection;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}

/**
 * React hook that detects the client's network quality and returns
 * a reactive tier string. Listens for connection changes so the tier
 * updates automatically (e.g., WiFi → cellular).
 *
 * @returns {{ quality: NetworkQuality; isDetecting: boolean }}
 */
export function useNetworkQuality(): {
  quality: NetworkQuality;
  isDetecting: boolean;
} {
  const [quality, setQuality] = useState<NetworkQuality>("medium");
  const [isDetecting, setIsDetecting] = useState(true);

  const detect = useCallback(async () => {
    const conn = getConnection();

    if (conn) {
      // Tier 1: Network Information API available
      const resolved = resolveFromConnectionAPI(conn);
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[NetworkQuality] API detected → effectiveType=${conn.effectiveType}, downlink=${conn.downlink}Mbps, saveData=${conn.saveData} → tier="${resolved}"`
        );
      }
      setQuality(resolved);
      setIsDetecting(false);
    } else {
      // Tier 2: Download speed probe fallback
      if (process.env.NODE_ENV === "development") {
        console.log("[NetworkQuality] No connection API — running download probe…");
      }
      const probed = await probeDownloadSpeed();
      if (process.env.NODE_ENV === "development") {
        console.log(`[NetworkQuality] Probe result → tier="${probed}"`);
      }
      setQuality(probed);
      setIsDetecting(false);
    }
  }, []);

  useEffect(() => {
    detect();

    // Listen for network changes (Chromium only)
    const conn = getConnection();
    if (conn) {
      const handleChange = () => {
        const updated = resolveFromConnectionAPI(conn);
        if (process.env.NODE_ENV === "development") {
          console.log(`[NetworkQuality] Connection changed → tier="${updated}"`);
        }
        setQuality(updated);
      };
      conn.addEventListener("change", handleChange);
      return () => conn.removeEventListener("change", handleChange);
    }
  }, [detect]);

  return { quality, isDetecting };
}
