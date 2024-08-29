import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory, deleteCategory } from '../api/service/category';
import HocContainer from "../Components/HocContainer";
import "../Styles/categories.css";
import Button from '../Components/Button';
import Modal from '../Components/modal';
import TableComponent from '../Components/TableComponent';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");  
    const [token, setToken] = useState("");

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await fetchCategories();
                setCategories(response.data);
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

        const authToken = localStorage.getItem('token');
        console.log('Retrieved token:', authToken); 
        setToken(authToken);

        getCategories();
    }, []);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleAddCategory = async () => {
        const category = [{ categoryName: categoryName }]; 
        try {
            await addCategory(category, token); 
            setCategoryName("");  
            handleCloseModal();
            const response = await fetchCategories(); 
            setCategories(response.data);
        } catch (error) {
            console.error('Error adding category:', error); 
            setError('Failed to add category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id, token); 
            const response = await fetchCategories(); 
            setCategories(response.data);
        } catch (error) {
            console.error('Error deleting category:', error);
            setError('Failed to delete category');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (categories.length === 0) return <div>No categories available.</div>;

    const columns = [
        { header: 'S.No', accessor: 'serialNumber' }, 
        { header: 'Category Name', accessor: 'categoryName' },
        { 
            header: 'Actions', 
            accessor: (category) => (
                <>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(category.id)}>Delete</button>
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
            <Button className="add-category" onClick={handleOpenModal}>Add Category</Button>
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddCategory}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
            />
            <TableComponent columns={columns} data={dataWithSerialNumbers} />
        </div>
    );
};

export default HocContainer(Categories," Categories");
