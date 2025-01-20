import axios from "axios";

export const api = axios.create({
    // Production
    // baseURL: "https://api.example.com",
    // Development
    baseURL: "http://localhost:8000/",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});