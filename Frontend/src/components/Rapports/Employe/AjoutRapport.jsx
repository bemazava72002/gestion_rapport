import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

const CreateRapport = () => {
    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState(''); // Valeur par défaut
    const [fichier, setFichier] = useState(null);
    const [reportTypes, setReportTypes] = useState([]); // Pour stocker les types de rapport
    const [loading, setLoading] = useState(false); // État de chargement
    const [error, setError] = useState(null); // État d'erreur

    const navigate = useNavigate();
    const Color = 'bg-gray-700';

    useEffect(() => {
        const fetchReportTypes = async () => {
            setLoading(true); // Commencer le chargement
            setError(null); // Réinitialiser les erreurs
            try {
                const response = await axiosInstance.get('/rapport/types');
                setReportTypes(response.data); // Stocker les types récupérés
                setType(response.data[0]); // Initialiser le type avec le premier élément
            } catch (error) {
                setError("Erreur lors de la récupération des types de rapport");
                console.error("Erreur lors de la récupération des types de rapport", error);
            } finally {
                setLoading(false); // Terminer le chargement
            }
        };

        fetchReportTypes();
    }, []);

    const handleFileChange = (e) => {
        setFichier(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Commencer le chargement
        setError(null); // Réinitialiser les erreurs

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('description', description);
        formData.append('type', type);
        formData.append('fichier', fichier);

        try {
            const response = await axiosInstance.post('/rapport', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                navigate('/EmpRapport'); // Redirection en cas de succès
            }
        } catch (error) {
            setError("Erreur lors de la création du rapport");
            console.error("Erreur lors de la création du rapport", error);
        } finally {
            setLoading(false); // Terminer le chargement
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 shadow rounded">
            {loading && <p>Chargement en cours...</p>} {/* Indicateur de chargement */}
            {error && <p className="text-red-500">{error}</p>} {/* Message d'erreur */}
            <div>
                <label className="block mb-1">Titre</label>
                <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className={`w-full p-2 ${Color} rounded`}
                    required
                />
            </div>
            <div>
                <label className="block mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full ${Color} p-2 text-white rounded`}
                />
            </div>
            <div>
                <label className="block mb-1">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className={`w-full ${Color} p-2 rounded`}>
                    {reportTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block mb-1">Fichier</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className={`w-full p-2 ${Color} rounded`}
                />
            </div>
            <button type="submit" className={`mt-4 w-full bg-gradient-to-r from-purple-400 to-blue-500 p-2 text-white rounded`}>
                Créer le Rapport
            </button>
        </form>
    );
};

export default CreateRapport;
