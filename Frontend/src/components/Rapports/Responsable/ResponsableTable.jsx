import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const ResponsableRapportsTable = () => {
    const navigate = useNavigate();

    const [currentPage, setcurrentPage] = useState(1);
    const recordsPerPage = 4;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [searchTerm, setSearchTerm] = useState("");
    const [allRapport, setAllRapport] = useState([]);
    const [filteredRapport, setFilteredRapport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchResponsableRapports();
            } catch (error) {
                setError("Erreur lors du chargement des rapports.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchResponsableRapports = async () => {
        try {
            const response = await axiosInstance.get('/rapports/responsable');
            const rapports = response.data.data.rapports || [];
            setAllRapport(rapports);
            setFilteredRapport(rapports);
        } catch (error) {
            console.error("Échec de la récupération des rapports :", error);
            setError("Erreur lors de la récupération des rapports.");
        }
    };

    const handleApprouve = async (rapportId) => {
        try {
            await axiosInstance.patch(`/rapport/validation/${rapportId}`, { Statut: "Approuvée" });
            setMessage("Rapport approuvé avec succès.");
            fetchResponsableRapports();
        } catch (error) {
            setMessage(error.response?.data.message || "Erreur lors de la validation du rapport.");
        }
    };

    const handleReject = async (rapportId) => {
        const recommandation = prompt("Veuillez entrer une recommandation pour le rejet:");
        if (recommandation) {
            try {
                await axiosInstance.patch(`/rapport/validation/${rapportId}`, { Statut: "Rejetée", recommandation });
                setMessage("Rapport rejeté avec succès.");
                fetchResponsableRapports();
            } catch (error) {
                setMessage(error.response?.data.message || "Erreur lors du rejet du rapport.");
            }
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        
        setSearchTerm(term);
        

        if (term === "") {
            setFilteredRapport(allRapport);
        } else {
            const filtered = allRapport.filter(rapport =>
                rapport.titre.toLowerCase().includes(term) || 
                (rapport.Departement && rapport.Departement.departements.toLowerCase().includes(term))
            );
            setFilteredRapport(filtered);
        }
    };
    const records =    filteredRapport.slice(firstIndex, lastIndex);


    const npage = Math.ceil(filteredRapport.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    function prevPage() {
      if (currentPage !== 1) {
        setcurrentPage(currentPage - 1);
      }
    }
    function changePage(id) {
      setcurrentPage(id);
    }
    function nexPage() {
      if (currentPage !== npage) {
        setcurrentPage(currentPage + 1);
      }
    }
    return (
        <><motion.div
            className="bg-gray-800 bg-opacity-10 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Rapports de mon département</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Rechercher un rapport..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                        aria-label="Rechercher des rapports" />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {loading ? (
                <div className="text-gray-300 text-center">Chargement des rapports...</div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                {["Titre", "Statut", "Description", "Types", "Créateur", "Fichier", "Date", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {Array.isArray(records) && records.length > 0 ? (
                                records.map((rapport) => (
                                    <motion.tr key={rapport.id}
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
                                            <div className='text-sm text-gray-300'>{rapport.Auteur?.Nom || "Inconnu"}</div>
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
                                                        <i className="fas fa-check"></i> Approuver
                                                    </button>
                                                    <button className='text-red-400 hover:text-red-300 text-sm' onClick={() => handleReject(rapport.id)} aria-label="Rejeter le rapport">
                                                        <i className="fas fa-times"></i> Rejeter
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-4 text-center text-gray-400">Aucun rapport trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {message && <div className="text-center mt-4 text-gray-300">{message}</div>}
        </motion.div>
        
        <div className="mt-6 flex justify-center space-x-2">
        <button
                    onClick={prevPage}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
                    disabled={currentPage === 1}
                >
                    Précédent
                </button>
                {numbers.map((num) => (
                    <button
                        key={num}
                        onClick={() => changePage(num)}
                        className={`px-4 py-2 rounded-lg ${currentPage === num ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"}`}
                    >
                        {num}
                    </button>
                ))}
                <button
                    onClick={nexPage}
                    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
                    disabled={currentPage === npage}
                >
                    Suivant
                </button>
                </div></>
    );
};

export default ResponsableRapportsTable;
