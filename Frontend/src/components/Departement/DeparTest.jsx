// src/components/ProvincesTable.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosInstance from '../../utils/axiosInstance';
import Modal from "./modalTest";

const DepartementTestTable = () => {
	const [selectedDepartementId, setSelectedDepartementId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [allDepartements, setAllDepartements] = useState([]);
    const [filteredDepartements, setFilteredDepartements] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [newDepartement, setNewDepartement] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchDepartements();
    }, []);
// affichage
    const fetchDepartements = async () => {
		try {
			const response = await axiosInstance.get('/departements');
			console.log(response.data); // Vérifiez ici ce qui est retourné
			setAllDepartements(response.data.data); // Stocke la liste complète des provinces
        setFilteredDepartements(response.data.data);// Assurez-vous d'accéder à `data`
		} catch (error) {
			console.error(error); // Afficher l'erreur
			setMessage("Erreur lors de la récupération des departements.");
		}
	};
//recherche
const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
        // Si le terme de recherche est vide, réinitialiser la liste des provinces
        setFilteredDepartements(allDepartements);
    } else {
        const filtered = filteredDepartements.filter(departement =>
            departement.departements.toLowerCase().includes(term) ||
            departement.Provinces.provinces.toLowerCase().includes(term)
        );
        setFilteredDepartements(filtered);
    }
};
	
// modal
   
    const closeModal = () => {
        setShowModal(false);
        setMessage("");
    };

// fin modal

// Ajout
	const handleAddDepartement = async (DepartementData) => {
		try {
			const response = await axiosInstance.post('/departements', { departements: DepartementData.departements });
			setMessage(response.data.message);
			fetchDepartements(); // Rafraîchir la liste des departements
			closeModal();
		} catch (error) {
			setMessage(error.response?.data.message || "Erreur lors de l'ajout de la departement.");
		}
	};
//suppression

	const handleDelete = async (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer cette departement ?")) {
			try {
				const response = await axiosInstance.delete(`/departement/${id}`);
				setMessage(response.data.message);
				fetchDepartements(); // Rafraîchir la liste des departements après suppression
			} catch (error) {
				console.error(error);
				setMessage("Erreur lors de la suppression de departement.");
			}
		}
	};
	
	
	const handleUpdateDepartement = async (departementData) => {
        try {
            const response = await axiosInstance.put(`/departement/${selectedDepartementId}`, departementData);
            setMessage(response.data.message);
            fetchDepartements();
            closeModal();
        } catch (error) {
            setMessage("Erreur lors de la mise à jour de departement.");
        }
    };		
	const openEditModal = (departement) => {
        setModalTitle("Modifier le departement");
        setNewDepartement(departement.departements);
        setSelectedDepartementId(departement.id);
        setShowModal(true);
    };
	const openAddModal = () => {
        setModalTitle("Ajouter un departement");
        setNewDepartement("");
        setSelectedDepartementId(null); // Réinitialiser l'ID sélectionné
        setShowModal(true);
    };
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Departement</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='recherche...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
                </div>
                <button
                    className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-gray-900 font-semibold'
                    onClick={openAddModal}
                >
                    <i className="fas fa-plus text-sm font-medium text-gray-100"></i>
                </button>
            </div>

            {message && <div className="mb-4 text-green-400">{message}</div>}

            <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-700'>
                    <thead>
                        <tr>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>id</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Departements</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Provinces</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>
					<tbody className='divide-y divide-gray-700'>
    {Array.isArray(filteredDepartements) && filteredDepartements.length > 0 ? (
        filteredDepartements.map((departement) => (
            <motion.tr
                key={departement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-100'>{departement.id}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-300'>{departement.departements}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-300'>{departement.Provinces.provinces}</div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                    <button
                        className='text-indigo-400 hover:text-indigo-300 mr-2 text-xl'
						onClick={() => openEditModal(departement)}
                    >
                        <i className="fas fa-edit"></i>
                    </button>
                    <button
                        className='text-red-400 hover:text-red-300 text-xl'
                        onClick={() => handleDelete(departement.id)}
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </td>
            </motion.tr>
        ))
    ) : (
        <tr>
            <td colSpan="3" className="px-6 py-4 text-center text-gray-400">Aucune departement trouvée.</td>
        </tr>
    )}
</tbody>
                </table>
            </div>

            {/* Modal pour ajouter une province */}
			<Modal show={showModal}
			 onClose={closeModal}
			  title={modalTitle} 
			  onSubmit={selectedDepartementId ? handleUpdateDepartement : handleAddDepartement}
			  initialData={selectedDepartementId ? { departements: newDepartement } : null}>
    <form onSubmit={handleAddDepartement}>
        <input
            type="text"
            placeholder="Nom de departement"
            value={newDepartement}
            onChange={(e) => setNewDepartement(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded"
            required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Ajouter</button>
    </form>
</Modal>


        </motion.div>
    );
};

export default DepartementTestTable;
