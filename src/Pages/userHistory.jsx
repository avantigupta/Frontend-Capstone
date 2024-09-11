import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { fetch_get } from '../api/apiManager'; 
import HocContainer from '../components/hocContainer';
import Table from '../components/table'; 
import arrow from "../assets/icons/arrow.png";

const UserHistory = () => {
    const { userId } = useParams();  
    const navigate = useNavigate();  
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState(''); 

    useEffect(() => {
        const fetchIssuanceHistory = async () => {
            try {
                const response = await fetch_get(`/api/v1/issuances/user/${userId}`);
                setHistory(response.data);
            } catch (err) {
                setError('Failed to load issuance history.');
            } 
        };

        const fetchUsername = async () => {
            try {
                const response = await fetch_get(`/api/v1/users/${userId}`); 
                setUsername(response.data.name);
            } catch (err) {
                setError('Failed to load user details.');
            }
        };

        fetchIssuanceHistory();
        fetchUsername(); 
    }, [userId]);

    const convertToIST = (dateTime) => {
        const date = new Date(dateTime);
        const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
        const istOffset = 5.5 * 60 * 60 * 1000; 
        const istTime = new Date(utcTime + istOffset);
    
        const day = String(istTime.getDate()).padStart(2, '0');
        const month = String(istTime.getMonth() + 1).padStart(2, '0');
        const year = istTime.getFullYear();
        const hours = String(istTime.getHours()).padStart(2, '0');
        const minutes = String(istTime.getMinutes()).padStart(2, '0');
    
        return `${day}-${month}-${year}, ${hours}:${minutes}`;
    };
    
    if (error) return <div className='books-error'>{error}</div>;

    const columns = [
        { header: 'S.No', accessor: 'serialNumber' },
        { header: 'Book Title', accessor: row => row.book?.title || 'No Title' },  
        { header: 'Issued Date', accessor: (row) => convertToIST(row.issuedAt) },
        { header: 'Returned Date', accessor: (row) => convertToIST(row.returnedAt) },
        { header: 'Type', accessor: 'issuanceType' },
        { header: 'Status', accessor: 'status' }
    ];

    const dataWithSerialNumbers = history.map((issuance, index) => ({
        ...issuance,
        serialNumber: index + 1, 
    }));

    return (
        <div>
            <div className='book-history'>
                <img 
                    src={arrow} 
                    alt='Back to Books' 
                    className='arrow' 
                    onClick={() => navigate('/users')} 
                    style={{ cursor: 'pointer' }} 
                />
                <p className='book-page-title'>{username}</p> 
            </div>
            {history.length === 0 ? (
                <div className='no-books-found'>History not found!</div>
            ) : (
                <Table columns={columns} data={dataWithSerialNumbers} />
            )}

        </div>
    );
};

export default HocContainer(UserHistory, "User History");
