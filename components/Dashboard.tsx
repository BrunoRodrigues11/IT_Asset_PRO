import React from 'react';
import { Equipment, Peripheral } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { Package, MonitorCheck, Keyboard, AlertCircle } from 'lucide-react';

interface DashboardProps {
  equipments: Equipment[];
  peripherals: Peripheral[];
}

export const Dashboard: React.FC<DashboardProps> = ({ equipments, peripherals }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // --- Calculators ---

  // Equipment Logic
  const equipByType = equipments.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipBySite = equipments.reduce((acc, curr) => {
    acc[curr.site] = (acc[curr.site] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const equipByBrand = equipments.reduce((acc, curr) => {
    acc[curr.marca] = (acc[curr.marca] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const rolloutCount = equipments.filter(e => e.site.startsWith('rollout')).length;
  const physicalStockCount = equipments.filter(e => e.site === 'estoque físico').length;

  // Peripheral Logic
  const periphByType = peripherals.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const periphByState = peripherals.reduce((acc, curr) => {
    acc[curr.estado] = (acc[curr.estado] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const periphNoSerial = peripherals.filter(p => !p.serialNumber || p.serialNumber === 'N/A' || p.serialNumber === '').length;


  // --- Data for Charts ---

  const equipTypeData = Object.keys(equipByType).map(k => ({ name: k, value: equipByType[k] }));
  const periphTypeData = Object.keys(periphByType).map(k => ({ name: k, value: periphByType[k] }));
  const periphStateData = Object.keys(periphByState).map(k => ({ name: k.charAt(0).toUpperCase() + k.slice(1), value: periphByState[k] }));
  
  const siteDistributionData = Object.keys(equipBySite).map(k => ({ name: k.replace('estoque ', '').replace('rollout ', 'Rollout '), value: equipBySite[k] }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Visão Estratégica do Estoque</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 flex items-center">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <MonitorCheck className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Total Equipamentos</p>
            <p className="text-2xl font-bold text-slate-800">{equipments.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500 flex items-center">
          <div className="p-3 rounded-full bg-purple-100 mr-4">
            <Keyboard className="text-purple-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Total Periféricos</p>
            <p className="text-2xl font-bold text-slate-800">{peripherals.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500 flex items-center">
          <div className="p-3 rounded-full bg-orange-100 mr-4">
            <Package className="text-orange-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Em Rollout (Eqp)</p>
            <p className="text-2xl font-bold text-slate-800">{rolloutCount}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500 flex items-center">
          <div className="p-3 rounded-full bg-red-100 mr-4">
            <AlertCircle className="text-red-600 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-semibold">Perif. Sem N/S</p>
            <p className="text-2xl font-bold text-slate-800">{periphNoSerial}</p>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Equipamentos por Tipo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipTypeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Distribuição por Site (Equipamentos)</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={siteDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {siteDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Charts Row 2 */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Periféricos por Tipo</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={periphTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {periphTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-slate-700">Periféricos: Novo vs Usado</h3>
           <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periphStateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Summary Table for Brands */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-slate-700">Marcas em Estoque</h3>
        <div className="grid grid-cols-2 gap-8">
            <div>
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">Equipamentos</h4>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(equipByBrand).map(([brand, count]) => (
                        <span key={brand} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {brand}: {count}
                        </span>
                    ))}
                    {Object.keys(equipByBrand).length === 0 && <span className="text-slate-400 italic">Sem dados</span>}
                </div>
            </div>
             <div>
                <h4 className="text-sm font-bold text-slate-500 mb-2 uppercase">Periféricos</h4>
                <div className="flex flex-wrap gap-2">
                    {/* Reuse logic for peripheral brands inline for brevity */}
                     {Object.entries(peripherals.reduce((acc, curr) => {
                            acc[curr.marca] = (acc[curr.marca] || 0) + 1;
                            return acc;
                        }, {} as Record<string, number>)).map(([brand, count]) => (
                        <span key={brand} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {brand}: {count}
                        </span>
                    ))}
                     {peripherals.length === 0 && <span className="text-slate-400 italic">Sem dados</span>}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
