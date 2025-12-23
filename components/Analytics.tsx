import React from 'react';
import { Equipment, Peripheral, EquipmentType } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Line 
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, Scale, Database } from 'lucide-react';

interface AnalyticsProps {
  equipments: Equipment[];
  peripherals: Peripheral[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ equipments, peripherals }) => {
  
  // --- KPI 1: Integridade dos Dados (Data Health) ---
  const invalidSerialEquip = equipments.filter(e => !e.serialNumber || e.serialNumber === 'N/A' || e.serialNumber.trim() === '').length;
  const invalidSerialPeriph = peripherals.filter(p => !p.serialNumber || p.serialNumber === 'N/A' || p.serialNumber.trim() === '').length;
  const totalAssets = equipments.length + peripherals.length;
  const totalInvalid = invalidSerialEquip + invalidSerialPeriph;
  const healthScore = totalAssets > 0 ? ((totalAssets - totalInvalid) / totalAssets) * 100 : 100;

  // --- KPI 2: Taxa de Rollout (Eficiência de Giro) ---
  const inRollout = equipments.filter(e => e.site.includes('rollout')).length;
  const inStock = equipments.filter(e => e.site.includes('estoque')).length;
  const rolloutRate = equipments.length > 0 ? (inRollout / equipments.length) * 100 : 0;

  // --- KPI 3: Ratio Equipamento / Periférico ---
  // Idealmente 1 PC tem pelo menos 1 Mouse e 1 Teclado.
  const ratioPeripherals = equipments.length > 0 ? (peripherals.length / equipments.length).toFixed(2) : '0';

  // --- Chart Data 1: Breakdown de Estoque (Físico vs Rollout por Tipo) ---
  const types: EquipmentType[] = ['Notebook', 'Desktop', 'Mini PC'];
  const stockBreakdownData = types.map(type => {
    const subset = equipments.filter(e => e.type === type);
    return {
      name: type,
      Físico: subset.filter(e => e.site.includes('estoque')).length,
      Rollout: subset.filter(e => e.site.includes('rollout')).length,
      Total: subset.length
    };
  });

  // --- Chart Data 2: Condição dos Periféricos ---
  const periphCondition = [
    { name: 'Novos', value: peripherals.filter(p => p.estado === 'novo').length },
    { name: 'Usados', value: peripherals.filter(p => p.estado === 'usado').length }
  ];

  const COLORS_CONDITION = ['#10b981', '#f59e0b']; // Green, Amber

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Análise de Performance</h2>
          <p className="text-slate-500 text-sm">Indicadores chave de desempenho (KPIs) do inventário</p>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Health Score */}
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Integridade de Dados</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{healthScore.toFixed(1)}%</h3>
            </div>
            <div className={`p-2 rounded-lg ${healthScore > 90 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            <span className={totalInvalid > 0 ? "text-red-500 font-bold" : "text-green-500"}>
              {totalInvalid} itens
            </span> sem Número de Série
          </div>
        </div>

        {/* Card 2: Rollout Rate */}
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Taxa de Rollout</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{rolloutRate.toFixed(1)}%</h3>
            </div>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            {inRollout} ativos em processo de movimentação
          </div>
        </div>

        {/* Card 3: Asset Ratio */}
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ratio Perif./Comp.</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{ratioPeripherals}x</h3>
            </div>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">
            Média de periféricos por computador
          </div>
        </div>

        {/* Card 4: Critical Stock Alert */}
        <div className="bg-white p-5 rounded-lg shadow border border-slate-200">
            <div className="flex justify-between items-start">
                <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Alerta de Estoque</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                    {equipments.filter(e => e.site === 'estoque físico').length < 5 ? 'CRÍTICO' : 'NORMAL'}
                </h3>
                </div>
                <div className={`p-2 rounded-lg ${equipments.filter(e => e.site === 'estoque físico').length < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {equipments.filter(e => e.site === 'estoque físico').length < 5 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">
                Baseado no estoque físico disponível
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart: Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-4">Distribuição: Físico vs Rollout</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stockBreakdownData} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" scale="band" />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{fill: '#f1f5f9'}}
                        />
                        <Legend />
                        <Bar dataKey="Físico" stackId="a" fill="#3b82f6" barSize={20} radius={[0, 0, 0, 0]} />
                        <Bar dataKey="Rollout" stackId="a" fill="#f97316" barSize={20} radius={[0, 4, 4, 0]} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Side Chart: Peripheral Condition */}
        <div className="bg-white p-6 rounded-lg shadow border border-slate-200 flex flex-col">
             <h3 className="text-lg font-bold text-slate-700 mb-4">Condição dos Periféricos</h3>
             <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={periphCondition}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {periphCondition.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_CONDITION[index % COLORS_CONDITION.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 p-4 bg-slate-50 rounded text-xs text-slate-600">
                 <strong>Insight:</strong> Uma alta taxa de periféricos usados pode indicar necessidade de renovação de compras em breve.
             </div>
        </div>

      </div>
    </div>
  );
};