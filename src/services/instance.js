import axios from 'axios';
const ApiAxios = axios.create({
  baseURL: 'https://meetingsapi.infyshield.com/v1/',
  timeout: 8000,
});

ApiAxios.interceptors.request.use(
  (request) => {
    const accessToken = sessionStorage.getItem('accessToken');
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

ApiAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const get = async (url, config) => {
  try {
    const response = await ApiAxios.get(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const post = async (url, data, config) => {
  try {
    const response = await ApiAxios.post(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const put = async (url, data, config) => {
  try {
    const response = await ApiAxios.put(url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const del = async (url, config) => {
  try {
    const response = await ApiAxios.delete(url, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
