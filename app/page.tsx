import { initAuth0 } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Sidebar from './components/Sidebar';

const auth0 = initAuth0({
  secret: 'c88d905229a9ef7f89404e6d1bce0457beb593c7090de3c1985ee50679c0bbcf',
  issuerBaseURL: 'https://dev-usj0rrtsgjpijobs.us.auth0.com',
  baseURL: 'http://localhost:3000',
  clientID: 'h2pTjX74HOgSECwXnrtVZ1jkXveUiZh1',
  clientSecret: 'Sd16zSQs5tLEeiYOtwfA9-gM_D1H0G-LZv_ryWQhcupK056UkLn4_InOdqqP5p5H',
});

export default async function Home() {
  const session = await auth0.getSession();

  if (!session) {
    redirect('/api/auth/login');
  }

  const misOrgs = [
    { id: '1', name: 'Banco Galicia', type: 'Banco', role: 'Admin', kyc: 12, pendientes: 2 },
    { id: '2', name: 'Empresa ABC', type: 'Empresa', role: 'Analista', kyc: 5, pendientes: 1 },
  ];

  const autorizados = [
    { id: '3', name: 'Empresa XYZ', type: 'Empresa', autorizadoPor: 'Banco Galicia', kyc: 8, pendientes: 0 },
    { id: '4', name: 'Empresa 123', type: 'Empresa', autorizadoPor: 'ALYC Sur', kyc: 3, pendientes: 1 },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar />
      <main style={{ marginLeft: '56px', flex: 1, padding: '32px', color: 'white' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 4px 0' }}>
              Bienvenido, {session!.user.name?.split(' ')[0]}
            </h1>
            <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>{session!.user.email}</p>
          </div>
          <a href="/api/auth/logout" style={{
            color: '#555', fontSize: '13px', textDecoration: 'none',
            padding: '8px 16px', border: '1px solid #222', borderRadius: '8px'
          }}>Salir</a>
        </div>

        {/* Mis organizaciones */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#fff' }}>
              Mis organizaciones
            </h2>
            <button style={{
              backgroundColor: '#6366f1', color: 'white', border: 'none',
              borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer'
            }}>
              + Nueva organización
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {misOrgs.map((org) => (
              <a key={org.id} href={`/org/${org.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#111', border: '1px solid #1f1f1f',
                  borderRadius: '12px', padding: '20px', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{org.name}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{org.type}</div>
                    </div>
                    <span style={{
                      backgroundColor: '#1a1a2e', color: '#6366f1',
                      fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500'
                    }}>{org.role}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{org.kyc}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>KYC aprobados</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{org.pendientes}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>Pendientes</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Accesos autorizados */}
        <div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: '#fff' }}>
            Accesos autorizados
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {autorizados.map((org) => (
              <a key={org.id} href={`/org/${org.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#111', border: '1px solid #1f1f1f',
                  borderRadius: '12px', padding: '20px', cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff', marginBottom: '4px' }}>{org.name}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>Autorizado por {org.autorizadoPor}</div>
                    </div>
                    <span style={{
                      backgroundColor: '#0f1f3d', color: '#3b82f6',
                      fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: '500'
                    }}>Autorizado</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#22c55e' }}>{org.kyc}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>KYC aprobados</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>{org.pendientes}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>Pendientes</div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}