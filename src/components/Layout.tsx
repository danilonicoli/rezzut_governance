import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Target, 
  BarChart3, 
  FileText, 
  ShieldAlert, 
  CheckSquare, 
  ClipboardList, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Target, label: 'Estratégia (OKRs)', path: '/estrategia' },
  { icon: BarChart3, label: 'Indicadores (KPIs)', path: '/indicadores' },
  { icon: FileText, label: 'SGI / Documentos', path: '/sgi' },
  { icon: ShieldAlert, label: 'Gestão de Riscos', path: '/riscos' },
  { icon: CheckSquare, label: 'Compliance', path: '/compliance' },
  { icon: ClipboardList, label: 'Auditorias', path: '/auditorias' },
  { icon: Settings, label: 'Configurações', path: '/config' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-primary-700 text-white transition-all duration-300 flex flex-col fixed h-full z-50",
          isSidebarOpen ? "w-[280px]" : "w-[80px]"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight">REZZUT</span>
              <span className="text-[10px] uppercase tracking-widest text-primary-300 font-semibold">Governança</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-3 rounded-radius-10 transition-all group",
                isActive 
                  ? "bg-primary-500 text-white shadow-lg" 
                  : "text-primary-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={22} className={cn("shrink-0", !isSidebarOpen && "mx-auto")} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-display font-bold text-xs">
              DN
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">Danilo Nicoli</span>
                <span className="text-[10px] text-primary-300 truncate">Administrador</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "ml-[280px]" : "ml-[80px]"
        )}
      >
        {/* Topbar */}
        <header className="bg-surface border-b border-border sticky top-0 z-40 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-xl text-text">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            <p className="text-xs text-muted">Sistema de Governança Corporativa Rezzut</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="ui-button--ghost text-xs h-9">
              Exportar Relatório
            </button>
            <button className="ui-button--primary text-xs h-9">
              Novo Registro
            </button>
          </div>
        </header>

        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
