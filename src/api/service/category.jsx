import axiosInstance from '../axiosConfig';

export const fetchCategories = async () => {
    return await axiosInstance.get(`/api/v1/categories/getAll`);
};

export const getCategoryCount = async () => {
    return await axiosInstance.get(`api/v1/categories/category-count`);
};

export const addCategory = async (category, token) => {
    return await axiosInstance.post(`/api/v1/categories/save`, category, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export const deleteCategory = async (id, token) => {
    console.log('Deleting category with ID:', id);
    console.log('Using token:', token);
    return await axiosInstance.delete(`/api/v1/categories/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
}
