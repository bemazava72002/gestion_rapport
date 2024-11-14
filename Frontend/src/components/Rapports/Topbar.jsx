import { BarChart2,EarthIcon, Menu, User, ChevronDown, Building, Briefcase, Folder, ClipboardListIcon } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const TOPBAR_ITEMS = [
	
	
	{ name: "Rapports", icon: ClipboardListIcon, color: "#EC4899", href: "/EmpRapport" },
	
// 	{ name: "Affaire", icon: Briefcase, color: "#F59E0B", href: "/Affaire" },
// 	{ name: "Dossier", icon: Folder, color: "#3B82F6", href: "/Dossier" },
//   { name: "Mon compte", icon: User, color: "#EC4899", href: "/User/profile/" },
];

const Topbar = ({role}) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [openDropdown, setOpenDropdown] = useState(null);

	const toggleDropdown = (index) => {
		setOpenDropdown(openDropdown === index ? null : index);
	
	
		// Vérifier si le token existe et est valide
		
	
	};


	return (
		<motion.div
		className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
			isSidebarOpen ? "w-64" : "w-20"
		}`}
		animate={{ width: isSidebarOpen ? 256 : 80 }}
		>
			<div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
			
				<motion.button
					whileHover={{ scale: 1.1 }}
					whileTap={{ scale: 0.9 }}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
				>
					<Menu size={24} />
				</motion.button>
				
                    
					<div className='items-center mx-auto mt-5'>
                       <span><i className="fas fa-user-circle text-gray-100 text-5xl mr-2"></i> </span><br /> {/* Icône d'avatar */}

						
						<h2 className={`text-gray-100 ${!isSidebarOpen && 'hidden'}`}>{role}</h2>
						 {/* Afficher le nom d'utilisateur */} {/* Afficher le nom de l'utilisateur */}
                    </div>
                        
{/* Icône de déconnexion */}
                   
              
				<nav className='mt-8 flex-grow'>
					{TOPBAR_ITEMS.map((item, index) => (
						<div key={item.href}>
							<Link to={item.href} onClick={() => item.subItems && toggleDropdown(index)}>
								<motion.div className='flex items-center justify-between p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
									<div className='flex items-center'>
										<item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
										<AnimatePresence>
											{isSidebarOpen && (
												<motion.span
													className='ml-4 whitespace-nowrap'
													initial={{ opacity: 0, width: 0 }}
													animate={{ opacity: 1, width: "auto" }}
													exit={{ opacity: 0, width: 0 }}
													transition={{ duration: 0.2, delay: 0.3 }}
												>
													{item.name}
												</motion.span>
											)}
										</AnimatePresence>
									</div>
									{item.subItems && isSidebarOpen && (
										<ChevronDown size={18} />
									)}
								</motion.div>
							</Link>
							{/* Dropdown items */}
							{item.subItems && openDropdown === index && (
								<AnimatePresence>
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className='pl-8'
									>
										{item.subItems.map((subItem) => (
											<Link key={subItem.href} to={subItem.href}>
												<motion.div className='flex items-center p-3 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
													{isSidebarOpen && (
														<motion.span
															className='ml-4 whitespace-nowrap'
															initial={{ opacity: 0, width: 0 }}
															animate={{ opacity: 1, width: "auto" }}
															exit={{ opacity: 0, width: 0 }}
															transition={{ duration: 0.2, delay: 0.3 }}
														>
															{subItem.name}
														</motion.span>
													)}
												</motion.div>
											</Link>
										))}
									</motion.div>
								</AnimatePresence>
							)}
						</div>
					))}
				</nav>
			</div>
		</motion.div>
	)
;
};


export default Topbar;
