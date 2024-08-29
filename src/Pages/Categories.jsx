
import React, { useEffect, useState } from 'react';
import { fetchCategories, addCategory } from '../api/service/category';
import HocContainer from "../Components/HocContainer";
import "../Styles/categories.css";
import Button from '../Components/Button';
import Modal from '../Components/modal';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");  
const[token, setToken]= useState("");
    

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
    const category = [{ name: categoryName }]; 
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (categories.length === 0) return <div>No categories available.</div>;

    return (
        <div className="category-page">
            <Button onClick={handleOpenModal}>Add Category</Button>
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={handleAddCategory}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
            />
            <table className="category-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Category Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{category.categoryName}</td>
                            <td>
                                <button className="edit-btn">Edit</button>
                                <button className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HocContainer(Categories);
