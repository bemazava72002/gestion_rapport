import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import Modal from "./Modal";
import ModalRole from "./ModalRole";
import { useNavigate } from "react-router-dom";
const UsersEntentTable = () => {
	const [currentPage, setcurrentPage] = useState(1);
    const recordsPerPage = 3 ;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [showModalRole, setShowModalRole] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
	const [userData,setUserData] = useState({role_id:""})
	const [newUser, setNewUser] = useState("");
    const [allDepartements, setAllDepartements] = useState([]);
	const [allRoles,setAllRoles] = useState([]);
	const [message, setMessage] = useState("");
    const navigate = useNavigate()
	useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUsers();
				await fetchDepartements();
				await fetchRoles();
            } catch (error) {
                setError("Erreur lors du chargement des utilisateurs.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
	
	const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get(`/users/${false}`);
            console.log("Users récupérés :", response.data);
            const users = response.data.data.users || []; // Assurez-vous que c'est un tableau
            setAllUsers(users);
            setFilteredUsers(users);
        } catch (error) {
            console.error("Échec de la récupération des utilisateurs :", error);
            setError("Erreur lors de la récupération des utilisateur.");
        }
    };

	const fetchDepartements = async () => {
        try {
            const response = await axiosInstance.get('/departements');
            setAllDepartements(response.data.data);
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de la récupération des departements.");
        }
    };
	
	const fetchRoles = async () => {
        try {
            const response = await axiosInstance.get('/roles');
            setAllRoles(response.data.data);
        } catch (error) {
            console.error(error);
            setMessage("Erreur lors de la récupération des roles.");
        }
    };
	const closeModal = () => {
        setShowModal(false);
        setMessage("");
       
    };
	const closeModalRoles = () => {
        setShowModalRole(false);
        setMessage("");
       
    };
	const openRole = (user)=>{
		setModalTitle('Assigner un role');
		setUserData({role_id:user.role_id});
		setSelectedUserId(user.id);
		setShowModalRole(true);
	}
	const openAssignModal = (user) => {
        setModalTitle("Assigner le departement");
        setUserData({ departement_id: user.departement_id });
        setSelectedUserId(user.id);
        setShowModal(true);
    };
	const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        if (term === "") {
            setFilteredUsers(allUsers);
        } else {
            const filtered = allUsers.filter(user =>
                user.Nom.toLowerCase().includes(term) ||
				user.Prenom.toLowerCase().includes(term) ||
            user.Departements && user.Departements.departements.toLowerCase().includes(term) ||
			user.Roles && user.Roles.role.toLowerCase().includes(term)
            
            
        
            );
            setFilteredUsers(filtered);
        }
    };

	const handleAssignaDepart = async (userData) => {
        try {
            if (selectedUserId) {
                await axiosInstance.patch(`/assignDepart/${selectedUserId}`, userData);
            } else {
                await axiosInstance.post('/assignDepart', userData);
            }
            fetchUsers();
            closeModal();
        } catch (error) {
            setMessage(error.response?.data.message || "Erreur lors de l'assignation du departement");
        }
    
    };

	const handleDelete = async (id) => {
		if (window.confirm("Êtes-vous sûr de vouloir supprimer cette utilisateur ?")) {
			try {
				const response = await axiosInstance.delete(`/users/${id}`);
				setMessage('utilisateur a été supprimé avec succès');
				fetchUsers(); // Rafraîchir la liste des utilisateurs après suppression
			} catch (error) {
				console.error(error);
				setMessage("Erreur lors de la suppression des utilisateur.");
			}
		}
	};
	const handleAssignaRole = async (userData) => {
        try {
            if (selectedUserId) {
                await axiosInstance.patch(`/assignation/${selectedUserId}`, userData);
            } else {
                await axiosInstance.post('/assignation', userData);
            }
            fetchUsers();
            closeModalRoles();
        } catch (error) {
            setMessage(error.response?.data.message || "Erreur lors de l'assignation du role");
        }
    
    };	

    const handleActive = async (userId) => {
        try {
            await axiosInstance.patch(`/ActiveCompte/${userId}`, {isActive: true});
            setMessage("compte a bien été activé  avec succès.");
            navigate('/Users/Listes')
           
            
            
        } catch (error) {
            setMessage(error.response?.data.message || "Erreur lors de l'activation de compte.");
        }
    };
	const records =    filteredUsers.slice(firstIndex, lastIndex);


    const npage = Math.ceil(filteredUsers.length / recordsPerPage);
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
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Tous les rapports</h2>
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
					<table className="min-w-full divide-y divide-gray-700">
						<thead>
							<tr>
								{["Nom", "Email", "Departement", "Roles", "Actions"].map((header) => (
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
								records.map((user) => (
									<motion.tr
										key={user.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10'>
													<div className='h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold'>
														{user.Nom.charAt(0)}
													</div>
												</div>
												<div className='ml-4'>
													<div className='text-sm font-medium text-gray-100'>{user.Nom}{" "}{user.Prenom}</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-300'>{user.Email}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-300'>{user.Departements?.departements}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-300'>{user.Roles?.role}</div>
										</td>
										


										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
											<button
												className='text-indigo-400 hover:text-indigo-300 mr-2 text-sm'
												onClick={() => openAssignModal(user)}
											>
												<i className="fas fa-edit"></i>
												departement
											</button>
											<button
												className='text-green-400 hover:text-green-300 text-sm'
												onClick={() => openRole(user)}
											>
												<i className="fas fa-edit"></i>
												role
											</button>
                                            <button
												className='text-green-400 m-2 hover:text-green-300 text-sm'
												onClick={() => handleActive(user.id)}
											>
												<i className="fas fa-check"></i>
												Activer
											</button>

											<button onClick={() => handleDelete(user.id)} className='text-red-400 hover:text-red-300 text-sm' aria-label="Rejeter le rapport">
                                                        <i className="fas fa-trash"></i>
                                                    </button>
										</td>
									</motion.tr>
								))
							) : (
								<tr>
									<td colSpan="9" className="px-6 py-4 text-center text-gray-400">Aucun utilisateur trouvé.</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

			)}

			<Modal show={showModal}
				onClose={closeModal}
				title={modalTitle}
				departements={allDepartements}
				onSubmit={selectedUserId ? handleAssignaDepart : ''}
				initialData={userData}>
				<form onSubmit={handleAssignaDepart}>
					<select
						value={newUser}
						onChange={(e) => setNewUser(e.target.value)}
						className="w-full p-2 mb-4 border border-gray-300 rounded"
						required />

					<button type="submit" className="bg-blue-500 text-white p-2 rounded">Ajouter</button>
				</form>
			</Modal>

			<ModalRole show={showModalRole}
				onClose={closeModalRoles}
				title={modalTitle}
				role={allRoles}
				onSubmit={selectedUserId ? handleAssignaRole : ''}
				initialData={userData}>
				<form onSubmit={handleAssignaRole}>
					<select


						value={newUser}
						onChange={(e) => setNewUser(e.target.value)}
						className="w-full p-2 mb-4 border border-gray-300 rounded"
						required />

					<button type="submit" className="bg-blue-500 text-white p-2 rounded">Ajouter</button>
				</form>
			</ModalRole>

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

export default UsersEntentTable ;
