import type { APIRoute } from "astro";
import { Resend } from "resend";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    const { nombre, email, mensaje, telefono, captchaToken  } = data;

    const verifyCaptcha = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${import.meta.env.RECAPTCHA_SECRET}&response=${captchaToken}`,
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
      from: "Contacto <onboarding@resend.dev>",
      to: "sergiotovar9430@gmail.com",
      subject: "Nuevo lead desde la web 🚀",
      html: `
        <h2>Nuevo contacto</h2>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${telefono}</p>
        <p><b>Mensaje:</b> ${mensaje}</p>
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