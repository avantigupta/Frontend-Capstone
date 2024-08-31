import axiosInstance from '../axiosConfig';

export const fetchBooks = async () => {
    return await axiosInstance.get(`/api/books/getBooks`);
};

export const getBookCount = async () => {
    return await axiosInstance.get(`api/books/books-count`);
};

export const addBooks = async (book, token) => {
    return await axiosInstance.post(`/api/books/save`, book, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const deleteBook = async (id, token) => {
    console.log('Deleting book with ID:', id);
    console.log('Using token:', token);
    return await axiosInstance.delete(`/api/books/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}

export const updateBook = async (id, book, token) => {
    return await axiosInstance.put(`/api/books/update/${id}`, book, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};