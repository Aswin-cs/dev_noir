"use client";

import React, { createContext, useContext } from "react";
import { useNetworkQuality, type NetworkQuality } from "@/hooks/useNetworkQuality";

interface NetworkQualityContextValue {
  /** Current asset quality tier based on network speed */
  quality: NetworkQuality;
  /** True while the initial detection is still running */
  isDetecting: boolean;
}

const NetworkQualityContext = createContext<NetworkQualityContextValue>({
  quality: "medium",
  isDetecting: true,
});

/**
 * Wrap your app with this provider so any child component can call
 * `useNetworkQualityContext()` to get the current asset quality tier.
 */
export function NetworkQualityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useNetworkQuality();

  return (
    <NetworkQualityContext.Provider value={value}>
      {children}
    </NetworkQualityContext.Provider>
  );
}

/**
 * Consume the network quality context from any child component.
 * Must be used within a `<NetworkQualityProvider>`.
 */
export function useNetworkQualityContext(): NetworkQualityContextValue {
  return useContext(NetworkQualityContext);
}
