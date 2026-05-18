import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { nombre, email, mensaje, telefono, captchaToken  } = data;

    if (!captchaToken) {
      return new Response(
        JSON.stringify({ ok: false, error: "missing_captcha" }),
        { status: 400 }
      );
    }

    const verifyCaptcha = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: import.meta.env.RECAPTCHA_SECRET,
          response: captchaToken,
        })
      }
    );

    const captchaResult = await verifyCaptcha.json();

    if (!captchaResult.success) {
      return new Response(
        JSON.stringify({ ok: false, error: "captcha_failed" }),
        { status: 400 }
      );
    }

    await resend.emails.send({
  from: "Aurora Web <onboarding@resend.dev>",
  to: "sergiotovar9430@gmail.com",
  subject: "Nuevo lead desde la web",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f4f7fb; padding:40px;">
      <div style="
        max-width:600px;
        margin:auto;
        background:white;
        border-radius:16px;
        overflow:hidden;
        box-shadow:0 4px 20px rgba(0,0,0,0.08);
      ">
        
        <!-- Header -->
        <div style="
          background:linear-gradient(135deg, #0f172a, #1e293b);
          padding:30px;
          text-align:center;
        ">
          <h1 style="
            color:white;
            margin:0;
            font-size:28px;
          ">
            Nuevo Lead 
          </h1>
          <p style="
            color:#cbd5e1;
            margin-top:8px;
            font-size:14px;
          ">
            Aurora Web Studio
          </p>
        </div>

        <!-- Content -->
        <div style="padding:32px; color:#1e293b;">
          
          <div style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            padding:20px;
            margin-bottom:16px;
          ">
            <p style="margin:0 0 8px;"><b>Nombre</b></p>
            <p style="margin:0; color:#475569;">${nombre}</p>
          </div>

          <div style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            padding:20px;
            margin-bottom:16px;
          ">
            <p style="margin:0 0 8px;"><b>Email</b></p>
            <p style="margin:0; color:#475569;">${email}</p>
          </div>

          <div style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            padding:20px;
            margin-bottom:16px;
          ">
            <p style="margin:0 0 8px;"><b>Teléfono</b></p>
            <p style="margin:0; color:#475569;">${telefono}</p>
          </div>

          <div style="
            background:#f8fafc;
            border:1px solid #e2e8f0;
            border-radius:12px;
            padding:20px;
          ">
            <p style="margin:0 0 8px;"><b>Mensaje</b></p>
            <p style="
              margin:0;
              color:#475569;
              line-height:1.6;
              white-space:pre-line;
            ">
              ${mensaje}
            </p>
          </div>

        </div>

        <!-- Footer -->
        <div style="
          padding:20px;
          text-align:center;
          font-size:12px;
          color:#94a3b8;
          border-top:1px solid #e2e8f0;
        ">
          Este mensaje fue enviado desde el formulario de contacto de Aurora.
        </div>

      </div>
    </div>
  `,
});

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false }),
      { status: 500 }
    );
  }
}