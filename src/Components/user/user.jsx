import React, { useEffect, useState } from 'react';
import HocContainer from "../HocContainer";
import Button from '../Button';
import { fetch_get,fetch_delete,fetch_patch,fetch_post, fetch_put} from '../../api/apiManager';
import Modal from '../modal'; 
import { useNavigate } from 'react-router-dom';
import Table from '../Table';
import Dropdown from '../Dropdown';
import '../../styles/users.css';
import SearchBox from '../searchBox';
import Toast from "../Toast";
import ActionIcon from "../../Assets/Icons/more.png";

const Users = () => {
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('success');
   
    const userRole = "USER";
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);  
    const [issueModalOpen, setIssueModalOpen] = useState(false); 
    const [editingUserId, setEditingUserId] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [userToDelete, setUserToDelete] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);  
    const [totalPages, setTotalPages] = useState(0);
    const [returnedAt, setReturnedAt] = useState(null);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [issuanceType, setIssuanceType] = useState("");
    const [issueError, setIssueError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); 
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  
    
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedQuery = searchQuery.trim(); 
        if (trimmedQuery.length >= 3 || trimmedQuery === "") {
        setDebouncedSearchQuery(trimmedQuery); 
        setCurrentPage(0);
      }
    }, 1000);
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  

    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch_get(`/api/v1/users/list`, {
                    page: currentPage,  
                    size: 5,
                    search: debouncedSearchQuery
                });
                setTotalPages(response.data.totalPages);
                setUsers(response.data.content);
            } catch (err) {
              showToast("Failed to load users. Try again later!", 'error')
            } finally {
                setLoading(false);
            }
        };

        const getBooks = async () => {
            try {
                const response = await fetch_get('/api/books/list',{
                    page: currentPage,
                    size: 15,
                    search: debouncedSearchQuery
                });
                setBooks(response.data.content);
            } catch (err) {
            showToast('Failed to load books', 'error')
            }
        };

        getUsers();
        getBooks();
    }, [currentPage, debouncedSearchQuery]);

    const showToast = (message, type = 'success') => {
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

    const handleOpenUserModal = (user = null) => {
        if (user) {
            setUserName(user.name || "");
            setUserEmail(user.email || "");
            setPhoneNumber(user.phoneNumber || "");
            setEditingUserId(user.id);
        } else {
            setUserName("");
            setUserEmail("");
            setPhoneNumber("");
            setEditingUserId(null);
        }
        setModalOpen(true);
    };

    const handleOpenIssueModal = (user) => {
        setSelectedBook(null);
        setIssuanceType("");
        setIssueError(null);
        setEditingUserId(user.id); 
        setIssueModalOpen(true);
    };

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setIssueModalOpen(false);
        setDeleteModalOpen(false);
        setSuccessMessage(null);
        setError(null);
        setIssueError(null);
    }
    
    const handleSaveUser = async () => {
        if (!userName || !userEmail || !phoneNumber) {
            setIssueError("All fields are required.");
            return;
        }
    const digitOnlyRegex = /^\d+$/;
    if (!digitOnlyRegex.test(phoneNumber)) {
        setIssueError("Phone number cannot contain letters or special characters.");
        return;
    }
    if (phoneNumber.length !== 10) {
        setIssueError("Phone number must be exactly 10 digits.");
        return;
    }

    const userData = {
            id: editingUserId,
            name: userName,
            email: userEmail,
            role: userRole,
            phoneNumber, 
    };

    try {
            if (editingUserId) {
                await fetch_patch(`/api/v1/users/update/${editingUserId}`, userData);
                showToast("User updated successfully!");

            } else {
                await fetch_post(`/api/v1/users/register`, [userData]);
                showToast("User added successfully!");
            }

            setModalOpen(false);
            setUserName("");
            setUserEmail("");
            setPhoneNumber("");
            const response = await fetch_get(`/api/v1/users/list`,{ page: currentPage, size: 5, search: debouncedSearchQuery });
            setUsers(response.data.content);

        } catch (error) {
          setIssueError(error.response.data.message)
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch_delete(`/api/v1/users/delete/${userToDelete.id}`);
            setUserToDelete(null);
            setDeleteModalOpen(false);
            const updatedUsers = await fetch_get(`/api/v1/users/list`, { page: currentPage, size: 5, search: debouncedSearchQuery });
            setUsers(updatedUsers.data.content);
            showToast(response.data.message);
    
        } catch (error) {
            showToast(error.response.data.message, "error")
        }
    };
    
    

    const handleSelectBook = (option) => {
        setSelectedBook(books.find(book => book.title === option.label));
    };
    
    const handleIssueBook = async () => {
        if (!selectedBook || !issuanceType || !returnedAt || !editingUserId) {
            setIssueError('All fields are required for issuing a book.');
            console.log('selectedBook:', selectedBook);
            console.log('issuanceType:', issuanceType);
            console.log('returnedAt:', returnedAt);
            console.log('editingUserId:', editingUserId);
            return;
        }
    
        try {
            const formattedReturnedAt = formatDateTime(new Date(returnedAt));
            
            const issuanceData = {
                userId: editingUserId,
                bookId: selectedBook.id,
                issuedAt: formatDateTime(new Date()),
                returnedAt: formattedReturnedAt,
                issuanceType,
                status: "ISSUED",
            };
            const result = await fetch_post('/api/v1/issuances/save', issuanceData);
            
            setSelectedBook(null);
            setIssuanceType("");
            setReturnedAt(null);
            handleCloseModal();
            showToast(result.data.message);
    
            const response = await fetch_get('/api/v1/users/list');
            setUsers(response.data.content);
    
        } catch (error) {
            handleCloseModal();
            console.error("Error issuing book:", error);
            showToast("Failed to issue book", 'error');
        }
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
    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16); 
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
    const handleSelect = (option, user) => {
        switch(option.value) {
            case 'edit':
                handleOpenUserModal(user);
                break;
            case 'delete':
                handleOpenDeleteModal(user);
                break;
            case 'issue':
                handleOpenIssueModal(user);
                break;
            case 'history':
                navigate(`/user-history/${user.id}`);
                break;
        }
    };

    const dropdownOptions = [
        { label: 'Edit', value: 'edit' },
        { label: 'Delete', value: 'delete' },
        { label: 'Issue', value: 'issue' },
        { label: 'History', value: 'history' },
    ];
    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(0); 
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const columns = [
        { header: 'S.NO.', accessor: 'serialNumber' },
        { header: 'User Name', accessor: 'name' },
        { header: 'User Email', accessor: 'email' },
        { header: 'Phone Number', accessor: 'phoneNumber' },
        { 
            header: 'Options', 
            accessor: (user) => (
                <>
                  <Dropdown 
                    options={dropdownOptions} 
                    onSelect={(option) => handleSelect(option, user)} 
                    imageSrc={ActionIcon} 
                    triggerOnHover={true} 
                  />
                </>
            )
        }
    ];

    const dataWithSerialNumbers = users.map((user, index) => ({
        ...user,
        serialNumber: currentPage * 5 + index + 1, 
    }));

    return (
        <div className="users-page">
            <div className='users-content'>
            {toastMessage && (
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setToastMessage(null)}
                    />
                )}
            <div><SearchBox placeholder="Search..."  onSearch={handleSearch} /></div>
           <div><Button className="add-user" onClick={() => handleOpenUserModal(null)}>Add User</Button></div> 
            </div>
          
    <Modal
    isOpen={modalOpen || deleteModalOpen || issueModalOpen}  
    onClose={handleCloseModal}
    onSubmit={
        deleteModalOpen 
            ? handleDelete 
            : issueModalOpen 
            ? handleIssueBook 
            : handleSaveUser
    }
    title={
        deleteModalOpen 
            ? "Confirm Deletion" 
            : issueModalOpen 
            ? "Issue Book" 
            : editingUserId 
            ? "Edit User" 
            : "Add User"
    }
    deleteMessage={`Are you sure you want to delete this user?`}
    successMessage={successMessage}
    isDeleteConfirmation={deleteModalOpen}
    issueError={issueError}

