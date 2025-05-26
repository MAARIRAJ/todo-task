
import axios from "axios";

const api_token =" add_your_token";

export const api = axios.create({
  baseURL: "https://crudify.dev/api/v1",
  headers: {
    Authorization: `Bearer ${api_token}`, 
  },
});
