'use client';

const kycColor = (status: string) => {
  if (status === 'completo') return '#22c55e';
  if (status === 'pendiente') return '#f59e0b';
  if (status === 'alerta') return '#ef4444';
  return '#555';
};

const kycLabel = (status: string) => {
  if (status === 'completo') return 'Completo';
  if (status === 'pendiente') return 'Pendiente';
  if (status === 'alerta') return '⚠ Alerta';
  return 'Sin estado';
};

const scoreColor = (score: number) => {
  if (score >= 75) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

interface Org {
  id: string;
  name: string;
  cuit: string;
  type: string;
  size: string;
  sector: string;
  kyc_status: string;
  risk_score: number;
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
              {org.type && <span>{org.type}</span>}
              {org.type && org.sector && <span>·</span>}
              {org.sector && <span>{org.sector}</span>}
              {org.sector && org.size && <span>·</span>}
              {org.size && <span>{org.size}</span>}
            </div>
          </div>
          <span style={{
            backgroundColor: autorizado ? '#0f1f3d' : '#1a1a2e',
            color: autorizado ? '#3b82f6' : '#6366f1',
            fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500', whiteSpace: 'nowrap'
          }}>
            {autorizado ? 'Autorizado' : 'Propietario'}
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#444', marginBottom: '12px' }}>
          CUIT {org.cuit || '—'}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: '#555' }}>Estado KYC</span>
          <span style={{
            fontSize: '12px', fontWeight: '600',
            color: kycColor(org.kyc_status),
            backgroundColor: kycColor(org.kyc_status) + '20',
            padding: '2px 10px', borderRadius: '20px'
          }}>{kycLabel(org.kyc_status)}</span>
        </div>

        {org.risk_score ? (
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '12px', color: '#555' }}>Score crediticio</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: scoreColor(org.risk_score) }}>{org.risk_score}</span>
            </div>
            <div style={{ backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
              <div style={{
                width: `${org.risk_score}%`, height: '4px',
                backgroundColor: scoreColor(org.risk_score), borderRadius: '4px'
              }} />
            </div>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: '#333', marginBottom: '8px' }}>Sin score crediticio</div>
        )}
      </div>
    </a>
  );
}