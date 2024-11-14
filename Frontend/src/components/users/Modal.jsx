import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Modal = ({ show, onClose, title, onSubmit, initialData,departements }) => {
   
    const [departementId, setDepartementId] = useState(initialData?.departement_id || '');
    useEffect(() => {
        if (initialData) {
            setDepartementId(initialData.departement_id);
        }
    }, [initialData]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ departement_id: departementId });
        setDepartementId('');
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
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <form onSubmit={handleSubmit}>
                   
                    <div className="mb-4">
                        <label>departements</label>
                        <select value={departementId} 
                         className="border border-gray-300 text-gray-500 rounded-lg w-full p-2"
                        onChange={(e) => setDepartementId(e.target.value)} required>
                            <option value="">Sélectionnez un departement</option>
                            {departements.map(departement => (
                                <option key={departement.id} value={departement.id}>
                                    {departement.departements}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex justify-end">
                        <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center">
                            <i className="fas fa-save mr-2"></i>
                            {initialData ?'Assigner': ''}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Modal;