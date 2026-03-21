'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = 'score' | 'ratios' | 'historial' | 'cualitativo';

const tabs: { key: Tab; label: string }[] = [
  { key: 'score', label: '🎯 Score & Dictamen' },
  { key: 'ratios', label: '📊 Ratios Financieros' },
  { key: 'historial', label: '🏦 Historial Crediticio' },
  { key: 'cualitativo', label: '🔍 Factores Cualitativos' },
];

const scoreColor = (score: number) => {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  if (score >= 25) return '#ef4444';
  return '#7f1d1d';
};

const scoreRecomendacion = (rec: string) => {
  if (rec === 'Aprobar') return { label: 'Aprobar', color: '#22c55e', bg: '#22c55e15', border: '#22c55e40' };
  if (rec === 'Aprobar con condiciones') return { label: 'Aprobar con condiciones', color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40' };
  return { label: 'Rechazar', color: '#ef4444', bg: '#ef444415', border: '#ef444440' };
};

const estadoRatioConfig = {
  ok: { color: '#22c55e', bg: '#22c55e20', label: '✓ OK' },
  alerta: { color: '#f59e0b', bg: '#f59e0b20', label: '⚠ Atención' },
  malo: { color: '#ef4444', bg: '#ef444420', label: '✗ Fuera de rango' },
};

const situacionBCRAConfig: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Normal', color: '#22c55e', bg: '#22c55e20' },
  2: { label: 'Riesgo bajo', color: '#84cc16', bg: '#84cc1620' },
  3: { label: 'Riesgo medio', color: '#f59e0b', bg: '#f59e0b20' },
  4: { label: 'Riesgo alto', color: '#f97316', bg: '#f9731620' },
  5: { label: 'Irrecuperable', color: '#ef4444', bg: '#ef444420' },
  6: { label: 'Irrecup. técnico', color: '#7f1d1d', bg: '#7f1d1d20' },
};

interface Analisis {
  score: number;
  nivel_riesgo: string;
  recomendacion: string;
  limite_sugerido: string;
  plazo_sugerido: string;
  tasa_sugerida: string;
  garantia_requerida: string;
  dictamen: string;
  factores_positivos: string[];
  factores_negativos: string[];
  ratios: { grupo: string; label: string; valor: string; referencia: string; estado: string }[];
  factores_cualitativos: { label: string; valor: string; detalle: string; estado: string }[];
}

