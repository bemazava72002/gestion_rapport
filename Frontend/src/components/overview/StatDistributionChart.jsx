import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Définir un ensemble de couleurs
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const StatDistributionChart = ({ dat }) => {
    // Journal pour débogage
    console.log("Données reçues pour le graphique circulaire:", dat);

	// Vérification si les données sont vides
	if (!dat || dat.length === 0) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 text-center text-gray-400'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<h2 className='text-lg font-medium mb-4 text-gray-100'>Category Distribution</h2>
				<p>Aucune donnée disponible pour le graphique circulaire.</p>
			</motion.div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-lg font-medium mb-4 text-gray-100'>Category Distribution</h2>
			<div className='h-80'>
				<ResponsiveContainer width="100%" height="100%">
					<PieChart>
						<Pie
							data={dat}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={90}
							fill='#8884d8'
							dataKey='value'
							label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
						>
							{dat.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend
							iconType="circle"
							iconSize={10}
							layout="horizontal"
							align="center"
							verticalAlign="bottom"
							wrapperStyle={{ color: "#E5E7EB" }}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default StatDistributionChart;
