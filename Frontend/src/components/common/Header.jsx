import { useNavigate } from "react-router-dom";
import NotificationsDropdown from "./Notification";

const Header = ({ title }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Supprimer le token du localStorage
        localStorage.removeItem('token');

        // Rediriger vers la page de connexion
        navigate('/login'); // Remplacez '/login' par votre route de connexion
    };

    return (
        <header className='bg-gray-800 bg-opacity-50 flex backdrop-blur-md shadow-lg border-b border-gray-700'>
            <div className='max-w-7xl ml-[-1] py-4 px-4 flex items-center sm:px-6 lg:px-8'>
                <h1 className='text-sm font-semibold text-gray-100'>{title}</h1>
            </div>
            <div className='ml-auto py-4 px-4 flex items-center sm:px-6 lg:px-8'>
               <span className="mr-5">
               <NotificationsDropdown/>
               </span>
               
                <button onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt text-gray-100 cursor-pointer"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
