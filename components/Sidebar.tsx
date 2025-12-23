import React from 'react';
import { LayoutDashboard, Monitor, Keyboard, FileInput, Laptop2, LogOut, BarChart3, X, FileText } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  isOpen: boolean; // Mobile state
  onClose: () => void; // Mobile close handler
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Análise & KPIs', icon: BarChart3 },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'equipments', label: 'Equipamentos', icon: Monitor },
    { id: 'peripherals', label: 'Periféricos', icon: Keyboard },
    { id: 'import', label: 'Importações', icon: FileInput },
  ];

  // Base classes for the sidebar container
  const baseClasses = "bg-slate-800 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto shadow-xl z-50 transition-transform duration-300 ease-in-out";
  
  // Responsive visibility classes
  // Desktop: always translated-0 (visible), width 64
  // Mobile: depends on isOpen. If closed -translate-x-full, if open translate-x-0
  const responsiveClasses = `${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} md:translate-x-0 md:w-64`;

  const handleNavigation = (view: ViewState) => {
    onNavigate(view);
    onClose(); // Close sidebar on mobile when clicked
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div className={`${baseClasses} ${responsiveClasses}`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Laptop2 className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-lg font-bold">Estoque TI</h1>
              <p className="text-xs text-slate-400">Gestão de Ativos</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id as ViewState)}
                    className={`w-full flex items-center px-6 py-3 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white border-r-4 border-blue-300'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-slate-300 hover:text-white hover:bg-red-600/20 hover:text-red-200 rounded-lg transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 group-hover:text-red-400" />
            <span className="font-medium">Sair</span>
          </button>
          <div className="mt-4 text-xs text-center text-slate-500">
            v1.4.0 - Relatórios
          </div>
        </div>
      </div>
    </>
  );
};