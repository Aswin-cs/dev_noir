import React from "react";
import { render } from "@testing-library/react";
import { CustomCursor } from "@/components/CustomCursor";

describe("CustomCursor Component", () => {
  it("renders fine pointer custom cursor element", () => {
    const { container } = render(<CustomCursor />);
    expect(container).toBeInTheDocument();
  });
});
