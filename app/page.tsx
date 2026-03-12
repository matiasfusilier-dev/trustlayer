import { initAuth0 } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';

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

  return (
    <div style={{ 
      backgroundColor: '#0a0a0a', 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #1f1f1f', 
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            backgroundColor: '#6366f1', 
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '14px'
          }}>TL</div>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>TrustLayer</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>
            {session.user.email}
          </span>
          <a href="/api/auth/logout" style={{ 
            color: '#888', fontSize: '14px', textDecoration: 'none' 
          }}>Salir</a>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 8px 0' }}>
            Dashboard
          </h1>
          <p style={{ color: '#888', margin: 0 }}>
            Bienvenido, {session.user.name || session.user.email}
          </p>
        </div>

        {/* Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Empresas activas', value: '0', color: '#6366f1' },
            { label: 'KYC aprobados', value: '0', color: '#22c55e' },
            { label: 'En revisión', value: '0', color: '#f59e0b' },
            { label: 'Rechazados', value: '0', color: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} style={{ 
              backgroundColor: '#111', 
              border: '1px solid #1f1f1f',
              borderRadius: '12px',
              padding: '20px'
            }}>
              <div style={{ 
                fontSize: '28px', fontWeight: '700', 
                color: stat.color, marginBottom: '4px' 
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#888', fontSize: '14px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Empresas table */}
        <div style={{ 
          backgroundColor: '#111', 
          border: '1px solid #1f1f1f',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
              Empresas
            </h2>
            <button style={{ 
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer'
            }}>
              + Agregar empresa
            </button>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '48px', 
            color: '#888' 
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
            <p style={{ margin: 0 }}>No hay empresas todavía</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
              Agregá la primera empresa para empezar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}