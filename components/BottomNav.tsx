import React from 'react';
import { LayoutDashboard, Monitor, Keyboard, Menu } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, onOpenMenu }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dash', icon: LayoutDashboard },
    { id: 'equipments', label: 'Equip.', icon: Monitor },
    { id: 'peripherals', label: 'Perif.', icon: Keyboard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ViewState)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-16 ${
              isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        );
      })}
      
      {/* Menu Button (Triggers Sidebar) */}
      <button
        onClick={onOpenMenu}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-16 text-slate-400 hover:text-slate-600`}
      >
        <Menu className="w-6 h-6" />
        <span className="text-[10px] font-medium mt-1">Menu</span>
      </button>
    </div>
  );
};