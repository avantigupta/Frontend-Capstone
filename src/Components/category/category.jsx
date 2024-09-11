import React, { useEffect, useState } from "react";
import HocContainer from "../hocContainer";
import Modal from "../modal";
import Table from "../table";
import SearchBox from "../searchBox";
import Toast from "../toast";
import Button from "../button";
import "../../styles/categories.css";
import Loader from "../loader";
import {
  fetch_get,
  fetch_put,
  fetch_post,
  fetch_delete,
} from "../../api/apiManager";
import { validateForm } from "../../utils/formValidation";

const Category = () => {
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => {
    getCategories();
  }, [currentPage, searchQuery]);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch_get(`/api/categories/list`, {
        page: currentPage,
        size: 8,
        search: searchQuery,
      });
      setCategories(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }
  }, [toastMessage]);

  const handleSearch = (query) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
  
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      setTypingTimeout(
        setTimeout(() => {
          setSearchQuery(trimmedQuery);
          setCurrentPage(0);
        }, 500)
      );
    } else {
      setSearchQuery('');
      setCurrentPage(0);
    }
  };
  

  const handleOpenModal = (category = null) => {
    setIsDeleteConfirmation(false);
    if (category) {
      setCategoryName(category.categoryName);
      setEditingCategoryId(category.id);
    } else {
      setCategoryName("");
      setEditingCategoryId(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setError(null);
  };

  const handleSaveCategory = async () => {
    const trimmedCategoryName = categoryName.trim();
    const validationErrors = validateForm({ categoryName: trimmedCategoryName });
    setError(null);
    if (validationErrors.categoryName) {
      setError(validationErrors.categoryName);
      return;
    }

    const categoryData = { id: editingCategoryId, categoryName: trimmedCategoryName };
    setLoading(true);

    try {
      let result;
      if (editingCategoryId) {
        result = await fetch_put(
          `/api/categories/update/${editingCategoryId}`,
          categoryData
        );
        showToast(result.data.message);
      } else {
        result = await fetch_post(`/api/categories/save`, [categoryData]);
        showToast(result.data.message);
      }

      setCategoryName("");
      handleCloseModal();
      getCategories();
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          handleCloseModal();
          showToast(error.response.data.message, "error");
        } else {
          showToast("Failed to save category. Please try again.", "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await fetch_delete(`/api/categories/delete/${categoryToDelete.id}`);
      setCategoryToDelete(null);
      handleCloseModal();
      getCategories();
      showToast(result.data.message);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          handleCloseModal();
          showToast(error.response.data.message, "error");
        } else {
          handleCloseModal();
          showToast("Cannot delete category, it has associated books!", "error");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmation(true);
    setModalOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const columns = [
    { header: "S.No", accessor: "serialNumber" },
    { header: "Category", accessor: "categoryName" },
    {
      header: "Actions",
      accessor: (category) => (
        <>
          <Button className="edit-btn" onClick={() => handleOpenModal(category)}>
            Edit
          </Button>
          <Button className="delete-btn" onClick={() => handleOpenDeleteModal(category)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const dataWithSerialNumbers = categories.map((category, index) => ({
    ...category,
    serialNumber: currentPage * 5 + index + 1,
  }));

  return (
    <div className="category-page">
      <div className="category-content">
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        )}
        <div>
          <SearchBox placeholder="Search..." onSearch={handleSearch} />
        </div>
        <div>
          <Button className="add-category" onClick={() => handleOpenModal(null)}>
            Add Category
          </Button>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={isDeleteConfirmation ? handleDelete : handleSaveCategory}
        title={editingCategoryId ? "Edit Category" : "Add Category"}
        isDeleteConfirmation={isDeleteConfirmation}
        deleteMessage="Are you sure you want to delete this category?"
      >
        {!isDeleteConfirmation && (
          <>
            <input
              type="text"
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </>
        )}
        {error && <div className="error-books">{error}</div>}
      </Modal>
      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <div className="no-books-found">Category not available</div>
      ) : (
        <>
          <Table columns={columns} data={dataWithSerialNumbers} />
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={currentPage === 0}>
              Previous
            </button>
            <span>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HocContainer(Category, "Category");
