import React, { useEffect, useState } from 'react';
import HocContainer from "../Components/HocContainer";
import "../Styles/categories.css";
import Button from '../Components/Button';
import {_get, _put, _post, _delete } from '../api/apiManager'
import Modal from '../Components/modal';
import Table from '../Components/Table';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [categoryName, setCategoryName] = useState(""); 
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false); 
    const [categoryToDelete, setCategoryToDelete] = useState(null); 
    const [currentPage, setCurrentPage] = useState(0);  
    const [totalPages, setTotalPages] = useState(0);  

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await _get(`/api/categories/list`, {
                    page: currentPage,  
                    size: 5
                });
                console.log(response);
                setCategories(response.data.content);
                setTotalPages(response.data.totalPages); 
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                } else {
                    setError('Failed to load categories');
                }
            } finally {
                setLoading(false);
            }
        };
    
        getCategories();
    }, [currentPage]);  
    
    const handleOpenModal = (category = null) => {
        if (category) {
          setCategoryName(category.categoryName);
          setEditingCategoryId(category.id);
        } else {
          setCategoryName("");
          setEditingCategoryId(null);
        }
        
        setIsDeleteConfirmation(false); 
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveCategory = async () => {
        const categoryData = { id:editingCategoryId, categoryName:categoryName };
    
        try {
          let result;
          if (editingCategoryId) {
            result = await _put(`/api/categories/update/${editingCategoryId}`,categoryData)
          } else {
            result = await _post(`/api/categories/save`,[categoryData]);
          }

          setCategoryName("");
          handleCloseModal();
          const response = await _get(`/api/categories`);
          setCategories(response.data);
        } catch (error) {
          setError('Failed to save category');
        }
      };
      

      const handleDelete = async () => {
        try {
            const response = await _delete(`/api/categories/delete/${categoryToDelete.id}`);
            setCategoryToDelete(null);
            handleCloseModal();
            const updatedCategories = await _get(`/api/categories`);
            setCategories(updatedCategories.data);
        } catch (error) {
            setError(`Failed to delete category: ${error.response?.data?.message || error.message}`);
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
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const columns = [
        { header: 'S.No', accessor: 'serialNumber' }, 
        { header: 'Category Name', accessor: 'categoryName' },
        { 
            header: 'Actions', 
            accessor: (category) => (
                <>
                    <button className="edit-btn" onClick={() => handleOpenModal(category)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleOpenDeleteModal(category)}>Delete</button>
                </>
            )
        }
    ];

    const dataWithSerialNumbers = categories.map((category, index) => ({
        ...category,
        serialNumber: index + 1, 
    }));

    return (
        <div className="category-page">
            <Button className="add-category" onClick={() => handleOpenModal(null)}>Add Category</Button>
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={isDeleteConfirmation ? handleDelete : handleSaveCategory} 
                title={editingCategoryId ? "Edit Category" : "Add Category"}
                isDeleteConfirmation={isDeleteConfirmation}
                deleteMessage={`Are you sure you want to delete this category ?`}
            >
                {
                    !isDeleteConfirmation && (
                        <>
                          <input 
                            type='text'
                            placeholder='Category Name'
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                          />
                        </>
                    )
                }
            </Modal>
            {categories.length === 0 ? (
                <div>No categories available.</div>
            ) : (
                <>
                <Table columns={columns} data={dataWithSerialNumbers} />
                <div className="pagination-controls">
                    <button onClick={handlePreviousPage} disabled={currentPage === 0}>
                        Previous
                    </button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage >= totalPages - 1}>
                        Next
                    </button>
                </div>
                </>
            )}
        </div>
    );
};

export default HocContainer(Categories, "Categories");

