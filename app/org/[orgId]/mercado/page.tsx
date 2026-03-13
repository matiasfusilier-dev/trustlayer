'use client';

import { useState } from 'react';

type Tab = 'empresa' | 'sector-noticias' | 'sector-metricas' | 'mercado';

const tabs: { key: Tab; label: string }[] = [
  { key: 'empresa', label: '🏢 Noticias de la empresa' },
  { key: 'sector-noticias', label: '📰 Noticias del sector' },
  { key: 'sector-metricas', label: '📊 Métricas del sector' },
  { key: 'mercado', label: '🌐 Mercado & Macro' },
];

const noticiasEmpresa = [
  { titulo: 'Banco Galicia anuncia nuevo plan de créditos para PyMEs por $10.000M', fuente: 'El Cronista', fecha: '12 Mar 2025', resumen: 'La entidad lanzó una línea especial de financiamiento para pequeñas y medianas empresas con tasas subsidiadas en el marco del programa de apoyo productivo.', url: '#' },
  { titulo: 'Banco Galicia reporta crecimiento del 18% en depósitos durante febrero', fuente: 'Infobae', fecha: '05 Mar 2025', resumen: 'Los depósitos a plazo fijo crecieron significativamente impulsados por tasas competitivas y la confianza de los ahorristas en la entidad.', url: '#' },
  { titulo: 'Galicia lanza nueva plataforma digital para empresas corporativas', fuente: 'Ámbito', fecha: '28 Feb 2025', resumen: 'La plataforma permite gestionar transferencias, pagos y consultas en tiempo real con integración API para sistemas ERP empresariales.', url: '#' },
  { titulo: 'Banco Galicia entre los mejores empleadores de Argentina 2025', fuente: 'La Nación', fecha: '20 Feb 2025', resumen: 'La entidad fue reconocida por Great Place to Work en la categoría de grandes empresas del sector financiero argentino.', url: '#' },
];

const noticiasSector = [
  { titulo: 'El crédito al sector privado creció 12% real en febrero', fuente: 'BCRA', fecha: '10 Mar 2025', resumen: 'El Banco Central informó un fuerte crecimiento del crédito comercial impulsado por las líneas productivas y el financiamiento de capital de trabajo.', url: '#' },
  { titulo: 'Bancos privados reducen tasas activas ante mayor liquidez del sistema', fuente: 'El Economista', fecha: '08 Mar 2025', resumen: 'La mayor liquidez del sistema financiero llevó a los principales bancos a reducir sus tasas para préstamos corporativos en 300 puntos básicos.', url: '#' },
  { titulo: 'UIF refuerza controles KYC para entidades financieras en 2025', fuente: 'Cronista', fecha: '03 Mar 2025', resumen: 'La Unidad de Información Financiera actualizó los requisitos de debida diligencia para bancos y ALYCs con foco en beneficiarios finales.', url: '#' },
  { titulo: 'Morosidad del sistema bancario se mantiene en mínimos históricos', fuente: 'BCRA', fecha: '01 Mar 2025', resumen: 'El índice de morosidad del sistema financiero cerró febrero en 1.8%, el nivel más bajo desde 2018, reflejando la mejora en la calidad crediticia.', url: '#' },
];

const metricasSector = {
  nombre: 'Sector Financiero',
  indicadores: [
    { label: 'Crecimiento del sector YoY', valor: '+8.4%', color: '#22c55e', detalle: 'vs +5.2% del año anterior' },
    { label: 'Volumen de crédito total', valor: '$42.3B', color: '#6366f1', detalle: 'Acumulado sistema financiero' },
    { label: 'Morosidad promedio del sector', valor: '1.8%', color: '#22c55e', detalle: 'Mínimo histórico' },
    { label: 'ROE promedio del sector', valor: '18.2%', color: '#22c55e', detalle: 'Rentabilidad sobre patrimonio' },
    { label: 'Liquidez promedio', valor: '32.4%', color: '#22c55e', detalle: 'Por encima del mínimo regulatorio' },
    { label: 'Empleo sectorial', valor: '127.400', color: '#aaa', detalle: 'Empleados en el sistema financiero' },
  ],
  comparativo: [
    { sector: 'Finanzas', crecimiento: 8.4, morosidad: 1.8, color: '#6366f1' },
    { sector: 'Agro', crecimiento: 6.2, morosidad: 2.1, color: '#22c55e' },
    { sector: 'Construcción', crecimiento: 3.1, morosidad: 4.8, color: '#f59e0b' },
    { sector: 'Tecnología', crecimiento: 12.3, morosidad: 1.2, color: '#3b82f6' },
    { sector: 'Industria', crecimiento: 2.8, morosidad: 3.6, color: '#ef4444' },
  ],
};

const datosMercado = {
  cambio: [
    { label: 'Dólar Oficial', valor: '$1.067', variacion: '+0.3%', color: '#aaa' },
    { label: 'Dólar MEP', valor: '$1.142', variacion: '+0.8%', color: '#f59e0b' },
    { label: 'Dólar CCL', valor: '$1.158', variacion: '+0.6%', color: '#f59e0b' },
    { label: 'Dólar Blue', valor: '$1.175', variacion: '+1.2%', color: '#ef4444' },
  ],
  tasas: [
    { label: 'Tasa política monetaria', valor: '32.0% TNA', detalle: 'BCRA' },
    { label: 'Plazo fijo 30 días', valor: '34.5% TNA', detalle: 'Promedio bancos' },
    { label: 'Préstamos personales', valor: '89.0% TNA', detalle: 'Promedio bancos' },
    { label: 'Préstamos corporativos', valor: '55.0% TNA', detalle: 'Promedio bancos' },
    { label: 'Tarjeta de crédito', valor: '110.0% TNA', detalle: 'Promedio bancos' },
  ],
  macro: [
    { label: 'Inflación mensual', valor: '2.4%', color: '#f59e0b', detalle: 'Feb 2025' },
    { label: 'Inflación anual', valor: '66.9%', color: '#ef4444', detalle: 'Interanual' },
    { label: 'Riesgo país (EMBI)', valor: '612 pbs', color: '#f59e0b', detalle: 'JP Morgan' },
    { label: 'Reservas BCRA', valor: 'USD 26.800M', color: '#22c55e', detalle: 'Brutas' },
    { label: 'EMAE (actividad)', valor: '+3.2%', color: '#22c55e', detalle: 'YoY Ene 2025' },
    { label: 'Desempleo', valor: '6.9%', color: '#aaa', detalle: 'IV trim 2024' },
  ],
};

