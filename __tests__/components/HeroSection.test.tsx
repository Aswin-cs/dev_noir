import React from "react";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/components/HeroSection";
import { NetworkQualityProvider } from "@/components/NetworkQualityProvider";

describe("HeroSection Component", () => {
  it("renders kinetic title text DEV NOIR", () => {
    render(
      <NetworkQualityProvider>
        <HeroSection />
      </NetworkQualityProvider>
    );

    const titleHeading = screen.getByRole("heading", { level: 1 });
    expect(titleHeading).toBeInTheDocument();
    expect(titleHeading.textContent).toContain("NOIR");
  });

  it("renders hero tagline description", () => {
    render(
      <NetworkQualityProvider>
        <HeroSection />
      </NetworkQualityProvider>
    );

    expect(
      screen.getByText(/Minimalist digital architecture, motion visuals, and black & white aesthetic/i)
    ).toBeInTheDocument();
  });

  it("renders explore scroll down button with data-cursor-text attribute", () => {
    render(
      <NetworkQualityProvider>
        <HeroSection />
      </NetworkQualityProvider>
    );

    const exploreBtn = screen.getByRole("button", { name: /EXPLORE/i });
    expect(exploreBtn).toBeInTheDocument();
    expect(exploreBtn).toHaveAttribute("data-cursor-text", "EXPLORE");
  });
});
