import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { OKR, KPI, Risk } from '../types';

export default function Dashboard() {
  const [data, setData] = React.useState<{ okrs: OKR[], kpis: KPI[], risks: Risk[] } | null>(null);

  React.useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="flex items-center justify-center h-full">Carregando...</div>;

  const riskData = [
    { name: 'Crítico', value: data.risks.filter(r => r.impact * r.probability >= 12).length, color: '#dc2626' },
    { name: 'Monitorado', value: data.risks.filter(r => r.impact * r.probability < 12 && r.impact * r.probability >= 6).length, color: '#f59e0b' },
    { name: 'Baixo', value: data.risks.filter(r => r.impact * r.probability < 6).length, color: '#16a34a' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="OKRs no Prazo" 
          value={`${Math.round((data.okrs.filter(o => o.status === 'on_track').length / data.okrs.length) * 100)}%`}
          icon={TrendingUp}
          trend="+5%"
          color="text-success"
        />
        <StatCard 
          title="Riscos Críticos" 
          value={data.risks.filter(r => r.impact * r.probability >= 12).length.toString()}
          icon={AlertTriangle}
          trend="-2"
          color="text-danger"
        />
        <StatCard 
          title="Conformidade SGI" 
          value="94%"
          icon={CheckCircle2}
          trend="+1.2%"
          color="text-primary-500"
        />
        <StatCard 
          title="Auditorias Pendentes" 
          value="3"
          icon={Clock}
          trend="Estável"
          color="text-warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* OKR Progress Chart */}
        <div className="ui-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Progresso de OKRs Estratégicos</h3>
            <button className="text-primary-500 text-xs font-semibold hover:underline">Ver todos</button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.okrs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f3" />
                <XAxis dataKey="title" fontSize={10} tick={{fill: '#5b6b84'}} axisLine={false} tickLine={false} />
                <YAxis fontSize={10} tick={{fill: '#5b6b84'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 24px rgba(10, 42, 67, 0.12)' }}
                />
                <Bar dataKey="progress" fill="#1d6fb8" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Scorecard */}
        <div className="ui-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">Scorecard de Indicadores</h3>
            <button className="text-primary-500 text-xs font-semibold hover:underline">Detalhes</button>
          </div>
          <div className="space-y-4">
            {data.kpis.map(kpi => (
              <div key={kpi.id} className="flex items-center justify-between p-3 rounded-radius-10 bg-surface-soft border border-border">
                <div>
                  <p className="text-sm font-semibold">{kpi.title}</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Meta: {kpi.target} {kpi.unit}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm font-bold">{kpi.actual} {kpi.unit}</span>
                    {kpi.trend === 'up' && <ArrowUpRight size={14} className="text-success" />}
                    {kpi.trend === 'down' && <ArrowDownRight size={14} className="text-danger" />}
                    {kpi.trend === 'stable' && <Minus size={14} className="text-warning" />}
                  </div>
                  <div className="w-32 h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 transition-all" 
                      style={{ width: `${Math.min((kpi.actual / kpi.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Matrix Summary */}
        <div className="ui-card lg:col-span-1">
          <h3 className="text-lg mb-6">Perfil de Risco</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {riskData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-muted">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Actions / Audit Findings */}
        <div className="ui-card lg:col-span-2">
          <h3 className="text-lg mb-6">Ações e Auditorias Recentes</h3>
          <div className="table-wrapper">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Atividade</th>
                  <th>Responsável</th>
                  <th>Status</th>
                  <th>Prazo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Auditoria Interna ISO 9001</td>
                  <td>Qualidade</td>
                  <td><span className="ui-badge bg-warning/10 text-warning">Em Curso</span></td>
                  <td>15 Mar 2024</td>
                </tr>
                <tr>
                  <td>Revisão de Política de Dados</td>
                  <td>Compliance</td>
                  <td><span className="ui-badge bg-success/10 text-success">Concluído</span></td>
                  <td>01 Mar 2024</td>
                </tr>
                <tr>
                  <td>Plano de Mitigação: Preços</td>
                  <td>Compras</td>
                  <td><span className="ui-badge bg-danger/10 text-danger">Atrasado</span></td>
                  <td>28 Fev 2024</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <div className="ui-card flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-radius-10 bg-surface-soft border border-border ${color}`}>
          <Icon size={20} />
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-soft border border-border ${trend.startsWith('+') ? 'text-success' : trend.startsWith('-') ? 'text-danger' : 'text-muted'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-display font-bold text-text">{value}</p>
        <p className="text-xs text-muted font-medium">{title}</p>
      </div>
    </div>
  );
}
