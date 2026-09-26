import { UserProfile } from '../types';
import { auth, db, googleProvider, isFirebaseConfigured } from './firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const LOCAL_USERS_KEY = 'fkus_local_users_registry_v1';
const CURRENT_USER_KEY = 'fkus_current_active_user_v1';

// Admin Test User definition
export const ADMIN_USER: UserProfile = {
  id: 'admin_test_user_id',
  username: 'admin',
  email: 'admin@fkus.app',
  birthDate: '2000-01-01',
  photoURL: undefined,
  isEmailVerified: true,
  authProvider: 'admin',
  createdAt: new Date().toISOString(),
};

interface LocalStoredAccount {
  profile: UserProfile;
  passwordHash: string;
}

// Helper to read local registered accounts
function getLocalAccounts(): LocalStoredAccount[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accounts: LocalStoredAccount[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(accounts));
}

export const authService = {
  /**
   * Get initial stored user session if available
   */
  getPersistedUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setPersistedUser(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  /**
   * Login as predefined test admin account
   */
  async loginAsAdmin(password: string): Promise<UserProfile> {
    if (password !== 'admin123') {
      throw new Error('Contraseña de administrador incorrecta. Usa "admin123".');
    }
    this.setPersistedUser(ADMIN_USER);
    return ADMIN_USER;
  },

  /**
   * Register a new user with username, email, password, and birthDate
   */
  async register(
    username: string,
    email: string,
    password: string,
    birthDate: string
  ): Promise<{ user: UserProfile; verificationSent: boolean }> {
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedUsername || !trimmedEmail || !password) {
      throw new Error('Por favor completa todos los campos requeridos.');
    }

    if (trimmedUsername === 'admin') {
      throw new Error('El nombre de usuario "admin" está reservado para la cuenta de prueba.');
    }

    // Check local registry first
    const accounts = getLocalAccounts();
    const usernameTaken = accounts.some(a => a.profile.username.toLowerCase() === trimmedUsername);
    if (usernameTaken) {
      throw new Error('Este nombre de usuario ya está en uso. Por favor elige otro.');
    }

    const emailTaken = accounts.some(a => a.profile.email.toLowerCase() === trimmedEmail);
    if (emailTaken) {
      throw new Error('Ya existe una cuenta con este correo electrónico.');
    }

    let newUserProfile: UserProfile;
    let verificationSent = false;

    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        const fbUser = userCredential.user;

        // Update display name
        await updateProfile(fbUser, { displayName: trimmedUsername });

        // Send Email Verification
        try {
          await sendEmailVerification(fbUser);
          verificationSent = true;
        } catch (verifErr) {
          console.warn('Error al enviar correo de verificación de Firebase:', verifErr);
        }

        newUserProfile = {
          id: fbUser.uid,
          username: trimmedUsername,
          email: trimmedEmail,
          birthDate: birthDate || undefined,
          isEmailVerified: fbUser.emailVerified,
          authProvider: 'email',
          createdAt: new Date().toISOString(),
        };

        // Persist profile to Firestore if available
        if (db) {
          try {
            await setDoc(doc(db, 'users', fbUser.uid), newUserProfile);
          } catch (dbErr) {
            console.warn('Error guardando usuario en Firestore:', dbErr);
          }
        }
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          throw new Error('Este correo ya está registrado en Firebase.');
        } else if (err.code === 'auth/weak-password') {
          throw new Error('La contraseña debe tener al menos 6 caracteres.');
        } else if (err.code === 'auth/invalid-email') {
          throw new Error('El formato del correo electrónico no es válido.');
        }
        throw new Error(err.message || 'Error al registrar la cuenta en Firebase.');
      }
    } else {
      // Offline / Local Registry Fallback
      const userId = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      newUserProfile = {
        id: userId,
        username: trimmedUsername,
        email: trimmedEmail,
        birthDate: birthDate || undefined,
        isEmailVerified: false, // will simulate email verification
        authProvider: 'email',
        createdAt: new Date().toISOString(),
      };
      verificationSent = true;
    }

    // Save in local registry
    accounts.push({
      profile: newUserProfile,
      passwordHash: password, // In client mock store
    });
    saveLocalAccounts(accounts);
    this.setPersistedUser(newUserProfile);

    return { user: newUserProfile, verificationSent };
  },

  /**
   * Login with username or email and password
   */
  async login(identifier: string, password: string): Promise<UserProfile> {
    const trimmedId = identifier.trim().toLowerCase();

    // Check if logging in as Admin
    if (trimmedId === 'admin' || trimmedId === 'admin@fkus.app') {
      return this.loginAsAdmin(password);
    }

    if (isFirebaseConfigured && auth) {
      try {
        // If identifier is a username, find corresponding email in local registry or Firestore
        let emailToUse = trimmedId;
        if (!trimmedId.includes('@')) {
          const accounts = getLocalAccounts();
          const match = accounts.find(a => a.profile.username.toLowerCase() === trimmedId);
          if (match) {
            emailToUse = match.profile.email;
          }
        }

        const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
        const fbUser = userCredential.user;

        let profile: UserProfile | null = null;
        if (db) {
          try {
            const snap = await getDoc(doc(db, 'users', fbUser.uid));
            if (snap.exists()) {
              profile = snap.data() as UserProfile;
              profile.isEmailVerified = fbUser.emailVerified;
            }
          } catch (e) {
            console.warn('Error fetching user profile from Firestore:', e);
          }
        }

        if (!profile) {
          profile = {
            id: fbUser.uid,
            username: fbUser.displayName || fbUser.email?.split('@')[0] || 'usuario',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            isEmailVerified: fbUser.emailVerified,
            authProvider: 'email',
            createdAt: new Date().toISOString(),
          };
        }

        this.setPersistedUser(profile);
        return profile;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          throw new Error('Credenciales incorrectas. Verifica tu usuario/correo y contraseña.');
        }
        // Fallback to local accounts if Firebase failed due to offline/env
      }
    }

    // Local Accounts Check
    const accounts = getLocalAccounts();
    const found = accounts.find(
      a => (a.profile.username.toLowerCase() === trimmedId || a.profile.email.toLowerCase() === trimmedId)
    );

    if (!found || found.passwordHash !== password) {
      throw new Error('Usuario o contraseña incorrectos.');
    }

    this.setPersistedUser(found.profile);
    return found.profile;
  },

  /**
   * Fast Sign-In with Google (OAuth)
   */
  async loginWithGoogle(): Promise<UserProfile> {
    if (isFirebaseConfigured && auth && googleProvider) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const fbUser = result.user;

        let profile: UserProfile | null = null;
        if (db) {
          try {
            const snap = await getDoc(doc(db, 'users', fbUser.uid));
            if (snap.exists()) {
              profile = snap.data() as UserProfile;
              profile.isEmailVerified = fbUser.emailVerified;
            }
          } catch (e) {
            console.warn('Error reading google user from firestore:', e);
          }
        }

        if (!profile) {
          const generatedUsername = (fbUser.displayName || fbUser.email?.split('@')[0] || 'usuario')
            .replace(/\s+/g, '')
            .toLowerCase();

          profile = {
            id: fbUser.uid,
            username: generatedUsername,
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || undefined,
            isEmailVerified: fbUser.emailVerified,
            authProvider: 'google',
            createdAt: new Date().toISOString(),
          };

          if (db) {
            try {
              await setDoc(doc(db, 'users', fbUser.uid), profile);
            } catch (e) {
              console.warn('Error creating google user in firestore:', e);
            }
          }
        }

        this.setPersistedUser(profile);
        return profile;
      } catch (err: any) {
        if (err.code === 'auth/popup-closed-by-user') {
          throw new Error('Inicio de sesión con Google cancelado.');
        }
        throw new Error(err.message || 'Error al iniciar sesión con Google.');
      }
    }

    // Demo / Fast Google Sign-In Simulation if Firebase keys aren't configured yet
    const demoGoogleUser: UserProfile = {
      id: 'google_demo_user_' + Date.now().toString(36),
      username: 'usuario.google',
      email: 'usuario.demo@gmail.com',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user',
      isEmailVerified: true,
      authProvider: 'google',
      createdAt: new Date().toISOString(),
    };
    this.setPersistedUser(demoGoogleUser);
    return demoGoogleUser;
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(user: UserProfile): Promise<void> {
    if (isFirebaseConfigured && auth?.currentUser) {
      await sendEmailVerification(auth.currentUser);
    } else {
      // In local mode, we mark the local user account as verified
      const accounts = getLocalAccounts();
      const match = accounts.find(a => a.profile.id === user.id);
      if (match) {
        match.profile.isEmailVerified = true;
        saveLocalAccounts(accounts);
      }
      user.isEmailVerified = true;
      this.setPersistedUser(user);
    }
  },

  /**
   * Verify email manually / simulate confirmation
   */
  async verifyEmailLocally(user: UserProfile): Promise<UserProfile> {
    const updated = { ...user, isEmailVerified: true };
    const accounts = getLocalAccounts();
    const match = accounts.find(a => a.profile.id === user.id);
    if (match) {
      match.profile.isEmailVerified = true;
      saveLocalAccounts(accounts);
    }
    this.setPersistedUser(updated);
    return updated;
  },

  /**
   * Log out
   */
  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Firebase signout warning:', e);
      }
    }
    this.setPersistedUser(null);
  },
};