export default function MercadoPage() {
  const [tab, setTab] = useState<Tab>('empresa');

  const card = (children: React.ReactNode, mb = true) => (
    <div style={{
      backgroundColor: '#111', border: '1px solid #1f1f1f',
      borderRadius: '12px', padding: '24px', marginBottom: mb ? '16px' : '0'
    }}>{children}</div>
  );

  const NoticiaCard = ({ n }: { n: typeof noticiasEmpresa[0] }) => (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #1a1a1a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff', flex: 1, marginRight: '16px' }}>{n.titulo}</div>
        <a href={n.url} style={{
          fontSize: '11px', color: '#6366f1', textDecoration: 'none',
          border: '1px solid #6366f140', padding: '3px 10px', borderRadius: '6px', flexShrink: 0
        }}>Ver →</a>
      </div>
      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{n.resumen}</p>
      <div style={{ fontSize: '11px', color: '#444' }}>{n.fuente} · {n.fecha}</div>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Mercado & Noticias
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Contexto de mercado, sector e información relevante de la empresa
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '24px', flexWrap: 'wrap',
        backgroundColor: '#111', padding: '4px', borderRadius: '10px', width: 'fit-content'
      }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
            color: tab === t.key ? 'white' : '#555',
            transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Noticias empresa */}
      {tab === 'empresa' && card(
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Banco Galicia — Noticias recientes</h2>
            <span style={{ fontSize: '11px', color: '#555', backgroundColor: '#1f1f1f', padding: '4px 10px', borderRadius: '6px' }}>
              🤖 Próximamente: búsqueda automática IA
            </span>
          </div>
          {noticiasEmpresa.map(n => <NoticiaCard key={n.titulo} n={n} />)}
        </div>
      )}

      {/* TAB: Noticias sector */}
      {tab === 'sector-noticias' && card(
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Sector Financiero — Noticias recientes</h2>
            <span style={{ fontSize: '11px', color: '#555', backgroundColor: '#1f1f1f', padding: '4px 10px', borderRadius: '6px' }}>
              🤖 Próximamente: búsqueda automática IA
            </span>
          </div>
          {noticiasSector.map(n => <NoticiaCard key={n.titulo} n={n} />)}
        </div>
      )}

      {/* TAB: Métricas del sector */}
      {tab === 'sector-metricas' && (
        <div>
          {card(
            <div>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                Indicadores — {metricasSector.nombre}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {metricasSector.indicadores.map(({ label, valor, color, detalle }) => (
                  <div key={label} style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color, marginBottom: '4px' }}>{valor}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{detalle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {card(
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                Comparativo entre sectores
              </h2>
              <div style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr',
                padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                <span>Sector</span><span>Crecimiento YoY</span><span>Morosidad</span>
              </div>
              {metricasSector.comparativo.map((s) => (
                <div key={s.sector} style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr',
                  padding: '12px 0', borderBottom: '1px solid #0f0f0f', alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: s.color }} />
                    <span style={{ fontSize: '13px', color: s.sector === 'Finanzas' ? '#fff' : '#aaa', fontWeight: s.sector === 'Finanzas' ? '600' : '400' }}>
                      {s.sector} {s.sector === 'Finanzas' ? '← esta empresa' : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, maxWidth: '80px', backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
                      <div style={{ width: `${(s.crecimiento / 15) * 100}%`, height: '4px', backgroundColor: s.color, borderRadius: '4px' }} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: s.color }}>{s.crecimiento}%</span>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: '500',
                    color: s.morosidad < 2 ? '#22c55e' : s.morosidad < 4 ? '#f59e0b' : '#ef4444'
                  }}>{s.morosidad}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB: Mercado & Macro */}
      {tab === 'mercado' && (
        <div>
          {/* Tipo de cambio */}
          {card(
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Tipo de cambio</h2>
                <span style={{ fontSize: '11px', color: '#555', backgroundColor: '#1f1f1f', padding: '4px 10px', borderRadius: '6px' }}>
                  ⚡ Próximamente: API en tiempo real
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {datosMercado.cambio.map(({ label, valor, variacion, color }) => (
                  <div key={label} style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color, marginBottom: '4px' }}>{valor}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: variacion.startsWith('+') ? '#22c55e' : '#ef4444' }}>{variacion} hoy</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasas */}
          {card(
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Tasas de referencia</h2>
              {datosMercado.tasas.map(({ label, valor, detalle }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid #1a1a1a'
                }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#aaa' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{detalle}</div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{valor}</span>
                </div>
              ))}
            </div>
          )}

          {/* Macro */}
          {card(
            <div>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Indicadores macroeconómicos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {datosMercado.macro.map(({ label, valor, color, detalle }) => (
                  <div key={label} style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color, marginBottom: '4px' }}>{valor}</div>
                    <div style={{ fontSize: '12px', color: '#aaa', marginBottom: '2px' }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#555' }}>{detalle}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}