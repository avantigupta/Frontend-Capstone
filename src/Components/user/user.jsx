    import React, { useEffect, useState } from 'react';
    import HocContainer from "../hocContainer";
    import Button from '../button';
    import { fetch_get,fetch_delete,fetch_patch,fetch_post} from '../../api/apiManager';
    import Modal from '../modal'; 
    import { useNavigate } from 'react-router-dom';
    import Table from '../table';
    import Dropdown from '../dropdown';
    import '../../styles/users.css';
    import SearchBox from '../searchBox';
    import Toast from "../toast";
    import ActionIcon from "../../assets/icons/more.png";
    import Loader from '../loader';
    import { BOOK_SUGGESTIONS, ISSUANCES_POST, USER_DELETE, USER_REGISTER, USER_UPDATE, USERS_API } from '../../utils/constants';

    const Users = () => {
        const userRole = "USER";
        const [toastMessage, setToastMessage] = useState(null);
        const [toastType, setToastType] = useState('success');
        const [users, setUsers] = useState([]);
        const [loading, setLoading] = useState(false);
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
        const [historyData, setHistoryData] = useState([]);
        const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
        const [returnTime, setReturnTime] = useState("");
    
        const navigate = useNavigate();

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
    
        useEffect(()=>{
            getUsers();
            getBooks();
        },[currentPage, debouncedSearchQuery])
        
        const getUsers = async () => {
            setLoading(true)
                try {
                    const response = await fetch_get(`${USERS_API}`, {
                        page: currentPage,  
                        size: 8,
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
                    const response = await fetch_get(`${BOOK_SUGGESTIONS}`, {
                        searchTerm: debouncedSearchQuery,  
                                
                    });
                    const availableBooks = response.data.filter(book => book.quantity > 0);
                    setBooks(availableBooks);
                } catch (err) {
                    showToast('Failed to load book suggestions', 'error');
                }
            };

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
            setLoading(false)
        }
        
        const handleSaveUser = async () => {
            setLoading(true)
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
            setModalOpen(false);
            setLoading(true);
                if (editingUserId) {
                    await fetch_patch(`${USER_UPDATE}${editingUserId}`, userData);
                    showToast("User updated successfully!");

                } else {
                    await fetch_post(`${USER_REGISTER}`, [userData]);
                    showToast("User added successfully!");
                }
                setModalOpen(false);
                setUserName("");
                setUserEmail("");
                setPhoneNumber("");
                const response = await fetch_get(`${USERS_API}`,{ page: currentPage, size: 8, search: debouncedSearchQuery });
                setUsers(response.data.content);

            } catch (error) {
            setIssueError(error.response.data.message)
            }finally{
                setLoading(false)
            }
        };

        const handleDelete = async () => {
            setLoading(true)
            try {
                const response = await fetch_delete(`${USER_DELETE}${userToDelete.id}`);
                setUserToDelete(null);
                setDeleteModalOpen(false);
                const updatedUsers = await fetch_get(`${USERS_API}`, { page: currentPage, size: 8, search: debouncedSearchQuery });
                setUsers(updatedUsers.data.content);
                showToast(response.data.message);
        
            } catch (error) {
                handleCloseModal();
                showToast(error.response.data.message, "error")
            }
            finally{
                setLoading(false)
            }
        };
        
        const handleHistoryModal = (user) => {
            navigate(`/user-History/${user.id}`);
        };
        
        const handleCloseHistoryModal = () => {
            setIsHistoryModalOpen(false);
            setHistoryData([]);
        };
        
        const handleSelectBook = (book) => {
            setSelectedBook(book);
        };
        const handleReturnTimeChange = (e) => {
            const selectedTime = e.target.value;
            const [hours, minutes] = selectedTime.split(':');
            const selectedDate = new Date();
            selectedDate.setHours(hours, minutes, 0, 0);
            const currentDate = new Date();
            if (selectedDate <= currentDate) {
                setIssueError("Cannot select a time in the past.");
                setReturnTime("");
            } else {
                setReturnTime(selectedTime);
                setIssueError("");
            }
        };
    
        const handleReturnedAtChange = (e) => {
            const selectedDate = new Date(e.target.value);
            const currentDate = new Date();
            if (selectedDate <= currentDate) {
                setIssueError("Cannot select a date and time in the past.");
                setReturnedAt(null);
            } else {
                setReturnedAt(e.target.value);
                setIssueError("");
            }
        };
    
        const handleIssueBook = async () => {
            setLoading(true)
            if (!selectedBook || !issuanceType || (!returnedAt && issuanceType === "Takeaway") || (!returnTime && issuanceType === "InHouse") || !editingUserId) {
                setIssueError('All fields are required for issuing a book.');
                return;
            }
            let isValid = true;
                if (issuanceType === "InHouse") {
                    const [hours, minutes] = returnTime.split(':');
                    const selectedDate = new Date();
                    selectedDate.setHours(hours, minutes, 0, 0);
                    const currentDate = new Date();
                    if (selectedDate <= currentDate) {
                        setIssueError("Cannot select a time in the past.");
                        isValid = false;
                    }
                } else {
                    const selectedDate = new Date(returnedAt);
                    const currentDate = new Date();
                    if (selectedDate <= currentDate) {
                        setIssueError("Cannot select a date and time in the past.");
                        isValid = false;
                    }
                }

                if (!isValid) {
                    setLoading(false);
                    return;
                }
                getBooks();
            try {
                setModalOpen(false);
                    let formattedReturnedAt;
                if (issuanceType === "InHouse") {
                    const currentDate = new Date().toISOString().split('T')[0];
                    formattedReturnedAt = formatDateTime(new Date(`${currentDate}T${returnTime}:00`));
                } else {
                    formattedReturnedAt = formatDateTime(new Date(returnedAt));
                }
                const issuanceData = {
                    userId: editingUserId,
                    bookId: selectedBook.value,
                    issuedAt: formatDateTime(new Date()),
                    returnedAt: formattedReturnedAt,
                    issuanceType,
                    status: "ISSUED",
                };
                const result = await fetch_post(`${ISSUANCES_POST}`, issuanceData);
                
                setSelectedBook(null);
                setIssuanceType("");
                setReturnedAt(null);
                setReturnTime("");
                handleCloseModal();
                showToast(result.data.message);
                navigate('/issuances')
                const response = await fetch_get(`${USERS_API}`);
                setUsers(response.data.content);
        
            } catch (error) {
                handleCloseModal();
                showToast("Failed to issue book", 'error');
            }finally{
                setLoading(false)
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
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            return now.toISOString().slice(0, 16);
          };
        const getCurrentTime = () => {
            const now = new Date();
            return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
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
                    handleHistoryModal(user)
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
                        shouldFilter={false}
                    />
                    </>
                )
            }
        ];

        const dataWithSerialNumbers = users.map((user, index) => ({
            ...user,
            serialNumber: currentPage * 8 + index + 1, 
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
        options={books.map((book) => ({
            label: `${book.title} - ${book.category.categoryName} `,
            value: book.id,
        }))}
        onSelect={handleSelectBook}
        useInput={true}
        placeholder={selectedBook ? selectedBook.label : "Search for a book"}
    />
            
                         <select
                            value={issuanceType}
                            onChange={(e) => {
                                setIssuanceType(e.target.value);
                                setReturnedAt(null);
                                setReturnTime("");
                                setIssueError(""); 
                            }}
                        >       
                    <option value="" disabled>Select Issuance Type</option>
                    <option value="InHouse">In House</option>
                    <option value="Takeaway">Takeaway</option>
                </select>
                {issuanceType === "InHouse" ? (
                            <input
                                type="time"
                                value={returnTime}
                                onChange={handleReturnTimeChange}
                                min={getCurrentTime()}
                            />
                        ) : (
                            <input
                                type="datetime-local"
                                value={returnedAt}
                                onChange={handleReturnedAtChange }
                                min={getCurrentDateTime()}
                            />
                )}
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
    <Modal
            isOpen={isHistoryModalOpen}
            onClose={handleCloseHistoryModal}
            title="User History"
        >
            {historyData.length > 0 ? (
            <ul>
                {historyData.map((entry, index) => (
                <li key={index}>
                    <p>Mobile Number: {entry.name}</p>
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
        ):users.length === 0 ? (
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

