import React from 'react';
import "../Styles/modal.css";
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  categoryName,
  setCategoryName,
  bookTitle,
  setBookTitle,
  bookAuthor,
  quantity,
  setQuantity,
  setBookAuthor,
  isEditing,
  isBookPage
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? `Edit ${isBookPage ? "Book" : "Category"}` : `Add ${isBookPage ? "Book" : "Category"}`}</h2>

        {isBookPage ? (
          <>
            <input
              type="text"
              placeholder="Book Title"
              value={bookTitle}
              onChange={(e) => setBookTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Author"
              value={bookAuthor}
              onChange={(e) => setBookAuthor(e.target.value)}
            />
            <input
            type='text'
            placeholder='Quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            />
          </>
        ) : (
          <input
            type="text"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        )}

        <div>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit}>{isEditing ? "Edit" : "Add"}</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
