import { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { clearUser } from '../store/slices/authSlice';
import { loginWithEmail, registerWithEmail, logout, checkUsernameAvailable } from '../services/firebase/auth.service';
import { AUTH_ERRORS } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function mapError(code: string): string {
    return AUTH_ERRORS[code] ?? 'Une erreur est survenue';
  }

  async function login(email: string, password: string): Promise<boolean> {
    setIsLoading(true); setError(null);
    try { await loginWithEmail(email, password); return true; }
    catch (e: any) { setError(mapError(e.code)); return false; }
    finally { setIsLoading(false); }
  }

  async function register(email: string, password: string, username: string, displayName: string): Promise<boolean> {
    setIsLoading(true); setError(null);
    try {
      const available = await checkUsernameAvailable(username);
      if (!available) { setError("Ce nom d'utilisateur est déjà pris"); return false; }
      await registerWithEmail(email, password, username, displayName);
      return true;
    } catch (e: any) { setError(mapError(e.code)); return false; }
    finally { setIsLoading(false); }
  }

  async function signOut(): Promise<void> {
    await logout();
    await AsyncStorage.clear();
    dispatch(clearUser());
  }

  return { login, register, signOut, isLoading, error, setError };
}
