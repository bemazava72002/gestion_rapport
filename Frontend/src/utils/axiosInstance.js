// src/utils/axiosConfig.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3001/api", // Remplacez par l'URL de votre API
});

// Ajoutez un intercepteur pour inclure le token d'authentification
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem("token"); // Assurez-vous de stocker le token lors de la connexion
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
