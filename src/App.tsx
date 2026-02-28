import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Estrategia from './pages/Estrategia';
import Riscos from './pages/Riscos';

// Placeholder pages for other modules
const Placeholder = ({ name }: { name: string }) => (
  <div className="ui-card flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl font-bold">?</span>
    </div>
    <h2 className="text-xl mb-2">Módulo {name}</h2>
    <p className="text-muted max-w-md">Este módulo está em desenvolvimento como parte da Fase 2 do projeto de Governança Rezzut.</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/estrategia" element={<Estrategia />} />
          <Route path="/indicadores" element={<Placeholder name="Indicadores (KPIs)" />} />
          <Route path="/sgi" element={<Placeholder name="SGI / Documentos" />} />
          <Route path="/riscos" element={<Riscos />} />
          <Route path="/compliance" element={<Placeholder name="Compliance" />} />
          <Route path="/auditorias" element={<Placeholder name="Auditorias" />} />
          <Route path="/config" element={<Placeholder name="Configurações" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
