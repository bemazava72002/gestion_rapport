import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UserGrowthChart from "../components/users/UserGrowthChart";
import UserActivityHeatmap from "../components/users/UserActivityHeatmap";
import UserDemographicsChart from "../components/users/UserDemographicsChart";
import Sidebar from "../components/common/Sidebar";
import UsersEntentTable from "../components/users/UserEntent";
const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const UsersEntentPage = () => {
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
			<Sidebar nom = {userInfo.Nom} role={userInfo.roles}/>
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Users' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
				
				</motion.div>

				<UsersEntentTable />

				{/* USER CHARTS */}
				{/* <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8'>
					<UserGrowthChart />
					<UserActivityHeatmap />
					<UserDemographicsChart />
				</div> */}
			</main>
		</div>
		</div>
	);
};
export default UsersEntentPage;
