// axiosInstance.ts
import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://openapi.twse.com.tw/v1'
  : '/api';

const instance = axios.create({
  baseURL,
});

export default instance;
