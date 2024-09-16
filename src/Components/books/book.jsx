import React, { useEffect, useState } from "react";
import hocContainer from "../hocContainer";
import "../../styles/books.css";
import Button from "../button";
import Modal from "../modal";
import Table from "../table";
import SearchBox from "../searchBox";
import {
  fetch_delete,
  fetch_get,
  fetch_put,
  fetch_post,
} from "../../api/apiManager";
import Toast from "../toast";
import Dropdown from "../dropdown";
import { useNavigate } from "react-router-dom";
import Loader from "../loader";
import ActionIcon from "../../assets/icons/more.png";
import { BOOK_DELETE, BOOK_POST, BOOK_UPDATE, BOOKS_API, CATEGORY, ISSUANCES_POST, USERS_BY_MOBILE_NUMBER } from "../../utils/constants";

const Books = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [bookTitle, setBookTitle] = useState("");
  const [quantity, setQuantity] = useState(null);
  const [bookAuthor, setBookAuthor] = useState("");
  const [categoryForBook, setCategoryForBook] = useState("");
  const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [issuanceType, setIssuanceType] = useState("");
  const [status, setStatus] = useState("");
  const [issueError, setIssueError] = useState(null);
  const [returnedAt, setReturnedAt] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [userName, setUserName] = useState("");
  const [returnTime, setReturnTime] = useState("");

  const fetchBooksAndCategories = async () => {
    setLoading(true); 
    try {
      const [booksResponse, categoriesResponse] = await Promise.all([
        fetch_get(`${BOOKS_API}`, {
          page: currentPage,
          size: 8,
          search: debouncedSearchQuery,
        }),
        fetch_get(`${CATEGORY}`),
      ]);

      setBooks(booksResponse.data.content);
      setTotalPages(booksResponse.data.totalPages);
      setCategories(categoriesResponse.data);
      setError(null);
    } catch (err) {
      setError("Failed to load books, try again later!");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchBooksAndCategories();
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length >= 3 || trimmedQuery === "") {
               setDebouncedSearchQuery(trimmedQuery); 
              setCurrentPage(0);
       }
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleMobileNumberChange = async (e) => {
    const mobile = e.target.value;
    setMobileNumber(mobile);

    if (mobile.length < 10) {
      setUserName("");
      setIssueError("");
      return; 
    }

    if (mobile.length === 10) {
      try {
        const userResponse = await fetch_get(`${USERS_BY_MOBILE_NUMBER}${mobile}`);
        const userName = userResponse.data.name;
        setUserName(userName);
        setIssueError(""); 
      } catch (error) {
        setUserName(""); 
        setIssueError("User not found with this mobile number.");
      }
    } else {
      setUserName("");
      setIssueError("");
    }
};

  const handleHistoryModal = (book) => {
    navigate(`/bookHistory/${book.id}`);
  };

  const handleCloseHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setHistoryData([]);
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (toastMessage) {
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }
  }, [toastMessage]);

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
    setIssueError(""); 

  };

  const handleCloseModal = () => {
    setSelectedBook(null)
    setIssueError(null)
    setModalOpen(false);
  };
  const validateBookTitle = (title) => {
    const titleRegex = /^[a-zA-Z0-9\s.,'-]+$/; 
    return titleRegex.test(title);
  };
  
  const validateBookAuthor = (author) => {
    const authorRegex = /^[a-zA-Z\s.']+$/; 
    return authorRegex.test(author);
  };

  const validateQuantity = (value) => {
    if (!/^\d+$/.test(value)) return { valid: false, error: "Quantity must be a non-negative whole number." };
    return { valid: true, error: null };
  };
  const handleSaveBook = async () => {
    const trimmedBookTitle = bookTitle.trim();
    const quantityValidation = validateQuantity(quantity);

  
    if (!trimmedBookTitle || !bookAuthor || quantity === null || !categoryForBook) {
      setIssueError("All fields are required!");
      return;
    }
  
    if (!validateBookTitle(trimmedBookTitle)) {
      setIssueError("Book title cannot contain special characters.");
      return;
    }
  
    if (!validateBookAuthor(bookAuthor)) {
      setIssueError("Author name cannot contain special characters.");
      return;
    }

    if (!quantityValidation.valid) {
    setIssueError(quantityValidation.error);
    return;
    }
    
    const bookData = {
      title: trimmedBookTitle,
      author: bookAuthor,
      quantity: parseInt(quantity, 10),
      categoryId: categoryForBook,
    };
    setLoading(true)
    try {
      let result;
      if (editingBookId) {
        result = await fetch_put(`${BOOK_UPDATE}${editingBookId}`, bookData);
      } else {
        result = await fetch_post(`${BOOK_POST}`, bookData);
      }
  
      showToast(result.data.message);
  
      setCategoryForBook("");
      setBookTitle("");
      setBookAuthor("");
      setQuantity(null);
      handleCloseModal();
  
      const response = await fetch_get(`${BOOKS_API}`, {
        page: currentPage,
        size: 8,
        search: debouncedSearchQuery,
      });
      setBooks(response.data.content);
    } catch (error) {
      setIssueError(error.response.data.message)
    }finally{
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    setLoading(true);
    try {
      const result = await fetch_delete(`${BOOK_DELETE}${bookToDelete.id}`);
      setBookToDelete(null);
      handleCloseModal();
      const response = await fetch_get(`${BOOKS_API}`, {
        page: currentPage,
        size: 8,
        search: debouncedSearchQuery,
      });
      setBooks(response.data.content);
      showToast(result.data.message);
    } catch (error) {
      handleCloseModal();
      showToast(error.response.data.message, "error")
    }finally{
      setLoading(false)
    }
  };

  const handleOpenDeleteModal = (book) => {
    setBookToDelete(book);
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

  const handleIssueModal = (book) => {
    setSelectedBook(book);
    setBookTitle(book.title);
    setBookAuthor(book.author);
    setMobileNumber("");
    setIssuanceType("");
    setStatus("");
    setIssueError(null);
    setReturnedAt(null);
    setIsDeleteConfirmation(false);
    setModalOpen(true);
  };

  const handleIssueBook = async () => {
    if (!selectedBook || !mobileNumber || !issuanceType || !status || (!returnedAt && issuanceType === "Takeaway") || (!returnTime && issuanceType === "InHouse")) {
      setIssueError("All fields are required for issuing a book!");
      return;
    }
  
    try {
      const userResponse = await fetch_get(`${USERS_BY_MOBILE_NUMBER}${mobileNumber}`);
      const userId = userResponse.data.id;
      let returnDateTime;
      if (issuanceType === "InHouse") {
        const currentDate = new Date().toISOString().split('T')[0];
        returnDateTime = `${currentDate}T${returnTime}:00`;
      } else {
        returnDateTime = returnedAt;
      }
      const issuanceData = {
        userId: userId,
        bookId: selectedBook.id,
        issuedAt: formatDateTime(new Date()),
        returnedAt: formatDateTime(new Date(returnDateTime)),
        issuanceType: issuanceType,
        status: status,
      };
  
      const result = await fetch_post(`${ISSUANCES_POST}`, issuanceData);
  
      setSelectedBook("");
      setMobileNumber("");
      setIssuanceType("");
      setStatus("");
      setReturnedAt(null);
      handleCloseModal();
      showToast(result.data.message);
      navigate('/issuances');
    } catch (error) {
      handleCloseModal();
  
      if (error.response && error.response.data) {
        setIssueError(error.response.data.message || "Failed to issue book");
      } else {
        setIssueError("Failed to issue book");
      }
    }
  };
  
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setIssueError(""); 
  };

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };
  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const getCurrentDateTime = () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      return now.toISOString().slice(0, 16);
  };
  
  if (error) return <div>{error}</div>;

  const columns = [
    { header: "S.No", accessor: "serialNumber" },
    { header: "Book Title", accessor: "title" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Author", accessor: "author" },
    {
      header: "Category",
      accessor: (book) =>
        book.category ? book.category.categoryName : "No Category",
    },
    {
      header: "Actions",
      accessor: (book) => (
        <Dropdown
          options={[
            { label: "Edit", action: () => handleOpenModal(book) },
            { label: "Delete", action: () => handleOpenDeleteModal(book) },
            { label: "Issue", action: () => handleIssueModal(book),  disabled: book.quantity === 0 },
            { label: "History", action: () => handleHistoryModal(book) },
          ]}
          onSelect={(option) => {
            if (!option.disabled) { 
              option.action();
            }
          }}
          imageSrc={ActionIcon}
          shouldFilter={false}
          triggerOnHover={true}
        />
      ),
    },
  ];

  const dataWithSerialNumbers = books.map((book, index) => ({
    ...book,
    serialNumber: currentPage * 8 + index + 1,
  }));

  return (
    <div className="book-page">
      <div className="book-content">
        
        {toastMessage && (
          <Toast
            message={toastMessage}
            type={toastType}
            onClose={() => setToastMessage(null)}
          />
        )}

        <div>
          <SearchBox placeholder="Search..." onSearch={handleSearch} />
        </div>
        <div>
          <Button
            onClick={() => handleOpenModal(null)}
          >
            Add Book
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={
          isDeleteConfirmation
            ? handleDelete
            : selectedBook
            ? handleIssueBook
            : handleSaveBook
        }
        title={
          isDeleteConfirmation
            ? "Delete Book"
            : selectedBook
            ? "Issue Book"
            : editingBookId
            ? "Edit Book"
            : "Add Book"
        }
        isDeleteConfirmation={isDeleteConfirmation}
        deleteMessage="Are you sure you want to delete this book?"
      >
        {!isDeleteConfirmation && !selectedBook && (
          <>
            <input
              type="text"
              placeholder="Book Title"
              value={bookTitle}
              onChange={handleInputChange(setBookTitle)}
            />
            <input
              type="text"
              placeholder="Author"
              value={bookAuthor}
              onChange={handleInputChange(setBookAuthor)}
            />
            <input
  type="text"
  placeholder="Quantity"
  value={quantity}
  onChange={(e) => {
    const value = e.target.value;
    setQuantity(value);
    const validation = validateQuantity(value);
    if (!validation.valid) {
      setIssueError(validation.error);
    } else {
      setIssueError(null);
    }
  }}
/>
            <select
              value={categoryForBook}
              onChange={(e) => setCategoryForBook(e.target.value)}
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </>
        )}

        {selectedBook && (
          <>
          
            <input
              type="text"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={handleMobileNumberChange}
            />
          
            <select
              value={issuanceType}
              onChange={(e) => setIssuanceType(e.target.value)}
            >
              <option value="" disabled>
                Select Issuance Type
              </option>
              <option value="InHouse">InHouse</option>
              <option value="Takeaway">Takeaway</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="" disabled>
                Select Status
              </option>
              <option value="ISSUED">Issued</option>
            </select>
          
            {issuanceType === "InHouse" ? (
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                min={getCurrentTime()}
              />
            ) : (
              <input
                type="datetime-local"
                value={returnedAt}
                onChange={(e) => setReturnedAt(e.target.value)}
                min={getCurrentDateTime()}
              />
            )}
          </>
        )}
          {mobileNumber && userName && (
              <span className="username-mobile">
                Username found with name {userName}
              </span>
            )}
        {issueError && <div className="error-books">{issueError}</div>}

      </Modal>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={handleCloseHistoryModal}
        title="Issuance History"
      >
        {historyData.length > 0 ? (
          <ul>
            {historyData.map((entry, index) => (
              <li key={index}>
                <p>Mobile Number: {entry.mobileNumber}</p>
                <p>Issuance Type: {entry.issuanceType}</p>
                <p>Issued At: {formatDateTime(new Date(entry.issuedAt))}</p>
                <p>
                  Returned At:{" "}
                  {entry.returnedAt
                    ? formatDateTime(new Date(entry.returnedAt))
                    : "Not Returned Yet"}
                </p>
                <p>Status: {entry.status}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Issuance History not found.</p>
        )}
      </Modal>

      {loading ? (
        <Loader />
      ): books.length === 0 ? (
        <div className="no-books-found">No books available</div>
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
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default hocContainer(Books, "Books");
