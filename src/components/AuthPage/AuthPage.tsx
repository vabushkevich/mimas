import React from "react";
import { useAuth, useRedirectURLParams } from "@services/auth";
import { Redirect } from "react-router-dom";

export function AuthPage() {
  const { authorize } = useAuth();
  const { code, redirectTo } = useRedirectURLParams();

  authorize(code);

  return <Redirect to={redirectTo} />;
}
