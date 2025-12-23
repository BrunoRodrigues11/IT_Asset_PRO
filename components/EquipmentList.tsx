import React, { useState } from 'react';
import { Equipment, EquipmentSite, EquipmentType } from '../types';
import { EQUIPMENT_SITES, EQUIPMENT_TYPES, FIXED_LOCATION, FIXED_STATUS } from '../constants';
import { Plus, Search, Trash2, Edit2, X, LayoutGrid, LayoutList, Laptop, Monitor, Cpu } from 'lucide-react';

interface EquipmentListProps {
  data: Equipment[];
  onAdd: (item: Equipment) => void;
  onUpdate: (item: Equipment) => void;
  onDelete: (id: string) => void;
}

export const EquipmentList: React.FC<EquipmentListProps> = ({ data, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Form State
  const [formData, setFormData] = useState<Partial<Equipment>>({
    status: FIXED_STATUS,
    localizacao: FIXED_LOCATION,
    site: 'estoque físico'
  });

  const filteredData = data.filter(item => 
    item.ri.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item?: Equipment) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        status: FIXED_STATUS,
        localizacao: FIXED_LOCATION,
        site: 'estoque físico',
        type: 'Notebook',
        marca: '',
        modelo: '',
        ri: '',
        serialNumber: '',
        obs: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ri || !formData.marca || !formData.modelo || !formData.serialNumber) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (editingItem) {
      onUpdate({ ...formData, id: editingItem.id } as Equipment);
    } else {
      onAdd({ ...formData, id: crypto.randomUUID() } as Equipment);
    }
    setIsModalOpen(false);
  };

  const getTypeIcon = (type: EquipmentType) => {
    switch (type) {
      case 'Notebook': return <Laptop className="w-5 h-5 text-blue-500" />;
      case 'Desktop': return <Monitor className="w-5 h-5 text-blue-500" />;
      case 'Mini PC': return <Cpu className="w-5 h-5 text-blue-500" />;
      default: return <Laptop className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Equipamentos</h2>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="bg-white border border-slate-300 rounded-lg p-1 flex">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Visualização em Lista"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-all ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Visualização em Cards"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Novo Equipamento
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input 
                type="text" 
                placeholder="Buscar por RI, Série, Marca ou Modelo..." 
                className="pl-10 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">RI (Patrimônio)</th>
                  <th className="px-4 py-3">Marca/Modelo</th>
                  <th className="px-4 py-3">N/S</th>
                  <th className="px-4 py-3">Site</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </td>
                      <td className="px-4 py-3">{item.ri}</td>
                      <td className="px-4 py-3">{item.marca} - {item.modelo}</td>
                      <td className="px-4 py-3 font-mono text-xs">{item.serialNumber}</td>
                      <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${item.site.includes('rollout') ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                              {item.site}
                          </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title="Editar">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => onDelete(item.id)} className="text-red-600 hover:bg-red-50 p-1 rounded" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Nenhum equipamento encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow p-5 flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">{item.type}</h3>
                        <p className="text-xs text-slate-500 font-mono">{item.ri}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${item.site.includes('rollout') ? 'bg-orange-50 text-orange-700 border border-orange-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {item.site === 'estoque físico' ? 'Físico' : 'Rollout'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Modelo</span>
                      <p className="text-sm font-medium text-slate-700 truncate" title={`${item.marca} - ${item.modelo}`}>{item.marca} {item.modelo}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">N/S</span>
                      <p className="text-xs font-mono text-slate-600 bg-slate-50 p-1 rounded border border-slate-100 truncate">{item.serialNumber}</p>
                    </div>
                    {item.obs && (
                      <div>
                        <span className="text-xs text-slate-400 uppercase font-semibold">Obs</span>
                        <p className="text-xs text-slate-500 truncate">{item.obs}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                   <button 
                      onClick={() => handleOpenModal(item)} 
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded text-xs font-medium flex items-center transition"
                   >
                     <Edit2 className="w-3 h-3 mr-1" /> Editar
                   </button>
                   <button 
                      onClick={() => onDelete(item.id)} 
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded text-xs font-medium flex items-center transition"
                   >
                     <Trash2 className="w-3 h-3 mr-1" /> Excluir
                   </button>
                </div>
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-12 text-slate-400 bg-white rounded-lg border border-dashed border-slate-300">
               Nenhum equipamento encontrado.
             </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in-up">
            <div className="flex justify-between items-center bg-slate-100 px-6 py-4 border-b">
              <h3 className="text-lg font-bold text-slate-800">
                {editingItem ? 'Editar Equipamento' : 'Novo Equipamento'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Tipo de Equipamento</label>
                    <select 
                        required
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as EquipmentType})}
                    >
                        {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">RI (Patrimônio)</label>
                    <input 
                        required
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        value={formData.ri || ''}
                        onChange={(e) => setFormData({...formData, ri: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Número de Série (N/S)</label>
                    <input 
                        required
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        value={formData.serialNumber || ''}
                        onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Marca</label>
                    <input 
                        required
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        value={formData.marca || ''}
                        onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700">Modelo</label>
                    <input 
                        required
                        type="text" 
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        value={formData.modelo || ''}
                        onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Site</label>
                    <select 
                        required
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        value={formData.site}
                        onChange={(e) => setFormData({...formData, site: e.target.value as EquipmentSite})}
                    >
                        {EQUIPMENT_SITES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                 {/* Read-only fields for context */}
                 <div className="grid grid-cols-2 gap-4 md:col-span-2 bg-slate-50 p-3 rounded text-sm text-slate-500">
                    <div>
                        <span className="font-semibold">Status:</span> {FIXED_STATUS}
                    </div>
                    <div>
                        <span className="font-semibold">Localização:</span> {FIXED_LOCATION}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Observações</label>
                    <textarea 
                        className="mt-1 block w-full border border-slate-300 rounded-md p-2 bg-white text-slate-900"
                        rows={3}
                        value={formData.obs || ''}
                        onChange={(e) => setFormData({...formData, obs: e.target.value})}
                    />
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Salvar
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};