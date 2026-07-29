import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactSection } from "@/components/ContactSection";

describe("ContactSection Component", () => {
  it("renders CONNECT WITH DEV NOIR heading", () => {
    render(<ContactSection />);
    const heading = screen.getByRole("heading", { level: 2, name: /CONNECT WITH DEV NOIR/i });
    expect(heading).toBeInTheDocument();
  });

  it("renders Instagram channel link pointing to @dev_noir_", () => {
    render(<ContactSection />);
    const instaLink = screen.getByRole("link", { name: /Follow/i });
    expect(instaLink).toBeInTheDocument();
    expect(instaLink).toHaveAttribute("href", "https://instagram.com/dev_noir_");
  });

  it("opens legal disclaimer and terms modal on click", () => {
    render(<ContactSection />);
    const termsBtn = screen.getByRole("button", { name: /Disclaimer & Terms & Conditions/i });
    expect(termsBtn).toBeInTheDocument();

    // Click to open modal
    fireEvent.click(termsBtn);

    expect(screen.getByText(/Disclaimer & Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/01. Intellectual Property & Confidentiality/i)).toBeInTheDocument();
  });
});
