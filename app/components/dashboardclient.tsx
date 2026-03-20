'use client';

import { useState, useEffect } from 'react';
import OrgCard from './OrgCard';
import NuevaOrgModal from './NuevaOrgModal';
import { supabase } from '../../src/lib/supabase';

interface Org {
  id: string;
  name: string;
  tipo: string;
  industria: string;
  tamanio: string;
  role?: string;
  kyc: string;
  score: number;
  docsPendientes: number;
  ultimaActividad: string;
}

interface Props {
  autorizados: (Org & { autorizadoPor: string })[];
}

export default function DashboardClient({ autorizados }: Props) {
  const [misOrgs, setMisOrgs] = useState<Org[]>([]);
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

    if (error) {
      console.error('Error cargando orgs:', error);
    } else {
      const mapeadas: Org[] = (data || []).map((o: any) => ({
        id: o.id,
        name: o.name,
        tipo: o.type,
        industria: o.razon_social || '—',
        tamanio: o.razon_social || '—',
        role: 'Admin',
        kyc: o.kyc_status === 'aprobado' ? 'Aprobado' : o.kyc_status === 'revision' ? 'En revisión' : 'Pendiente',
        score: o.kyc_score || 0,
        docsPendientes: 0,
        ultimaActividad: 'Ahora',
      }));
      setMisOrgs(mapeadas);
    }
    setLoading(false);
  };

  const handleCrear = async (data: any) => {
    const { error } = await supabase
      .from('organizations')
      .insert({
        name: data.nombre,
        cuit: data.cuit,
        type: data.tipo.toLowerCase(),
        razon_social: data.sector,
        kyc_status: 'pendiente',
        kyc_score: 0,
      });

    if (error) {
      console.error('Error creando org:', error);
      alert('Error al crear la organización: ' + error.message);
    } else {
      await cargarOrgs();
    }
  };

  // Stats mis orgs
  const misKycAprobados = misOrgs.filter(o => o.kyc === 'Aprobado').length;
  const misKycPendientes = misOrgs.filter(o => o.kyc === 'Pendiente').length;
  const misKycRevision = misOrgs.filter(o => o.kyc === 'En revisión').length;
  const misScorePromedio = misOrgs.length > 0
    ? Math.round(misOrgs.reduce((acc, o) => acc + o.score, 0) / misOrgs.length)
    : 0;

  // Stats terceros
  const tercKycAprobados = autorizados.filter(o => o.kyc === 'Aprobado').length;
  const tercKycPendientes = autorizados.filter(o => o.kyc === 'Pendiente').length;
  const tercKycRevision = autorizados.filter(o => o.kyc === 'En revisión').length;
  const tercScorePromedio = autorizados.length > 0
    ? Math.round(autorizados.reduce((acc, o) => acc + o.score, 0) / autorizados.length)
    : 0;

  const ResumenBloque = ({
    titulo, total, kycAprobados, kycRevision, kycPendientes, scorePromedio, color
  }: {
    titulo: string; total: number; kycAprobados: number; kycRevision: number;
    kycPendientes: number; scorePromedio: number; color: string;
  }) => (
    <div style={{
      backgroundColor: '#111', border: '1px solid #1f1f1f',
      borderRadius: '14px', padding: '24px', flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color,
        }} />
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {titulo}
        </h3>
        <span style={{
          marginLeft: 'auto', fontSize: '22px', fontWeight: '700', color,
        }}>{loading ? '—' : total}</span>
      </div>

      {/* KYC */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          KYC
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'Aprobados', value: kycAprobados, color: '#22c55e', bg: '#22c55e15' },
            { label: 'En revisión', value: kycRevision, color: '#f59e0b', bg: '#f59e0b15' },
            { label: 'Pendientes', value: kycPendientes, color: '#ef4444', bg: '#ef444415' },
          ].map(stat => (
            <div key={stat.label} style={{
              flex: 1, backgroundColor: stat.bg, borderRadius: '10px',
              padding: '12px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: stat.color }}>
                {loading ? '—' : stat.value}
              </div>
              <div style={{ fontSize: '11px', color: stat.color, opacity: 0.8, marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score */}
      <div>
        <div style={{ fontSize: '11px', color: '#444', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Análisis crediticio
        </div>
        <div style={{
          backgroundColor: '#0d0d0d', borderRadius: '10px', padding: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', color: '#555' }}>Score promedio</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '80px', height: '6px', backgroundColor: '#1a1a1a', borderRadius: '99px', overflow: 'hidden',
            }}>
              <div style={{
                width: `${loading ? 0 : scorePromedio}%`, height: '100%',
                backgroundColor: scorePromedio >= 70 ? '#22c55e' : scorePromedio >= 40 ? '#f59e0b' : '#ef4444',
                borderRadius: '99px', transition: 'width 0.5s ease',
              }} />
            </div>
            <span style={{
              fontSize: '16px', fontWeight: '700',
              color: scorePromedio >= 70 ? '#22c55e' : scorePromedio >= 40 ? '#f59e0b' : '#ef4444',
            }}>
              {loading ? '—' : `${scorePromedio}/100`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showModal && (
        <NuevaOrgModal onClose={() => setShowModal(false)} onCrear={handleCrear} />
      )}

      {/* Resumen */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
        <ResumenBloque
          titulo="Mis organizaciones"
          total={misOrgs.length}
          kycAprobados={misKycAprobados}
          kycRevision={misKycRevision}
          kycPendientes={misKycPendientes}
          scorePromedio={misScorePromedio}
          color="#6366f1"
        />
        <ResumenBloque
          titulo="Accesos de terceros"
          total={autorizados.length}
          kycAprobados={tercKycAprobados}
          kycRevision={tercKycRevision}
          kycPendientes={tercKycPendientes}
          scorePromedio={tercScorePromedio}
          color="#3b82f6"
        />
      </div>

      {/* Mis organizaciones */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: 'white' }}>Mis organizaciones</h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              backgroundColor: '#6366f1', color: 'white', border: 'none',
              borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer'
            }}>
            + Nueva organización
          </button>
        </div>

        {loading ? (
          <div style={{ color: '#555', fontSize: '13px', padding: '20px 0' }}>Cargando organizaciones...</div>
        ) : misOrgs.length === 0 ? (
          <div style={{
            backgroundColor: '#111', border: '1px dashed #222',
            borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#555', fontSize: '14px'
          }}>
            No tenés organizaciones todavía. ¡Creá la primera!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {misOrgs.map((org) => <OrgCard key={org.id} org={org} />)}
          </div>
        )}
      </div>

      {/* Accesos autorizados */}
      {autorizados.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '600', color: 'white' }}>Accesos autorizados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {autorizados.map((org) => <OrgCard key={org.id} org={org} autorizado />)}
          </div>
        </div>
      )}
    </>
  );
}