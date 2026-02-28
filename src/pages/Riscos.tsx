import React from 'react';
import { Risk } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Riscos() {
  const [risks, setRisks] = React.useState<Risk[]>([]);

  React.useEffect(() => {
    fetch('/api/risks')
      .then(res => res.json())
      .then(setRisks);
  }, []);

  const getRiskLevel = (impact: number, prob: number) => {
    const score = impact * prob;
    if (score >= 12) return { label: 'Crítico', color: 'text-danger', bg: 'bg-danger/10' };
    if (score >= 6) return { label: 'Moderado', color: 'text-warning', bg: 'bg-warning/10' };
    return { label: 'Baixo', color: 'text-success', bg: 'bg-success/10' };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">Matriz de Riscos Corporativos</h2>
          <p className="text-sm text-muted">Identificação, Análise e Mitigação de Riscos</p>
        </div>
        <button className="ui-button--primary">Novo Risco</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Matrix Visualization */}
        <div className="ui-card lg:col-span-1">
          <h3 className="text-lg mb-6">Matriz Impacto x Probabilidade</h3>
          <div className="grid grid-cols-6 gap-1 aspect-square">
            <div className="col-span-1 flex flex-col justify-between text-[10px] font-bold text-muted py-2">
              <span>5</span><span>4</span><span>3</span><span>2</span><span>1</span>
            </div>
            <div className="col-span-5 grid grid-cols-5 grid-rows-5 gap-1">
              {[5,4,3,2,1].map(row => (
                [1,2,3,4,5].map(col => {
                  const score = row * col;
                  let bg = 'bg-success/20';
                  if (score >= 12) bg = 'bg-danger/40';
                  else if (score >= 6) bg = 'bg-warning/30';
                  
                  return (
                    <div 
                      key={`${row}-${col}`} 
                      className={`${bg} rounded-sm flex items-center justify-center text-[8px] font-bold text-text/50 hover:scale-110 transition-transform cursor-pointer`}
                      title={`Impacto ${row}, Probabilidade ${col}`}
                    >
                      {risks.filter(r => r.impact === row && r.probability === col).length || ''}
                    </div>
                  );
                })
              ))}
            </div>
            <div className="col-start-2 col-span-5 flex justify-between text-[10px] font-bold text-muted px-2">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-danger/40 rounded-sm" />
              <span className="text-muted">Crítico (12-25)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-warning/30 rounded-sm" />
              <span className="text-muted">Moderado (6-11)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-success/20 rounded-sm" />
              <span className="text-muted">Baixo (1-5)</span>
            </div>
          </div>
        </div>

        {/* Risk List */}
        <div className="lg:col-span-2 space-y-4">
          {risks.map(risk => {
            const level = getRiskLevel(risk.impact, risk.probability);
            return (
              <div key={risk.id} className="ui-card p-4 flex items-center justify-between hover:border-primary-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-radius-10 ${level.bg} ${level.color}`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{risk.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-muted uppercase font-bold">Owner: {risk.owner}</span>
                      <span className="text-[10px] text-muted uppercase font-bold">Score: {risk.impact * risk.probability}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`ui-badge ${level.bg} ${level.color}`}>
                      {level.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`ui-badge bg-surface-soft border border-border text-muted`}>
                      {risk.status === 'monitored' ? 'Monitorado' : 'Mitigado'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
