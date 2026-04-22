import { NextResponse } from "next/server"

interface ContactBody {
  name: string
  email: string
  phone: string
  message?: string
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY
  const emailTo = process.env.EMAIL_TO

  if (!apiKey) {
    return NextResponse.json({ error: "Falta la API key de Resend" }, { status: 500 })
  }
  if (!emailTo) {
    return NextResponse.json({ error: "Falta EMAIL_TO" }, { status: 500 })
  }

  let body: ContactBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 })
  }

  const { name, email, phone, message } = body

  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
  }

  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: #1a1a1a; padding: 32px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
          AMBROSONI — Nueva Consulta
        </h1>
      </div>

      <div style="padding: 32px;">
        <p style="color: #64748b; font-size: 14px; margin: 0 0 24px;">
          Se recibió una nueva consulta desde la web:
        </p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px; width: 140px;">Nombre</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 500;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Teléfono</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 500;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 13px;">Email</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 500;">
              <a href="mailto:${escapeHtml(email)}" style="color: #1a1a1a;">${escapeHtml(email)}</a>
            </td>
          </tr>
          ${
            message?.trim()
              ? `
          <tr>
            <td style="padding: 12px 16px; color: #64748b; font-size: 13px; vertical-align: top;">Mensaje</td>
            <td style="padding: 12px 16px; color: #1e293b; font-size: 14px; line-height: 1.6;">${escapeHtml(message).replace(/\n/g, "<br>")}</td>
          </tr>
          `
              : ""
          }
        </table>
      </div>

      <div style="background: #f8fafc; padding: 20px 32px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          Email enviado automáticamente desde el sitio de AMBROSONI
        </p>
      </div>
    </div>
  `

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "AMBROSONI Web <onboarding@resend.dev>",
        to: [emailTo],
        subject: `Nueva consulta — ${name}`,
        html: htmlContent,
        reply_to: email,
      }),
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error("Resend error:", res.status, errorBody)
      return NextResponse.json({ error: "Error al enviar el email" }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error sending email:", err)
    return NextResponse.json({ error: "Error de conexión al enviar email" }, { status: 500 })
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
