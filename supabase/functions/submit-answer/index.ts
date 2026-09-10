import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const QUESTIONS = new Set([
  "undersea-dream",
  "underwater-beauty",
  "shark-question",
  "orca-moment",
  "understood",
  "dream-dive",
  "little-happiness",
]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "POST required" }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const body = await req.json();

    const question_id = String(body.question_id ?? "");
    const question_text = String(body.question_text ?? "").trim();
    const answer = String(body.answer ?? "").trim();
    const page = String(body.page ?? "").slice(0, 300);

    // -----------------------------
    // Validate question
    // -----------------------------
    if (!QUESTIONS.has(question_id)) {
      return new Response(
        JSON.stringify({ error: "Unknown question." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // Validate answer
    // -----------------------------
    if (!question_text || !answer || answer.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Invalid answer." }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // Supabase configuration
    // -----------------------------
    const supabaseUrl = Deno.env.get("SUPABASE_URL");

    const serviceKey =
      Deno.env.get("SUPABASE_SECRET_KEY") ??
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceKey) {
      console.error("Supabase server credentials are missing.");

      return new Response(
        JSON.stringify({
          error: "Server configuration error.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    // -----------------------------
    // Resend configuration
    // -----------------------------
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const ownerEmail = Deno.env.get("OWNER_EMAIL");

    const fromEmail =
      Deno.env.get("FROM_EMAIL") ??
      "Chouchou Birthday <onboarding@resend.dev>";

    console.log("Email configuration:", {
      resendConfigured: Boolean(resendKey),
      ownerConfigured: Boolean(ownerEmail),
      fromEmail,
    });

    const admin = createClient(supabaseUrl, serviceKey);

    // -----------------------------
    // Save answer to Supabase
    // -----------------------------
    const { data, error } = await admin
      .from("answers")
      .insert({
        question_id,
        question_text,
        answer,
        page,
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Database error:", error);

      throw error;
    }

    // -----------------------------
    // Send email notification
    // -----------------------------
    let emailSent = false;
    let emailError = null;

    if (!resendKey) {
      emailError = "RESEND_API_KEY is not configured.";
      console.error(emailError);
    } else if (!ownerEmail) {
      emailError = "OWNER_EMAIL is not configured.";
      console.error(emailError);
    } else {
      const safe = (s: string) =>
        s.replace(/[&<>"]/g, (c) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
        }[c] ?? c));

      try {
        const emailRes = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${resendKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: fromEmail,
              to: [ownerEmail],
              subject: `🌊 New answer from Chouchou — ${question_id}`,
              html: `
                <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
                  <h2>🌊 Another bottle reached the shore ♡</h2>

                  <p>
                    <strong>Question:</strong>
                  </p>

                  <p>
                    ${safe(question_text)}
                  </p>

                  <p>
                    <strong>Answer:</strong>
                  </p>

                  <div style="
                    background:#f4f8fb;
                    padding:16px;
                    border-radius:10px;
                    white-space:pre-wrap;
                  ">
                    ${safe(answer)}
                  </div>

                  <p style="color:#777;font-size:12px;margin-top:20px;">
                    Saved at ${new Date().toISOString()}
                  </p>

                  <p style="color:#777;font-size:12px;">
                    Page: ${safe(page)}
                  </p>
                </div>
              `,
            }),
          }
        );

        const resendData = await emailRes.json().catch(() => ({}));

        if (!emailRes.ok) {
          emailError =
            resendData?.message ||
            resendData?.error ||
            `Resend returned HTTP ${emailRes.status}`;

          console.error("Resend error:", {
            status: emailRes.status,
            response: resendData,
          });
        } else {
          emailSent = true;

          console.log("Email sent successfully:", resendData);
        }
      } catch (err) {
        emailError =
          err instanceof Error ? err.message : String(err);

        console.error("Email request failed:", err);
      }
    }

    // -----------------------------
    // Return result
    // -----------------------------
    return new Response(
      JSON.stringify({
        ok: true,
        answer_id: data.id,
        email_sent: emailSent,
        email_error: emailError,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Function error:", error);

    return new Response(
      JSON.stringify({
        error: "Could not save this answer.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});