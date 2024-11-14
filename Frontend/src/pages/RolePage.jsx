import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { jwtDecode } from "jwt-decode";
import Sidebar from "../components/common/Sidebar";
import RoleTable from "../components/Roles/RoleTable";// Assurez-vous que le chemin d'importation est correct

const RolePage = () => {
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

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* Background */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
			
			{/* Sidebar */}
			<Sidebar nom={userInfo?.Nom} role={userInfo?.roles} />

			{/* Main content */}
			<div className='flex-1 overflow-auto relative z-10'>
				<Header title='Roles'  />

				<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
					{/* STATS (Placeholder for future stats) */}
					<motion.div
						className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1 }}
					>
						{/* Ajoutez ici vos statistiques si nécessaire */}
					</motion.div>

					{/* Departements Table */}
					<RoleTable />

					{/* USER CHARTS (Placeholder for future charts) */}
				</main>
			</div>
		</div>
	);
};

export default RolePage;
