'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://llrdjgcswlllxvwemalp.supabase.co',
  'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'
);

type Tab = 'miembros' | 'terceros';
type Rol = 'Admin' | 'Analista' | 'Viewer';
type Estado = 'Activo' | 'Pendiente' | 'Inactivo';

interface Miembro {
  id: string;
  org_id: string;
  nombre: string;
  email: string;
  rol: Rol;
  estado: Estado;
  ultimo_acceso: string | null;
}

interface AccesoTercero {
  id: string;
  org_id: string;
  empresa: string;
  persona: string;
  email: string;
  secciones: string[];
  desde: string;
}

const seccionesDisponibles = ['KYC', 'Documentos', 'Apoderados', 'Estructura Societaria', 'Riesgo Crediticio', 'Mercado & Noticias'];

const rolConfig: Record<Rol, { color: string; bg: string }> = {
  Admin: { color: '#6366f1', bg: '#6366f120' },
  Analista: { color: '#3b82f6', bg: '#3b82f620' },
  Viewer: { color: '#555', bg: '#55555520' },
};

const estadoConfig: Record<Estado, { color: string; bg: string }> = {
  Activo: { color: '#22c55e', bg: '#22c55e20' },
  Pendiente: { color: '#f59e0b', bg: '#f59e0b20' },
  Inactivo: { color: '#555', bg: '#55555520' },
};

