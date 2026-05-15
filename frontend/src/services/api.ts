import axios from 'axios';

 // @ts-ignore
const url = process.env.URL_API;
export const api = axios.create({
  baseURL: url, 
});