import Sidebar from '../../components/Sidebar';

interface Props {
  children: React.ReactNode;
  params: { orgId: string };
}

export default function OrgLayout({ children, params }: Props) {
  const orgId = params.orgId;
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar orgId={orgId} />
      <main style={{ marginLeft: '64px', flex: 1, color: 'white' }}>
        {children}
      </main>
    </div>
  );
}