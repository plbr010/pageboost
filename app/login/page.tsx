import { Suspense } from "react";
import LoginClient from "./login-client";

function Fallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-100 text-sm text-slate-500">
      Carregando…
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <LoginClient />
    </Suspense>
  );
}
