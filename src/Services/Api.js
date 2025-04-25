import axios from "axios";

const local = "http://localhost:5129/api";
const live = "https://ec2-54-145-32-188.compute-1.amazonaws.com:5000/";

const API_BASE_URL = local;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Other headers can be set here
  },
});

// Export the configured axios instance
export default api;
