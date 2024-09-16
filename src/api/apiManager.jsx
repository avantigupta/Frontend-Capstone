import axiosInstance from "./axiosConfig";

const fetch_get = (url,params={}) => {
  return axiosInstance.get(url,{params});
};

const fetch_delete = (url) => {
  return axiosInstance.delete(url);
};

const fetch_put = (url, data = {}) => {
  return axiosInstance.put(url, data);
};

const fetch_patch = (url, data = {}) => {
  return axiosInstance.patch(url, data);
};

const fetch_post = (url, data = {}) => {
  return axiosInstance.post(url, data);
};

export { fetch_get, fetch_delete, fetch_put, fetch_post, fetch_patch };