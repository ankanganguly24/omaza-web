import axios, { isAxiosError,AxiosRequestConfig, AxiosResponse } from 'axios';

import { getCookie, deleteCookie } from './cookies';
import { BASE_URL, BEARER_TOKEN as DEFAULT_AUTH_TOKEN } from './constant'; // Import the default token

export const apiGet = async <T>(endpoint: string, useToken: boolean = true): Promise<T> => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
  };

  if (useToken) {
    let token = getCookie('authToken');
    if (!token) {
      token = DEFAULT_AUTH_TOKEN; // Fallback to default token
    }

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
    if (isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
    }
    throw error;
  }
};

export const apiPost = async <T, D = unknown>(endpoint: string, data?: D, useToken: boolean = true): Promise<T> => {
  const config: AxiosRequestConfig = {
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (useToken) {
    let token = getCookie('authToken');
    if (!token) {
      token = DEFAULT_AUTH_TOKEN; // Fallback to default token
    }

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
    if (isAxiosError(error) && error.response?.status === 401) {
      handleUnauthorized();
    }
    throw error;
  }
};


const handleUnauthorized = (): void => {
  deleteCookie('authToken');
  window.location.href = '/login'; // Redirect to login page
};
