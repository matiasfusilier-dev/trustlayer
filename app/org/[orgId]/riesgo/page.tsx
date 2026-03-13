'use client';

import { useState } from 'react';

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

const scoreLabel = (score: number) => {
  if (score >= 75) return 'Riesgo Bajo';
  if (score >= 50) return 'Riesgo Medio';
  if (score >= 25) return 'Riesgo Alto';
  return 'Riesgo Muy Alto';
};

const scoreRecomendacion = (score: number) => {
  if (score >= 75) return { label: 'Aprobar', color: '#22c55e', bg: '#22c55e15', border: '#22c55e40' };
  if (score >= 50) return { label: 'Aprobar con condiciones', color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40' };
  return { label: 'Rechazar', color: '#ef4444', bg: '#ef444415', border: '#ef444440' };
};

const ratioGroups = [
  {
    titulo: 'Liquidez',
    ratios: [
      { label: 'Liquidez corriente', valor: '2.3x', referencia: '> 1.5x', estado: 'ok' },
      { label: 'Liquidez seca', valor: '1.8x', referencia: '> 1.0x', estado: 'ok' },
      { label: 'Capital de trabajo', valor: '$4.2M', referencia: 'Positivo', estado: 'ok' },
    ]
  },
  {
    titulo: 'Endeudamiento',
    ratios: [
      { label: 'Deuda / Patrimonio', valor: '0.45x', referencia: '< 1.0x', estado: 'ok' },
      { label: 'Deuda / EBITDA', valor: '1.8x', referencia: '< 3.0x', estado: 'ok' },
      { label: 'Cobertura de intereses', valor: '5.2x', referencia: '> 3.0x', estado: 'ok' },
    ]
  },
  {
    titulo: 'Rentabilidad',
    ratios: [
      { label: 'ROA', valor: '8.4%', referencia: '> 5%', estado: 'ok' },
      { label: 'ROE', valor: '14.2%', referencia: '> 10%', estado: 'ok' },
      { label: 'Margen neto', valor: '12.1%', referencia: '> 8%', estado: 'ok' },
      { label: 'Margen operativo', valor: '18.3%', referencia: '> 10%', estado: 'ok' },
    ]
  },
  {
    titulo: 'Eficiencia',
    ratios: [
      { label: 'Rotación de activos', valor: '0.7x', referencia: '> 0.5x', estado: 'ok' },
      { label: 'Días de cobro', valor: '42 días', referencia: '< 60 días', estado: 'ok' },
      { label: 'Días de pago', valor: '38 días', referencia: '< 60 días', estado: 'ok' },
      { label: 'Rotación de inventarios', valor: '8.2x', referencia: '> 4x', estado: 'ok' },
    ]
  },
];

const estadoRatioConfig = {
  ok: { color: '#22c55e', bg: '#22c55e20', label: '✓ OK' },
  alerta: { color: '#f59e0b', bg: '#f59e0b20', label: '⚠ Atención' },
  malo: { color: '#ef4444', bg: '#ef444420', label: '✗ Fuera de rango' },
};

const historialBCRA = [
  { mes: 'Mar 2025', situacion: 1, deuda: '$2.1M' },
  { mes: 'Feb 2025', situacion: 1, deuda: '$2.3M' },
  { mes: 'Ene 2025', situacion: 1, deuda: '$2.5M' },
  { mes: 'Dic 2024', situacion: 1, deuda: '$1.8M' },
  { mes: 'Nov 2024', situacion: 1, deuda: '$1.9M' },
  { mes: 'Oct 2024', situacion: 2, deuda: '$3.1M' },
  { mes: 'Sep 2024', situacion: 1, deuda: '$2.0M' },
  { mes: 'Ago 2024', situacion: 1, deuda: '$1.7M' },
];

const situacionBCRAConfig: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Normal', color: '#22c55e', bg: '#22c55e20' },
  2: { label: 'Riesgo bajo', color: '#84cc16', bg: '#84cc1620' },
  3: { label: 'Riesgo medio', color: '#f59e0b', bg: '#f59e0b20' },
  4: { label: 'Riesgo alto', color: '#f97316', bg: '#f9731620' },
  5: { label: 'Irrecuperable', color: '#ef4444', bg: '#ef444420' },
  6: { label: 'Irrecup. técnico', color: '#7f1d1d', bg: '#7f1d1d20' },
};

