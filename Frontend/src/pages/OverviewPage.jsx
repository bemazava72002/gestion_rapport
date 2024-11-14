
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

import { jwtDecode } from 'jwt-decode'; // Importez jwt-decode
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../utils/axiosInstance';
import { useEffect } from "react";
import Overview from "../components/overview/overView";
const OverviewPage = () => {
    // Récupérer le token
	const token = localStorage.getItem("token");
    let userInfo = null;

    // Vérifier si le token existe et est valide
    if (token) {
        try {
            userInfo = jwtDecode(token); // Décoder le token pour obtenir les informations utilisateur
        } catch (error) {
            console.error("Erreur lors du décodage du token:", error);
        }
    }
    useEffect(() => {
        // Appel de l'API pour récupérer les logs
        const fetchLogs = async () => {
          try {
            const response = await axiosInstance.get('/logs/actions');
          const logs =   response.data.forEach(log => {
               switch(log.action){
                case 'Création de rapport':
                  toast.info(`${new Date(log.date).toLocaleString()} - ${log.utilisateur}  a effectué l'action: ${log.action} pour ${log.details.responsable}`);
                case 'Activation du compte':
                  toast.info(`${new Date(log.date).toLocaleString()} - ${log.action} de l'utilisateur  ${log.utilisateur} `); 
               }
             
            });
          } catch (error) {
            console.error('Erreur lors de la récupération des logs:', error);
            toast.error('Erreur lors de la récupération des logs.');
          }
        };
    
        fetchLogs();
      }, []);
   
    return (
        <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
            {/* BG */}
            <div className='fixed inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
                <div className='absolute inset-0 backdrop-blur-sm' />
            </div>

            <Sidebar nom = {userInfo.Nom} role={userInfo.roles}/>
            <div className='flex-1 overflow-auto relative z-10'>
                <Header title='Tableau de bord'/>

                <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                    {/* Afficher les informations de l'utilisateur connecté */}
                   
                    <div>
     
      <ToastContainer />
    </div>
                    {/* STATS */}
                   

                    <Overview />
                    
                </main>
            </div>
        </div>
    );
};

export default OverviewPage;
