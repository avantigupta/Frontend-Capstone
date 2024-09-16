import React, { useEffect } from "react";
import "../styles/modal.css";
import Button from "./button";

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  isDeleteConfirmation,
  logoutConfirm,
  deleteMessage,
  logoutMessage,
  successMessage,
}) => {
  useEffect(() => {
    if (successMessage && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 70000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {successMessage ? (
          <>
            <h2>Success</h2>
            <p>{successMessage}</p>
            <div>
              <Button onClick={onClose}>OK</Button>
            </div>
          </>
        ) : isDeleteConfirmation ? (
          <>
            <h2>Confirm Deletion</h2>
            <p>{deleteMessage}</p>
            <div className="modal-actions">
              
                <Button className="cancel-btn" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="add-btn" onClick={onSubmit}>
                  Delete
                </Button>
              
            </div>
          </>
        ) : logoutConfirm ? (
<>
<h2>Confirm Logout</h2>
<p>{logoutMessage}</p>
<div className="modal-actions">
  <Button className="cancel-btn" onClick={onClose}>No</Button>
  <Button className="add-btn" onClick={onSubmit}>Yes</Button>

</div>
</>
        ):(
          <>
            <h2>{title}</h2>
            {children}
            <div className="modal-actions">
              <Button className="cancel-btn" onClick={onClose}>
                Cancel
              </Button>
              <Button className="add-btn" onClick={onSubmit}>
                {title.includes("Edit") ? "Edit" : "Add"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
