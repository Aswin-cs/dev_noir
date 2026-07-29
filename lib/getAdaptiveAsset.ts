import type { NetworkQuality } from "@/hooks/useNetworkQuality";

/**
 * Asset registry — maps a base name to its available quality files.
 * Each entry maps to: /assets_{quality}/{name}_{quality}.webp
 *
 * Add new project images here when they are added to the public/ directories.
 */
const ASSET_REGISTRY: Record<string, string[]> = {
  crema_bar: ["high", "medium", "low", "lowest"],
  velmora: ["high", "medium", "low", "lowest"],
  whitely: ["high", "medium", "low", "lowest"],
};

/**
 * Resolves the full public path for an adaptive asset.
 *
 * @param baseName  The base name of the asset (e.g., "crema_bar")
 * @param quality   The detected network quality tier
 * @returns         The full path to the appropriate image file
 *
 * @example
 * getAdaptiveAsset("crema_bar", "high")   // → "/assets_high/crema_bar_high.webp"
 * getAdaptiveAsset("crema_bar", "low")    // → "/assets_low/crema_bar_low.webp"
 */
export function getAdaptiveAsset(
  baseName: string,
  quality: NetworkQuality
): string {
  const available = ASSET_REGISTRY[baseName];

  if (!available) {
    // Unknown asset — return a fallback path with medium quality
    console.warn(
      `[getAdaptiveAsset] Unknown asset "${baseName}", falling back to medium`
    );
    return `/assets_medium/${baseName}_medium.webp`;
  }

  // If the requested quality is available, use it
  if (available.includes(quality)) {
    return `/assets_${quality}/${baseName}_${quality}.webp`;
  }

  // Fallback chain: try lower qualities in order
  const fallbackOrder: NetworkQuality[] = ["medium", "low", "lowest"];
  for (const fallback of fallbackOrder) {
    if (available.includes(fallback)) {
      return `/assets_${fallback}/${baseName}_${fallback}.webp`;
    }
  }

  // Last resort — use whatever is first available
  const first = available[0];
  return `/assets_${first}/${baseName}_${first}.webp`;
}

/**
 * Resolves the full public path for a responsive asset optimized for smaller screens.
 * 
 * @param baseName  The base name of the asset (e.g., "crema_bar")
 * @returns         The full path to the appropriate responsive image file
 */
export function getResponsiveAsset(baseName: string): string {
  return `/assets_responsive/${baseName}_responsive.webp`;
}
