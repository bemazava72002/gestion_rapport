// src/components/EmployeTable.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance"; // Ajustez le chemin selon votre structure
import { Link } from "react-router-dom";

const EmployeTable = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(""); // État pour la date de début
    const [endDate, setEndDate] = useState(""); // État pour la date de fin
    const [allRapport, setAllRapport] = useState([]);
    const [filteredRapport, setFilteredRapport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/rapports');
                const rapports = response.data.data.rapports || [];
                setAllRapport(rapports);
                setFilteredRapport(rapports);
            } catch (error) {
                console.error('Erreur lors de la récupération des rapports:', error);
                setError("Erreur lors de la récupération des rapports.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterReports(term, startDate, endDate); // Filtrer avec les dates
    };

    const handleDateChange = () => {
        filterReports(searchTerm, startDate, endDate); // Filtrer avec les dates
    };

    const filterReports = (term, start, end) => {
        const filtered = allRapport.filter(rapport => {
            const rapportDate = new Date(rapport.date_creation);
            const withinDateRange = (!start || rapportDate >= new Date(start)) && (!end || rapportDate <= new Date(end));
            return (
                (rapport.titre.toLowerCase().includes(term) ||
                (rapport.Departement && rapport.Departement.departements.toLowerCase().includes(term)) ||
                (rapport.Responsable && rapport.Responsable.Nom.toLowerCase().includes(term))) &&
                withinDateRange
            );
        });
        setFilteredRapport(filtered);
    };

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Rapports</h2>
                <div className="relative mt-4 sm:mt-0">
                    <input
                        type="text"
                        placeholder="Search rapport..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                        aria-label="Search rapports"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <Link to='/CreateRapport' className="mt-4 sm:mt-0">
                    <button className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-gray-900 font-semibold'>
                        <i className="fas fa-plus text-sm font-medium text-gray-100"></i>
                    </button>
                </Link>
            </div>

            {/* Champs de saisie pour les dates */}
            <div className="flex mb-4 flex-col sm:flex-row">
                <input 
                    type="date" 
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 mr-2 mb-2 sm:mb-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); handleDateChange(); }} 
                    aria-label="Date de début"
                />
                <input 
                    type="date" 
                    className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); handleDateChange(); }} 
                    aria-label="Date de fin"
                />
            </div>

            {loading ? (
                <div className="text-gray-300 text-center">Chargement des rapports...</div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead>
                            <tr>
                                {["Titre","Statut", "Description", "Types", "Responsable", "Département", "Fichier", "Date", "Actions"].map((header) => (
                                    <th
                                        key={header}
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {Array.isArray(filteredRapport) && filteredRapport.length > 0 ? (
                                filteredRapport.map((rapport) => (
                                    <motion.tr
                                        key={rapport.id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }} 
                                        transition={{ duration: 0.3 }} 
                                        className={`p-4 ${rapport.Statut === "Approuvée" ? "bg-gray-700" : ""}`}>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='flex items-center'>
                                                <div className='flex-shrink-0 h-10 w-10'>
                                                    <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                                                        {rapport.titre.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className='ml-4'>
                                                    <div className='text-sm font-medium text-gray-100'>{rapport.titre}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap text-sm text-gray-300'>
                                            {/* Affichage de l'icône selon le statut du rapport */}
                                            {rapport.Statut === "Soumis" ? (
                                                <span className='text-blue-400' aria-label="Rapport soumis">
                                                    <i className="fas fa-paper-plane"></i>
                                                </span>
                                            ) : rapport.Statut === "Approuvée" ? (
                                                <span className='text-green-400' aria-label="Rapport approuvé">
                                                    <i className="fas fa-circle-check"></i>
                                                </span>
                                            ) : (
                                                <span className='text-red-400' aria-label="Rapport rejeté">
                                                    <i className="fas fa-times"></i>
                                                </span>
                                            )}
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>{rapport.description}</div>
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>{rapport.type}</div>
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>{rapport.Responsable?.Nom || "Inconnu"}</div>
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>{rapport.Departement?.departements || "Département inconnu"}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {rapport.fichier ? (
                                                <a href={`${import.meta.env.VITE_API_URL}${rapport.fichier}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                                                    ouvrir
                                                </a>
                                            ) : "Aucun fichier disponible"}
                                        </td>
                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>{new Date(rapport.date_creation).toLocaleDateString("fr-FR")}</div>
                                        </td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {rapport.Statut === "Approuvée" ? (
                                                <button className='text-indigo-500 hover:text-indigo-300 mr-2 text-xl' aria-label="Consulter le rapport">
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                            ) : (
                                                <>
                                                    <button className='text-green-400 hover:text-green-300 mr-2 text-sm' onClick={() => handleApprouve(rapport.id)} aria-label="Approuver le rapport">
                                                        <i className="fas fa-edit"></i>Rectifier
                                                    </button>
                                                    
                                                </>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-4 text-center text-gray-400">
                                        Aucune donnée trouvée.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default EmployeTable;
