export default function OrgPage({ params }: { params: { orgId: string } }) {
  
  const org = {
    id: params.orgId,
    name: 'Banco Galicia',
    tipo: 'Banco',
    industria: 'Finanzas',
    tamanio: 'Corporate',
    kyc: 'Aprobado',
    score: 82,
    docsPendientes: 0,
    ultimaActividad: 'Hoy',
  };

  return (
    <div style={{ padding: '32px' }}>
      
      {/* Header org */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '600', margin: 0, color: 'white' }}>
            {org.name}
          </h1>
          <span style={{
            backgroundColor: '#22c55e20', color: '#22c55e',
            fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '500'
          }}>KYC Aprobado</span>
        </div>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          {org.tipo} · {org.industria} · {org.tamanio}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Score crediticio', value: org.score, color: '#22c55e', suffix: '/100' },
          { label: 'Documentos pendientes', value: org.docsPendientes, color: '#f59e0b', suffix: '' },
          { label: 'Apoderados', value: 3, color: '#6366f1', suffix: '' },
          { label: 'Última actividad', value: org.ultimaActividad, color: '#888', suffix: '' },
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
            { label: 'Estatuto social', status: 'Aprobado' },
            { label: 'Acta de directorio', status: 'Aprobado' },
            { label: 'Poder notarial', status: 'Aprobado' },
            { label: 'DNI apoderados', status: 'Aprobado' },
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
            { label: 'Score general', value: '82/100', color: '#22c55e' },
            { label: 'Deuda BCRA', value: 'Sin deuda', color: '#22c55e' },
            { label: 'Situación BCRA', value: 'Normal (1)', color: '#22c55e' },
            { label: 'Cheques rechazados', value: '0', color: '#22c55e' },
            { label: 'Nivel de riesgo', value: 'Bajo', color: '#22c55e' },
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