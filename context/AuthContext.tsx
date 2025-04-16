import React, { createContext, useContext, useState, ReactNode } from 'react';

const AuthContext = createContext<{
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
} | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Quản lý trạng thái đăng nhập

  const login = () => setIsLoggedIn(true);  // Đặt trạng thái là đã đăng nhập
  const logout = () => setIsLoggedIn(false);  // Đặt trạng thái là chưa đăng nhập

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