const factoresCualitativos = [
  { label: 'Antigüedad de la empresa', valor: '18 años', detalle: 'Empresa con trayectoria consolidada', estado: 'ok' },
  { label: 'Industria', valor: 'Finanzas', detalle: 'Riesgo sectorial bajo', estado: 'ok' },
  { label: 'Riesgo sectorial', valor: 'Bajo', detalle: 'Sector estable con baja volatilidad', estado: 'ok' },
  { label: 'Estructura societaria', valor: 'Completa', detalle: 'Composición accionaria clara y documentada', estado: 'ok' },
  { label: 'KYC', valor: 'Aprobado con obs.', detalle: 'Documentación casi completa, 1 ítem pendiente', estado: 'alerta' },
  { label: 'Cheques rechazados', valor: '0', detalle: 'Sin antecedentes de cheques rechazados', estado: 'ok' },
  { label: 'Litigios conocidos', valor: 'Ninguno', detalle: 'Sin litigios relevantes registrados', estado: 'ok' },
];

export default function RiesgoCrediticioPage() {
  const [tab, setTab] = useState<Tab>('score');
  const [generando, setGenerando] = useState(false);
  const [dictamenGenerado, setDictamenGenerado] = useState(false);

  const score = 82;
  const rec = scoreRecomendacion(score);

  const handleGenerarDictamen = () => {
    setGenerando(true);
    setTimeout(() => {
      setGenerando(false);
      setDictamenGenerado(true);
    }, 2500);
  };

  const card = (children: React.ReactNode) => (
    <div style={{
      backgroundColor: '#111', border: '1px solid #1f1f1f',
      borderRadius: '12px', padding: '24px', marginBottom: '16px'
    }}>{children}</div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Riesgo Crediticio
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Análisis integral de riesgo crediticio de la organización
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '24px',
        backgroundColor: '#111', padding: '4px', borderRadius: '10px', width: 'fit-content'
      }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
            color: tab === t.key ? 'white' : '#555',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Score & Dictamen */}
      {tab === 'score' && (
        <div>
          {/* Score visual */}
          {card(
            <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
              {/* Gauge */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{
                  width: '140px', height: '140px', borderRadius: '50%',
                  background: `conic-gradient(${scoreColor(score)} ${score * 3.6}deg, #1f1f1f 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 12px auto',
                }}>
                  <div style={{
                    width: '110px', height: '110px', borderRadius: '50%',
                    backgroundColor: '#111', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: '800', color: scoreColor(score) }}>{score}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>/ 100</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: scoreColor(score) }}>{scoreLabel(score)}</div>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recomendación</div>
                  <div style={{
                    display: 'inline-block', padding: '8px 20px', borderRadius: '8px',
                    backgroundColor: rec.bg, border: `1px solid ${rec.border}`,
                    fontSize: '15px', fontWeight: '700', color: rec.color,
                  }}>{rec.label}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'Límite sugerido', valor: '$5.000.000' },
                    { label: 'Plazo sugerido', valor: '24 meses' },
                    { label: 'Tasa sugerida', valor: 'TNA 45%' },
                    { label: 'Garantía requerida', valor: 'No requerida' },
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

          {/* Botón dictamen IA */}
          {!dictamenGenerado && card(
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <p style={{ color: '#555', fontSize: '13px', margin: '0 0 16px 0' }}>
                Generá un dictamen detallado con IA basado en todos los indicadores
              </p>
              <button onClick={handleGenerarDictamen} disabled={generando} style={{
                backgroundColor: generando ? '#333' : '#6366f1', color: 'white',
                border: 'none', borderRadius: '10px', padding: '12px 28px',
                fontSize: '14px', fontWeight: '600', cursor: generando ? 'not-allowed' : 'pointer',
              }}>
                {generando ? '⏳ Analizando...' : '🤖 Generar dictamen IA'}
              </button>
            </div>
          )}

          {/* Dictamen generado */}
          {dictamenGenerado && card(
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '16px' }}>🤖</span>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Dictamen IA</h3>
                <span style={{ fontSize: '11px', color: '#555', marginLeft: 'auto' }}>Generado ahora</span>
              </div>
              <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.7', margin: '0 0 16px 0' }}>
                La empresa presenta un perfil crediticio <strong style={{ color: '#22c55e' }}>sólido</strong> con indicadores financieros dentro de los parámetros aceptables. Su trayectoria de 18 años en el sector, junto con una estructura societaria clara y ratios de liquidez y endeudamiento saludables, la posicionan como un cliente de bajo riesgo.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: '#22c55e10', border: '1px solid #22c55e30', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e', marginBottom: '10px' }}>✓ Factores positivos</div>
                  {[
                    'Liquidez corriente sólida (2.3x)',
                    'Sin deuda BCRA ni cheques rechazados',
                    'ROE y ROA por encima del promedio sectorial',
                    'Estructura societaria transparente',
                    'Antigüedad y trayectoria consolidada',
                  ].map(f => (
                    <div key={f} style={{ fontSize: '12px', color: '#aaa', padding: '4px 0', borderBottom: '1px solid #22c55e15' }}>
                      · {f}
                    </div>
                  ))}
                </div>
                <div style={{ backgroundColor: '#f59e0b10', border: '1px solid #f59e0b30', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#f59e0b', marginBottom: '10px' }}>⚠ Factores a monitorear</div>
                  {[
                    'KYC con 1 documento pendiente',
                    'Situación BCRA 2 registrada en Oct 2024',
                    'Verificación PEP de apoderados pendiente',
                  ].map(f => (
                    <div key={f} style={{ fontSize: '12px', color: '#aaa', padding: '4px 0', borderBottom: '1px solid #f59e0b15' }}>
                      · {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Ratios Financieros */}
      {tab === 'ratios' && (
        <div>
          {ratioGroups.map((group) => (
            <div key={group.titulo} style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '24px', marginBottom: '16px'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>{group.titulo}</h2>
              <div style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                <span>Indicador</span><span>Valor</span><span>Referencia</span><span>Estado</span>
              </div>
              {group.ratios.map((r) => (
                <div key={r.label} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  padding: '12px 0', borderBottom: '1px solid #0f0f0f', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>{r.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig].color }}>{r.valor}</span>
                  <span style={{ fontSize: '12px', color: '#555' }}>{r.referencia}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '500',
                    color: estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig].color,
                    backgroundColor: estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig].bg,
                    padding: '2px 10px', borderRadius: '20px', width: 'fit-content'
                  }}>{estadoRatioConfig[r.estado as keyof typeof estadoRatioConfig].label}</span>
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
                  { label: 'Situación actual', valor: 'Normal (1)', color: '#22c55e' },
                  { label: 'Deuda total informada', valor: '$2.1M', color: '#aaa' },
                  { label: 'Cheques rechazados', valor: '0', color: '#22c55e' },
                ].map(({ label, valor, color }) => (
                  <div key={label} style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color, marginBottom: '4px' }}>{valor}</div>
                    <div style={{ fontSize: '12px', color: '#555' }}>{label}</div>
                  </div>
                ))}
              </div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', color: '#aaa' }}>
                Historial últimos 24 meses
              </h3>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                <span>Período</span><span>Situación</span><span>Deuda</span>
              </div>
              {historialBCRA.map((h) => (
                <div key={h.mes} style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                  padding: '10px 0', borderBottom: '1px solid #0f0f0f', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>{h.mes}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '500',
                    color: situacionBCRAConfig[h.situacion].color,
                    backgroundColor: situacionBCRAConfig[h.situacion].bg,
                    padding: '2px 10px', borderRadius: '20px', width: 'fit-content'
                  }}>
                    {h.situacion} — {situacionBCRAConfig[h.situacion].label}
                  </span>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>{h.deuda}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Factores Cualitativos */}
      {tab === 'cualitativo' && (
        <div>
          {card(
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Factores cualitativos</h2>
              {factoresCualitativos.map((f) => (
                <div key={f.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: '1px solid #1a1a1a'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '2px' }}>{f.label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{f.detalle}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{f.valor}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: '500',
                      color: estadoRatioConfig[f.estado as keyof typeof estadoRatioConfig].color,
                      backgroundColor: estadoRatioConfig[f.estado as keyof typeof estadoRatioConfig].bg,
                      padding: '2px 10px', borderRadius: '20px'
                    }}>{estadoRatioConfig[f.estado as keyof typeof estadoRatioConfig].label}</span>
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