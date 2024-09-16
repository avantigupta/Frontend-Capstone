import React, { useEffect, useState } from "react";
import Header from "../components/header";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../components/button";
import Table from "../components/table";
import { fetch_get } from "../api/apiManager";
import '../styles/userPage.css';
import Modal from "../components/modal";

const UserPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(true); 
  };
  const confirmLogout = () => {
    localStorage.clear();
    navigate("/");
    setIsModalOpen(false);
  };

  const cancelLogout = () => {
    setIsModalOpen(false);
  };

    useEffect(() => {
        if (!localStorage.getItem("token") || role !== "user") {
            navigate("/", { replace: true });
        }

        if (location.pathname !== "/userPage") {
            navigate("/userPage", { replace: true });
        }
    }, [navigate, role, location.pathname]);

    useEffect(() => {
        const fetchIssuanceHistory = async () => {
            try {
                const response = await fetch_get(`/api/userHistory/userIssuanceDetails/${userId}`);
                setHistory(response.data);
            } catch (err) {
                setError('Failed to load issuance history.');
            } finally {
                setLoading(false);
            }
        };

        fetchIssuanceHistory();
    }, [userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
    
        return `${year}-${month}-${day}, ${hours}:${minutes}`;
    };
    const columns = [
        { header: 'S.No', accessor: 'serialNumber' },
        { header: 'Book Title', accessor: row => row.book?.title || 'No Title' },
        { header: 'Issued Date', accessor: (row) => convertToIST(row.issuedAt)},
        { header: 'Returned Date', accessor: (row) => convertToIST(row.returnedAt) },
        { header: 'Type',  accessor: 'issuanceType' }
    ];

    const dataWithSerialNumbers = history.map((issuance, index) => ({
        ...issuance,
        serialNumber: index + 1
    }));

    return (
        <div>
            <Header title="User Dashboard" />
            <div className="user-page">
                <h2 className="heading-user">{username}</h2>
                {history.length === 0 ? (
                    <div className="user-history">History not available</div>
                ) : (
                    <Table columns={columns} data={dataWithSerialNumbers} />
                )}
            </div>
            <Button className="btn-history" onClick={handleLogout}>
                Logout
            </Button>
            <Modal
    isOpen={isModalOpen}
    onClose={cancelLogout}
    onSubmit={confirmLogout}
    logoutConfirm
    logoutMessage="Are you sure you want to log out?"
  />
        </div>
    );
};

export default UserPage;
