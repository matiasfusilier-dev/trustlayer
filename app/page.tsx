import { initAuth0 } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import Sidebar from './components/Sidebar';
import OrgCard from './components/OrgCard';

const auth0 = initAuth0({
  secret: 'c88d905229a9ef7f89404e6d1bce0457beb593c7090de3c1985ee50679c0bbcf',
  issuerBaseURL: 'https://dev-usj0rrtsgjpijobs.us.auth0.com',
  baseURL: 'http://localhost:3000',
  clientID: 'h2pTjX74HOgSECwXnrtVZ1jkXveUiZh1',
  clientSecret: 'Sd16zSQs5tLEeiYOtwfA9-gM_D1H0G-LZv_ryWQhcupK056UkLn4_InOdqqP5p5H',
});

export default async function Home() {
  const session = await auth0.getSession();
  if (!session) redirect('/api/auth/login');

  const misOrgs = [
    { id: '1', name: 'Banco Galicia', tipo: 'Banco', industria: 'Finanzas', tamanio: 'Corporate', role: 'Admin', kyc: 'Aprobado', score: 82, docsPendientes: 0, ultimaActividad: 'Hoy' },
    { id: '2', name: 'Empresa ABC', tipo: 'Empresa', industria: 'Tecnología', tamanio: 'PyME', role: 'Analista', kyc: 'En revisión', score: 61, docsPendientes: 3, ultimaActividad: 'Ayer' },
    { id: '3', name: 'Constructora XYZ', tipo: 'Empresa', industria: 'Construcción', tamanio: 'Empresa', role: 'Admin', kyc: 'Pendiente', score: 45, docsPendientes: 7, ultimaActividad: 'Hace 3 días' },
  ];

  const autorizados = [
    { id: '4', name: 'Agro del Sur', tipo: 'Empresa', industria: 'Agro', tamanio: 'Empresa', autorizadoPor: 'Banco Galicia', kyc: 'Aprobado', score: 78, docsPendientes: 1, ultimaActividad: 'Hoy' },
    { id: '5', name: 'Tech Solutions', tipo: 'Empresa', industria: 'Tecnología', tamanio: 'PyME', autorizadoPor: 'ALYC Sur', kyc: 'En revisión', score: 55, docsPendientes: 2, ultimaActividad: 'Hace 2 días' },
  ];

  const totalOrgs = misOrgs.length + autorizados.length;
  const kycAprobados = [...misOrgs, ...autorizados].filter(o => o.kyc === 'Aprobado').length;
  const kycPendientes = [...misOrgs, ...autorizados].filter(o => o.kyc === 'En revisión' || o.kyc === 'Pendiente').length;
  const totalAlertas = [...misOrgs, ...autorizados].reduce((acc, o) => acc + o.docsPendientes, 0);

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

        {/* Resumen global */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Organizaciones', value: totalOrgs, color: '#6366f1' },
            { label: 'KYC aprobados', value: kycAprobados, color: '#22c55e' },
            { label: 'KYC pendientes', value: kycPendientes, color: '#f59e0b' },
            { label: 'Docs pendientes', value: totalAlertas, color: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '20px'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ color: '#555', fontSize: '13px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mis organizaciones */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>Mis organizaciones</h2>
            <button style={{
              backgroundColor: '#6366f1', color: 'white', border: 'none',
              borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer'
            }}>+ Nueva organización</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {misOrgs.map((org) => <OrgCard key={org.id} org={org} />)}
          </div>
        </div>

        {/* Accesos autorizados */}
        <div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600' }}>Accesos autorizados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {autorizados.map((org) => <OrgCard key={org.id} org={org} autorizado />)}
          </div>
        </div>

      </main>
    </div>
  );
}