import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User, Address, AuthState, STORAGE_KEYS } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
  accountExists: (emailOrPhone: string) => boolean;
  checkEmailExists: (email: string) => boolean;
  checkPhoneExists: (phone: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 15);

// Migration: Convert defaultAddress to addresses array
const migrateUser = (user: User): User => {
  if (!user.addresses && (user as any).defaultAddress) {
    return {
      ...user,
      addresses: [(user as any).defaultAddress],
    };
  }
  return { ...user, addresses: user.addresses || [] };
};

const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = stored ? JSON.parse(stored) : [];
    return users.map(migrateUser);
  } catch {
    return [];
  }
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const migratedUser = migrateUser(parsedUser as User);
        // If user was migrated, update localStorage
        if (migratedUser !== parsedUser) {
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(migratedUser));
        }
        setUser(migratedUser);
        setIsLoggedIn(true);
      } catch {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    }
  }, []);

  const accountExists = useCallback((emailOrPhone: string): boolean => {
    const users = getStoredUsers();
    return users.some(
      u => u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
    );
  }, []);

  const checkEmailExists = useCallback((email: string): boolean => {
    const users = getStoredUsers();
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  }, []);

  const checkPhoneExists = useCallback((phone: string): boolean => {
    const users = getStoredUsers();
    return users.some(u => u.phone === phone);
  }, []);

  const login = useCallback(async (emailOrPhone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();
    const foundUser = users.find(
      u => (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone)
    );

    if (!foundUser) {
      return { success: false, error: 'Tài khoản không tồn tại' };
    }

    if (foundUser.password !== password) {
      return { success: false, error: 'Mật khẩu không đúng' };
    }

    // Remove password from stored user object
    const { password: _, ...userWithoutPassword } = foundUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    setIsLoggedIn(true);

    return { success: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt'>): Promise<{ success: boolean; error?: string }> => {
    const users = getStoredUsers();

    // Check if email or phone already exists
    const exists = users.some(
      u => u.email.toLowerCase() === userData.email.toLowerCase() || u.phone === userData.phone
    );

    if (exists) {
      return { success: false, error: 'Email hoặc số điện thoại đã được sử dụng' };
    }

    const newUser: User = {
      ...userData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
    setUser(userWithoutPassword);
    setIsLoggedIn(true);

    return { success: true };
  }, []);

  const addAddress = useCallback((address: Address) => {
    if (!user) return;

    const newAddress = { ...address, id: generateId(), isDefault: user.addresses.length === 0 };
    const updatedUser = {
      ...user,
      addresses: [...user.addresses, newAddress],
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in users list
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], addresses: updatedUser.addresses };
      saveUsers(users);
    }
  }, [user]);

  const updateAddress = useCallback((id: string, address: Address) => {
    if (!user) return;

    const updatedAddresses = user.addresses.map(a =>
      a.id === id ? { ...address, id } : a
    );
    const updatedUser = { ...user, addresses: updatedAddresses };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in users list
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], addresses: updatedAddresses };
      saveUsers(users);
    }
  }, [user]);

  const deleteAddress = useCallback((id: string) => {
    if (!user) return;

    const filteredAddresses = user.addresses.filter(a => a.id !== id);
    // If deleted address was default, set first remaining address as default
    const needsNewDefault = user.addresses.find(a => a.id === id)?.isDefault;
    if (needsNewDefault && filteredAddresses.length > 0) {
      filteredAddresses[0].isDefault = true;
    }

    const updatedUser = { ...user, addresses: filteredAddresses };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in users list
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], addresses: filteredAddresses };
      saveUsers(users);
    }
  }, [user]);

  const setDefaultAddress = useCallback((id: string) => {
    if (!user) return;

    const updatedAddresses = user.addresses.map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    const updatedUser = { ...user, addresses: updatedAddresses };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in users list
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = { ...users[index], addresses: updatedAddresses };
      saveUsers(users);
    }
  }, [user]);

  const getDefaultAddress = useCallback((): Address | undefined => {
    if (!user) return undefined;
    return user.addresses.find(a => a.isDefault) || user.addresses[0];
  }, [user]);

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
    accountExists,
    checkEmailExists,
    checkPhoneExists,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