export default function UsuariosPage({ params }: { params: { orgId: string } }) {
  const [tab, setTab] = useState<Tab>('miembros');
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [terceros, setTerceros] = useState<AccesoTercero[]>([]);
  const [loading, setLoading] = useState(true);

  const [showInvitar, setShowInvitar] = useState(false);
  const [inviteNombre, setInviteNombre] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRol, setInviteRol] = useState<Rol>('Viewer');
  const [guardandoMiembro, setGuardandoMiembro] = useState(false);

  const [showFormTercero, setShowFormTercero] = useState(false);
  const [terceroEmpresa, setTerceroEmpresa] = useState('');
  const [terceroPersona, setTerceroPersona] = useState('');
  const [terceroEmail, setTerceroEmail] = useState('');
  const [seccionesSeleccionadas, setSeccionesSeleccionadas] = useState<string[]>([]);
  const [guardandoTercero, setGuardandoTercero] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [params.orgId]);

  const cargarDatos = async () => {
    setLoading(true);
    const [{ data: m }, { data: t }] = await Promise.all([
      supabase.from('org_members').select('*').eq('org_id', params.orgId).order('created_at'),
      supabase.from('accesos_terceros').select('*').eq('org_id', params.orgId).order('created_at'),
    ]);
    if (m) setMiembros(m);
    if (t) setTerceros(t);
    setLoading(false);
  };

  const handleInvitar = async () => {
    if (!inviteEmail || !inviteNombre) return;
    setGuardandoMiembro(true);
    const { data, error } = await supabase
      .from('org_members')
      .insert([{ org_id: params.orgId, nombre: inviteNombre, email: inviteEmail, rol: inviteRol, estado: 'Pendiente' }])
      .select().single();
    if (!error && data) {
      setMiembros(prev => [...prev, data]);
      setInviteNombre('');
      setInviteEmail('');
      setShowInvitar(false);
    }
    setGuardandoMiembro(false);
  };

  const handleEliminarMiembro = async (id: string) => {
    await supabase.from('org_members').delete().eq('id', id);
    setMiembros(prev => prev.filter(m => m.id !== id));
  };

  const handleOtorgarAcceso = async () => {
    if (!terceroEmpresa || !terceroPersona || !terceroEmail || seccionesSeleccionadas.length === 0) return;
    setGuardandoTercero(true);
    const { data, error } = await supabase
      .from('accesos_terceros')
      .insert([{ org_id: params.orgId, empresa: terceroEmpresa, persona: terceroPersona, email: terceroEmail, secciones: seccionesSeleccionadas }])
      .select().single();
    if (!error && data) {
      setTerceros(prev => [...prev, data]);
      setTerceroEmpresa('');
      setTerceroPersona('');
      setTerceroEmail('');
      setSeccionesSeleccionadas([]);
      setShowFormTercero(false);
    }
    setGuardandoTercero(false);
  };

  const handleRevocarAcceso = async (id: string) => {
    await supabase.from('accesos_terceros').delete().eq('id', id);
    setTerceros(prev => prev.filter(t => t.id !== id));
  };

  const toggleSeccion = (s: string) => {
    setSeccionesSeleccionadas(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#0d0d0d', border: '1px solid #333',
    borderRadius: '6px', padding: '8px 12px', color: 'white',
    fontSize: '13px', boxSizing: 'border-box',
  };

  const btnPrimary: React.CSSProperties = {
    backgroundColor: '#6366f1', color: 'white', border: 'none',
    borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
  };

  const btnSecondary: React.CSSProperties = {
    backgroundColor: 'transparent', color: '#555', border: '1px solid #333',
    borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Usuarios & Permisos
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Gestioná los miembros de tu organización y los accesos a terceros
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '4px', marginBottom: '24px',
        backgroundColor: '#111', padding: '4px', borderRadius: '10px', width: 'fit-content'
      }}>
        {[{ key: 'miembros', label: '👥 Miembros' }, { key: 'terceros', label: '🔗 Accesos a terceros' }].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
            color: tab === t.key ? 'white' : '#555',
          }}>{t.label}</button>
        ))}
      </div>

      {/* MIEMBROS */}
      {tab === 'miembros' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>
              {loading ? 'Cargando...' : `${miembros.length} miembros`}
            </span>
            <button onClick={() => setShowInvitar(!showInvitar)} style={btnPrimary}>+ Invitar usuario</button>
          </div>

          {showInvitar && (
            <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Invitar nuevo usuario</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Nombre *</p>
                  <input type="text" placeholder="Nombre y apellido" value={inviteNombre}
                    onChange={(e) => setInviteNombre(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Email *</p>
                  <input type="email" placeholder="usuario@empresa.com" value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Rol</p>
                  <select value={inviteRol} onChange={(e) => setInviteRol(e.target.value as Rol)} style={inputStyle}>
                    <option value="Admin">Admin</option>
                    <option value="Analista">Analista</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '12px', marginBottom: '12px', fontSize: '12px', color: '#555' }}>
                {inviteRol === 'Admin' && '⚙ Admin: acceso total, puede invitar usuarios y gestionar permisos'}
                {inviteRol === 'Analista' && '📊 Analista: puede ver y editar información, sin gestión de usuarios'}
                {inviteRol === 'Viewer' && '👁 Viewer: solo lectura, no puede editar ni gestionar'}
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowInvitar(false)} style={btnSecondary}>Cancelar</button>
                <button onClick={handleInvitar} disabled={guardandoMiembro} style={btnPrimary}>
                  {guardandoMiembro ? 'Guardando...' : 'Guardar miembro'}
                </button>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
              fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Usuario</span><span>Rol</span><span>Estado</span><span>Último acceso</span><span></span>
            </div>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Cargando...</div>
            ) : miembros.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>No hay miembros registrados</div>
            ) : miembros.map((m) => (
              <div key={m.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 80px',
                padding: '14px 20px', borderBottom: '1px solid #0f0f0f', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{m.nombre}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{m.email}</div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  color: rolConfig[m.rol].color, backgroundColor: rolConfig[m.rol].bg,
                  padding: '3px 10px', borderRadius: '20px', width: 'fit-content'
                }}>{m.rol}</span>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  color: estadoConfig[m.estado].color, backgroundColor: estadoConfig[m.estado].bg,
                  padding: '3px 10px', borderRadius: '20px', width: 'fit-content'
                }}>{m.estado}</span>
                <span style={{ fontSize: '12px', color: '#555' }}>
                  {m.ultimo_acceso ? new Date(m.ultimo_acceso).toLocaleDateString('es-AR') : '—'}
                </span>
                <button onClick={() => handleEliminarMiembro(m.id)}
                  style={{ background: 'none', border: 'none', color: '#ef444460', cursor: 'pointer', fontSize: '13px' }}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TERCEROS */}
      {tab === 'terceros' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>
              {loading ? 'Cargando...' : `${terceros.length} accesos activos`}
            </span>
            <button onClick={() => setShowFormTercero(!showFormTercero)} style={btnPrimary}>+ Otorgar acceso</button>
          </div>

          {showFormTercero && (
            <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Otorgar acceso a tercero</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Empresa *</p>
                  <input type="text" placeholder="Ej: ALYC Sur S.A." value={terceroEmpresa}
                    onChange={(e) => setTerceroEmpresa(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Persona *</p>
                  <input type="text" placeholder="Nombre y apellido" value={terceroPersona}
                    onChange={(e) => setTerceroPersona(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Email *</p>
                  <input type="email" placeholder="usuario@empresa.com" value={terceroEmail}
                    onChange={(e) => setTerceroEmail(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555' }}>Secciones accesibles *</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {seccionesDisponibles.map((s) => (
                    <button key={s} onClick={() => toggleSeccion(s)} style={{
                      padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: '500',
                      border: `1px solid ${seccionesSeleccionadas.includes(s) ? '#6366f1' : '#333'}`,
                      backgroundColor: seccionesSeleccionadas.includes(s) ? '#6366f120' : 'transparent',
                      color: seccionesSeleccionadas.includes(s) ? '#6366f1' : '#555',
                    }}>{s}</button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowFormTercero(false); setTerceroEmpresa(''); setTerceroPersona(''); setTerceroEmail(''); setSeccionesSeleccionadas([]); }} style={btnSecondary}>Cancelar</button>
                <button onClick={handleOtorgarAcceso} disabled={guardandoTercero} style={{
                  ...btnPrimary,
                  opacity: (!terceroEmpresa || !terceroPersona || !terceroEmail || seccionesSeleccionadas.length === 0) ? 0.5 : 1,
                }}>
                  {guardandoTercero ? 'Guardando...' : 'Otorgar acceso'}
                </button>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 1fr 80px',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
              fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Empresa</span><span>Persona</span><span>Secciones</span><span>Desde</span><span></span>
            </div>
            {loading ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Cargando...</div>
            ) : terceros.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>No hay accesos a terceros registrados</div>
            ) : terceros.map((t) => (
              <div key={t.id} style={{
                display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 1fr 80px',
                padding: '14px 20px', borderBottom: '1px solid #0f0f0f', alignItems: 'center'
              }}>
                <div style={{ fontSize: '13px', fontWeight: '500', color: '#fff' }}>{t.empresa}</div>
                <div>
                  <div style={{ fontSize: '13px', color: '#aaa' }}>{t.persona}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{t.email}</div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {t.secciones.map(s => (
                    <span key={s} style={{
                      fontSize: '10px', color: '#6366f1', backgroundColor: '#6366f120',
                      padding: '2px 8px', borderRadius: '20px'
                    }}>{s}</span>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: '#555' }}>
                  {new Date(t.desde).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
                <button onClick={() => handleRevocarAcceso(t.id)}
                  style={{ background: 'none', border: 'none', color: '#ef444460', cursor: 'pointer', fontSize: '13px' }}>
                  Revocar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}