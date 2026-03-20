'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://llrdjgcswlllxvwemalp.supabase.co',
  'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'
);

interface AccesoLog {
  id: string;
  usuario: string;
  email: string;
  rol: string;
  seccion: string;
  action: string;
  details: string;
  created_at: string;
}

export default function AccesosPage({ params }: { params: { orgId: string } }) {
  const [accesos, setAccesos] = useState<AccesoLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [filtroSeccion, setFiltroSeccion] = useState('Todas');
  const [expandido, setExpandido] = useState<string | null>(null);

  const roles = ['Todos', 'Admin', 'Analista', 'Viewer', 'Tercero autorizado'];
  const secciones = ['Todas', 'Documentos', 'Apoderados', 'Estructura Societaria', 'Evaluación KYC', 'Análisis Empresa'];

  useEffect(() => {
    cargarAccesos();
  }, [params.orgId]);

  const cargarAccesos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('access_logs')
      .select('*')
      .eq('organization_id', params.orgId)
      .order('created_at', { ascending: false });

    if (!error && data) setAccesos(data);
    setLoading(false);
  };

  const filtrados = accesos.filter(a => {
    const okRol = filtroRol === 'Todos' || a.rol === filtroRol;
    const okSec = filtroSeccion === 'Todas' || a.seccion === filtroSeccion;
    return okRol && okSec;
  });

  const hoy = new Date().toDateString();
  const estasSemana = new Date();
  estasSemana.setDate(estasSemana.getDate() - 7);

  const accesosHoy = accesos.filter(a => new Date(a.created_at).toDateString() === hoy).length;
  const accesosSemana = accesos.filter(a => new Date(a.created_at) >= estasSemana).length;
  const usuariosUnicos = new Set(accesos.map(a => a.email)).size;

  return (
    <div style={{ padding: '32px', color: 'white', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Registro de Accesos</h1>
        <p style={{ color: '#666', marginTop: '6px', fontSize: '14px' }}>
          Historial de accesos a la información de esta organización
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {[
          { label: 'Accesos hoy', value: loading ? '—' : accesosHoy },
          { label: 'Accesos esta semana', value: loading ? '—' : accesosSemana },
          { label: 'Usuarios únicos', value: loading ? '—' : usuariosUnicos },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#6366f1' }}>{stat.value}</div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <select value={filtroRol} onChange={e => setFiltroRol(e.target.value)}
          style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white', padding: '8px 12px', fontSize: '13px' }}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={filtroSeccion} onChange={e => setFiltroSeccion(e.target.value)}
          style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: '8px', color: 'white', padding: '8px 12px', fontSize: '13px' }}>
          {secciones.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: '#111', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Cargando registros...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#555', fontSize: '13px' }}>
            No hay registros de acceso todavía
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                {['Usuario', 'Rol', 'Sección', 'Acción', 'Fecha', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(acceso => (
                <>
                  <tr
                    key={acceso.id}
                    style={{ borderBottom: '1px solid #1a1a1a', cursor: 'pointer' }}
                    onClick={() => setExpandido(expandido === acceso.id ? null : acceso.id)}
                  >
                    <td style={{ padding: '12px 16px', color: '#e0e0e0' }}>{acceso.usuario || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        backgroundColor: acceso.rol === 'Admin' ? '#1a1a2e' : '#1a1a1a',
                        color: acceso.rol === 'Admin' ? '#6366f1' : '#888',
                        borderRadius: '6px', padding: '2px 8px', fontSize: '12px'
                      }}>{acceso.rol || '—'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#888' }}>{acceso.seccion || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#888' }}>{acceso.action || '—'}</td>
                    <td style={{ padding: '12px 16px', color: '#666' }}>
                      {new Date(acceso.created_at).toLocaleDateString('es-AR')}{' '}
                      {new Date(acceso.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#444' }}>{expandido === acceso.id ? '▲' : '▼'}</td>
                  </tr>
                  {expandido === acceso.id && (
                    <tr key={`exp-${acceso.id}`} style={{ backgroundColor: '#0d0d0d' }}>
                      <td colSpan={6} style={{ padding: '16px' }}>
                        <div style={{ fontSize: '13px', color: '#666', display: 'flex', gap: '24px' }}>
                          <span>📧 {acceso.email || '—'}</span>
                          {acceso.details && <span>📝 {acceso.details}</span>}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}