import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { CheckCheckIcon, SendHorizonalIcon, XCircleIcon } from "lucide-react";
import StatCard from "../../components/common/StatCard";
import StatDistributionChart from "./StatDistributionChart";
import TypesChart from "./StatTypes";
import MonthlyReportsChart from "./MonthlyRepportsChart";
import { format } from 'date-fns';

const Overview = () => {
    const [reportCounts, setReportCounts] = useState({
        submitted: 0,
        approved: 0,
        rejected: 0,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [allRapport, setAllRapport] = useState([]);
    const [filteredRapport, setFilteredRapport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);
    const [chartType,setChartType] = useState([])

    // Mise à jour des compteurs en fonction des rapports filtrés
    const updateReportCounts = (filteredReports) => {
        const counts = {
            submitted: filteredReports.filter(report => report.Statut === 'Soumis').length,
            approved: filteredReports.filter(report => report.Statut === 'Approuvée').length,
            rejected: filteredReports.filter(report => report.Statut === 'Rejetée').length,
        };
        setReportCounts(counts);
    };

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchRapports();
                await fetchStats();
            } catch (error) {
                setError("Erreur lors du chargement des rapports.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Récupération des statistiques avec critères de recherche dynamiques
    const fetchStats = async () => {
        try {
            const params = { date_debut: startDate, date_fin: endDate, searchTerm };
            const response = await axiosInstance.get('/rapport/stats', { params });
            console.log(response.data); // Vérifiez la structure des données ici
            const monthlyStats = response.data.data.monthlyStats;
            const StatusStats = response.data.data.statusStats;
            const StatType = response.data.data.typeStats;            // Formatage des données pour le graphique
            const formattedData = monthlyStats.map((stat) => ({
                mois: format(new Date(stat.month), 'MMMM yyyy dd'), 
                rapports: stat.monthly_count
            }));
            const formattedDatapie = StatusStats.map((stats) => ({
                name: stats.Statut,  // Remplacez 'Statut' par la clé correcte si nécessaire
                value: Number(stats.status_count)
            }));
            
            const formattedType = StatType.map((types)=>({
               name:types.type,
               value:types.type_count
            }))
            setChartData(formattedData);
            setPieData(formattedDatapie);
            setChartType(formattedType)
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques', error);
        }
    };


    // Récupération des rapports
    const fetchRapports = async () => {
        try {
            const response = await axiosInstance.get('/rapports/tous');
            const rapports = response.data.data.rapports || [];
            setAllRapport(rapports);
            setFilteredRapport(rapports);
            updateReportCounts(rapports);
            setChartData(rapports); 
            setPieData(rapports)
            setChartType(rapports) // Assurez-vous que les données sont pertinentes pour `chartData`
        } catch (error) {
            setError("Erreur lors de la récupération des rapports.");
        }
    };

    // Filtrage en fonction du texte de recherche et des dates
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
        fetchStats(); // Récupère les statistiques pour les critères mis à jour
    };

    // Fonction de filtrage par date
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
        fetchStats(); // Récupération des statistiques mises à jour pour chaque changement de filtre
    }, [searchTerm, startDate, endDate, allRapport]);

    // Réinitialiser tous les filtres
    const handleAfficherTous = () => {
        setSearchTerm("");
        setStartDate("");
        setEndDate("");
        setFilteredRapport(allRapport);
        updateReportCounts(allRapport);
        fetchStats(); // Récupère toutes les statistiques
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
                        Tous
                    </button>
                    <input
                        type="text"
                        placeholder="Rechercher un rapport..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <MonthlyReportsChart datas={chartData} />
                {/* Rendu conditionnel de StatDistributionChart */}
                {pieData && pieData.length > 0 ? (
                    <StatDistributionChart dat={pieData} />
                ) : (
                    <p className="text-gray-400">Aucune donnée disponible pour le graphique circulaire.</p>
                )}
                <TypesChart dataType={chartType} />
            </div>
        </motion.div>
    );
};

export default Overview;
