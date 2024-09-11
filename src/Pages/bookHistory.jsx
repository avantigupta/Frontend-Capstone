import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetch_get } from '../api/apiManager'; 
import HocContainer from '../components/HocContainer';
import TableComponent from '../components/Table'; 
import arrow from "../Assets/Icons/arrow.png";
import "../styles/bookHistory.css";

const BookHistory = () => {
    const { bookId } = useParams();  
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchIssuanceHistory = async () => {
            try {
                const response = await fetch_get(`/api/books/${bookId}/issuances`); 
                setHistory(response.data);
                setTitle(response.data[0]?.book?.title || 'Unknown Book Title');
            } catch (err) {
                setError('Failed to load issuance history.');
            } finally {
                setLoading(false);
            }
        };

        fetchIssuanceHistory();
    }, [bookId]);

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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const columns = [
        { header: 'User Name', accessor: row => row.user?.name || 'Unknown' },  
        { header: 'Issued Date', accessor: (row) => convertToIST(row.issuedAt) },
        { header: 'Returned Date', accessor: (row) => convertToIST(row.returnedAt) },
        { header: 'Status', accessor: 'status' },
    ];

    return (
        <div>
            <div className='book-history'>
                <img 
                    src={arrow} 
                    alt='Go Back' 
                    className='arrow' 
                    onClick={() => navigate('/books')} 
                    style={{ cursor: 'pointer' }} 
                />
                <p className='book-page-title'>{title}</p>
            </div>
            {history.length === 0 ? (
                <div className='no-books-found'>History not found!</div>
            ) : (
                <>
                    <TableComponent columns={columns} data={history} />
                </>
            )}
        </div>
    );
};

export default HocContainer(BookHistory, "Book History");
