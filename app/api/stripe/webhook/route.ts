import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe-server";

export const runtime = "nodejs";

async function upsertSubscriptionRow(input: {
  email: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string;
  with_setup: boolean;
  setup_paid: boolean;
  current_period_end: string | null;
}) {
  const admin = createServiceRoleClient();
  if (!admin) {
    console.error("[stripe webhook] SUPABASE_SERVICE_ROLE_KEY ausente");
    return;
  }
  if (!input.stripe_subscription_id) {
    console.warn("[stripe webhook] sem stripe_subscription_id, ignorando upsert");
    return;
  }

  const now = new Date().toISOString();
  const { error } = await admin.from("subscriptions").upsert(
    {
      email: input.email,
      stripe_customer_id: input.stripe_customer_id,
      stripe_subscription_id: input.stripe_subscription_id,
      status: input.status,
      plan: "founder",
      with_setup: input.with_setup,
      setup_paid: input.setup_paid,
      current_period_end: input.current_period_end,
      updated_at: now,
    },
    { onConflict: "stripe_subscription_id" },
  );
  if (error) console.error("[stripe webhook] upsert subscriptions", error);
}

async function handleCheckoutCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  const subId = typeof session.subscription === "string" ? session.subscription : null;
  const custId = typeof session.customer === "string" ? session.customer : null;
  const email =
    session.customer_details?.email?.trim() ||
    (typeof session.customer_email === "string" ? session.customer_email.trim() : null) ||
    null;
  const meta = session.metadata ?? {};
  const withSetup = meta.withSetup === "true";

  let status = "complete";
  let currentPeriodEnd: string | null = null;
  if (subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId);
      status = sub.status;
      currentPeriodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;
    } catch (e) {
      console.error("[stripe webhook] retrieve subscription", e);
    }
  }

  await upsertSubscriptionRow({
    email,
    stripe_customer_id: custId,
    stripe_subscription_id: subId,
    status,
    with_setup: withSetup,
    setup_paid: withSetup,
    current_period_end: currentPeriodEnd,
  });
}

async function handleSubscriptionObject(stripe: Stripe, sub: Stripe.Subscription) {
  const meta = sub.metadata ?? {};
  const withSetup = meta.withSetup === "true";
  const custId = typeof sub.customer === "string" ? sub.customer : null;
  let email: string | null = null;
  if (custId) {
    try {
      const c = await stripe.customers.retrieve(custId);
      if (!("deleted" in c && c.deleted) && c.email) email = c.email.trim();
    } catch {
      /* ignore */
    }
  }

  await upsertSubscriptionRow({
    email,
    stripe_customer_id: custId,
    stripe_subscription_id: sub.id,
    status: sub.status,
    with_setup: withSetup,
    setup_paid: withSetup,
    current_period_end: sub.current_period_end
      ? new Date(sub.current_period_end * 1000).toISOString()
      : null,
  });
}

async function handleInvoice(
  stripe: Stripe,
  invoice: Stripe.Invoice,
  paymentOk: boolean,
) {
  const subId = typeof invoice.subscription === "string" ? invoice.subscription : null;
  if (!subId) return;
  try {
    const sub = await stripe.subscriptions.retrieve(subId);
    const meta = sub.metadata ?? {};
    const withSetup = meta.withSetup === "true";
    const custId = typeof sub.customer === "string" ? sub.customer : null;
    let email: string | null = null;
    if (custId) {
      try {
        const c = await stripe.customers.retrieve(custId);
        if (!("deleted" in c && c.deleted) && c.email) email = c.email.trim();
      } catch {
        /* ignore */
      }
    }
    let status = sub.status;
    if (!paymentOk) status = "past_due";
    await upsertSubscriptionRow({
      email,
      stripe_customer_id: custId,
      stripe_subscription_id: sub.id,
      status,
      with_setup: withSetup,
      setup_paid: withSetup,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
    });
  } catch (e) {
    console.error("[stripe webhook] invoice handler", e);
  }
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[stripe webhook] assinatura", e);
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription") {
          await handleCheckoutCompleted(stripe, session);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionObject(stripe, sub);
        break;
      }
      case "invoice.payment_succeeded": {
        const inv = event.data.object as Stripe.Invoice;
        await handleInvoice(stripe, inv, true);
        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        await handleInvoice(stripe, inv, false);
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("[stripe webhook] handler", e);
    return NextResponse.json({ error: "Erro ao processar." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
