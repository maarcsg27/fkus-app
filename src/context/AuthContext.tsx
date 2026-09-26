import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService, ADMIN_USER } from '../services/authService';
import { auth, isFirebaseConfigured } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, birthDate: string) => Promise<{ verificationSent: boolean }>;
  loginWithGoogle: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  verifyEmailLocally: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getPersistedUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Listen to Firebase auth state if configured
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userObj: UserProfile = {
            id: fbUser.uid,
            username: fbUser.displayName || fbUser.email?.split('@')[0] || 'usuario',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            isEmailVerified: fbUser.emailVerified,
            authProvider: fbUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'email',
            createdAt: fbUser.metadata.creationTime || new Date().toISOString(),
          };
          setCurrentUser(userObj);
          authService.setPersistedUser(userObj);
        } else {
          // If was logged in via admin or local session, preserve it
          const localUser = authService.getPersistedUser();
          if (localUser && (localUser.authProvider === 'admin' || !isFirebaseConfigured)) {
            setCurrentUser(localUser);
          } else {
            setCurrentUser(null);
          }
        }
        setIsLoading(false);
      });

      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const login = async (identifier: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(identifier, password);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string, birthDate: string) => {
    setIsLoading(true);
    try {
      const result = await authService.register(username, email, password, birthDate);
      setCurrentUser(result.user);
      return { verificationSent: result.verificationSent };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      setCurrentUser(user);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.loginAsAdmin('admin123');
      setCurrentUser(user);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!currentUser) return;
    await authService.resendVerificationEmail(currentUser);
  };

  const verifyEmailLocally = async () => {
    if (!currentUser) return;
    const updated = await authService.verifyEmailLocally(currentUser);
    setCurrentUser(updated);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsProfileModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openRegisterModal,
        login,
        register,
        loginWithGoogle,
        loginAsAdmin,
        resendVerificationEmail,
        verifyEmailLocally,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
