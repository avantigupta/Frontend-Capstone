import axiosInstance from '../axiosConfig';

export const fetchCategories = async () => {
    return await axiosInstance.get(`/api/categories/all`);
};


export const getCategoryCount = async () => {
    return await axiosInstance.get(`/api/categories/count`);
};



export const addCategory = async (category, token) => {
    return await axiosInstance.post(`/api/categories/save`, category, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const deleteCategory = async (id, token) => {
    console.log('Deleting category with ID:', id);
    console.log('Using token:', token);
    return await axiosInstance.delete(`/api/categories/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}

export const updateCategory = async (id, category, token) => {
    return await axiosInstance.put(`/api/categories/update/${id}`, category, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};