import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://llrdjgcswlllxvwemalp.supabase.co',
  'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'
);

export default async function OrgPage({ params }: { params: { orgId: string } }) {

  const { data: org, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', params.orgId)
    .single();

  if (error || !org) redirect('/');

  const kycLabel = org.kyc_status === 'aprobado' ? 'Aprobado'
    : org.kyc_status === 'revision' ? 'En revisión'
    : 'Pendiente';

  const kycColor = org.kyc_status === 'aprobado' ? '#22c55e'
    : org.kyc_status === 'revision' ? '#f59e0b'
    : '#ef4444';

  return (
    <div style={{ padding: '32px' }}>

      {/* Header org */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '600', margin: 0, color: 'white' }}>
            {org.name}
          </h1>
          <span style={{
            backgroundColor: `${kycColor}20`, color: kycColor,
            fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'
          }}>KYC {kycLabel}</span>
        </div>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          {org.type} · {org.razon_social || '—'} · CUIT {org.cuit}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Score crediticio', value: org.kyc_score || 0, color: org.kyc_score >= 70 ? '#22c55e' : org.kyc_score >= 40 ? '#f59e0b' : '#ef4444', suffix: '/100' },
          { label: 'Documentos pendientes', value: 0, color: '#f59e0b', suffix: '' },
          { label: 'Apoderados', value: 0, color: '#6366f1', suffix: '' },
          { label: 'Última actividad', value: 'Ahora', color: '#888', suffix: '' },
        ].map((stat) => (
          <div key={stat.label} style={{
            backgroundColor: '#111', border: '1px solid #1f1f1f',
            borderRadius: '12px', padding: '20px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
              {stat.value}{stat.suffix}
            </div>
            <div style={{ color: '#555', fontSize: '13px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Dos columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* KYC Status */}
        <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Estado KYC</h2>
          {[
            { label: 'Estatuto social', status: 'Pendiente' },
            { label: 'Acta de directorio', status: 'Pendiente' },
            { label: 'Poder notarial', status: 'Pendiente' },
            { label: 'DNI apoderados', status: 'Pendiente' },
            { label: 'Balance último ejercicio', status: 'Pendiente' },
          ].map((doc) => (
            <div key={doc.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #1a1a1a'
            }}>
              <span style={{ fontSize: '13px', color: '#aaa' }}>{doc.label}</span>
              <span style={{
                fontSize: '11px', fontWeight: '500',
                color: doc.status === 'Aprobado' ? '#22c55e' : '#f59e0b',
                backgroundColor: doc.status === 'Aprobado' ? '#22c55e20' : '#f59e0b20',
                padding: '2px 10px', borderRadius: '20px'
              }}>{doc.status}</span>
            </div>
          ))}
        </div>

        {/* Análisis crediticio */}
        <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Análisis crediticio</h2>
          {[
            { label: 'Score general', value: `${org.kyc_score || 0}/100`, color: org.kyc_score >= 70 ? '#22c55e' : '#f59e0b' },
            { label: 'Deuda BCRA', value: 'Sin datos', color: '#555' },
            { label: 'Situación BCRA', value: 'Sin datos', color: '#555' },
            { label: 'Cheques rechazados', value: 'Sin datos', color: '#555' },
            { label: 'Nivel de riesgo', value: 'Sin datos', color: '#555' },
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #1a1a1a'
            }}>
              <span style={{ fontSize: '13px', color: '#aaa' }}>{item.label}</span>
              <span style={{ fontSize: '13px', fontWeight: '600', color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}