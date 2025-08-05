import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/Redux/Store/store"; // Import your AppDispatch type
import {
  selectUser,
  selectAccessToken,
  selectIsAuthenticated,
  selectCheckAuthState,
  checkAuth, // ✅ This is your checkAuth thunk
} from "@/Redux/UserServices/Slices/auth.slice";
import Loader from "@/components/Layouts/Loader";

// ====================== AUTH CHECK COMPONENT ====================== //
interface AuthCheckProps {
  children: React.ReactNode;
}

export const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
  const navigate = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const checkAuthState = useSelector(selectCheckAuthState);

  // First, check authentication on component mount
  useEffect(() => {
    // Only call checkAuth if we don't already have user data
    if (!user && !checkAuthState?.loading) {
      dispatch(checkAuth());
    }
  }, [dispatch, user, checkAuthState?.loading]);

  // Handle redirect based on auth status
  useEffect(() => {
    // Don't redirect while auth check is loading
    if (checkAuthState?.loading) {
      return;
    }

    // Check if user is authenticated
    const isUserAuthenticated = user && accessToken && isAuthenticated;

    if (isUserAuthenticated) {
      // User is authenticated, redirect to /user/?tab=chats
      navigate.replace("/user/?tab=chats");
    } else {
      // User is not authenticated, redirect to login
      navigate.replace("/login");
    }
  }, [user, accessToken, isAuthenticated, checkAuthState?.loading, navigate]);

  // Show loading while checking auth
  if (checkAuthState?.loading) {
    return <Loader />;
  }

  // Return children (will redirect before rendering if needed)
  return <>{children}</>;
};
