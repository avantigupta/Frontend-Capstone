import axiosInstance from '../axiosConfig';

export const fetchBooks = async () => {
    return await axiosInstance.get(`/api/v1/books/getBooks`);
};

export const getBookCount = async () => {
    return await axiosInstance.get(`api/v1/books/books-count`);
};

export const addBooks = async (book, token) => {
    return await axiosInstance.post(`/api/v1/books/create`, book, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// export const deleteCategory = async (id, token) => {
//     console.log('Deleting category with ID:', id);
//     console.log('Using token:', token);
//     return await axiosInstance.delete(`/api/v1/categories/${id}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     });
// }

export const updateBook = async (id, book, token) => {
    return await axiosInstance.put(`/api/v1/books/update/${id}`, book, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};