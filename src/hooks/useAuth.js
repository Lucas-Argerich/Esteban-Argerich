import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user, loading, login, logout } = context;

  return {
    user,
    loading,
    signIn: login,
    signOut: logout,
    login,
    logout,
    isAdmin: !!user,
  };
}
