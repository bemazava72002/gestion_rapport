import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MoreHorizontal } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { CheckCheckIcon, SendHorizonalIcon, XCircleIcon } from "lucide-react";
import StatCard from "../common/StatCard"; 
import { saveAs } from 'file-saver'; 
const RapportsTable = () => {
    const navigate = useNavigate();
    const [reportCounts, setReportCounts] = useState({
        submitted: 0,
        approved: 0,
        rejected: 0,
    });
    const [currentPage, setcurrentPage] = useState(1);
    const recordsPerPage = 3;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const [searchTerm, setSearchTerm] = useState("");
    const [allRapport, setAllRapport] = useState([]);
    const [filteredRapport, setFilteredRapport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [searchDate, setSearchDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Mise à jour des compteurs en fonction des rapports filtrés
    const updateReportCounts = (filteredReports) => {
        const counts = {
            submitted: filteredReports.filter(report => report.Statut === 'Soumis').length,
            approved: filteredReports.filter(report => report.Statut === 'Approuvée').length,
            rejected: filteredReports.filter(report => report.Statut === 'Rejetée').length,
        };
        setReportCounts(counts);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchRapports();
                await fetchRapportCounts();
            } catch (error) {
                setError("Erreur lors du chargement des rapports.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchRapports = async () => {
        try {
            const response = await axiosInstance.get('/rapports/tous');
            const rapports = response.data.data.rapports || [];
            setAllRapport(rapports);
            setFilteredRapport(rapports);
            updateReportCounts(rapports);
        } catch (error) {
            setError("Erreur lors de la récupération des rapports.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
            try {
                await axiosInstance.delete(`/rapport/${id}`);
                fetchRapports();
            } catch (error) {
                setError("Erreur lors de la suppression de rapport.");
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
                rapport.Departement?.departements.toLowerCase().includes(term) ||
                rapport.Departement?.Provinces?.provinces.toLowerCase().includes(term) ||
                rapport.Auteur?.Nom.toLowerCase().includes(term) ||
                rapport.Responsable?.Nom.toLowerCase().includes(term)
            );
            setFilteredRapport(filtered);
        }
    };

    const filterByDate = (rapport) => {
        const rapportDate = new Date(rapport.date_creation);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        return (!start || rapportDate >= start) && (!end || rapportDate <= end);
    };

    useEffect(() => {
        const filtered = allRapport.filter(rapport => 
            filterByDate(rapport) && (
                rapport.titre.toLowerCase().includes(searchTerm) ||
                rapport.Departement?.departements.toLowerCase().includes(searchTerm) ||
                rapport.Departement?.Provinces?.provinces.toLowerCase().includes(searchTerm) ||
                rapport.Auteur?.Nom.toLowerCase().includes(searchTerm) ||
                rapport.Responsable?.Nom.toLowerCase().includes(searchTerm)
            )
        );
        setFilteredRapport(filtered);
        updateReportCounts(filtered);
        
    }, [searchTerm, startDate, endDate, allRapport]);

    const records = filteredRapport.slice(firstIndex, lastIndex);
    const npage = Math.ceil(filteredRapport.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    const prevPage = () => currentPage !== 1 && setcurrentPage(currentPage - 1);
    const changePage = (id) => setcurrentPage(id);
    const nextPage = () => currentPage !== npage && setcurrentPage(currentPage + 1);

    const toggleDropdown = (id) => {
        setDropdownOpen(dropdownOpen === id ? null : id);
    };

    const handleAfficherTous = () => {
        setSearchDate("");
        setFilteredRapport(allRapport);
        updateReportCounts(allRapport);
    };

    const fetchRapportCounts = async () => {
        try {
            const response = await axiosInstance.get('/rapports/tous');
            const rapports = response.data.data.rapports;
            updateReportCounts(rapports);
        } catch (error) {
            setError("Erreur lors de la récupération des rapports.");
        }
    };

    

    const exportRapports = async (format, startDate, endDate, provinces, departements, Statut) => {
        try {
            // Construction des paramètres de la requête
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);
            if (provinces) params.append('provinces', provinces); // Peut être un ID ou une valeur
            if (departements) params.append('departements', departements); // Peut être un ID ou une valeur
            if (Statut) params.append('Statut', Statut); // Ajout du statut si nécessaire
    
            // Requête axios avec les paramètres
            const response = await axiosInstance.get(`/rapport/generate?${params.toString()}&format=${format}`, {
                responseType: 'blob', // Assure la réception en tant que blob
            });
    
            // Vérifiez le format et définissez l'extension du fichier
            let fileType = 'application/octet-stream';
            let fileExtension = 'txt';
    
            if (format === 'excel') {
                fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                fileExtension = 'xlsx';
            } else if (format === 'pdf') {
                fileType = 'application/pdf';
                fileExtension = 'pdf';
            }
    
            // Création d'un Blob et téléchargement
            const blob = new Blob([response.data], { type: fileType });
            saveAs(blob, `rapport_filtre.${fileExtension}`);
        } catch (error) {
            console.error("Erreur lors de l'exportation des rapports :", error);
            setError("Erreur lors de l'exportation des rapports.");
        }
    };
    

   


    return (
        <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700">
            <motion.div className="grid grid-cols-4 gap-5 sm:grid-cols-4 lg:grid-cols-3 mb-8">
                <StatCard name="Soumis" icon={SendHorizonalIcon} value={reportCounts.submitted} color="#6366F1" />
                <StatCard name="Approuvé" icon={CheckCheckIcon} value={reportCounts.approved} color="#10B981" />
                <StatCard name="Rejeté" icon={XCircleIcon} value={reportCounts.rejected} color="#F59E0B" />
            </motion.div>
            <div className="flex justify-between items-center mb-6">
                <div className="relative flex items-center space-x-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4"
                    />
                    <button onClick={handleAfficherTous} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md">
                        tous
                    </button>
                    <input
                        type="text"
                        placeholder="Rechercher un rapport..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    <div className="flex space-x-1">
                    <button onClick={() => exportRapports('pdf')} className="px-4 py-2 bg-gray-600 text-white rounded-md">
                        PDF
                    </button>
                    <button onClick={() => exportRapports('excel')} className="px-4 py-2 bg-green-700 text-white rounded-md">
                        Excel
                    </button>
                </div>
                </div>
                
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
                                {["Titre", "Description", "Statut", "Departement", "Provinces",  "Date", "Createur", "Responsable", "Types", "Fichier", "Actions"].map((header) => (
                                    <th
                                        key={header}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-700">
                            {Array.isArray(records) && records.length > 0 ? (
                                records.map((rapport) => (
                                    <motion.tr
                                        key={rapport.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className={rapport.Statut === "Approuvé" ? "bg-gray-600" : ""}
                                    >
                                        
                                        <td className='px-6 py-4 whitespace-nowrap'>
    <div className='flex items-center'>
        <div className='flex-shrink-0 h-10 w-10'>
            <div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
                {rapport.titre ? rapport.titre.charAt(0) : "?"} {/* Vérifiez si titre existe */}
            </div>
        </div>
        <div className='ml-4'>
            <div className='text-sm font-medium text-gray-100'>{rapport.titre || "Titre non disponible"}</div>
        </div>
    </div>
</td>
												
                                        {/* Ligne des données */}
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.description}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.Statut}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.Departement?.departements}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.Departement.Provinces.provinces}</td>

                                        <td className='px-4 py-2 whitespace-nowrap'>
                                            <div className='text-sm text-gray-300'>{new Date(rapport.date_creation).toLocaleDateString("fr-FR")}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.Auteur?.Nom}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.Responsable?.Nom}</td>
                                        <td className="px-6 py-4 text-sm text-gray-300">{rapport.type}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                            {rapport.fichier ? (
                                                <a href={`${import.meta.env.VITE_API_URL}${rapport.fichier}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">
                                                    ouvrir
                                                </a>
                                            ) : "Aucun fichier disponible"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 relative">
                                            <button
                                                onClick={() => toggleDropdown(rapport.id)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>

                                            {dropdownOpen === rapport.id && (
                                                <div className="absolute right-5 mt-2 w-10 bg-gray-800 rounded-lg shadow-md">
                                                    <ul>
                                                        <li>
                                                            <button
                                                                onClick={() => navigate(`/modifier-rapport/${rapport.id}`)}
                                                                className="block px-4 py-2 text-sm text-green-500"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={() => handleDelete(rapport.id)}
                                                                className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                        Aucune donnée disponible
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
    onClick={nextPage} // Remplacez `nexPage` par `nextPage`
    className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg"
    disabled={currentPage === npage}
>
    Suivant
</button>
            </div>
        </motion.div>
    );
};

export default RapportsTable;
