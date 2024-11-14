import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; // Importer Axios
import { useNavigate } from 'react-router-dom';
const  Signup = ()=> {
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // Pour afficher le message de réponse
  const [error, setError] = useState(''); // Pour afficher les erreurs

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/registration', {
        Nom: nom,
        Prenom: prenom,
        Email: email,
        password,
      });
        navigate('/login')
      // Si la requête réussit, afficher le message de succès
      setMessage(response.data.message);

      setError('');
    } catch (err) {
      // Si la requête échoue, gérer les erreurs
      if (err.response) {
        // Erreurs provenant du serveur
        setError(err.response.data.message);
        setMessage('');
      } else {
        // Erreur de connexion ou autre
        setError('Erreur de connexion au serveur');
        setMessage('');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img src="src/static/logo-dark.png" className="w-20 h-20 bg-gray-900 rounded-full" />
        </div>
        <h2 className="text-center text-2xl font-bold mb-4">S'inscrire</h2>
        <p className="text-center text-gray-600 mb-4">
          Entrer votre information pour creer votre compte.
        </p>
        <form onSubmit={handleSignup}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input
                type="text"
                placeholder="Entrer votre nom"
                className="w-full p-2 border border-gray-300 rounded"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prenom</label>
              <input
                type="text"
                placeholder="Entrer votre prenom"
                className="w-full p-2 border border-gray-300 rounded"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Entrer votre adresse email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
            <input
              type="password"
              placeholder="Entrer votre mot de passe"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-800"
          >
            Confirmer
          </button>
        </form>
        {message && <p className="text-center text-sm text-green-500 mt-4">{message}</p>}
        {error && <p className="text-center text-sm text-red-500 mt-4">{error}</p>}
        <p className="text-center text-sm text-gray-500 mt-4">
          avez vous déjà un compte? <Link to="/login" className="text-gray-700 hover:text-gray-600">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
