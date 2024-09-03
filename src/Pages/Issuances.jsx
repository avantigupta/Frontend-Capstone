import React, { useEffect, useState } from 'react';
import HocContainer from "../Components/HocContainer";
import Button from '../Components/Button';
import { _get, _put, _post, _delete } from '../api/apiManager';
import Modal from '../Components/modal';
import Table from '../Components/Table';

const Issuances = () => {
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingIssuance, setEditingIssuance] = useState(null);
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [issuanceToDelete, setIssuanceToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const getIssuances = async () => {
            try {
                const response = await _get(`/api/v1/issuances/getList`);
                console.log(response )
                setIssuances(response.data);
                setTotalPages(response.data.totalPages);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                } else {
                    setError('Failed to load issuances');
                }
            } finally {
                setLoading(false);
            }
        };

        getIssuances();
    }, [currentPage]);

    const handleOpenModal = (issuance = null) => {
        setEditingIssuance(issuance ? { ...issuance } : {
            user: '',
            book: '',
            issuedAt: '',
            returnedAt: '',
            status: 'ISSUED',
            issuanceType: 'In House',
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
        try {
            if (editingIssuance.id) {
                await _put(`/api/issuances/update/${editingIssuance.id}`, editingIssuance);
            } else {
                await _post(`/api/issuances/save`, [editingIssuance]);
            }

            handleCloseModal();
            const response = await _get(`/api/issuances/list`, {
                page: currentPage,
                size: 5
            });
            setIssuances(response.data);
        } catch (error) {
            setError('Failed to save issuance');
        }
    };

    const handleDelete = async () => {
        try {
            await _delete(`/api/issuances/delete/${issuanceToDelete.id}`);
            setIssuanceToDelete(null);
            handleCloseModal();
            const updatedIssuances = await _get(`/api/issuances/list`, {
                page: currentPage,
                size: 5
            });
            setIssuances(updatedIssuances.data.content);
        } catch (error) {
            setError(`Failed to delete issuance: ${error.response?.data?.message || error.message}`);
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const convertToIST = (dateTime) => {
        const date = new Date(dateTime);
        const istOffset = 5.5 * 60 * 60 * 1000; 
        const istTime = new Date(date.getTime() + istOffset);
        return istTime.toISOString().slice(0, 16); 
    };
    const columns = [
        { header: 'S.No', accessor: 'serialNumber' },
        { header: 'User', accessor: 'userName' },
        { header: 'Book', accessor: 'bookTitle' },
        { header: 'Issue Date', accessor: 'issuedAt' },
        { header: 'Return Date', accessor: 'returnedAt' },
        { header: 'Status', accessor: 'status' },
        { header: 'Type', accessor: 'issuanceType' },
        {
            header: 'Actions',
            accessor: (issuance) => (
                <>
                    <button className="edit-btn" onClick={() => handleOpenModal(issuance)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleOpenDeleteModal(issuance)}>Delete</button>
                </>
            )
        }
    ];

    const dataWithSerialNumbers = issuances.map((issuance, index) => ({
        ...issuance,
        serialNumber: index + 1,
        userName: issuance.user.name,  
        bookTitle: issuance.book.title, 
    }));

    return (
        <div className="issuance-page">
            <Button className="add-issuance" onClick={() => handleOpenModal(null)}>Add Issuance</Button>
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={isDeleteConfirmation ? handleDelete : handleSaveIssuance}
                title={editingIssuance?.id ? "Edit Issuance" : "Add Issuance"}
                isDeleteConfirmation={isDeleteConfirmation}
                deleteMessage={`Are you sure you want to delete this issuance?`}
            >
                {!isDeleteConfirmation && (
                    <div className="issuance-form">
                        <label>
                            User:
                            <input
                                type="user"
                                name="user"
                                value={editingIssuance?.user || ''}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Book:
                            <input
                                type="book"
                                name="book"
                                value={editingIssuance?.book || ''}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Issue Date:
                            <input
                                type="datetime-local"
                                name="issuedAt"
                                value={editingIssuance?.issuedAt || ''}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Return Date:
                            <input
                                type="datetime-local"
                                name="returnedAt"
                                value={editingIssuance?.returnedAt || ''}
                                onChange={handleChange}
                                required
                            />
                        </label>
                        <label>
                            Status:
                            <select
                                name="status"
                                value={editingIssuance?.status || 'ISSUED'}
                                onChange={handleChange}
                                required
                            >
                                <option value="ISSUED">ISSUED</option>
                                <option value="RETURNED">RETURNED</option>
                            </select>
                        </label>
                        <label>
                            Issuance Type:
                            <select
                                name="issuanceType"
                                value={editingIssuance?.issuanceType || 'In House'}
                                onChange={handleChange}
                                required
                            >
                                <option value="In House">In House</option>
                                <option value="External">External</option>
                            </select>
                        </label>
                    </div>
                )}
            </Modal>
            {issuances.length === 0 ? (
                <div>No issuances available.</div>
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
