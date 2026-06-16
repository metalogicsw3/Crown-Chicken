// hooks/useAuth.js
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { loginUser, logoutUser, signupUser, googleLogin } from '@/lib/firebase/auth';

export function useAuth() {
  const { user, loading } = useAuthContext();

  return {
    user,          // null = not logged in
    loading,
    isLoggedIn: !!user,
    loginUser,
    signupUser,
    logoutUser,
    googleLogin,
  };
}