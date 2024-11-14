import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Formulaire = ({ title,titre,description,responsables,departements, onSubmit, initialData,provinces }) => {
    const [titre, setTitre] = useState(initialData ? initialData.titre : '');
    const [description, setDescription] = useState(initialData ? initialData.description:'')
    const [responsableId, setResponsableId] = useState(initialData?.responsable_id || '' )
    const [departId,setDepartId] = useState(initialData?.departid)

    useEffect(() => {
        if (initialData) {
            setTitre(initialData.titre);
            setDescription(initialData.description);
            setResponsableId(initialData.responsable_id);
            setDepartId(initialData.departid)

        }
    }, [initialData]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ titre: titre,description:description,
            responsable_id:responsableId , 
            departid: departId });
        setTitre('');
        setDescription('');
        setDepartId('');
        setResponsableId('');
        onClose();
    };

    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="bg-white rounded-lg p-6 w-1/3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                   
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="departement">Departements</label>
                        <input
                            type="text"
                            id="titre"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            className="border border-gray-300 text-gray-500 rounded-lg w-full p-2"
                            placeholder="titre"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700" htmlFor="departement">Departements</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 text-gray-500 rounded-lg w-full p-2"
                            placeholder="description"
                            required
                        />
                        
                    </div>
                    <div className="mb-4">
                        <label>responsable</label>
                        <select value={responsableId} 
                         className="border border-gray-300 text-gray-500 rounded-lg w-full p-2"
                        onChange={(e) => setResponsableId(e.target.value)} required>
                            <option value="">Sélectionnez une province</option>
                            {responsables.map(responsable => (
                                <option key={responsable.id} value={responsable.id}>
                                    {responsable.role}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex justify-end">
                        <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                            <i className="fas fa-save mr-2"></i>
                            {initialData ? 'Modifier' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Formulaire;