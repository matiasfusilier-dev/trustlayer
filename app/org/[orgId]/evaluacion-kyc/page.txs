'use client';

import { useState } from 'react';

const secciones = [
  {
    id: 'documentos',
    label: 'Documentación',
    icon: '📄',
    items: [
      { label: 'Estatuto social', estado: 'ok' },
      { label: 'Acta de constitución', estado: 'ok' },
      { label: 'Acta de autoridades', estado: 'ok' },
      { label: 'Nómina de firmantes', estado: 'ok' },
      { label: 'DNI apoderados', estado: 'ok' },
      { label: 'CUIL apoderados', estado: 'ok' },
      { label: 'Constancia AFIP', estado: 'ok' },
      { label: 'Constancia IIBB', estado: 'ok' },
      { label: 'DJ IVA/Ganancias', estado: 'ok' },
      { label: 'Balance último ejercicio', estado: 'ok' },
      { label: 'Estado patrimonial', estado: 'ok' },
      { label: 'Comprobante domicilio', estado: 'pendiente' },
    ],
    observacion: 'Falta cargar el comprobante de domicilio.',
  },
  {
    id: 'apoderados',
    label: 'Apoderados',
    icon: '👤',
    items: [
      { label: 'Juan Carlos Pérez — DNI', estado: 'ok' },
      { label: 'Juan Carlos Pérez — CUIL', estado: 'ok' },
      { label: 'Juan Carlos Pérez — PEP', estado: 'pendiente' },
      { label: 'María Laura Gómez — DNI', estado: 'ok' },
      { label: 'María Laura Gómez — CUIL', estado: 'pendiente' },
      { label: 'María Laura Gómez — PEP', estado: 'pendiente' },
      { label: 'Roberto Díaz — DNI', estado: 'pendiente' },
      { label: 'Roberto Díaz — CUIL', estado: 'pendiente' },
      { label: 'Roberto Díaz — PEP', estado: 'pendiente' },
    ],
    observacion: 'Verificación PEP pendiente en todos los apoderados. CUIL y DNI incompletos en 2 apoderados.',
  },
  {
    id: 'estructura',
    label: 'Estructura Societaria',
    icon: '👥',
    items: [
      { label: 'Composición accionaria completa', estado: 'ok' },
      { label: 'Capital distribuido al 100%', estado: 'ok' },
      { label: 'Beneficiarios finales identificados', estado: 'ok' },
      { label: 'DNI beneficiarios finales', estado: 'pendiente' },
      { label: 'PEP beneficiarios finales', estado: 'pendiente' },
    ],
    observacion: 'DNI y PEP de beneficiarios finales sin verificar.',
  },
];

const estadoConfig = {
  ok: { label: '✓ OK', color: '#22c55e', bg: '#22c55e20' },
  pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#f59e0b20' },
  rechazado: { label: 'Rechazado', color: '#ef4444', bg: '#ef444420' },
};

type Dictamen = 'aprobado' | 'observaciones' | 'rechazado' | null;

