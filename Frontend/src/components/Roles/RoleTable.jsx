// src/components/ProvincesTable.js
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosInstance from '../../utils/axiosInstance';
import Modal from "./Modal";

const RoleTable = () => {
    const [currentPage, setcurrentPage] = useState(1);
    const recordsPerPage = 6;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
	const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [allRoles, setAllRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [newRole, setNewRole] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchRoles();
    }, []);
// affichage
    const fetchRoles = async () => {
		try {
			const response = await axiosInstance.get('/roles');
			console.log(response.data); // Vérifiez ici ce qui est retourné
			setAllRoles(response.data.data); // Stocke la liste complète des roles
        setFilteredRoles(response.data.data);// Assurez-vous d'accéder à `data`
		} catch (error) {
			console.error(error); // Afficher l'erreur
			setMessage("Erreur lors de la récupération des roles.");
		}
	};
//recherche
const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === "") {
        // Si le terme de recherche est vide, réinitialiser la liste des provinces
        setFilteredRoles(allRoles);
    } else {
        const filtered = filteredRoles.filter(roles =>
            roles.role.toLowerCase().includes(term)
        );
        setFilteredRoles(filtered);
    }
};
	
// modal
   
    const closeModal = () => {
        setShowModal(false);
        setMessage("");
    };

// fin modal

// Ajout
	const handleAddRole = async (roleData) => {
		try {
			const response = await axiosInstance.post('/role', { role: roleData.role });
			setMessage(response.data.message);
			fetchRoles(); // Rafraîchir la liste des roles
			closeModal();
		} catch (error) {
			setMessage(error.response?.data.message || "Erreur lors de l'ajout de role.");
		}
	};
//suppression

	const handleDelete = async (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer cette role ?")) {
			try {
				const response = await axiosInstance.delete(`/roles/${id}`);
				setMessage(response.data.message);
				fetchRoles(); // Rafraîchir la liste des provinces après suppression
			} catch (error) {
				console.error(error);
				setMessage("Erreur lors de la suppression de role.");
			}
		}
	};
	

	const handleUpdateRole = async (roleData) => {
        try {
            const response = await axiosInstance.put(`/roles/${selectedRoleId}`, roleData);
            setMessage(response.data.message);
            fetchRoles();
            closeModal();
        } catch (error) {
            setMessage("Erreur lors de la mise à jour de role.");
        }
    };		
	const openEditModal = (roles) => {
        setModalTitle("Modifier le role");
        setNewRole(roles.role);
        setSelectedRoleId(roles.id);
        setShowModal(true);
    };
	const openAddModal = () => {
        setModalTitle("Ajouter un role");
        setNewRole("");
        setSelectedRoleId(null); // Réinitialiser l'ID sélectionné
        setShowModal(true);
    };

    const records =    filteredRoles.slice(firstIndex, lastIndex);


    const npage = Math.ceil(filteredRoles.length / recordsPerPage);
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
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex justify-between items-center mb-6'>
                <h2 className='text-xl font-semibold text-gray-100'>Roles</h2>
                <div className='relative'>
                    <input
                        type='text'
                        placeholder='recherche...'
                        className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={searchTerm}
                        onChange={handleSearch} />
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
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Roles</th>
                            <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                        {Array.isArray(records) && records.length > 0 ? (
                            records.map((roles) => (
                                <motion.tr
                                    key={roles.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm font-medium text-gray-100'>{roles.id}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap'>
                                        <div className='text-sm text-gray-300'>{roles.role}</div>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                        <button
                                            className='text-indigo-400 hover:text-indigo-300 mr-2 text-sm'
                                            onClick={() => openEditModal(roles)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className='text-red-400 hover:text-red-300 text-sm'
                                            onClick={() => handleDelete(roles.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">Aucune role trouvée.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal pour ajouter un role */}
            <Modal show={showModal}
                onClose={closeModal}
                title={modalTitle}
                onSubmit={selectedRoleId ? handleUpdateRole : handleAddRole}
                initialData={selectedRoleId ? { role: newRole } : null}>
                <form onSubmit={handleAddRole}>
                    <input
                        type="text"
                        placeholder="roles"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full p-2 mb-4 border border-gray-300 rounded"
                        required />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">Ajouter</button>
                </form>
            </Modal>


        </motion.div> <div className="mt-6 flex justify-center space-x-2">
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

export default RoleTable;
