import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import EmployeTable from "../../components/Rapports/Employe/EmpTable";
import Topbar from "../../components/Rapports/Topbar";
import { jwtDecode } from "jwt-decode";


const EmpAllPage = () => {
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
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
			<Topbar departement = {userInfo.departement} role={userInfo.roles}/>
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Rapport' deppartement={userInfo.departement} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					
				</motion.div>

				<EmployeTable />

				{/* USER CHARTS */}
				
			</main>
		</div>
		</div>
	);
};
export default EmpAllPage;
