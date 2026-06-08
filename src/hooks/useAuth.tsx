/**
 * useAuth.tsx
 * 
 * Auth Context và Hook cho React
 * Dùng localStorage để quản lý authentication
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Address, AuthState, MarketingPreferences } from '../types/auth';
import { STORAGE_KEYS } from '../types/auth';
import {
  signInWithPassword,
  signUpWithPassword,
  signOut as authSignOut,
  getCurrentUser,
  onAuthStateChange,
} from '../services/authService';

// ============================================
// TYPES
// ============================================

interface AuthContextType extends AuthState {
  // Auth functions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // Address management (vẫn lưu local vì không liên quan auth)
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;

  // Profile management
  updateProfile: (userData: Partial<User>) => void;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ============================================
// PROVIDER
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // ============================================
  // KHỞI TẠO - LẤY USER TỪ SUPABASE
  // ============================================

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        
        if (currentUser) {
          const fullUser = loadUserWithAddresses(currentUser);
          setUser(fullUser);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('[useAuth] Init error:', error);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initAuth();

    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        const fullUser = loadUserWithAddresses(user);
        setUser(fullUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    const handleMockAuthChange = (e: CustomEvent<User | null>) => {
      const user = e.detail;
      if (user) {
        const fullUser = loadUserWithAddresses(user);
        setUser(fullUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    window.addEventListener('mockAuthChange', handleMockAuthChange as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('mockAuthChange', handleMockAuthChange as EventListener);
    };
  }, []);

  // ============================================
  // CHUYỂN ĐỔI USER
  // ============================================

  function loadUserWithAddresses(user: User): User {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        const storedUser = JSON.parse(stored) as User;
        return {
          ...user,
          fullName: storedUser.fullName || user.fullName,
          phone: storedUser.phone || user.phone,
          addresses: storedUser.addresses || [],
          gender: storedUser.gender || user.gender || '',
          birthDate: storedUser.birthDate || user.birthDate || '',
          company: storedUser.company || user.company || '',
          taxCode: storedUser.taxCode || user.taxCode || '',
          companyAddress: storedUser.companyAddress || user.companyAddress || '',
          companyRepresentative: storedUser.companyRepresentative || user.companyRepresentative || '',
          customerGroup: storedUser.customerGroup || user.customerGroup || 'Khách hàng MECsu',
          currentDiscount: storedUser.currentDiscount || user.currentDiscount || 'Chưa cập nhật',
          marketingPreferences: storedUser.marketingPreferences || user.marketingPreferences,
        };
      }
    } catch {
      // Ignore parse errors
    }
    return user;
  }

  // ============================================
  // LƯU USER VÀO LOCALSTORAGE (KHÔNG CÓ PASSWORD)
  // ============================================

  const saveUserToStorage = useCallback((userData: User) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
  }, []);

  // ============================================
  // AUTH FUNCTIONS
  // ============================================

  /**
   * Đăng nhập bằng email và password
   */
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const result = await signInWithPassword(email, password);
    
    if (result.success && result.data) {
      const appUser = result.data.user;
      const fullUser = loadUserWithAddresses(appUser);
      setUser(fullUser);
      setIsLoggedIn(true);
      saveUserToStorage(fullUser);
    }
    
    return {
      success: result.success,
      error: result.error,
    };
  }, [saveUserToStorage]);

  /**
   * Đăng ký tài khoản mới
   */
  const register = useCallback(async (
    email: string, 
    password: string, 
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await signUpWithPassword(email, password, fullName);
    
    if (result.success && result.data) {
      const appUser = result.data.user;
      const fullUser = loadUserWithAddresses(appUser);
      setUser(fullUser);
      setIsLoggedIn(true);
      saveUserToStorage(fullUser);
    }
    
    return {
      success: result.success,
      error: result.error,
    };
  }, [saveUserToStorage]);

  /**
   * Đăng xuất
   */
  const logout = useCallback(async () => {
    await authSignOut();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }, []);

  // ============================================
  // ADDRESS MANAGEMENT (VẪN LƯU LOCAL)
  // ============================================

  const addAddress = useCallback((address: Address) => {
    if (!user) return;

    const newAddress = { 
      ...address, 
      id: Math.random().toString(36).substring(2, 15),
      isDefault: user.addresses.length === 0 
    };
    
    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress],
    };
    
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  }, [user, saveUserToStorage]);

  const updateAddress = useCallback((id: string, address: Address) => {
    if (!user) return;

    const updatedAddresses = user.addresses.map(a =>
      a.id === id ? { ...address, id } : a
    );
    
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  }, [user, saveUserToStorage]);

  const updateProfile = useCallback((userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...userData,
    };

    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  }, [user, saveUserToStorage]);

  const deleteAddress = useCallback((id: string) => {
    if (!user) return;

    const filteredAddresses = user.addresses.filter((a) => a.id !== id);
    const needsNewDefault = user.addresses.find((a) => a.id === id)?.isDefault;
    if (needsNewDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].isDefault = true;
    }

    const updatedUser = { ...user, addresses: filteredAddresses };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  }, [user, saveUserToStorage]);

  const setDefaultAddress = useCallback((id: string) => {
    if (!user) return;

    const updatedAddresses = user.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));

    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  }, [user, saveUserToStorage]);

  const getDefaultAddress = useCallback((): Address | undefined => {
    if (!user) return undefined;
    return user.addresses.find(a => a.isDefault) || user.addresses[0];
  }, [user]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AuthContextType = {
    isLoggedIn,
    user,
    login,
    logout,
    register,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    updateProfile,
    isLoading,
    isInitialized,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
