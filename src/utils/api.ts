// utils/apiUtils.ts

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getCookie, deleteCookie } from './cookies';
import { BASE_URL } from './constant';


export const apiGet = async <T>(endpoint: string, useToken: boolean = true): Promise<T> => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
  };

  if (useToken) {
    const token = getCookie('authToken');
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    } else {
      throw new Error('No auth token found');
    }
  }

  try {
    const response: AxiosResponse<T> = await axios.get(endpoint, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
    }
    throw error;
  }
};

export const apiPost = async <T>(endpoint: string, data?: any, useToken: boolean = true): Promise<T> => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (useToken) {
    const token = getCookie('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    } else {
      throw new Error('No auth token found');
    }
  }

  try {
    const response: AxiosResponse<T> = await axios.post(endpoint, data, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
    }
    throw error;
  }
};

const handleUnauthorized = (): void => {
  deleteCookie('authToken');
  window.location.href = '/login'; // Redirect to login page
};
