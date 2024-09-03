import React, { useEffect, useState } from 'react';
import HocContainer from "../Components/HocContainer";
import "../Styles/books.css";
import Button from '../Components/Button';
import Modal from '../Components/modal';
import Table from '../Components/Table';
import { _delete, _post, _get, _put } from '../api/apiManager';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);
    const [bookTitle, setBookTitle] = useState("");
    const [quantity, setQuantity] = useState(null);
    const [bookAuthor, setBookAuthor] = useState("");
    const [categoryForBook, setCategoryForBook] = useState("");
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [bookToDelete, setBookToDelete] = useState(null);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const [booksResponse, categoriesResponse] = await Promise.all([
                    _get(`/api/books`),
                    _get(`/api/categories`)
                ]);

                setBooks(booksResponse.data);
                setCategories(categoriesResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                } else {
                    setError('Failed to load books');
                }
            } finally {
                setLoading(false);
            }
        };

        getBooks();
    }, []);

    const handleOpenModal = (book = null) => {
        if (book) {
            setCategoryForBook(book.category ? book.category.id : "");
            setBookTitle(book.title);
            setQuantity(book.quantity);
            setBookAuthor(book.author);
            setEditingBookId(book.id);
        } else {
            setCategoryForBook("");
            setQuantity(null);
            setBookTitle("");
            setBookAuthor("");
            setEditingBookId(null);
        }
        setIsDeleteConfirmation(false);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveBook = async () => {
        if (!bookTitle || !bookAuthor || quantity === null || !categoryForBook) {
            console.error('All fields are required');
            return;
        }

        const bookData = {
            title: bookTitle,
            author: bookAuthor,
            quantity: quantity,
            categoryId: categoryForBook,
        };

        try {
            if (editingBookId) {
                await _put(`/api/books/update/${editingBookId}`, bookData);
            } else {
                await _post(`/api/books/save`, bookData);
            }

            setCategoryForBook("");
            setBookTitle("");
            setBookAuthor("");
            setQuantity(null);
            handleCloseModal();
            const response = await _get(`/api/books`);
            setBooks(response.data);
        } catch (error) {
            console.error('Error saving book:', error);
            setError('Failed to save book');
        }
    };

    const handleDelete = async () => {
        try {
            await _delete(`/api/books/delete/${bookToDelete.id}`);
            setBookToDelete(null);
            handleCloseModal();
            const response = await _get(`/api/books`);
            setBooks(response.data);
        } catch (error) {
            console.error('Error deleting book:', error);
            setError('Failed to delete book');
        }
    };

    const handleOpenDeleteModal = (book) => {
        setBookToDelete(book);
        setIsDeleteConfirmation(true);
        setModalOpen(true);
    };

    const isSaveDisabled = !bookTitle || !bookAuthor || quantity === null || !categoryForBook;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const columns = [
        { header: 'S.No', accessor: 'serialNumber' },
        { header: 'Book Title', accessor: 'title' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Author', accessor: 'author' },
        {
            header: 'Category',
            accessor: (book) => book.category ? book.category.categoryName : 'No Category'
        },
        {
            header: 'Actions',
            accessor: (book) => (
                <>
                    <button className="edit-btn" onClick={() => handleOpenModal(book)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleOpenDeleteModal(book)}>Delete</button>
                </>
            )
        }
    ];

    const dataWithSerialNumbers = books.map((book, index) => ({
        ...book,
        serialNumber: index + 1,
    }));

    return (
        <div className="book-page">
            <Button 
                className="add-book" 
                onClick={() => handleOpenModal(null)}
                disabled={isSaveDisabled} 
            >
                Add Book
            </Button>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={isDeleteConfirmation ? handleDelete : handleSaveBook}
                title={editingBookId ? "Edit Book" : "Add Book"}
                isDeleteConfirmation={isDeleteConfirmation}
                deleteMessage={`Are you sure you want to delete this book ?`}
            >
                {!isDeleteConfirmation && (
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
                            type="text"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                        <select
                            value={categoryForBook}
                            onChange={(e) => setCategoryForBook(e.target.value)}
                        >
                            <option value="" disabled>Select Category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </select>
                    </>
                )}
            </Modal>
            {books.length === 0 ? (
                <div>No Books available</div>
            ) : (
                <Table columns={columns} data={dataWithSerialNumbers} />
            )}
        </div>
    );
};

export default HocContainer(Books, "Books");
