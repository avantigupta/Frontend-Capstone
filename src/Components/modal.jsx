import React from 'react';
import "../Styles/modal.css";
import Button from './Button';
const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  isEditing 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "Edit Category" : "Add Category"}</h2>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
       
        <div>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>{isEditing ? "Edit" : "Add"}</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
