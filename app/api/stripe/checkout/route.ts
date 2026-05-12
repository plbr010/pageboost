import { NextResponse } from "next/server";
import { appBaseUrl, getStripe } from "@/lib/stripe-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const stripe = getStripe();
  const monthly = process.env.STRIPE_PRICE_MONTHLY?.trim();
  const setup = process.env.STRIPE_PRICE_SETUP?.trim();
  const base = appBaseUrl();

  if (!stripe || !monthly) {
    return NextResponse.json(
      { error: "Pagamento não configurado. Tente mais tarde." },
      { status: 503 },
    );
  }

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

  if (withSetup && !setup) {
    return NextResponse.json(
      { error: "Ativação assistida não configurada no servidor." },
      { status: 503 },
    );
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
      return NextResponse.json({ error: "Sessão sem URL." }, { status: 500 });
    }
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[stripe checkout]", e);
    return NextResponse.json(
      { error: "Não foi possível iniciar o pagamento." },
      { status: 500 },
    );
  }
}
