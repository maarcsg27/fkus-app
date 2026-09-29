import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC = () => {
  const { 
    currentUser, 
    openLoginModal, 
    setHasEnteredApp,
    isLoading 
  } = useAuth();

  const [isZooming, setIsZooming] = useState<boolean>(false);

  const handleEnter = () => {
    if (isZooming) return;
    setIsZooming(true);

    // Smooth cinematic zoom transition
    setTimeout(() => {
      if (currentUser) {
        // User is already logged in -> Enter app directly
        setHasEnteredApp(true);
      } else {
        // User is not logged in -> Open login / register modal
        openLoginModal();
        setIsZooming(false);
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden animate-in fade-in duration-300">
      {/* Background Ambient Glows */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-700 ease-out ${
          isZooming 
            ? 'w-[650px] sm:w-[850px] h-[650px] sm:h-[850px] bg-red-600/30 blur-[160px] scale-150' 
            : 'w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] bg-red-600/10 blur-[130px]'
        }`} 
      />
      <div className="absolute -top-20 right-1/4 w-72 h-72 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Spacer Top */}
      <div className="w-full h-8" />

      {/* Center Hero Section: Logo, Name & Slogan */}
      <div className="flex flex-col items-center justify-center text-center max-w-sm sm:max-w-md mx-auto my-auto z-10 space-y-6">
        {/* Centered App Logo with Zoom Animation */}
        <div 
          className="relative group cursor-pointer" 
          onClick={handleEnter}
          title="Toca para entrar"
        >
          {/* Pulsing Aura */}
          <div 
            className={`absolute inset-0 bg-red-600 blur-2xl rounded-3xl transition-all duration-500 ease-out ${
              isZooming 
                ? 'opacity-80 scale-150 blur-3xl' 
                : 'opacity-25 scale-90 group-hover:scale-110 group-hover:opacity-40'
            }`} 
          />
          
          {/* Logo Container with Zoom */}
          <div 
            className={`relative rounded-3xl bg-neutral-950/80 border border-neutral-800/90 p-4 shadow-2xl flex items-center justify-center backdrop-blur-xl transition-all duration-500 ease-out ${
              isZooming 
                ? 'scale-[1.8] sm:scale-[2.3] border-red-500 shadow-red-600/50 shadow-2xl -translate-y-2' 
                : 'w-28 h-28 sm:w-36 sm:h-36 group-hover:border-red-500/50 group-hover:scale-105 active:scale-95'
            }`}
          >
            <img 
              src="/logo-icon.png" 
              alt="FKUS" 
              className={`object-contain filter drop-shadow-[0_10px_20px_rgba(239,68,68,0.3)] transition-all duration-500 ${
                isZooming ? 'w-28 h-28 sm:w-36 sm:h-36 scale-110' : 'w-full h-full'
              }`} 
            />
          </div>
        </div>

        {/* Brand Name & Slogan */}
        <div className={`space-y-2 transition-all duration-300 ease-out ${
          isZooming ? 'opacity-0 translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100'
        }`}>
          <div className="flex items-center justify-center">
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              FKUS
            </h1>
          </div>

          {/* Slogan */}
          <p className="text-base sm:text-lg font-medium text-neutral-300 tracking-wide">
            Apúntalo. Organízalo. Hazlo.
          </p>
        </div>

        {/* Active Session Badge (if already logged in) */}
        {currentUser && (
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 transition-all duration-300 ${
            isZooming ? 'opacity-0 scale-90' : 'opacity-100 scale-100 animate-in fade-in'
          }`}>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Sesión activa como <strong className="text-white">{currentUser.username}</strong></span>
          </div>
        )}
      </div>

      {/* Bottom Section: Enter Button & Secondary options */}
      <div className={`w-full max-w-xs sm:max-w-sm mx-auto z-10 pb-4 space-y-3 transition-all duration-300 ease-out ${
        isZooming ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'
      }`}>
        {/* Main "Entrar" Button */}
        <button
          onClick={handleEnter}
          disabled={isLoading || isZooming}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:brightness-110 active:scale-[0.98] text-white font-black text-sm tracking-wide shadow-xl shadow-red-600/25 flex items-center justify-center gap-2.5 transition-all duration-200 group"
        >
          <span>{currentUser ? `Entrar como ${currentUser.username}` : 'Entrar'}</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Extra info / quick links */}
        {!currentUser ? (
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-400 pt-1">
            <button
              onClick={() => handleEnter()}
              className="hover:text-red-400 transition-colors"
            >
              Iniciar sesión
            </button>
            <span>•</span>
            <button
              onClick={() => handleEnter()}
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
