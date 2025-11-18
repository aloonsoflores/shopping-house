import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { email, code } = await req.json();
    console.log("📩 Petición recibida:", { email, code });

    if (!email || !code) {
      console.error("❌ Faltan parámetros");
      return new Response(JSON.stringify({ error: "Faltan parámetros: email o code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("❌ Falta RESEND_API_KEY en el entorno");
      return new Response(JSON.stringify({ error: "Falta RESEND_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("✅ RESEND_API_KEY detectada, enviando correo...");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Soporte ShoppingHouse <onboarding@resend.dev>",
        to: [email],
        subject: "Código para restablecer tu contraseña",
        html: `
          <div style="font-family: Arial, sans-serif; color: #222; padding: 16px;">
            <h2 style="color: #0a84ff;">Recuperar contraseña</h2>
            <p>Tu código de verificación es:</p>
            <h1 style="font-size: 28px; letter-spacing: 4px; color: #0a84ff;">${code}</h1>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error de Resend:", errorText);
      return new Response(
        JSON.stringify({ error: "Error al enviar correo", details: errorText }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Correo enviado correctamente");
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("💥 Error interno:", message);
    return new Response(
      JSON.stringify({ error: "Error interno", details: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
