import Axios, { AxiosRequestConfig } from 'axios';
import Auth from '../Auth';

export const http = Axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export function httpRequestInterceptor(config: AxiosRequestConfig) {
  const token = Auth.getToken();
  if (!!token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

http.interceptors.request.use(httpRequestInterceptor);
