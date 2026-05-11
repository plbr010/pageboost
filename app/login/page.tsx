import LoginClient from "./login-client";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const next = typeof sp.next === "string" && sp.next.startsWith("/") ? sp.next : "/dashboard";
  const error = typeof sp.error === "string" ? sp.error : undefined;
  return <LoginClient next={next} error={error} />;
}
