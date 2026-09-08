import React, { useState } from 'react';
import { useFKUS } from '../../context/FKUSContext';
import { 
  Tag, 
  BarChart3, 
  Search, 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  Check
} from 'lucide-react';
import { CategoriesModal } from './CategoriesModal';
import { StatsModal } from './StatsModal';

export const MoreView: React.FC = () => {
  const { 
    setIsCategoryModalOpen, 
    setIsStatsModalOpen, 
    setIsSearchOpen, 
    resetToDefaults, 
    exportDataJSON, 
    importDataJSON 
  } = useFKUS();

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
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Más y Ajustes
        </h1>
        <p className="text-xs text-neutral-400">
          Personalización, categorías, estadísticas y respaldo de tus datos.
        </p>
      </div>

      {/* Main Action Hub */}
      <div className="space-y-2.5">
        {/* Categories Manager */}
        <button
          onClick={() => setIsCategoryModalOpen(true)}
          className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Tag size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                Categorías personalizadas
              </h4>
              <p className="text-xs text-neutral-400">
                Crea, edita iconos y colores para tus actividades.
              </p>
            </div>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-sm">→</span>
        </button>

        {/* Action Stats */}
        <button
          onClick={() => setIsStatsModalOpen(true)}
          className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BarChart3 size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Estadísticas de Acción
              </h4>
              <p className="text-xs text-neutral-400">
                Resumen de tareas hechas, pendientes y hábitos.
              </p>
            </div>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-sm">→</span>
        </button>

        {/* Global Search */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Search size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                Buscador Global
              </h4>
              <p className="text-xs text-neutral-400">
                Encuentra cualquier tarea, nota u objetivo al instante.
              </p>
            </div>
          </div>
          <span className="text-neutral-500 group-hover:text-white transition-colors text-sm">→</span>
        </button>
      </div>

      {/* Data Backups & Reset */}
      <div className="space-y-2.5 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 px-1">
          Datos y Privacidad
        </h3>

        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Download size={17} className="text-emerald-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Exportar datos (JSON)</h5>
                <p className="text-[11px] text-neutral-400">Guarda una copia de seguridad en tu dispositivo.</p>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl"
            >
              {copySuccess ? '✓ Descargado' : 'Exportar'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <Upload size={17} className="text-teal-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Importar respaldo</h5>
                <p className="text-[11px] text-neutral-400">Restaura tus datos desde un archivo JSON.</p>
              </div>
            </div>
            <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white rounded-xl cursor-pointer">
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
            <p className="text-xs text-emerald-400 font-semibold pt-1">
              {importStatus}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex items-center space-x-2.5">
              <RotateCcw size={17} className="text-amber-400" />
              <div>
                <h5 className="text-xs font-bold text-white">Restaurar ejemplos iniciales</h5>
                <p className="text-[11px] text-neutral-400">Recarga las tareas y objetivos del ejemplo.</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿Deseas recargar los datos de ejemplo iniciales?')) {
                  resetToDefaults();
                }
              }}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-amber-500/20 text-xs font-semibold text-neutral-300 hover:text-amber-400 rounded-xl"
            >
              Restaurar
            </button>
          </div>
        </div>
      </div>

      {/* Manifest & Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 text-center space-y-1.5">
        <span className="text-lg font-black tracking-widest text-emerald-400">FKUS</span>
        <p className="text-xs font-medium text-neutral-300">
          "Apúntalo. Organízalo. Hazlo."
        </p>
        <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
          Diseñado para ahorrar tiempo, no para consumirlo. Entra, haz lo que tienes que hacer y continúa con tu día.
        </p>
      </div>

      {/* Modals */}
      <CategoriesModal />
      <StatsModal />
    </div>
  );
};
