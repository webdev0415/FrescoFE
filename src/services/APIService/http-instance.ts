import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import Auth from '../Auth';
import History from '../History';

export const http = Axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
  if (Auth.getToken()) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`;
  }

  return config;
});

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    if (!error.response) {
      error.response = {
        data: 'Network error',
        status: 500,
      };
      History.push('/500');
    } else if (error.response.status === 401) {
      Auth.clearToken();
      History.push('/login/admin');
      throw error;
    } else {
      History.push('/404');
      throw error;
    }
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    if (!error.response) {
      error.response = {
        data: 'Network error',
        status: 500,
      };
      History.push('/500');
    } else if (error.response.status === 401) {
      Auth.clearToken();
      History.push('/login/admin');
      throw error;
    } else {
      History.push('/404');
      throw error;
    }
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    if (!error.response) {
      error.response = {
        data: 'Network error',
        status: 500,
      };
      History.push('/500');
    } else if (error.response.status === 401) {
      Auth.clearToken();
      History.push('/login/admin');
      throw error;
    } else {
      History.push('/404');
      throw error;
    }
    return Promise.reject(error);
  },
);
