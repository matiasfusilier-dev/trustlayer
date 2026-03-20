import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://llrdjgcswlllxvwemalp.supabase.co",
  "sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL"
);

export async function POST(req: NextRequest) {
  try {
    const { prompt, orgId } = await req.json();
    console.log("1. Recibido orgId:", orgId);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "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",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    console.log("2. Status Anthropic:", response.status);
    const data = await response.json();
    console.log("3. Respuesta Anthropic:", JSON.stringify(data).slice(0, 200));

    if (data.error) {
      console.log("Error Anthropic:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const texto = data.content[0].text;
    console.log("4. Texto recibido:", texto.slice(0, 200));

    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No se pudo parsear el dictamen");

    const dictamen = JSON.parse(jsonMatch[0]);
    console.log("5. Dictamen parseado:", dictamen.resultado);

    await supabase.from("credit_analysis").upsert({
      organization_id: orgId,
      tipo: "kyc",
      kyc_score: dictamen.score,
      kyc_dictamen: JSON.stringify(dictamen),
      kyc_observaciones: dictamen.observaciones,
      score: dictamen.score,
      risk_level: dictamen.resultado,
      ai_dictamen: dictamen.resumen,
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id" });

    console.log("6. Guardado en Supabase OK");
    return NextResponse.json({ dictamen });

  } catch (error: any) {
    console.error("Error KYC detallado:", error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
