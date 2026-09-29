import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Sparkles, CheckCircle2, User, ShieldCheck } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { 
    currentUser, 
    openLoginModal, 
    setHasEnteredApp,
    isLoading 
  } = useAuth();

  const handleEnter = () => {
    if (currentUser) {
      // User is already logged in -> Enter app directly
      setHasEnteredApp(true);
    } else {
      // User is not logged in -> Open login / register modal
      openLoginModal();
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -top-20 right-1/4 w-72 h-72 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top Header Placeholder / Subtle indicator */}
      <div className="w-full flex items-center justify-between max-w-md mx-auto z-10 pt-2 opacity-80">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
            Productividad Pura
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
          v2.0
        </span>
      </div>

      {/* Center Hero Section: Logo, Name & Slogan */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm sm:max-w-md mx-auto my-auto z-10 space-y-6">
        {/* Centered App Logo */}
        <div className="relative group cursor-pointer" onClick={handleEnter}>
          <div className="absolute inset-0 bg-red-600/25 blur-2xl rounded-3xl scale-90 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-neutral-950/80 border border-neutral-800/90 p-4 shadow-2xl flex items-center justify-center backdrop-blur-xl group-hover:border-red-500/50 transition-all duration-300">
            <img 
              src="/logo-icon.png" 
              alt="FKUS" 
              className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(239,68,68,0.3)] group-hover:scale-105 transition-transform" 
            />
          </div>
        </div>

        {/* Brand Name & Slogan */}
        <div className="space-y-2">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              FKUS
            </h1>
          </div>

          {/* Slogan */}
          <p className="text-base sm:text-lg font-medium text-neutral-300 tracking-wide">
            Apúntalo. Organízalo. Hazlo.
          </p>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Tu centro de mando minimalista para tareas, metas y rutinas diarias.
          </p>
        </div>

        {/* Active Session Badge (if already logged in) */}
        {currentUser && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 animate-in fade-in">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Sesión activa como <strong className="text-white">{currentUser.username}</strong></span>
          </div>
        )}
      </div>

      {/* Bottom Section: Enter Button & Secondary options */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto z-10 pb-4 space-y-3">
        {/* Main "Entrar" Button */}
        <button
          onClick={handleEnter}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:brightness-110 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-xl shadow-red-600/25 flex items-center justify-center gap-2.5 transition-all duration-200 group"
        >
          <span>{currentUser ? `Entrar como ${currentUser.username}` : 'Entrar'}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Extra info / quick links */}
        {!currentUser ? (
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-400 pt-1">
            <button
              onClick={() => openLoginModal()}
              className="hover:text-red-400 transition-colors"
            >
              Iniciar sesión
            </button>
            <span>•</span>
            <button
              onClick={() => openLoginModal()}
              className="hover:text-red-400 transition-colors"
            >
              Crear cuenta
            </button>
            <span>•</span>
            <button
              onClick={() => setHasEnteredApp(true)}
              className="hover:text-neutral-300 transition-colors"
            >
              Modo Invitado
            </button>
          </div>
        ) : (
          <p className="text-center text-[11px] text-neutral-400">
            Tus datos se sincronizarán automáticamente en la base de datos.
          </p>
        )}
      </div>
    </div>
  );
};
