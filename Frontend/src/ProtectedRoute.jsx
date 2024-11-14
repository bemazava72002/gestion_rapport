import { Navigate, Outlet } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';

const ProtectedRoute = ({ allowedRoles }) => {
    // Récupérer le token
    const token = localStorage.getItem("token");
    
    let userInfo = null;

    // Vérifier si le token existe et est valide
    if (token) {
        try {
            userInfo = jwtDecode(token);
            console.log("Decoded token info:", userInfo); // Log pour vérifier le contenu du token
        } catch (error) {
            console.error("Erreur lors du décodage du token:", error);
        }
    }

    // Vérifiez les informations pour diagnostiquer
    console.log("Roles in token:", userInfo ? userInfo.roles : "No roles");
    console.log("Allowed roles:", allowedRoles);

    // Si l'utilisateur est authentifié et que son rôle est autorisé
    if (userInfo && allowedRoles.some(role => {
        // Ajustez cette condition en fonction de la structure de `userInfo.roles`
        if (Array.isArray(userInfo.roles)) {
            return userInfo.roles.includes(role);
        } 
        return userInfo.roles === role;
    })) {
        console.log("Accès autorisé.");
        return <Outlet />;
    }
   

    // Rediriger vers la page de connexion si non authentifié ou rôle non autorisé
    console.log("Redirection vers /login");
    return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
