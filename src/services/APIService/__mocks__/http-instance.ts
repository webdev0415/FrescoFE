import { AxiosStatic } from 'axios';

const mockAxios = jest.genMockFromModule<AxiosStatic>('axios');

console.log('in mock setup');
mockAxios.interceptors = mockAxios.interceptors || {};
mockAxios.interceptors.request = mockAxios.interceptors.request || {};
mockAxios.interceptors.request.use = jest.fn();
mockAxios.create = () => {
  console.log('in mock create');
  return mockAxios;
};

export const http = mockAxios;
