import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { Equipment, Peripheral, EquipmentSite, PeripheralState, EquipmentType, PeripheralType } from '../types';
import { FIXED_LOCATION, FIXED_PERIPHERAL_SITE, FIXED_STATUS, EQUIPMENT_SITES, PERIPHERAL_STATES } from '../constants';

interface ImportDataProps {
  onImportEquipment: (data: Equipment[]) => void;
  onImportPeripheral: (data: Peripheral[]) => void;
}

type Mode = 'equipment' | 'peripheral';

export const ImportData: React.FC<ImportDataProps> = ({ onImportEquipment, onImportPeripheral }) => {
  const [mode, setMode] = useState<Mode>('equipment');
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewData([]);
      setError(null);
      readExcel(selectedFile);
    }
  };

  const readExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        
        if (jsonData.length === 0) {
            setError("A planilha parece estar vazia.");
            return;
        }
        
        // Basic validation of columns based on mode
        const firstRow = jsonData[0] as any;
        if (!firstRow['RI'] || !firstRow['MARCA'] || !firstRow['MODELO']) {
             setError("A planilha deve conter colunas com cabeçalhos: RI, MARCA, MODELO, etc.");
             return;
        }

        setPreviewData(jsonData);
      } catch (err) {
        setError("Erro ao ler o arquivo. Certifique-se que é um .xlsx válido.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const processImport = () => {
    if (previewData.length === 0) return;

    try {
        if (mode === 'equipment') {
            const cleanData: Equipment[] = previewData.map((row: any) => {
                // Determine site safely
                let siteRaw = row['SITE']?.toString().toLowerCase().trim() || 'estoque físico';
                let validSite: EquipmentSite = 'estoque físico';
                if (EQUIPMENT_SITES.includes(siteRaw as EquipmentSite)) {
                    validSite = siteRaw as EquipmentSite;
                }

                // Determine type roughly (User can edit later, or we assume column TYPE exists)
                // Defaulting to notebook if not found to ensure type safety
                let type: EquipmentType = 'Notebook'; 
                if (row['TIPO']) {
                    const t = row['TIPO'].toString();
                    if (t.toLowerCase().includes('desk')) type = 'Desktop';
                    if (t.toLowerCase().includes('mini')) type = 'Mini PC';
                }

                return {
                    id: crypto.randomUUID(),
                    ri: row['RI']?.toString() || 'SEM_RI',
                    marca: row['MARCA']?.toString() || 'GENERICO',
                    modelo: row['MODELO']?.toString() || 'GENERICO',
                    serialNumber: row['N/S']?.toString() || 'N/A',
                    status: FIXED_STATUS,
                    localizacao: FIXED_LOCATION,
                    site: validSite,
                    type: type,
                    obs: row['OBS']?.toString()
                };
            });
            onImportEquipment(cleanData);
        } else {
             const cleanData: Peripheral[] = previewData.map((row: any) => {
                 // Determine state
                let stateRaw = row['ESTADO']?.toString().toLowerCase().trim() || 'novo';
                let validState: PeripheralState = 'novo';
                if (PERIPHERAL_STATES.includes(stateRaw as PeripheralState)) {
                    validState = stateRaw as PeripheralState;
                }

                let type: PeripheralType = 'Mouse';
                if (row['TIPO']) {
                    const t = row['TIPO'].toString().toLowerCase();
                    if (t.includes('teclado')) type = 'Teclado';
                    if (t.includes('headset') || t.includes('fone')) type = 'Headset';
                }

                return {
                    id: crypto.randomUUID(),
                    ri: row['RI']?.toString() || 'SEM_RI',
                    marca: row['MARCA']?.toString() || 'GENERICO',
                    modelo: row['MODELO']?.toString() || 'GENERICO',
                    serialNumber: row['N/S']?.toString() || '',
                    status: FIXED_STATUS,
                    localizacao: FIXED_LOCATION,
                    site: FIXED_PERIPHERAL_SITE,
                    estado: validState,
                    type: type,
                    obs: row['OBS']?.toString()
                };
             });
             onImportPeripheral(cleanData);
        }
        
        // Reset
        setFile(null);
        setPreviewData([]);
        alert("Importação realizada com sucesso!");

    } catch (err) {
        setError("Erro ao processar dados. Verifique o formato.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Importação em Massa</h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div className="flex space-x-4 mb-4">
            <button 
                onClick={() => { setMode('equipment'); setPreviewData([]); setFile(null); }}
                className={`px-4 py-2 rounded-md font-medium ${mode === 'equipment' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
                Importar Equipamentos
            </button>
            <button 
                onClick={() => { setMode('peripheral'); setPreviewData([]); setFile(null); }}
                className={`px-4 py-2 rounded-md font-medium ${mode === 'peripheral' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
                Importar Periféricos
            </button>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
            <FileSpreadsheet className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500 mb-4">
                Selecione uma planilha .xlsx. As colunas esperadas são: RI, MARCA, MODELO, N/S, {mode === 'equipment' ? 'SITE, TIPO' : 'ESTADO, TIPO'}
            </p>
            <input 
                type="file" 
                accept=".xlsx"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
            />
        </div>

        {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        )}

        {previewData.length > 0 && !error && (
            <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-700 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        Prévia: {previewData.length} itens encontrados
                    </h3>
                    <button 
                        onClick={processImport}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center font-bold shadow-sm"
                    >
                        <Upload className="w-4 h-4 mr-2" /> Confirmar Importação
                    </button>
                 </div>
                 
                 <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-md">
                     <table className="w-full text-xs text-left">
                         <thead className="bg-slate-100">
                             <tr>
                                 <th className="p-2">RI</th>
                                 <th className="p-2">Marca</th>
                                 <th className="p-2">Modelo</th>
                                 <th className="p-2">{mode === 'equipment' ? 'Site' : 'Estado'}</th>
                             </tr>
                         </thead>
                         <tbody>
                             {previewData.slice(0, 10).map((row, i) => (
                                 <tr key={i} className="border-t border-slate-100">
                                     <td className="p-2">{row['RI']}</td>
                                     <td className="p-2">{row['MARCA']}</td>
                                     <td className="p-2">{row['MODELO']}</td>
                                     <td className="p-2">{mode === 'equipment' ? row['SITE'] : row['ESTADO']}</td>
                                 </tr>
                             ))}
                             {previewData.length > 10 && (
                                 <tr><td colSpan={4} className="p-2 text-center text-slate-400">... e mais {previewData.length - 10} itens</td></tr>
                             )}
                         </tbody>
                     </table>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};
