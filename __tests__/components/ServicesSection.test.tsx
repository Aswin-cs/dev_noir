import React from "react";
import { render, screen } from "@testing-library/react";
import { ServicesSection } from "@/components/ServicesSection";

describe("ServicesSection Component", () => {
  it("renders SERVICES main heading", () => {
    render(<ServicesSection />);
    const heading = screen.getByRole("heading", { level: 2, name: /SERVICES/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders subtitle text WHAT WE BUILD", () => {
    render(<ServicesSection />);
    expect(screen.getByText(/WHAT WE BUILD/i)).toBeInTheDocument();
  });

  it("renders all freelance service offerings", () => {
    render(<ServicesSection />);

    const expectedServices = [
      "WEB ARCHITECTURE",
      "UI/UX & MOTION DESIGN",
      "FULL-STACK ENGINEERING",
      "AI INTEGRATION",
      "PERFORMANCE OPTIMIZATION",
      "SECURITY & CODE AUDIT",
    ];

    expectedServices.forEach((service) => {
      const items = screen.getAllByText(service);
      expect(items.length).toBeGreaterThan(0);
    });
  });
});
