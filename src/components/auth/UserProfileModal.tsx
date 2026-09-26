import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFKUS } from '../../context/FKUSContext';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Database,
  Sparkles 
} from 'lucide-react';
import { formatDateSpanish } from '../../utils/dateUtils';

export const UserProfileModal: React.FC = () => {
  const { 
    currentUser, 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    logout, 
    resendVerificationEmail,
    verifyEmailLocally,
    isLoading 
  } = useAuth();

  const { tasks, goals, routines } = useFKUS();
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!isProfileModalOpen || !currentUser) return null;

  const handleClose = () => {
    setResendStatus(null);
    setIsProfileModalOpen(false);
  };

  const handleResend = async () => {
    setResendStatus('Enviando enlace...');
    try {
      await resendVerificationEmail();
      setResendStatus('¡Correo de verificación enviado! Revisa tu bandeja de entrada o spam.');
    } catch (e: any) {
      setResendStatus('Error al enviar el correo. Puedes verificarla directamente abajo.');
    }
  };

  const handleVerifyNow = async () => {
    try {
      await verifyEmailLocally();
      setResendStatus('¡Cuenta verificada exitosamente!');
    } catch (e: any) {
      setResendStatus('Error al verificar la cuenta.');
    }
  };

  const initial = currentUser.username.charAt(0).toUpperCase() || 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Top Line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pt-1">
          {currentUser.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.username} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500/40 shadow-lg shadow-red-600/10"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-red-500/40 flex items-center justify-center text-red-500 font-black text-2xl shadow-lg">
              {initial}
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white leading-tight">
                {currentUser.username}
              </h2>
              {currentUser.authProvider === 'admin' && (
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-red-600 text-white">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              {currentUser.email}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              {currentUser.isEmailVerified ? (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={11} />
                  <span>Cuenta Verificada</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                  <AlertTriangle size={11} />
                  <span>Pendiente de Confirmar</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Verification banner if pending */}
        {!currentUser.isEmailVerified && (
          <div className="p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-2xl space-y-2 text-xs">
            <div className="flex items-start gap-2 text-amber-300">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
              <span>Verifica tu correo electrónico para proteger y confirmar tu cuenta.</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleResend}
                className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 font-bold text-[11px] transition-all"
              >
                Reenviar correo
              </button>
              <button
                type="button"
                onClick={handleVerifyNow}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-[11px] transition-all"
              >
                Confirmar ahora
              </button>
            </div>
            {resendStatus && (
              <p className="text-[11px] text-amber-200/90 italic pt-1">{resendStatus}</p>
            )}
          </div>
        )}

        {/* Details List */}
        <div className="space-y-2 bg-neutral-900/60 border border-neutral-850 rounded-2xl p-3.5 text-xs">
          {currentUser.birthDate && (
            <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
              <div className="flex items-center gap-2 text-neutral-400">
                <Calendar size={14} className="text-red-400" />
                <span>Fecha de cumpleaños</span>
              </div>
              <span className="font-bold text-neutral-200">
                {currentUser.birthDate}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-1 border-b border-neutral-800/60">
            <div className="flex items-center gap-2 text-neutral-400">
              <ShieldCheck size={14} className="text-red-400" />
              <span>Método de Acceso</span>
            </div>
            <span className="font-bold text-neutral-200 capitalize">
              {currentUser.authProvider === 'google' ? 'Google OAuth' : currentUser.authProvider === 'admin' ? 'Administrador' : 'Correo y Contraseña'}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2 text-neutral-400">
              <Database size={14} className="text-red-400" />
              <span>Datos sincronizados</span>
            </div>
            <span className="font-bold text-neutral-200">
              {tasks.length} tareas · {goals.length} metas · {routines.length} rutinas
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={logout}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-red-400 hover:text-red-300 border border-neutral-800 hover:border-red-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
