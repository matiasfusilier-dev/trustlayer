'use client';

const kycColor = (status: string) => {
  if (status === 'Aprobado') return '#22c55e';
  if (status === 'En revisión') return '#f59e0b';
  if (status === 'Rechazado') return '#ef4444';
  return '#555';
};

const scoreColor = (score: number) => {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

interface Org {
  id: string;
  name: string;
  tipo: string;
  industria: string;
  tamanio: string;
  role?: string;
  autorizadoPor?: string;
  kyc: string;
  score: number;
  docsPendientes: number;
  ultimaActividad: string;
}

export default function OrgCard({ org, autorizado }: { org: Org; autorizado?: boolean }) {
  return (
    <a href={`/org/${org.id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{
          backgroundColor: '#111', border: '1px solid #1f1f1f',
          borderRadius: '12px', padding: '20px', cursor: 'pointer',
          transition: 'border-color 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = autorizado ? '#3b82f6' : '#6366f1'}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1f1f1f'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{org.name}</div>
            <div style={{ fontSize: '12px', color: '#555', display: 'flex', gap: '6px' }}>
              <span>{org.tipo}</span><span>·</span><span>{org.industria}</span><span>·</span><span>{org.tamanio}</span>
            </div>
          </div>
          <span style={{
            backgroundColor: autorizado ? '#0f1f3d' : '#1a1a2e',
            color: autorizado ? '#3b82f6' : '#6366f1',
            fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap'
          }}>
            {autorizado ? 'Autorizado' : org.role}
          </span>
        </div>

        {autorizado && (
          <div style={{ fontSize: '11px', color: '#444', marginBottom: '12px' }}>
            Autorizado por {org.autorizadoPor}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#555' }}>Estado KYC</span>
          <span style={{
            fontSize: '12px', fontWeight: '600', color: kycColor(org.kyc),
            backgroundColor: kycColor(org.kyc) + '20', padding: '2px 10px', borderRadius: '20px'
          }}>{org.kyc}</span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', color: '#555' }}>Score crediticio</span>
            <span style={{ fontSize: '13px', fontWeight: '700', color: scoreColor(org.score) }}>{org.score}</span>
          </div>
          <div style={{ backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
            <div style={{
              width: `${org.score}%`, height: '4px',
              backgroundColor: scoreColor(org.score), borderRadius: '4px'
            }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #1a1a1a' }}>
          <div style={{ fontSize: '11px', color: org.docsPendientes > 0 ? '#f59e0b' : '#555' }}>
            {org.docsPendientes > 0 ? `⚠ ${org.docsPendientes} docs pendientes` : '✓ Docs al día'}
          </div>
          <div style={{ fontSize: '11px', color: '#444' }}>{org.ultimaActividad}</div>
        </div>
      </div>
    </a>
  );
}