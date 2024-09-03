import axiosInstance from "./axiosConfig";

const _get = (url,params={}) => {
  return axiosInstance.get(url,{params});
};

const _delete = (url) => {
  return axiosInstance.delete(url);
};

const _put = (url, data = {}) => {
  return axiosInstance.put(url, data);
};

const _patch = (url, data = {}) => {
  return axiosInstance.patch(url, data);
};

const _post = (url, data = {}) => {
  return axiosInstance.post(url, data);
};

export { _get, _delete, _put, _post, _patch };