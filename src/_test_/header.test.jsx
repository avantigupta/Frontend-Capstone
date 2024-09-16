import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../components/header";

describe("Header Component", () => {
  // Test 1: Render Header Component
  test("renders Header component", () => {
    render(<Header title="Test Title" />);
    const headerElement = screen.getByRole("heading", { name: /Test Title/i });
    expect(headerElement).toBeInTheDocument();
  });

  // Test 2: Display Logo and Title
  test("displays logo and title", () => {
    render(<Header title="Test Title" />);
    const logoElement = screen.getByAltText("logo");
    const titleElement = screen.getByText("BookNest");
    expect(logoElement).toBeInTheDocument();
    expect(titleElement).toBeInTheDocument();
  });

  // Test 3: Profile Section
  test("displays profile section with image and name", () => {
    render(<Header title="Test Title" />);
    const profileImage = screen.getByAltText("Profile");
    const profileName = screen.getByText(/Hi/i);
    expect(profileImage).toBeInTheDocument();
    expect(profileName).toBeInTheDocument();
  });

  // Test 4: Role Display
  test("displays the role from localStorage", () => {
    // Set up localStorage mock
    const mockRole = "Admin";
    localStorage.setItem("role", mockRole);

    render(<Header title="Test Title" />);

    const profileName = screen.getByText(`Hi ${mockRole}`);
    expect(profileName).toBeInTheDocument();
  });

  // Cleanup after tests
  afterEach(() => {
    localStorage.removeItem("role");
  });
});
