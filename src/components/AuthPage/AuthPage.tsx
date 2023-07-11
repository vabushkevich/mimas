import React from "react";
import { useAuth, useAuthPageParams } from "@services/auth";
import { Redirect } from "react-router-dom";

export function AuthPage() {
  const { authorize } = useAuth();
  const { code, redirectTo = "/" } = useAuthPageParams();

  if (!code) throw new Error("Authorization code is not received");
  authorize(code);

  return <Redirect to={redirectTo} />;
}
