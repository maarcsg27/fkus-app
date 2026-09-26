import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Tag, 
  BarChart3, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  Database
} from 'lucide-react';
import { CategoriesModal } from './CategoriesModal';
import { StatsModal } from './StatsModal';

export const MoreView: React.FC = () => {
  const { 
    setIsCategoryModalOpen, 
    setIsStatsModalOpen, 
    setIsSearchOpen, 
    clearAllData,
    loadSampleData,
    resetToDefaults, 
    exportDataJSON, 
    importDataJSON 
  } = useFKUS();

  const {
    currentUser,
    openLoginModal,
    openRegisterModal,
    setIsProfileModalOpen,
    logout,
  } = useAuth();

  const [copySuccess, setCopySuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FKUS_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJSON(content);
      if (success) {
        setImportStatus('¡Datos importados con éxito!');
      } else {
        setImportStatus('Error: formato JSON inválido.');
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-150">
      {/* Header */}
      <div className="pt-1 px-1">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Más y Ajustes
        </h1>
        <p className="text-xs text-neutral-400">
          Cuenta, sincronización en base de datos, categorías y estadísticas.
        </p>
      </div>

      {/* Account & Database Cloud Sync Card */}
      <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-neutral-400">
            <Database size={14} className="text-red-500" />
            <span>Base de Datos y Cuenta</span>
          </div>
          {currentUser && (
            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Sincronizado
            </span>
          )}
        </div>

        {currentUser ? (
          <div className="flex items-center justify-between pt-1">
            <div 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={currentUser.username} 
                  className="w-11 h-11 rounded-xl object-cover border border-red-500/40"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-neutral-900 border border-red-500/40 text-red-500 font-black text-base flex items-center justify-center">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                    {currentUser.username}
                  </h4>
                  {currentUser.authProvider === 'admin' && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-red-600/30 text-red-400 border border-red-500/40 uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400">{currentUser.email}</p>
                {currentUser.birthDate && (
                  <p className="text-[11px] text-neutral-500">🎂 {currentUser.birthDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-white font-bold text-xs border border-neutral-800"
              >
                Ver Perfil
              </button>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-red-600/20 text-neutral-400 hover:text-red-400 border border-neutral-800 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white">Modo Invitado (Almacenamiento Local)</h4>
              <p className="text-[11px] text-neutral-400">
                Inicia sesión o crea una cuenta para guardar tus datos en la nube y acceder desde cualquier dispositivo.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={openLoginModal}
                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center gap-1.5"
              >
                <LogIn size={14} />
                <span>Iniciar Sesión</span>
              </button>
              <button
                onClick={openRegisterModal}
                className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-xs border border-neutral-800"
              >
                Crear Cuenta
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Hub */}
      <div className="space-y-2.5">
        {/* Categories Manager */}
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="w-full p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-500/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
              <Tag size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                Categorías personalizadas
              </h4>
              <p className="text-xs text-neutral-400">
                Crea, edita iconos y colores para tus actividades.
              </p>
            </div>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-sm font-bold">→</span>
        </button>

        {/* Action Stats */}
        <button
          onClick={() => setIsStatsModalOpen(true)}
          className="w-full p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-500/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                Estadísticas de Acción
              </h4>
              <p className="text-xs text-neutral-400">
                Resumen de tareas hechas, pendientes y hábitos.
              </p>
            </div>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-sm font-bold">→</span>
        </button>

        {/* Global Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-red-500/50 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center">
              <Search size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                Buscador Global
              </h4>
              <p className="text-xs text-neutral-400">
                Encuentra cualquier tarea, nota u objetivo al instante.
              </p>
            </div>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-sm font-bold">→</span>
        </button>
      </div>

      {/* Data Backups & Reset */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
          Datos y Privacidad
        </h3>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Download size={17} className="text-red-500" />
              <div>
                <h5 className="text-xs font-bold text-white">Exportar datos (JSON)</h5>
                <p className="text-[11px] text-neutral-400">Guarda una copia de seguridad en tu dispositivo.</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white rounded-xl border border-neutral-800"
            >
              {copySuccess ? '✓ Descargado' : 'Exportar'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <Upload size={17} className="text-red-500" />
              <div>
                <h5 className="text-xs font-bold text-white">Importar respaldo</h5>
                <p className="text-[11px] text-neutral-400">Restaura tus datos desde un archivo JSON.</p>
              </div>
            </div>
            <label className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-white rounded-xl border border-neutral-800 cursor-pointer">
              Importar
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <p className="text-xs text-red-400 font-bold pt-1">
              {importStatus}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <Trash2 size={17} className="text-red-500" />
              <div>
                <h5 className="text-xs font-bold text-white">Vaciar todos los datos</h5>
                <p className="text-[11px] text-neutral-400">Borra todas las tareas, rutinas y objetivos para empezar de cero.</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Seguro que deseas vaciar todas las tareas, rutinas y objetivos? Esta acción empezará tu app de cero.')) {
                  clearAllData();
                  setImportStatus('¡Datos vaciados! Tu app está lista y limpia.');
                  setTimeout(() => setImportStatus(null), 3000);
                }
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-red-600 text-xs font-bold text-neutral-300 hover:text-white rounded-xl border border-neutral-800 transition-colors"
            >
              Vaciar
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <RotateCcw size={17} className="text-neutral-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Cargar datos de ejemplo</h5>
                <p className="text-[11px] text-neutral-400">Carga tareas y objetivos de prueba para explorar la app.</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Deseas cargar los datos de prueba de ejemplo?')) {
                  loadSampleData();
                  setImportStatus('¡Datos de ejemplo cargados!');
                  setTimeout(() => setImportStatus(null), 3000);
                }
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-xs font-bold text-neutral-300 hover:text-white rounded-xl border border-neutral-800 transition-colors"
            >
              Cargar
            </button>
          </div>
        </div>
      </div>

      {/* Manifest & Philosophy Banner */}
      <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-3">
        <img 
          src="/logo-tight.png" 
          alt="FKUS Logo" 
          className="w-36 h-auto mx-auto object-contain"
        />
        <p className="text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed pt-1">
          Diseñado para ahorrar tiempo, no para consumirlo. Entra, haz lo que tienes que hacer y continúa con tu día.
        </p>
      </div>

      {/* Modals */}
      <CategoriesModal />
      <StatsModal />
    </div>
  );
};
