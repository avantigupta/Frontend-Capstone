import Categories from "../../pages/Categories";
import { render } from "@testing-library/react";
import React from "react";
import Category from "../../components/category/category";

jest.mock("../../components/category/category", () => jest.fn());
describe("Category Page testing:", () => {
  test("Test: Page Rendering", () => {
    render(<Categories />);
  });
  test("Test: Component Rendering", () => {
    render(<Category />);
    expect(Category).toHaveBeenCalled();
  });
});