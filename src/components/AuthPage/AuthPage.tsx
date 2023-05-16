import React from "react";
import { useAuth, useRedirectURLParams } from "@services/auth";
import { Redirect } from "react-router-dom";

export function AuthPage() {
  const { authorize } = useAuth();
  const { code, redirectTo = "/" } = useRedirectURLParams();

  if (!code) throw new Error("Authorization code is not received");

  authorize(code);

  return <Redirect to={redirectTo} />;
}
