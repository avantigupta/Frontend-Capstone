import React, { useEffect, useState } from 'react';
import HocContainer from "../Components/HocContainer";
import Button from '../Components/Button';
import {_get, _put, _post, _delete, _patch } from '../api/apiManager';
import Modal from '../Components/modal';
import Table from '../Components/Table';
import Dropdown from '../Components/Dropdown';
import '../Styles/users.css'

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isDeleteConfirmation, setIsDeleteConfirmation] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await _get(`/api/v1/users/role/user`);
                setUsers(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('Unauthorized access. Please log in.');
                } else {
                    setError('Failed to load users');
                }
            } finally {
                setLoading(false);
            }
        };

        getUsers();
    }, []);

    const handleOpenModal = (user = null) => {
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
        
        setIsDeleteConfirmation(false);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveUser = async () => {
        if (!userName || !userEmail || !phoneNumber) {
            setError("All fields are required.");
            return;
        }

        const userData = {
            id: editingUserId,
            name: userName,
            email: userEmail,
            phoneNumber,
        };

        try {
            let result;
            if (editingUserId) {
                result = await _patch(`/api/v1/users/update/${editingUserId}`, userData);
                console.log(result)
            } else {
                result = await _post(`/api/v1/users/register`, [userData]);
            }

            setUserName("");
            setUserEmail("");
            setPhoneNumber("");
            handleCloseModal();
            const response = await _get(`/api/v1/users/role/user`);
            setUsers(response.data);
        } catch (error) {
            setError('Failed to save user');
        }
    };

    const handleDelete = async () => {
        try {
            const response = await _delete(`/api/v1/users/delete/${userToDelete.id}`);
            setUserToDelete(null);
            handleCloseModal();
            const updatedUsers = await _get(`/api/v1/users/role/user`);
            setUsers(updatedUsers.data);
        } catch (error) {
            setError(`Failed to delete user: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteConfirmation(true);
        setModalOpen(true);
    };

    const handleSelect = (option, user) => {
        switch(option.value) {
            case 'edit':
                handleOpenModal(user);
                break;
            case 'delete':
                handleOpenDeleteModal(user);
                break;
            case 'issue':
                //still to add issue book functionality
                console.log('Issuing books for user:', user);
                break;
            case 'history':
                //still to add history page
                console.log('Showing history for user:', user);
                break;
        }
    };
  
    const dropdownOptions = [
        { label: 'Edit', value: 'edit' },
        { label: 'Delete', value: 'delete' },
        { label: 'Issue', value: 'issue' },
        { label: 'History', value: 'history' },
    ];
    
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
                    buttonLabel="Actions" 
                  />
                </>
            )
        }
    ];

    const dataWithSerialNumbers = users.map((user, index) => ({
      ...user,
      serialNumber: index + 1, 
  }));

    return (
        <div className="users-page">
            <Button className="add-user" onClick={() => handleOpenModal(null)}>Add User</Button>
            <Modal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                onSubmit={isDeleteConfirmation ? handleDelete : handleSaveUser}
                title={isDeleteConfirmation ? "Confirm Deletion" : editingUserId ? "Edit User" : "Add User"}
                deleteMessage={`Are you sure you want to delete this user?`}
            >
                {!isDeleteConfirmation && (
                    <div className='edit-user'>
                        <label>User Name:</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <label>User Email:</label>
                        <input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                )}
            </Modal>
            {users.length === 0 ? (
                <div>No users available.</div>
            ) : (
                <Table columns={columns} data={dataWithSerialNumbers} />
            )}
        </div>
    );
};

export default HocContainer(Users, "Users");
