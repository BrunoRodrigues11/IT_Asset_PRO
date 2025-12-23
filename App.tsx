import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { EquipmentList } from './components/EquipmentList';
import { PeripheralList } from './components/PeripheralList';
import { ImportData } from './components/ImportData';
import { Analytics } from './components/Analytics';
import { Reports } from './components/Reports';
import { Login } from './components/Login';
import { Equipment, Peripheral, ViewState } from './types';
import { getEquipments, getPeripherals, saveEquipments, savePeripherals } from './services/storageService';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [peripherals, setPeripherals] = useState<Peripheral[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mobile Menu State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check Auth on Mount
  useEffect(() => {
    const authSession = localStorage.getItem('ti_auth_session');
    if (authSession === 'true') {
      setIsAuthenticated(true);
    }
    setIsAuthChecking(false);
  }, []);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      const loadedEquip = getEquipments();
      const loadedPer = getPeripherals();
      setEquipments(loadedEquip);
      setPeripherals(loadedPer);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Persistence effects
  useEffect(() => {
    if (isAuthenticated && !loading) saveEquipments(equipments);
  }, [equipments, loading, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && !loading) savePeripherals(peripherals);
  }, [peripherals, loading, isAuthenticated]);

  // Auth Handlers
  const handleLogin = (success: boolean) => {
    if (success) {
      localStorage.setItem('ti_auth_session', 'true');
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    if (confirm('Deseja realmente sair do sistema?')) {
      localStorage.removeItem('ti_auth_session');
      setIsAuthenticated(false);
      setLoading(true); // Reset loading state for next login
    }
  };

  // CRUD Handlers - Equipment
  const addEquipment = (item: Equipment) => {
    setEquipments(prev => [...prev, item]);
  };

  const updateEquipment = (item: Equipment) => {
    setEquipments(prev => prev.map(e => e.id === item.id ? item : e));
  };

  const deleteEquipment = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este equipamento?')) {
      setEquipments(prev => prev.filter(e => e.id !== id));
    }
  };

  // CRUD Handlers - Peripheral
  const addPeripheral = (item: Peripheral) => {
    setPeripherals(prev => [...prev, item]);
  };

  const updatePeripheral = (item: Peripheral) => {
    setPeripherals(prev => prev.map(p => p.id === item.id ? item : p));
  };

  const deletePeripheral = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este periférico?')) {
      setPeripherals(prev => prev.filter(p => p.id !== id));
    }
  };

  // Import Handlers
  const handleImportEquipment = (data: Equipment[]) => {
      setEquipments(prev => [...prev, ...data]);
  };

  const handleImportPeripheral = (data: Peripheral[]) => {
      setPeripherals(prev => [...prev, ...data]);
  };


  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard equipments={equipments} peripherals={peripherals} />;
      case 'analytics':
        return <Analytics equipments={equipments} peripherals={peripherals} />;
      case 'reports':
        return <Reports equipments={equipments} peripherals={peripherals} />;
      case 'equipments':
        return (
          <EquipmentList 
            data={equipments} 
            onAdd={addEquipment} 
            onUpdate={updateEquipment} 
            onDelete={deleteEquipment} 
          />
        );
      case 'peripherals':
        return (
          <PeripheralList 
            data={peripherals} 
            onAdd={addPeripheral} 
            onUpdate={updatePeripheral} 
            onDelete={deletePeripheral} 
          />
        );
      case 'import':
        return (
          <ImportData 
            onImportEquipment={handleImportEquipment}
            onImportPeripheral={handleImportPeripheral}
          />
        );
      default:
        return <Dashboard equipments={equipments} peripherals={peripherals} />;
    }
  };

  if (isAuthChecking) return null; // Prevent flash

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) return <div className="h-screen flex items-center justify-center text-slate-500">Carregando dados...</div>;

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar - Responsive */}
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 h-full overflow-y-auto w-full">
        {/* Padding bottom added for mobile nav clearance */}
        <div className="p-4 md:p-8 pb-24 md:pb-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />
    </div>
  );
};

export default App;