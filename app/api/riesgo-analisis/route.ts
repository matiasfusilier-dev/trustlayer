import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://llrdjgcswlllxvwemalp.supabase.co',
  'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'
);

export async function POST(req: NextRequest) {
  try {
    const { orgId, orgData, documentos, apoderados, kycResultado } = await req.json();
    console.log('1. orgId:', orgId);

    const prompt = `Sos un analista de riesgo crediticio senior de un banco argentino. 
Generá un análisis de riesgo crediticio completo basado en los datos de la empresa.

EMPRESA: ${orgData.name} | CUIT: ${orgData.cuit} | Tipo: ${orgData.type || 'No especificado'} | Sector: ${orgData.sector || 'No especificado'} | Tamaño: ${orgData.size || 'No especificado'}
DOCUMENTOS: ${documentos.length} cargados
APODERADOS: ${apoderados.length} registrados
KYC: ${kycResultado || 'No evaluado'}

Respondé ÚNICAMENTE con JSON válido:
{
  "score": 70,
  "nivel_riesgo": "Riesgo Medio",
  "recomendacion": "Aprobar con condiciones",
  "limite_sugerido": "$3.000.000",
  "plazo_sugerido": "18 meses",
  "tasa_sugerida": "TNA 50%",
  "garantia_requerida": "Garantía real",
  "dictamen": "texto del dictamen",
  "factores_positivos": ["factor 1"],
  "factores_negativos": ["factor 1"],
  "ratios": [{"grupo": "Liquidez", "label": "Liquidez corriente", "valor": "1.5x", "referencia": "> 1.5x", "estado": "ok"}],
  "factores_cualitativos": [{"label": "Antigüedad", "valor": "5 años", "detalle": "detalle", "estado": "ok"}]
}`;

    console.log('2. Llamando a Anthropic...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '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',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    console.log('3. Status:', response.status);
    const data = await response.json();
    console.log('4. Respuesta completa:', JSON.stringify(data));

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const texto = data.content[0].text;
    const jsonMatch = texto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No se pudo parsear el análisis');

    const analisis = JSON.parse(jsonMatch[0]);
    console.log('5. Score:', analisis.score);

    await supabase.from('credit_analysis').upsert({
      organization_id: orgId,
      tipo: 'riesgo',
      score: analisis.score,
      risk_level: analisis.nivel_riesgo,
      ai_dictamen: analisis.dictamen,
      ratios: analisis.ratios,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'organization_id' });

    return NextResponse.json({ analisis });

  } catch (error: any) {
    console.error('Error detallado:', error.message, error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}