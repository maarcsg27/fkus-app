import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, Calendar, ShieldCheck, AlertCircle, CheckCircle2, Sparkles, LogIn, UserPlus } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginWithGoogle,
    loginAsAdmin,
    isLoading,
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsAuthModalOpen(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    try {
      await login(loginIdentifier.trim(), loginPassword);
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al iniciar sesión.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim() || !regBirthDate.trim()) {
      setErrorMsg('Por favor rellena todos los campos (nombre de usuario, correo, contraseña y fecha de cumpleaños).');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const { verificationSent } = await register(
        regUsername.trim(),
        regEmail.trim(),
        regPassword,
        regBirthDate.trim()
      );

      if (verificationSent) {
        setSuccessMsg(
          '¡Cuenta creada exitosamente! Se ha enviado un enlace de confirmación a tu correo para verificar tu cuenta.'
        );
      } else {
        setSuccessMsg('¡Cuenta creada e iniciada con éxito!');
      }

      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar el usuario.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    try {
      await loginWithGoogle();
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con Google.');
    }
  };

  const handleAdminQuickLogin = async () => {
    setErrorMsg(null);
    try {
      await loginAsAdmin();
      handleClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al acceder como administrador.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-white relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Branding */}
        <div className="text-center pt-2">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="text-red-500 font-black text-xl tracking-tighter">FK</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            {authModalMode === 'login' ? 'Iniciar Sesión en FKUS' : 'Crear Cuenta de Usuario'}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            {authModalMode === 'login' 
              ? 'Accede para sincronizar tus tareas y objetivos en la nube' 
              : 'Regístrate para guardar y proteger toda tu información'}
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 p-1 bg-neutral-900/90 border border-neutral-800 rounded-2xl">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setErrorMsg(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authModalMode === 'login'
                ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/50'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LogIn size={13} />
            <span>Iniciar Sesión</span>
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('register'); setErrorMsg(null); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authModalMode === 'register'
                ? 'bg-red-600 text-white shadow-sm shadow-red-600/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <UserPlus size={13} />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Notifications / Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-2xl flex items-start gap-2.5 text-red-200 text-xs animate-in fade-in">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl flex items-start gap-2.5 text-emerald-200 text-xs animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Google Sign-In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-750 hover:border-neutral-600 text-neutral-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.98]"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-neutral-950 px-3 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider absolute">
            o con tu cuenta
          </span>
        </div>

        {/* LOGIN FORM */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                Usuario o Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="ej: admin o tu@correo.com"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-red-500 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Introduce tu contraseña"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-neutral-900/90 border border-neutral-800 focus:border-red-500 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={15} />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <User size={13} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="ej: marc27"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Cumpleaños
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Calendar size={13} />
                  </div>
                  <input
                    type="date"
                    required
                    value={regBirthDate}
                    onChange={(e) => setRegBirthDate(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Mail size={13} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="tucorreo@ejemplo.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock size={13} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 carácteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                    <Lock size={13} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Repite la contraseña"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl pl-8 pr-2.5 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400">
              ℹ️ Te enviaremos un correo para verificar y confirmar tu cuenta.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={15} />
                  <span>Registrar Cuenta</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* DEMO / ADMIN QUICK BUTTON */}
        <div className="pt-2 border-t border-neutral-900">
          <button
            type="button"
            onClick={handleAdminQuickLogin}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/30 text-[11px] font-semibold text-neutral-400 hover:text-neutral-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-red-500" />
              <span>Acceso de prueba: <strong className="text-white font-mono">admin</strong> / <strong className="text-white font-mono">admin123</strong></span>
            </div>
            <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider">Entrar rápido →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