export default function EvaluacionKYCPage() {
  const [loading, setLoading] = useState(false);
  const [dictamen, setDictamen] = useState<Dictamen>(null);
  const [expandido, setExpandido] = useState<string | null>(null);

  const totalItems = secciones.flatMap(s => s.items).length;
  const itemsOk = secciones.flatMap(s => s.items).filter(i => i.estado === 'ok').length;
  const itemsPendientes = totalItems - itemsOk;
  const scoreKYC = Math.round((itemsOk / totalItems) * 100);

  const handleEvaluar = () => {
    setLoading(true);
    setDictamen(null);
    setTimeout(() => {
      setLoading(false);
      if (scoreKYC >= 90) setDictamen('aprobado');
      else if (scoreKYC >= 60) setDictamen('observaciones');
      else setDictamen('rechazado');
    }, 2500);
  };

  const dictamenConfig = {
    aprobado: {
      label: 'KYC Aprobado',
      color: '#22c55e',
      bg: '#22c55e15',
      border: '#22c55e40',
      icon: '✓',
      texto: 'La empresa cumple con todos los requisitos KYC. La documentación está completa y verificada. Se recomienda aprobar la apertura de cuenta.',
    },
    observaciones: {
      label: 'Aprobado con observaciones',
      color: '#f59e0b',
      bg: '#f59e0b15',
      border: '#f59e0b40',
      icon: '⚠',
      texto: 'La empresa cumple con los requisitos mínimos KYC pero existen observaciones que deben subsanarse en un plazo de 30 días. Se puede proceder con la apertura de cuenta de manera condicionada.',
    },
    rechazado: {
      label: 'KYC Rechazado',
      color: '#ef4444',
      bg: '#ef444415',
      border: '#ef444440',
      icon: '✗',
      texto: 'La empresa no cumple con los requisitos mínimos KYC. Existen demasiados ítems pendientes de verificación. Se recomienda no proceder hasta completar la documentación.',
    },
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Evaluación KYC
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Revisión integral del proceso KYC con dictamen automático
        </p>
      </div>

      <div style={{
        backgroundColor: '#111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '24px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: scoreKYC >= 90 ? '#22c55e' : scoreKYC >= 60 ? '#f59e0b' : '#ef4444' }}>
              {scoreKYC}%
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>Score KYC</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#22c55e' }}>{itemsOk}</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Ítems verificados</div>
          </div>
          <div>
            <div style={{ fontSize: '36px', fontWeight: '700', color: '#f59e0b' }}>{itemsPendientes}</div>
            <div style={{ fontSize: '13px', color: '#555' }}>Ítems pendientes</div>
          </div>
        </div>
        <button
          onClick={handleEvaluar}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#333' : '#6366f1',
            color: 'white', border: 'none', borderRadius: '10px',
            padding: '14px 28px', fontSize: '14px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            minWidth: '180px',
          }}
        >
          {loading ? '⏳ Evaluando...' : '🤖 Generar dictamen'}
        </button>
      </div>

      {dictamen && (
        <div style={{
          backgroundColor: dictamenConfig[dictamen].bg,
          border: `1px solid ${dictamenConfig[dictamen].border}`,
          borderRadius: '12px', padding: '24px', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: dictamenConfig[dictamen].color }}>
              {dictamenConfig[dictamen].icon}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: dictamenConfig[dictamen].color }}>
              {dictamenConfig[dictamen].label}
            </span>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#aaa', lineHeight: '1.6' }}>
            {dictamenConfig[dictamen].texto}
          </p>
          {dictamen !== 'aprobado' && (
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Observaciones pendientes
              </p>
              {secciones.filter(s => s.items.some(i => i.estado !== 'ok')).map(s => (
                <div key={s.id} style={{
                  display: 'flex', gap: '8px', alignItems: 'flex-start',
                  padding: '6px 0', borderBottom: '1px solid #ffffff10'
                }}>
                  <span style={{ color: '#f59e0b', fontSize: '13px' }}>⚠</span>
                  <span style={{ fontSize: '13px', color: '#888' }}>
                    <span style={{ color: '#aaa', fontWeight: '500' }}>{s.label}:</span> {s.observacion}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {secciones.map((sec) => {
          const okCount = sec.items.filter(i => i.estado === 'ok').length;
          const total = sec.items.length;
          const completo = okCount === total;
          const isOpen = expandido === sec.id;

          return (
            <div key={sec.id} style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', overflow: 'hidden'
            }}>
              <div
                onClick={() => setExpandido(isOpen ? null : sec.id)}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 24px', cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '18px' }}>{sec.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{sec.label}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: '500',
                    color: completo ? '#22c55e' : '#f59e0b',
                    backgroundColor: completo ? '#22c55e20' : '#f59e0b20',
                    padding: '2px 10px', borderRadius: '20px'
                  }}>
                    {okCount}/{total}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '100px', backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
                    <div style={{
                      width: `${(okCount / total) * 100}%`, height: '4px',
                      backgroundColor: completo ? '#22c55e' : '#6366f1',
                      borderRadius: '4px'
                    }} />
                  </div>
                  <span style={{ color: '#555', fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: '1px solid #1a1a1a' }}>
                  {sec.items.map((item) => (
                    <div key={item.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 24px', borderBottom: '1px solid #0f0f0f'
                    }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>{item.label}</span>
                      <span style={{
                        fontSize: '11px', fontWeight: '500',
                        color: estadoConfig[item.estado as keyof typeof estadoConfig].color,
                        backgroundColor: estadoConfig[item.estado as keyof typeof estadoConfig].bg,
                        padding: '2px 10px', borderRadius: '20px'
                      }}>
                        {estadoConfig[item.estado as keyof typeof estadoConfig].label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}