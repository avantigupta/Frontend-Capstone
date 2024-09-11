import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Modal from "../components/modal";
import Button from "../components/Button";

// Mock Button component to avoid unrelated errors
jest.mock("../components/Button", () => ({ onClick, children, className }) => (
  <button className={className} onClick={onClick}>
    {children}
  </button>
));

describe("Modal component", () => {
  const onCloseMock = jest.fn();
  const onSubmitMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onSubmitMock.mockClear();
  });

  it("renders nothing when isOpen is false", () => {
    const { queryByText } = render(
      <Modal isOpen={false} onClose={onCloseMock} />
    );

    expect(queryByText("Success")).not.toBeInTheDocument();
  });

  it("renders the success message and auto-closes after timeout", () => {
    jest.useFakeTimers();
    render(
      <Modal
        isOpen={true}
        onClose={onCloseMock}
        successMessage="Category added successfully"
      />
    );

    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Category added successfully")).toBeInTheDocument();

    // Fast-forward until the timeout has been called
    jest.advanceTimersByTime(70000);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("renders the deletion confirmation modal", () => {
    render(
      <Modal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        isDeleteConfirmation={true}
        deleteMessage="Are you sure you want to delete this category?"
      />
    );

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this category?")
    ).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();

    // Simulate clicking the Delete button
    fireEvent.click(screen.getByText("Delete"));
    expect(onSubmitMock).toHaveBeenCalledTimes(1);

    // Simulate clicking the Cancel button
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders the add/edit form modal", () => {
    render(
      <Modal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Add Category"
      >
        <input type="text" placeholder="Category Name" />
      </Modal>
    );

    expect(screen.getByText("Add Category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();

    // Simulate clicking the Add button
    fireEvent.click(screen.getByText("Add"));
    expect(onSubmitMock).toHaveBeenCalledTimes(1);

    // Simulate clicking the Cancel button
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders the edit form modal", () => {
    render(
      <Modal
        isOpen={true}
        onClose={onCloseMock}
        onSubmit={onSubmitMock}
        title="Edit Category"
      >
        <input type="text" placeholder="Category Name" />
      </Modal>
    );

    expect(screen.getByText("Edit Category")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Category Name")).toBeInTheDocument();

    // Check if buttons are rendered
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();

    // Simulate clicking the Edit button
    fireEvent.click(screen.getByText("Edit"));
    expect(onSubmitMock).toHaveBeenCalledTimes(1);

    // Simulate clicking the Cancel button
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
