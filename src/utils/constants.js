export const API_BASE_URL = "http://localhost:8086";

export const USER_REGISTER = `${API_BASE_URL}/api/users/register`;
export const SIGNUP = `${API_BASE_URL}/api/users/signin`;
export const COUNT = `${API_BASE_URL}/api/dashboard/count`;

export const BOOKS_API = `${API_BASE_URL}/api/books/list`;
export const BOOK_BY_ID_API = (id) => `${API_BASE_URL}/books/${id}`;
export const BOOK_HISTORY =  `${API_BASE_URL}/bookHistory/`
export const BOOK_UPDATE =  `${API_BASE_URL}/api/books/update/`
export const BOOK_POST =  `${API_BASE_URL}/api/books/save`
export const BOOK_DELETE =  `${API_BASE_URL}/api/books/delete/`
export const BOOK_SUGGESTIONS =  `${API_BASE_URL}/api/books/suggestions`

export const CATEGORY_API = `${API_BASE_URL}/api/categories/list`;
export const CATEGORY_UPDATE = `${API_BASE_URL}/api/categories/update/`;
export const CATEGORY_POST = `${API_BASE_URL}/api/categories/save`;
export const CATEGORY_DELETE = `${API_BASE_URL}/api/categories/delete/`;
export const CATEGORY = `${API_BASE_URL}/api/categories`

export const ISSUANCES_API = `${API_BASE_URL}/api/issuances/list`;
export const ISSUANCES_POST = `${API_BASE_URL}/api/issuances/save`;
export const ISSUANCES_UPDATE = `${API_BASE_URL}/api/issuances/update/`;
export const ISSUANCES_DELETE = `${API_BASE_URL}/api/issuances/delete/`;

export const USERS_API = `${API_BASE_URL}/api/users/list`;
export const USERS_BY_MOBILE_NUMBER = `${API_BASE_URL}/api/users/number/`
export const USER_UPDATE = `${API_BASE_URL}/api/users/update/`;
export const USER_DELETE = `${API_BASE_URL}/api/users/delete/`;