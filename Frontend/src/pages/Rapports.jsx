import { CheckCheckIcon, SendHorizonalIcon, XCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "../components/common/StatCard";  // Assurez-vous que StatCard est bien importé
import Header from "../components/common/Header";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/common/Sidebar";
import RapportsTable from "../components/Rapports/RapportTable";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const AllRapportPage = () => {
    const [reportCounts, setReportCounts] = useState({
        submitted: 0,
        approved: 0,
        rejected: 0,
    });
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");
    let userInfo = null;

    // Vérifier si le token existe et est valide
    if (token) {
        try {
            userInfo = jwtDecode(token);
        } catch (error) {
            console.error("Erreur lors du décodage du token:", error);
        }
    }

    // Fonction pour récupérer les rapports et compter chaque statut
    const fetchRapportCounts = async () => {
        try {
            const response = await axiosInstance.get('/rapports/tous');
            console.log("Réponse API:", response.data); // Log de la réponse API pour déboguer

            const rapports = response.data.data.rapports;

            // Compter les rapports par statut
            const counts = {
                submitted: rapports.filter(report => report.Statut === 'Soumis').length,
                approved: rapports.filter(report => report.Statut === 'Approuvée').length,
                rejected: rapports.filter(report => report.Statut === 'Rejetée').length,
            };

            setReportCounts(counts);
        } catch (error) {
            console.error("Échec de la récupération des rapports :", error);
            setError("Erreur lors de la récupération des rapports.");
        }
    };

    useEffect(() => {
        fetchRapportCounts();
    }, []);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
            {/* BG */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
                <div className="absolute inset-0 backdrop-blur-sm" />
            </div>
            <Sidebar nom={userInfo?.Nom} role={userInfo?.roles} />
            <div className="flex-1 overflow-auto relative z-10">
                <Header title="Rapports" />

                <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
                    {/* Affichage de l'erreur */}
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    {/* STATS */}
                    {/* <motion.div
                        className="grid grid-cols-2 gap-5 sm:grid-cols-4 lg:grid-cols-3 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                       
                        <StatCard
                            name="Soumis"
                            icon={SendHorizonalIcon}
                            value={reportCounts.submitted}
                            color="#6366F1"
                        />

                        
                        <StatCard
                            name="Approuvé"
                            icon={CheckCheckIcon}
                            value={reportCounts.approved}
                            color="#10B981"
                        />

                        
                        <StatCard
                            name="Rejeté"
                            icon={XCircleIcon}
                            value={reportCounts.rejected}
                            color="#F59E0B"
                        />
                    </motion.div> */}

                    {/* Table des rapports */}
                    <RapportsTable />
                </main>
            </div>
        </div>
    );
};

export default AllRapportPage;
