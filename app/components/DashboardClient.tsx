'use client';

import { useState, useEffect } from 'react';
import OrgCard from './OrgCard';
import NuevaOrgModal from './NuevaOrgModal';
import { supabase } from '../../src/lib/supabase';

interface Org {
  id: string;
  name: string;
  cuit: string;
  type: string;
  size: string;
  sector: string;
  kyc_status: string;
  risk_score: number;
  created_at: string;
}

interface Props {
  autorizados: Org[];
}

export default function DashboardClient({ autorizados }: Props) {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarOrgs();
  }, []);

  const cargarOrgs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrgs(data);
    setLoading(false);
  };

  const handleOrgCreada = (nuevaOrg: Org) => {
    setOrgs(prev => [nuevaOrg, ...prev]);
  };

  const kycBreakdown = (lista: Org[]) => {
    const ok = lista.filter(o => o.kyc_status === 'completo').length;
    const pendiente = lista.filter(o => o.kyc_status === 'pendiente').length;
    const alerta = lista.filter(o => o.kyc_status === 'alerta').length;
    return { ok, pendiente, alerta };
  };

  const scorePromedio = (lista: Org[]) => {
    if (lista.length === 0) return '—';
    const scores = lista.filter(o => o.risk_score).map(o => o.risk_score);
    if (scores.length === 0) return '—';
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const misOrgs = orgs;
  const misKyc = kycBreakdown(misOrgs);
  const misScore = scorePromedio(misOrgs);
  const tercerosKyc = kycBreakdown(autorizados);
  const tercerosScore = scorePromedio(autorizados);

  const statStyle = (color: string): React.CSSProperties => ({
    fontSize: '11px', fontWeight: '600', color,
    backgroundColor: color + '20', padding: '2px 8px',
    borderRadius: '20px', display: 'inline-block'
  });

  return (
    <>
      {/* Resumen global */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>

        {/* Mis organizaciones */}
        <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mis organizaciones
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1', marginBottom: '12px' }}>
            {loading ? '—' : misOrgs.length}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={statStyle('#22c55e')}>✓ {misKyc.ok} completos</span>
            <span style={statStyle('#f59e0b')}>{misKyc.pendiente} pendientes</span>
            {misKyc.alerta > 0 && <span style={statStyle('#ef4444')}>⚠ {misKyc.alerta} alertas</span>}
            <span style={statStyle('#6366f1')}>Score: {misScore}</span>
          </div>
        </div>

        {/* Accesos de terceros */}
        <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Accesos de terceros
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6', marginBottom: '12px' }}>
            {autorizados.length}
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={statStyle('#22c55e')}>✓ {tercerosKyc.ok} completos</span>
            <span style={statStyle('#f59e0b')}>{tercerosKyc.pendiente} pendientes</span>
            {tercerosKyc.alerta > 0 && <span style={statStyle('#ef4444')}>⚠ {tercerosKyc.alerta} alertas</span>}
            <span style={statStyle('#3b82f6')}>Score: {tercerosScore}</span>
          </div>
        </div>
      </div>

      {/* Header mis orgs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: 'white' }}>Mis organizaciones</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: '#6366f1', color: 'white', border: 'none',
            borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer'
          }}
        >
          + Nueva organización
        </button>
      </div>

      {/* Lista orgs */}
      {loading ? (
        <p style={{ color: '#555', fontSize: '13px' }}>Cargando organizaciones...</p>
      ) : misOrgs.length === 0 ? (
        <div style={{
          backgroundColor: '#111', border: '1px solid #1f1f1f',
          borderRadius: '12px', padding: '48px', textAlign: 'center'
        }}>
          <p style={{ color: '#555', margin: '0 0 8px 0', fontSize: '15px' }}>No tenés organizaciones todavía</p>
          <p style={{ color: '#333', margin: 0, fontSize: '13px' }}>Creá la primera con el botón de arriba</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {misOrgs.map(org => (
            <OrgCard key={org.id} org={org} />
          ))}
        </div>
      )}

      {/* Terceros */}
      {autorizados.length > 0 && (
        <>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '32px 0 16px 0', color: 'white' }}>
            Accesos de terceros
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {autorizados.map(org => (
              <OrgCard key={org.id} org={org} />
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <NuevaOrgModal
          onClose={() => setShowModal(false)}
          onCreated={handleOrgCreada}
        />
      )}
    </>
  );
}