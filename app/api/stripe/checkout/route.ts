import { NextResponse } from "next/server";
import { appBaseUrl, getStripe } from "@/lib/stripe-server";

export const runtime = "nodejs";

const USER_ERR =
  "Não foi possível abrir o pagamento. Verifique as configurações da Stripe ou tente novamente.";

function criticalMissingEnv(withSetup: boolean): string[] {
  const out: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY?.trim()) out.push("STRIPE_SECRET_KEY");
  if (!process.env.STRIPE_PRICE_MONTHLY?.trim()) out.push("STRIPE_PRICE_MONTHLY");
  if (withSetup && !process.env.STRIPE_PRICE_SETUP?.trim()) out.push("STRIPE_PRICE_SETUP");
  if (!process.env.NEXT_PUBLIC_APP_URL?.trim()) out.push("NEXT_PUBLIC_APP_URL");
  return out;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const withSetup =
    typeof body === "object" &&
    body !== null &&
    "withSetup" in body &&
    (body as { withSetup?: unknown }).withSetup === true;

  const stripe = getStripe();
  const monthly = process.env.STRIPE_PRICE_MONTHLY?.trim();
  const setup = process.env.STRIPE_PRICE_SETUP?.trim();
  const base = appBaseUrl();

  const missingEnv = criticalMissingEnv(withSetup);
  const ready =
    stripe &&
    monthly &&
    (!withSetup || !!setup) &&
    !!process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!ready) {
    console.error(
      "[stripe/checkout] Configuração incompleta. Defina na Vercel:",
      missingEnv.join(", "),
    );

    return NextResponse.json({ error: USER_ERR, missingEnv }, { status: 503 });
  }

  const lineItems: { price: string; quantity: number }[] = [{ price: monthly, quantity: 1 }];
  if (withSetup && setup) {
    lineItems.push({ price: setup, quantity: 1 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      success_url: `${base}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/founder?cancelled=1`,
      metadata: {
        plan: "founder",
        withSetup: withSetup ? "true" : "false",
      },
      subscription_data: {
        metadata: {
          plan: "founder",
          withSetup: withSetup ? "true" : "false",
        },
      },
      allow_promotion_codes: true,
    });

    const url = session.url;
    if (!url) {
      console.error("[stripe/checkout] Sessão criada sem URL.");
      return NextResponse.json({ error: USER_ERR }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[stripe/checkout]", e);
    return NextResponse.json({ error: USER_ERR }, { status: 500 });
  }
}
