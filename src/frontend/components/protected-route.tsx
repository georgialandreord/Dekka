"use client";

import { Navigate } from "react-router";
import { useActiveSubscription } from "~/hooks/use-active-subscription";
import { authClient } from "~/server/better-auth/client";
import Subscribe from "./subsrcibe";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ADMIN_ID = "EYsRH8hFWpvZjJhWQmbK4esHNul76F41"

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = authClient.useSession();
  const { isActiveSubscription, subscription, isLoading, data } =
  useActiveSubscription();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600">checking subscription...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/auth/login" replace />;
  }

  if(!isActiveSubscription && session.user.id !== ADMIN_ID) {
    return <Subscribe/>
  }

  return <>{children}</>;
}
