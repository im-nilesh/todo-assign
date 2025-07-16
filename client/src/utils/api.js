import axios from "axios";

const api = axios.create({
  baseURL: "http://todo-assign-backend.vercel.app/",
});

export default api;
