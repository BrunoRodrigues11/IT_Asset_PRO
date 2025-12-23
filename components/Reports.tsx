import React, { useState, useMemo } from 'react';
import { Equipment, Peripheral } from '../types';
import * as XLSX from 'xlsx';
import { Download, Filter, Settings2, Search, CheckSquare, Square, FileText } from 'lucide-react';
import { EQUIPMENT_SITES, EQUIPMENT_TYPES, PERIPHERAL_STATES, PERIPHERAL_TYPES } from '../constants';

interface ReportsProps {
  equipments: Equipment[];
  peripherals: Peripheral[];
}

type ReportType = 'equipment' | 'peripheral';

export const Reports: React.FC<ReportsProps> = ({ equipments, peripherals }) => {
  const [activeTab, setActiveTab] = useState<ReportType>('equipment');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dynamic Filters
  const [filterBrand, setFilterBrand] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSite, setFilterSite] = useState('');
  const [filterState, setFilterState] = useState(''); // Only for peripherals

  // Column Configuration
  const allEquipColumns = [
    { key: 'ri', label: 'RI (Patrimônio)' },
    { key: 'type', label: 'Tipo' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'serialNumber', label: 'N/S' },
    { key: 'site', label: 'Site' },
    { key: 'status', label: 'Status' },
    { key: 'obs', label: 'Observação' }
  ];

  const allPeriphColumns = [
    { key: 'ri', label: 'RI (Patrimônio)' },
    { key: 'type', label: 'Tipo' },
    { key: 'marca', label: 'Marca' },
    { key: 'modelo', label: 'Modelo' },
    { key: 'estado', label: 'Estado' },
    { key: 'serialNumber', label: 'N/S' },
    { key: 'site', label: 'Site' },
    { key: 'obs', label: 'Observação' }
  ];

  const [selectedEquipCols, setSelectedEquipCols] = useState(allEquipColumns.map(c => c.key));
  const [selectedPeriphCols, setSelectedPeriphCols] = useState(allPeriphColumns.map(c => c.key));

  // --- Logic ---

  // Get Unique Brands for Dropdown
  const availableBrands = useMemo(() => {
    const source = activeTab === 'equipment' ? equipments : peripherals;
    const brands = new Set(source.map(i => i.marca));
    return Array.from(brands).sort();
  }, [activeTab, equipments, peripherals]);

  // Filtering
  const filteredData = useMemo(() => {
    let data: any[] = activeTab === 'equipment' ? equipments : peripherals;

    // Text Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(item => 
        item.ri.toLowerCase().includes(lower) ||
        item.serialNumber.toLowerCase().includes(lower) ||
        item.modelo.toLowerCase().includes(lower) ||
        item.marca.toLowerCase().includes(lower)
      );
    }

    // Dropdown Filters
    if (filterBrand) data = data.filter(item => item.marca === filterBrand);
    if (filterType) data = data.filter(item => item.type === filterType);
    if (filterSite) data = data.filter(item => item.site === filterSite);
    
    // Specific Filters
    if (activeTab === 'peripheral' && filterState) {
        data = data.filter((item: Peripheral) => item.estado === filterState);
    }

    return data;
  }, [activeTab, equipments, peripherals, searchTerm, filterBrand, filterType, filterSite, filterState]);

  // Handlers
  const handleExport = () => {
    const cols = activeTab === 'equipment' ? allEquipColumns : allPeriphColumns;
    const selectedKeys = activeTab === 'equipment' ? selectedEquipCols : selectedPeriphCols;
    
    // Map data to selected columns with nice headers
    const exportData = filteredData.map(item => {
        const row: any = {};
        cols.forEach(col => {
            if (selectedKeys.includes(col.key)) {
                row[col.label] = item[col.key as keyof typeof item];
            }
        });
        return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatório");
    XLSX.writeFile(wb, `Relatorio_${activeTab}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const toggleColumn = (key: string) => {
    if (activeTab === 'equipment') {
        setSelectedEquipCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    } else {
        setSelectedPeriphCols(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    }
  };

  const currentColumns = activeTab === 'equipment' ? allEquipColumns : allPeriphColumns;
  const currentSelection = activeTab === 'equipment' ? selectedEquipCols : selectedPeriphCols;

  const resetFilters = () => {
      setSearchTerm('');
      setFilterBrand('');
      setFilterType('');
      setFilterSite('');
      setFilterState('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-blue-600" /> Gerador de Relatórios
            </h2>
            <p className="text-slate-500 text-sm">Crie, customize e exporte listas detalhadas do inventário.</p>
        </div>
        <button 
            onClick={handleExport}
            className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center shadow-sm transition"
        >
            <Download className="w-4 h-4 mr-2" /> Exportar para Excel
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg w-fit">
        <button
            onClick={() => { setActiveTab('equipment'); resetFilters(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'equipment' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            Relatório de Equipamentos
        </button>
        <button
            onClick={() => { setActiveTab('peripheral'); resetFilters(); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'peripheral' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
            Relatório de Periféricos
        </button>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200 space-y-6">
        
        {/* Row 1: Advanced Filters */}
        <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Filtros Avançados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar RI, Serial, Modelo..." 
                        className="pl-9 w-full p-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Type Filter */}
                <select 
                    className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="">Todos os Tipos</option>
                    {activeTab === 'equipment' 
                        ? EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)
                        : PERIPHERAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)
                    }
                </select>

                {/* Brand Filter (Dynamic) */}
                <select 
                    className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900"
                    value={filterBrand}
                    onChange={(e) => setFilterBrand(e.target.value)}
                >
                    <option value="">Todas as Marcas</option>
                    {availableBrands.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                {/* Specific Filter (Site for Eq, State for Per) */}
                {activeTab === 'equipment' ? (
                     <select 
                        className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900"
                        value={filterSite}
                        onChange={(e) => setFilterSite(e.target.value)}
                    >
                        <option value="">Todos os Sites</option>
                        {EQUIPMENT_SITES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                ) : (
                    <select 
                        className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900"
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                    >
                        <option value="">Todos os Estados</option>
                        {PERIPHERAL_STATES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                )}
            </div>
        </div>

        <div className="border-t border-slate-100 my-4"></div>

        {/* Row 2: Column Selection */}
        <div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center">
                <Settings2 className="w-4 h-4 mr-2" /> Colunas Visíveis
            </h3>
            <div className="flex flex-wrap gap-3">
                {currentColumns.map(col => {
                    const isSelected = currentSelection.includes(col.key);
                    return (
                        <button
                            key={col.key}
                            onClick={() => toggleColumn(col.key)}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition
                                ${isSelected 
                                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                        >
                            {isSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                            <span>{col.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Results Preview */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">Pré-visualização dos Resultados</h3>
            <span className="text-xs font-medium bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                {filteredData.length} registros encontrados
            </span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-700 font-semibold">
                    <tr>
                        {currentColumns.map(col => (
                            currentSelection.includes(col.key) && (
                                <th key={col.key} className="px-4 py-3 whitespace-nowrap border-b border-slate-200">
                                    {col.label}
                                </th>
                            )
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredData.length > 0 ? (
                        filteredData.slice(0, 50).map((item, idx) => (
                            <tr key={item.id || idx} className="hover:bg-slate-50">
                                {currentColumns.map(col => (
                                    currentSelection.includes(col.key) && (
                                        <td key={col.key} className="px-4 py-2 whitespace-nowrap">
                                            {/* Special formatting for specific columns can go here */}
                                            {item[col.key as keyof typeof item]}
                                        </td>
                                    )
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={currentSelection.length} className="px-4 py-12 text-center text-slate-400">
                                Nenhum resultado encontrado com os filtros atuais.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            {filteredData.length > 50 && (
                <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 border-t border-slate-100">
                    Mostrando os primeiros 50 resultados. Exporte para ver tudo.
                </div>
            )}
        </div>
      </div>

    </div>
  );
};