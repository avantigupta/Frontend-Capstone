import React, { useEffect, useState } from 'react';
import { fetchBooks, updateBook, addBooks, deleteBook} from '../api/service/books';
import HocContainer from "../Components/HocContainer";
import "../Styles/books.css";
import Button from '../Components/Button';
import Modal from '../Components/modal';
import TableComponent from '../Components/TableComponent';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBookId, setEditingBookId] = useState(null);
    const [bookTitle, setBookTitle] = useState("");
    const[quantity, setQuantity]=useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [token, setToken] = useState("");
    const [isEditing, setEditing] = useState(false);

    useEffect(() => {
        const getBooks = async () => {
            try {
                const response = await fetchBooks();
                setBooks(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                } else {
                    setError('Failed to load books');
                }
            } finally {
                setLoading(false);
            }
        };

        const authToken = localStorage.getItem('token');
        console.log('Retrieved token:', authToken);
        setToken(authToken);

        getBooks();
    }, []);

    const handleOpenModal = (book = null) => {
        if (book) {
            setBookTitle(book.title);
            setQuantity(book.quantity);
            setBookAuthor(book.author);
            setEditingBookId(book.id);
        } else {
            setQuantity("");
            setBookTitle("");
            setBookAuthor("");
            setEditingBookId(null);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveBook = async () => {
        const bookData = { title: bookTitle, author: bookAuthor, quantity:quantity };

        try {
            if (editingBookId) {
                await updateBook(editingBookId, bookData, token);
            } else {
                await addBooks([bookData], token);
            }

            setBookTitle("");
            setBookAuthor("");
            setQuantity("");
            handleCloseModal();
            const response = await fetchBooks();
            setBooks(response.data);
        } catch (error) {
            console.error('Error saving book:', error);
            setError('Failed to save book');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBook(id, token);
            const response = await fetchBooks();
            setBooks(response.data);
        } catch (error) {
            console.error('Error deleting book:', error);
            setError('Failed to delete book');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (books.length === 0) return <div>No books available.</div>;

    const columns = [
        { header: 'S.No', accessor: 'serialNumber' },
        { header: 'Book Title', accessor: 'title' },
        {header: 'Quantity', accessor: 'quantity'},
        { header: 'Author', accessor: 'author' },
        {
            header: 'Actions',
            accessor: (book) => (
                <>
                    <button className="edit-btn" onClick={() => handleOpenModal(book)}>Edit</button>
                    <button className="delete-btn" onClick={()=> handleDelete(book.id)}>Delete</button>
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
            <Button className="add-book" onClick={() => handleOpenModal(null)}>Add Book</Button>
            <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveBook}
        bookTitle={bookTitle}
        setBookTitle={setBookTitle}
        bookAuthor={bookAuthor}
        quantity={quantity}
        setQuantity={setQuantity}
       setBookAuthor={setBookAuthor}
        isEditing={isEditing}
        isBookPage={true}
      />
            <TableComponent columns={columns} data={dataWithSerialNumbers} />
        </div>
    );
};

export default HocContainer(Books, "Books");
