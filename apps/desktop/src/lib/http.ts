import axios from 'axios';

import { API_URL } from '../config/api';

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});