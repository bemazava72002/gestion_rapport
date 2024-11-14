import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Ensure you have this installed: npm install jwt-decode
import axios from 'axios';



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
      if (value) {
        // Simple email validation check
        const isValidEmail = /\S+@\S+\.\S+/.test(value);
        if (isValidEmail) {
          setValidFields((prev) => ({ ...prev, email: true }));
          setErrors((prev) => ({ ...prev, email: undefined }));
        } else {
          setValidFields((prev) => ({ ...prev, email: false }));
          setErrors((prev) => ({ ...prev, email: 'Email invalide' }));
        }
      } else {
        setValidFields((prev) => ({ ...prev, email: false }));
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (value) {
        // Assuming password needs to be at least 6 characters
        if (value.length >= 6) {
          setValidFields((prev) => ({ ...prev, password: true }));
          setErrors((prev) => ({ ...prev, password: undefined }));
        } else {
          setValidFields((prev) => ({ ...prev, password: false }));
          setErrors((prev) => ({ ...prev, password: 'Mot de passe trop court' }));
        }
      } else {
        setValidFields((prev) => ({ ...prev, password: false }));
        setErrors((prev) => ({ ...prev, password: undefined }));
      }
    }
  };

  const login = async () => {
    setErrors({});
    setValidFields({});

    if (!email || !password) {
      setErrors({ general: 'Veuillez remplir tous les champs requis.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        Email: email,
        password: password,
      });

      // Check if the response is okay
      if (response.status !== 200) {
        setErrors({ general: response.data.message || 'Erreur de connexion. Veuillez réessayer.' });
        return;
      }

      const { AccessToken } = response.data.data; // Ensure this matches your API response structure

      if (!AccessToken) {
        setErrors({ general: 'Connexion échouée, veuillez vérifier vos identifiants.' });
        return;
      }

      // Store the token in localStorage
      localStorage.setItem('token', AccessToken);

      // Decode the token to get user information
      const decoded = jwtDecode(AccessToken);
      const role = decoded.roles;
      console.log("Role récupéré:", role);

      // Redirect based on the user's role
      setValidFields({ email: true, password: true });

      switch (role) {
        case 'Admin':
          navigate('/Accueil');
          break;
        case 'Employé':
          navigate('/EmpRapport');
          break;
        case 'Responsable':
          navigate('/ResRapport');
          break;
        default:
          setErrors({ general: "Vous n'avez pas encore de rôle défini" });
      }

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      if (error.response) {
        setErrors({ general: error.response.data.message || 'Erreur de connexion. Veuillez réessayer.' });
      } else {
        setErrors({ general: 'Erreur de connexion. Veuillez réessayer.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-6">
       
          <div className="bg-gray-700 w-20 rounded-full h-20 p-2">
            <img src="src/static/logo-dark.png" alt="logo" />
          </div>
        </div>

        <p className="text-center text-gray-600 mb-4">Heureux de vous revoir 👋</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
        >
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Entrer votre email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-2 border ${
                errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : validFields.email
                  ? 'border-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:border-blue-500'
              } rounded transition-all duration-300`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <i class="fas fa-exclamation-circle mr-1"></i>{errors.email}</p>
               
            )}
            {validFields.email && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                <i class="fas fa-check-circle mr-1"></i> Email valide</p>
               
              
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full p-2 border ${
                errors.password
                  ? 'border-red-500 focus:border-red-500'
                  : validFields.password
                  ? 'border-green-500 focus:border-green-500'
                  : 'border-gray-300 focus:border-blue-500'
              } rounded transition-all duration-300`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <i class="fas fa-exclamation-circle mr-1"></i>{errors.password}</p>
              
            )}
            {validFields.password && (
              <p className="text-green-500 text-sm mt-1 flex items-center">
                
                <i class="fas fa-check-circle mr-1"></i> Mot de passe valide</p>
              
            )}
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mt-1">{errors.general}</p>
          )}

          <button
            type="submit"
            className="w-full bg-slate-600 text-white py-2 px-4 rounded-md hover:bg-slate-700"
          >
            Envoyer
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          N'avez-vous pas de compte?
          <Link to="/Signup" className="text-slate-600 hover:text-slate-500">
            créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
