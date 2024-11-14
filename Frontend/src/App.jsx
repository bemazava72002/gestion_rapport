import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import FinancePage from "./pages/Finance";
import JusticePage from "./pages/justice";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import ProvincePage from "./pages/ProvincePage";
import DepartementPage from "./pages/DepartementPage";
import JobPage from "./pages/JobPage";
import EmpAllPage from "./pages/Employe/EmployePage";
import EmpAjout from "./pages/Employe/EmpCreer";
import ResAllPage from "./pages/Responsable/ResponsablePage";
import RolePage from "./pages/RolePage";
import RapportsTable from "./components/Rapports/RapportTable";
import AllRapportPage from "./pages/Rapports";
import HistoriquePage from "./pages/Historique";
import UsersEntentPage from "./pages/UserEntentPage";
import TestPage from "./pages/TestPage";
import AllNotificationPage from "./pages/AllNotificationPage";
import PrintPage from "./pages/printPage";


function App() {
				
	return (
		
		
			<BrowserRouter>
			
				<Routes>
				<Route exact = {true} path='/' element={<Navigate to="/login"/>}/>
				<Route  path='/login' element={<Login/>}/>
				<Route  path='/test' element={<TestPage/>}/>

				<Route path="/Signup" element={<Signup/>}/>
				<Route path="/print" element={<PrintPage/>}/>
				{/* Admin */}
				<Route element={<ProtectedRoute allowedRoles={['Admin']}/>} >
				 <Route path='/Accueil' element={ < OverviewPage />} />
				<Route path='/province' element={<ProvincePage />} />
				<Route path='/Departement/Tous' element={<DepartementPage />} />
				<Route path='/Users/Roles' element={<RolePage />} />
				<Route path='/Rapports/tous' element={<AllRapportPage />} />
				<Route path='/Users/Listes' element={<UsersPage />} />
				<Route path='/Users/attente' element={<UsersEntentPage />} />
				<Route path='/AllNotifications' element={< AllNotificationPage />} />

				
				
				</Route>

				{/* Employé */}
				<Route element={<ProtectedRoute allowedRoles={['Employé']}/>} >
				 <Route path='/EmpRapport' element={< EmpAllPage/>} />
				<Route path='/CreateRapport' element={<EmpAjout />} />

			{/* Responsable */}
				</Route>

				<Route element={<ProtectedRoute allowedRoles={['Responsable']}/>} >
				 <Route path='/Resrapport' element={< ResAllPage/>} />
				</Route>
				
				

				<Route path="/job" element={ <JobPage/>} />
				
				 <Route path='/Users/Departement' element={<UsersPage />} />
				
				 <Route path='/Departement/Justice' element={<JusticePage />} />
				 <Route path='/Departement/Finance' element={<FinancePage />} />
				 <Route path='/Affaire' element={<AnalyticsPage />} />
				 <Route path='/Dossier' element={<SettingsPage />} />
	      
				</Routes>

				
			</BrowserRouter>

				

		
	);
}

export default App;
