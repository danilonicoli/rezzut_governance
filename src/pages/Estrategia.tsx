import React from 'react';
import { OKR } from '../types';
import { Target, User, TrendingUp, AlertCircle } from 'lucide-react';

export default function Estrategia() {
  const [okrs, setOkrs] = React.useState<OKR[]>([]);

  React.useEffect(() => {
    fetch('/api/okrs')
      .then(res => res.json())
      .then(setOkrs);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Ciclo Estratégico 2024</h2>
          <p className="text-sm text-muted">Acompanhamento de Objetivos e Resultados-Chave</p>
        </div>
        <div className="flex gap-2">
          <button className="ui-button--ghost">Filtrar</button>
          <button className="ui-button--primary">Novo OKR</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {okrs.map(okr => (
          <div key={okr.id} className="ui-card hover:border-primary-300 transition-colors cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500/10 text-primary-500 rounded-radius-14">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-lg group-hover:text-primary-500 transition-colors">{okr.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <User size={14} />
                      <span>{okr.owner}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <TrendingUp size={14} />
                      <span>{okr.progress}% concluído</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] uppercase tracking-widest text-muted font-bold mb-1">Status</p>
                  <span className={`ui-badge ${
                    okr.status === 'on_track' ? 'bg-success/10 text-success' : 
                    okr.status === 'at_risk' ? 'bg-warning/10 text-warning' : 
                    'bg-danger/10 text-danger'
                  }`}>
                    {okr.status === 'on_track' ? 'No Prazo' : okr.status === 'at_risk' ? 'Em Risco' : 'Atrasado'}
                  </span>
                </div>
                <div className="w-48">
                  <div className="flex justify-between text-[10px] font-bold text-muted mb-1 uppercase tracking-wider">
                    <span>Progresso</span>
                    <span>{okr.progress}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        okr.status === 'on_track' ? 'bg-success' : 
                        okr.status === 'at_risk' ? 'bg-warning' : 
                        'bg-danger'
                      }`}
                      style={{ width: `${okr.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Results Preview */}
            <div className="mt-6 pt-6 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-surface-soft rounded-radius-10 border border-border">
                <p className="text-xs font-semibold mb-2">KR1: Aumento de 20% em Leads</p>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500" style={{ width: '75%' }} />
                </div>
              </div>
              <div className="p-3 bg-surface-soft rounded-radius-10 border border-border">
                <p className="text-xs font-semibold mb-2">KR2: 5 Novos Contratos Industriais</p>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500" style={{ width: '40%' }} />
                </div>
              </div>
              <div className="p-3 bg-surface-soft rounded-radius-10 border border-border">
                <p className="text-xs font-semibold mb-2">KR3: Redução de 10% no CAC</p>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500" style={{ width: '90%' }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