export default function RiesgoCrediticioPage({ params }: { params: { orgId: string } }) {
  const [tab, setTab] = useState<Tab>('score');
  const [analisis, setAnalisis] = useState<Analisis | null>(null);
  const [generando, setGenerando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ultimoAnalisis, setUltimoAnalisis] = useState<string | null>(null);
  const [org, setOrg] = useState<any>(null);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [apoderados, setApoderados] = useState<any[]>([]);
  const [kycResultado, setKycResultado] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [params.orgId]);

  const cargarDatos = async () => {
    setLoading(true);
    const [{ data: orgData }, { data: docsData }, { data: apodData }, { data: analisisData }, { data: kycData }] = await Promise.all([
      supabase.from('organizations').select('*').eq('id', params.orgId).single(),
      supabase.from('documents').select('*').eq('organization_id', params.orgId),
      supabase.from('apoderados').select('*').eq('org_id', params.orgId),
      supabase.from('credit_analysis').select('*').eq('organization_id', params.orgId).eq('tipo', 'riesgo').order('created_at', { ascending: false }).limit(1),
      supabase.from('credit_analysis').select('*').eq('organization_id', params.orgId).eq('tipo', 'kyc').order('created_at', { ascending: false }).limit(1),
    ]);

    if (orgData) setOrg(orgData);
    if (docsData) setDocumentos(docsData);
    if (apodData) setApoderados(apodData);
    if (kycData && kycData.length > 0) setKycResultado(kycData[0].risk_level);

    if (analisisData && analisisData.length > 0) {
      const ultimo = analisisData[0];
      if (ultimo.ai_dictamen && ultimo.ratios) {
        setAnalisis({
          score: ultimo.score,
          nivel_riesgo: ultimo.risk_level,
          recomendacion: ultimo.score >= 75 ? 'Aprobar' : ultimo.score >= 50 ? 'Aprobar con condiciones' : 'Rechazar',
          limite_sugerido: '—',
          plazo_sugerido: '—',
          tasa_sugerida: '—',
          garantia_requerida: '—',
          dictamen: ultimo.ai_dictamen,
          factores_positivos: [],
          factores_negativos: [],
          ratios: ultimo.ratios || [],
          factores_cualitativos: [],
        });
        setUltimoAnalisis(ultimo.created_at);
      }
    }
    setLoading(false);
  };

  const handleGenerarAnalisis = async () => {
    if (!org) return;
    setGenerando(true);
    setAnalisis(null);

    try {
      const response = await fetch('/api/riesgo-analisis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId: params.orgId, orgData: org, documentos, apoderados, kycResultado }),
      });

      const data = await response.json();
      if (data.analisis) {
        setAnalisis(data.analisis);
        setUltimoAnalisis(new Date().toISOString());
      }
    } catch (error) {
      console.error('Error generando análisis:', error);
    }

    setGenerando(false);
  };

  const card = (children: React.ReactNode) => (
    <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
      {children}
    </div>
  );

  if (loading) return <div style={{ padding: '32px', color: '#555', fontSize: '14px' }}>Cargando datos...</div>;

  const rec = analisis ? scoreRecomendacion(analisis.recomendacion) : null;
  const ratiosPorGrupo = analisis ? analisis.ratios.reduce((acc: any, r) => {
    if (!acc[r.grupo]) acc[r.grupo] = [];
    acc[r.grupo].push(r);
    return acc;
  }, {}) : {};

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>Riesgo Crediticio</h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>Análisis integral de riesgo crediticio generado con IA</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#111', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap',
            backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
            color: tab === t.key ? 'white' : '#555',
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Score & Dictamen */}
      {tab === 'score' && (
        <div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {[
              { label: 'Documentos cargados', value: documentos.length, color: documentos.length > 0 ? '#22c55e' : '#f59e0b' },
              { label: 'KYC', value: kycResultado || 'No evaluado', color: kycResultado === 'aprobado' ? '#22c55e' : '#f59e0b' },
              { label: 'Último análisis', value: ultimoAnalisis ? new Date(ultimoAnalisis).toLocaleDateString('es-AR') : 'Nunca', color: ultimoAnalisis ? '#6366f1' : '#555' },
            ].map(stat => (
              <div key={stat.label} style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '18px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Score visual */}
          {analisis && card(
            <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '140px', height: '140px', borderRadius: '50%',
                  background: `conic-gradient(${scoreColor(analisis.score)} ${analisis.score * 3.6}deg, #1f1f1f 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto',
                }}>
                  <div style={{
                    width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#111',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: scoreColor(analisis.score) }}>{analisis.score}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>/ 100</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: scoreColor(analisis.score) }}>{analisis.nivel_riesgo}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recomendación</div>
                  <div style={{
                    display: 'inline-block', padding: '8px 20px', borderRadius: '8px',
                    backgroundColor: rec!.bg, border: `1px solid ${rec!.border}`,
                    fontSize: '15px', fontWeight: '700', color: rec!.color,
                  }}>{rec!.label}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Límite sugerido', valor: analisis.limite_sugerido },
                    { label: 'Plazo sugerido', valor: analisis.plazo_sugerido },
                    { label: 'Tasa sugerida', valor: analisis.tasa_sugerida },
                    { label: 'Garantía requerida', valor: analisis.garantia_requerida },
                  ].map(({ label, valor }) => (
                    <div key={label}>
                      <div style={{ fontSize: '11px', color: '#555', marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#aaa' }}>{valor}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Botón generar */}
          {card(
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ color: '#555', fontSize: '13px', margin: '0 0 16px 0' }}>
                {analisis ? 'Regenerá el análisis con los datos actuales' : 'Generá un análisis completo de riesgo crediticio con IA'}
              </p>
              <button onClick={handleGenerarAnalisis} disabled={generando} style={{
                backgroundColor: generando ? '#333' : '#6366f1', color: 'white',
                border: 'none', borderRadius: '10px', padding: '12px 28px',
                fontSize: '14px', fontWeight: '600', cursor: generando ? 'not-allowed' : 'pointer',
              }}>
                {generando ? '⏳ Analizando con IA...' : '🤖 Generar análisis de riesgo'}
              </button>
            </div>
          )}

          {/* Dictamen */}
          {analisis && card(
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px' }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Dictamen IA</h3>
                <span style={{ fontSize: '11px', color: '#555', marginLeft: 'auto' }}>
                  {ultimoAnalisis ? new Date(ultimoAnalisis).toLocaleDateString('es-AR') : ''}
                </span>
              </div>
              <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.7', margin: '0 0 16px 0' }}>
                {analisis.dictamen}
              </p>
              {(analisis.factores_positivos.length > 0 || analisis.factores_negativos.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ backgroundColor: '#22c55e10', border: '1px solid #22c55e30', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e', marginBottom: '10px' }}>✓ Factores positivos</div>
                    {analisis.factores_positivos.map((f, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#aaa', padding: '4px 0', borderBottom: '1px solid #22c55e15' }}>· {f}</div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: '#f59e0b10', border: '1px solid #f59e0b30', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b', marginBottom: '10px' }}>⚠ Factores a monitorear</div>
                    {analisis.factores_negativos.map((f, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#aaa', padding: '4px 0', borderBottom: '1px solid #f59e0b15' }}>· {f}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB: Ratios Financieros */}
      {tab === 'ratios' && (
        <div>
          {!analisis ? (
            <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Generá el análisis primero desde la pestaña Score & Dictamen</p>
            </div>
          ) : Object.entries(ratiosPorGrupo).map(([grupo, ratios]: [string, any]) => (
            <div key={grupo} style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{grupo}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '8px 0', borderBottom: '1px solid #1a1a1a', fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>Indicador</span><span>Valor</span><span>Referencia</span><span>Estado</span>
              </div>
              {ratios.map((r: any) => (
                <div key={r.label} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '12px 0', borderBottom: '1px solid #0f0f0f', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>{r.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig]?.color || '#aaa' }}>{r.valor}</span>
                  <span style={{ fontSize: '12px', color: '#555' }}>{r.referencia}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '500',
                    color: estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig]?.color || '#aaa',
                    backgroundColor: estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig]?.bg || '#33333320',
                    padding: '2px 10px', borderRadius: '20px', width: 'fit-content'
                  }}>{estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig]?.label || r.estado}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* TAB: Historial Crediticio */}
      {tab === 'historial' && (
        <div>
          {card(
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Central de Deudores BCRA</h2>
                <span style={{ fontSize: '11px', color: '#555', backgroundColor: '#1f1f1f', padding: '4px 10px', borderRadius: '6px' }}>
                  ⚡ Próximamente: conexión API BCRA
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Situación actual', valor: 'Pendiente API', color: '#555' },
                  { label: 'Deuda total informada', valor: 'Pendiente API', color: '#555' },
                  { label: 'Cheques rechazados', valor: 'Pendiente API', color: '#555' },
                ].map(({ label, valor, color }) => (
                  <div key={label} style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color, marginBottom: '4px' }}>{valor}</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '24px', textAlign: 'center', color: '#555', fontSize: '13px' }}>
                La conexión con la Central de Deudores del BCRA estará disponible próximamente
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Factores Cualitativos */}
      {tab === 'cualitativo' && (
        <div>
          {!analisis ? (
            <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
              <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>Generá el análisis primero desde la pestaña Score & Dictamen</p>
            </div>
          ) : card(
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Factores cualitativos</h2>
              {analisis.factores_cualitativos.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '2px' }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{f.detalle}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{f.valor}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: '500',
                      color: estadoRatioConfig[f.estado as keyof typeof estadoRatioConfig]?.color || '#aaa',
                      backgroundColor: estadoRatioConfig[f.estado as keyof typeof estadoRatioConfig]?.bg || '#33333320',
                      padding: '2px 10px', borderRadius: '20px'
                    }}>{estadoRatioConfig[f.estado as keyof typeof estadoRatioConfig]?.label || f.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}