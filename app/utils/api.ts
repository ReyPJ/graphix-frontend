import axios from "axios";

export const api = axios.create({
    // Production
    // baseURL: "https://api.example.com",
    // Development
    baseURL: process.env.DJANGO_BACKEND_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});