export default function OrgPage({ params }: { params: { orgId: string } }) {
  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>
        Dashboard de organización
      </h1>
      <p style={{ color: '#555' }}>Org ID: {params.orgId}</p>
    </div>
  );
}