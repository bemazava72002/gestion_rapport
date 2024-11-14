import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axiosInstance from '../utils/axiosInstance';

const TableDisplay = ({ user }) => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get('/donnee');
        console.log('API Response:', response.data);

        if (Array.isArray(response.data) && response.data.length === 0) {
          setError("Aucune donnée trouvée.");
          setTableData([]);
        } else if (Array.isArray(response.data)) {
          const transformedData = response.data.map(obj => Object.values(obj));
          console.log('Transformed Data:', transformedData);
          setTableData(transformedData);
        } else {
          setError("Format de réponse inattendu.");
        }
      } catch (error) {
        console.error("Data loading error:", error);

        if (error.response) {
          setError(`Erreur API : ${error.response?.data?.message || error.response?.statusText}`);
        } else if (error.request) {
          setError("Aucune réponse du serveur.");
        } else {
          setError("Erreur inconnue : " + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addRow = () => {
    const newRow = Array(tableData[0]?.length || 1).fill('');
    setTableData(prevData => [...prevData, newRow]);
  };

  const addColumn = () => {
    setTableData(prevData => prevData.map(row => [...row, '']));
  };

  const updateCell = (rowIndex, colIndex, value) => {
    setTableData(prevData => {
      const updatedData = [...prevData];
      updatedData[rowIndex][colIndex] = value;
      return updatedData;
    });
  };

  const updateHeader = (colIndex, value) => {
    setTableData(prevData => {
      const updatedData = [...prevData];
      if (!updatedData[0]) {
        updatedData[0] = [];
      }
      updatedData[0][colIndex] = value;
      return updatedData;
    });
  };

  const handleSaveToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 10,
    });
    doc.save('tableau.pdf');
  };

  const handleSaveToExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    ws['!cols'] = tableData[0].map((_, colIndex) => {
      const maxWidth = Math.max(...tableData.map(row => row[colIndex]?.toString().length || 0));
      return { wch: maxWidth + 2 };
    });
    const excelFile = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelFile], { type: 'application/octet-stream' }), 'tableau.xlsx');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau Excel Éditable</h1>

      {loading && <p>Chargement des données...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {tableData.length > 0 && !loading ? (
        <div className="overflow-x-auto">
          <table className="table-fixed w-full border border-gray-300">
            <thead>
              <tr>
                {tableData[0].map((header, colIndex) => (
                  <th key={colIndex} className="border p-2 text-sm">
                    <input
                      type="text"
                      value={header || `Colonne ${colIndex + 1}`}
                      onChange={(e) => updateHeader(colIndex, e.target.value)}
                      className="w-full p-1 font-bold"
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="border p-2 text-sm">
                      <input
                        type="text"
                        value={cell || ''}
                        onChange={(e) => updateCell(rowIndex + 1, colIndex, e.target.value)}
                        className="w-full p-1"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && !error && <p>Aucune donnée disponible</p>
      )}

      <div className="mt-4 space-x-4">
        <button onClick={addRow} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Ajouter une ligne
        </button>
        <button onClick={addColumn} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Ajouter une colonne
        </button>
        <button onClick={handleSaveToPDF} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
          Enregistrer en PDF
        </button>
        <button onClick={handleSaveToExcel} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">
          Enregistrer en Excel
        </button>
      </div>
    </div>
  );
};

export default TableDisplay;
