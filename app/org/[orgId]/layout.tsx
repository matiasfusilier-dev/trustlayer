import Sidebar from '../../components/Sidebar';

export default function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar orgId={params.orgId} />
      <main style={{ marginLeft: '56px', flex: 1, color: 'white' }}>
        {children}
      </main>
    </div>
  );
}