
import axios from "axios";

const api_token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJtYWFyaXJhajMwMkBnbWFpbC5jb20iLCJpYXQiOjE3NDgyNDg1MDF9.CF49qWQALaFxi4h-gb6Eu0HDmaiJeYUroTGPb6-c6m0";

export const api = axios.create({
  baseURL: "https://crudify.dev/api/v1",
  headers: {
    Authorization: `Bearer ${api_token}`, 
  },
});
