import { signIn, signOut, useSession } from "next-auth/react";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useGlobalStore } from "../stores/GlobalStore";

// Add this type definition
interface AuthUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roleId: string;
  mRoleId: string;
  isActive: boolean;
  userType?: string;
}

export const useAuth = () => {
  const { data, status } = useSession();
  const { navigateToLogin } = useNavigation();
  const { reset } = useGlobalStore();

  const login = async (username: string, password: string) =>
    signIn("credentials", {
      username,
      password,
      redirect: false,
    });

  const logout = async () => {
    await signOut({ redirect: false });
    localStorage.clear();
    navigateToLogin();
    reset();
  };

  // Cast the user to the AuthUser type
  return {
    login,
    logout,
    user: data?.user as AuthUser | undefined,
    status,
  };
};
