import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    // Modo desarrollo: loguear en consola
    console.log(`\n[Shoppr Email - dev mode]`);
    console.log(`  → Para: ${to}`);
    console.log(`  → Asunto: ${subject}`);
    console.log(`  → Cuerpo: ${html.replace(/<[^>]+>/g, "").trim().slice(0, 120)}...\n`);
    return { success: true, dev: true };
  }

  try {
    const result = await resend.emails.send({
      from: "Shoppr <noreply@shoppr.bo>",
      to,
      subject,
      html,
    });
    return { success: true, id: result.data?.id };
  } catch (err) {
    console.error("[Shoppr Email] Error al enviar:", err);
    return { success: false };
  }
}

// ─── Templates ────────────────────────────────────────────────

export function emailNewOffer(orderTitle: string, travelerName: string) {
  return {
    subject: `Nueva oferta en tu pedido: ${orderTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <div style="background:#16a34a;padding:16px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Shoppr</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
          <h2 style="color:#111827;margin-top:0">¡Tenés una nueva oferta!</h2>
          <p style="color:#6b7280"><strong>${travelerName}</strong> hizo una oferta en tu pedido:</p>
          <div style="background:#fff;border:1px solid #d1fae5;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0;font-weight:600;color:#111827">${orderTitle}</p>
          </div>
          <p style="color:#6b7280">Ingresá a Shoppr para revisar la oferta y decidir si la aceptás.</p>
          <a href="${process.env.NEXTAUTH_URL ?? "https://shoppr.bo"}/dashboard/buyer/my-orders"
             style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
            Ver mis pedidos →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px">Shoppr · El marketplace boliviano de compras internacionales</p>
      </div>`,
  };
}

export function emailOfferAccepted(
  orderTitle: string,
  buyerName: string,
  buyerEmail: string
) {
  return {
    subject: `¡Tu oferta fue aceptada! — ${orderTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <div style="background:#16a34a;padding:16px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Shoppr</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
          <h2 style="color:#111827;margin-top:0">🎉 ¡Tu oferta fue aceptada!</h2>
          <p style="color:#6b7280">Tu oferta para el pedido <strong>${orderTitle}</strong> fue aceptada.</p>
          <div style="background:#d1fae5;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0;font-weight:600;color:#065f46">Coordiná la entrega con el comprador:</p>
            <p style="margin:8px 0 0;color:#047857">Nombre: ${buyerName}</p>
            <p style="margin:4px 0 0;color:#047857">Email: <a href="mailto:${buyerEmail}" style="color:#047857">${buyerEmail}</a></p>
          </div>
          <a href="${process.env.NEXTAUTH_URL ?? "https://shoppr.bo"}/dashboard/traveler/my-offers"
             style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
            Ver mis ofertas →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px">Shoppr · El marketplace boliviano de compras internacionales</p>
      </div>`,
  };
}

export function emailTransferConfirmed(orderTitle: string, role: "buyer" | "traveler") {
  const message =
    role === "buyer"
      ? "Tu pago fue confirmado. El viajero ya puede coordinar la entrega."
      : "El pago del comprador fue confirmado. Ya podés coordinar la entrega.";

  return {
    subject: `Pago confirmado — ${orderTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <div style="background:#16a34a;padding:16px 24px;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:20px">Shoppr</h1>
        </div>
        <div style="background:#f9fafb;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb">
          <h2 style="color:#111827;margin-top:0">✅ Pago confirmado</h2>
          <p style="color:#6b7280">${message}</p>
          <div style="background:#d1fae5;border-radius:8px;padding:16px;margin:16px 0">
            <p style="margin:0;font-weight:600;color:#065f46">Pedido: ${orderTitle}</p>
          </div>
          <a href="${process.env.NEXTAUTH_URL ?? "https://shoppr.bo"}/dashboard"
             style="display:inline-block;background:#16a34a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
            Ir al panel →
          </a>
        </div>
        <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:16px">Shoppr · El marketplace boliviano de compras internacionales</p>
      </div>`,
  };
}
