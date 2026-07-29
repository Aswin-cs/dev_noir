import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectsSection } from "@/components/ProjectsSection";
import { NetworkQualityProvider } from "@/components/NetworkQualityProvider";

describe("ProjectsSection Component", () => {
  it("renders PROJECTS main title heading", () => {
    render(
      <NetworkQualityProvider>
        <ProjectsSection />
      </NetworkQualityProvider>
    );

    const headings = screen.getAllByRole("heading", { level: 2 });
    expect(headings.length).toBeGreaterThan(0);
    expect(headings[0].textContent).toContain("P");
  });

  it("renders project cards for Whitely, Crema Bar, and Velmora", () => {
    render(
      <NetworkQualityProvider>
        <ProjectsSection />
      </NetworkQualityProvider>
    );

    expect(screen.getByText("WHITELY")).toBeInTheDocument();
    expect(screen.getByText("CREMA BAR")).toBeInTheDocument();
    expect(screen.getByText("VELMORA")).toBeInTheDocument();
  });

  it("renders explore links pointing to client project URLs", () => {
    render(
      <NetworkQualityProvider>
        <ProjectsSection />
      </NetworkQualityProvider>
    );

    const whitelyLinks = screen.getAllByRole("link", { name: /EXPLORE PROJECT/i });
    expect(whitelyLinks.length).toBeGreaterThan(0);
    expect(whitelyLinks[0]).toHaveAttribute("href", "https://whitely.vercel.app/");
  });
});