>
    {deleteModalOpen ? (
        <div className="confirm-delete">
            <p>Are you sure you want to delete this user?</p>
        </div>
    ) : issueModalOpen ? (
        <div className='issue-book'>
   <Dropdown
    className="model-content"
    options={books.map(book => ({ label: book.title, value: book.id }))}
    onSelect={handleSelectBook}
    useInput={true}
    placeholder="Search for a book"
    value={selectedBook ? selectedBook.label : ""}
/>
        
            <select
                value={issuanceType}
                onChange={(e) => setIssuanceType(e.target.value)}
            >
                <option value="" disabled>Select Issuance Type</option>
                <option value="InHouse">In House</option>
                <option value="Takeaway">Takeaway</option>
            </select>
            <input
                type="datetime-local"
                value={returnedAt}
                onChange={(e) => setReturnedAt(e.target.value)}
                min={getCurrentDateTime()}
            />
            {issueError && <div className="error-books">{issueError}</div>}
        </div>
    ) : (
        <>
            <input
                type="text"
                placeholder="Enter User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Enter Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
            />
            <input
                type="tel"
                placeholder="Enter Phone Number"
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                maxLength={10}
                pattern="\d{10}"
            />
            {issueError && <div className="error-books">{issueError}</div>}
        </>
    )}
</Modal>

            {users.length === 0 ? (
                <div className='no-books-found'>Users not found!</div>
            ):(
                <>
            <Table columns={columns} data={dataWithSerialNumbers} />
            <div className="pagination-controls">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                <span>
              Page {currentPage + 1} of {totalPages}
            </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
            </div>
            </>
            )}
        </div>
    );
};

export default HocContainer(Users, "Users");

