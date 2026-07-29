import React from "react";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/components/Navbar";

describe("Navbar Component", () => {
  it("renders DEV NOIR brand title and logo", () => {
    render(<Navbar />);
    expect(screen.getByText("DEV NOIR")).toBeInTheDocument();
    expect(screen.getByAltText("Dev Noir Logo")).toBeInTheDocument();
  });

  it("renders desktop navigation links for Services, Projects, and Contact", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "#services");
    expect(screen.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "#projects");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "#contact");
  });
});
