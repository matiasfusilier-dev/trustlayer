import { initAuth0 } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Sidebar from './components/Sidebar';
import DashboardClient from './components/DashboardClient';

const auth0 = initAuth0({
  secret: process.env.AUTH0_SECRET || 'c88d905229a9ef7f89404e6d1bce0457beb593c7090de3c1985ee50679c0bbcf',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-usj0rrtsgjpijobs.us.auth0.com',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3001',
  clientID: process.env.AUTH0_CLIENT_ID || 'h2pTjX74HOgSECwXnrtVZ1jkXveUiZh1',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'Sd16zSQs5tLEeiYOtwfA9-gM_D1H0G-LZv_ryWQhcupK056UkLn4_InOdqqP5p5H',
});

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) redirect('/api/auth/login');

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

        <DashboardClient autorizados={[]} />

      </main>
    </div>
  );
}