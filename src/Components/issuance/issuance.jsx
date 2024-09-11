import React, { useEffect, useState } from 'react';
import { fetch_get, fetch_delete, fetch_patch } from '../../api/apiManager';
import Toast from '../toast';
import Modal from '../modal';
import Table from '../table';
import HocContainer from '../hocContainer';
import SearchBox from '../searchBox';
import '../../styles/issuances.css'
import Button from '../button';
import Loader from '../loader';

const Issuances = () => {
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('success');
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIssuance, setEditingIssuance] = useState(null);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [issuanceToDelete, setIssuanceToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
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
  
    useEffect(()=>{
    getIssuances();
   },[currentPage, debouncedSearchQuery])

    const getIssuances = async () => {
        setLoading(true)
            try {
                const response = await fetch_get(`/api/issuances/list`, {
                    page: currentPage,  
                    size: 5,
                    search: debouncedSearchQuery
                });
                setIssuances(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (err) {
               showToast("Failed to load issuances, Try again later!",'error')
            } finally {
                setLoading(false);
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
          }, 5000); 
        }
      }, [toastMessage]);

    const handleOpenModal = (issuance = null) => {
        setEditingIssuance(issuance ? { ...issuance } : {
            user: '',
            book: '',
            issuedAt: '',
            returnedAt: '',
            status: '',
            issuanceType: '',
        });
        setIsDeleteConfirmation(false);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingIssuance((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveIssuance = async () => {
        setLoading(true)
        try {
            const formattedIssuance = {
                ...editingIssuance,
                issuedAt: convertToIST(editingIssuance.issuedAt),
                returnedAt: convertToIST(editingIssuance.returnedAt),
            };
            if (editingIssuance.id) {
                const result = await fetch_patch(`/api/issuances/update/${editingIssuance.id}`, formattedIssuance);
                showToast(result.data.message);

            } 
            handleCloseModal();
            const response = await fetch_get(`/api/issuances/list`, {
                page: currentPage,
                size: 5,
                search: debouncedSearchQuery
            });
            setIssuances(response.data.content);
        } catch (error) {
            showToast("Failed to update issuance", 'error'); 
        }
        finally{
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);

        try {
            const result = await fetch_delete(`/api/issuances/delete/${issuanceToDelete.id}`);
            setIssuanceToDelete(null);
            handleCloseModal();
            const updatedIssuances = await fetch_get(`/api/issuances/list`, {
                page: currentPage,
                size: 5,
                search: debouncedSearchQuery
            });
            setIssuances(updatedIssuances.data.content);
            showToast(result.data.message);

        } catch (error) {
            handleCloseModal();
            showToast("Failed to delete issuance",'error'); 
        }finally{
            setLoading(false)
        }
    };

    const handleOpenDeleteModal = (issuance) => {
        setIssuanceToDelete(issuance);
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        setCurrentPage(0); 
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
    
        return `${year}-${month}-${day}T${hours}:${minutes}`; 
    };
    
    const convertToIST = (dateTime) => {
        if (!dateTime) return '';
    
        const date = new Date(dateTime);
        const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
        const istOffset = 5.5 * 60 * 60 * 1000; 
        const istTime = new Date(utcTime + istOffset);
    
        const year = istTime.getFullYear();
        const month = String(istTime.getMonth() + 1).padStart(2, '0');
        const day = String(istTime.getDate()).padStart(2, '0');
        const hours = String(istTime.getHours()).padStart(2, '0');
        const minutes = String(istTime.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const formatForDisplay = (dateTime) => {
        const convertedIST = convertToIST(dateTime);
        if (!convertedIST) return '';
      
        const parts = convertedIST.split('T');
        const datePart = parts[0];
        const timePart = parts[1].split(':');
        const hours = timePart[0];
        const minutes = timePart[1];
      
        return `${datePart}, ${hours}:${minutes}`; 
    };

    const columns = [
        { header: 'S.No', accessor: 'serialNumber' },
        { header: 'User', accessor: 'userName' },
        { header: 'Book', accessor: 'bookTitle' },
        { header: 'Issue Date', accessor: (row) => formatForDisplay(row.issuedAt) },
        { header: 'Return Date', accessor: (row) => formatForDisplay(row.returnedAt) },
        { header: 'Status', accessor: 'status' },
        { header: 'Type', accessor: 'issuanceType' },
        {
            header: 'Actions',
            accessor: (issuance) => (
                <>
                    <Button className="edit-btn" onClick={() => handleOpenModal(issuance)}>Edit</Button>
                    <Button className="delete-btn"  onClick={() => handleOpenDeleteModal(issuance)}>Delete</Button>
                </>
            )
        }
    ];

    const dataWithSerialNumbers = issuances.map((issuance, index) => ({
        ...issuance,
        serialNumber: currentPage * 5 + index + 1, 
        userName: issuance.user.name,
        bookTitle: issuance.book.title,
    }));

    return (
        <div className="issuance-page">
             {toastMessage && (
                    <Toast
                        message={toastMessage}
                        type={toastType}
                        onClose={() => setToastMessage(null)}
                    />
                )}
            <div className='search'>
                <SearchBox placeholder="Search..." onSearch={handleSearch}/>
            </div>
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={isDeleteConfirmation ? handleDelete : handleSaveIssuance}
                title={isDeleteConfirmation ? "Delete Issuance" : (editingIssuance?.id ? "Edit Issuance" : "Add Issuance")}
                isDeleteConfirmation={isDeleteConfirmation}
                deleteMessage={`Are you sure you want to delete this issuance?`}
            >
                {!isDeleteConfirmation && (
                    <div className="issuance-form">
                        <label>
                            <input
                                type="text"
                                name="user"
                                value={editingIssuance?.user.name || ''}
                                readOnly={!!editingIssuance?.id}
                               
                            />
                        </label>
                        <label>
                            <input
                                type="text"
                                name="book"
                                value={editingIssuance?.book.title || ''}
                                readOnly={!!editingIssuance?.id}
                                
                            />
                        </label>
                        <label>
                            <input
                                type="datetime-local"
                                name="issuedAt"
                                value={convertToIST(editingIssuance?.issuedAt) || ''}
                                readOnly={!!editingIssuance?.id}
                                
                            />
                        </label>
                        <label>
                            <input
                                type="datetime-local"
                                name="returnedAt"
                                value={convertToIST(editingIssuance?.returnedAt) || ''}
                                onChange={handleChange}
                                min={getCurrentDateTime()} 
                            />
                        </label>
                        <label>
                            <select
                                name="status"
                                value={editingIssuance?.status || ''}
                                onChange={handleChange}
                               
                            >
                                <option value="ISSUED">ISSUED</option>
                                <option value="RETURNED">RETURNED</option>
                            </select>
                        </label>
                      
                    </div>
                )}
            </Modal>
            
      {loading ? (
        <Loader />
      ): issuances.length === 0 ? (
        <div className="no-books-found">Issuance not available</div>
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

export default HocContainer(Issuances, "Issuances");
