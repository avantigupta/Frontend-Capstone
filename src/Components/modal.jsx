import React from 'react';
import "../Styles/modal.css";
import Button from './Button';

const Modal = ({ isOpen, onClose, onSubmit, title, children, isDeleteConfirmation, deleteMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {isDeleteConfirmation ? (
          <>
            <h2>Confirm Deletion</h2>
            <p>{deleteMessage}</p>
            <div>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={onSubmit}>Delete</Button>
            </div>
          </>
        ) : (
          <>
            <h2>{title}</h2>
            {children}
            <div>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={onSubmit}>{title.includes("Edit") ? "Edit" : "Add"}</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
