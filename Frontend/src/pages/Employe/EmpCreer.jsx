import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/common/Header";
import EmployeTable from "../../components/Rapports/Employe/EmpTable";
import Topbar from "../../components/Rapports/Topbar";
import CreateRapport from "../../components/Rapports/Employe/AjoutRapport";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const EmpAjout = () => {
	

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
			<Topbar nom = 'rakotoson' role='Employé'/>
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Rapport' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					
				</motion.div>

				<CreateRapport />

				{/* USER CHARTS */}
				
			</main>
		</div>
		</div>
	);
};
export default EmpAjout;
