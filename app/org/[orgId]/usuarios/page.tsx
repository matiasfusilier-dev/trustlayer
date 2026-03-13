'use client';

import { useState } from 'react';

type Tab = 'miembros' | 'terceros';
type Rol = 'Admin' | 'Analista' | 'Viewer';
type Estado = 'Activo' | 'Pendiente' | 'Inactivo';

interface Miembro {
  id: string;
  nombre: string;
  email: string;
  rol: Rol;
  estado: Estado;
  ultimoAcceso: string;
}

interface AccesoTercero {
  id: string;
  empresa: string;
  persona: string;
  email: string;
  secciones: string[];
  desde: string;
}

const miembrosMock: Miembro[] = [
  { id: '1', nombre: 'Matias Fusilier', email: 'matias@trustlayer.com', rol: 'Admin', estado: 'Activo', ultimoAcceso: 'Hoy' },
  { id: '2', nombre: 'Juan Carlos Pérez', email: 'jperez@bancogalicia.com', rol: 'Analista', estado: 'Activo', ultimoAcceso: 'Ayer' },
  { id: '3', nombre: 'María Laura Gómez', email: 'mgomez@bancogalicia.com', rol: 'Viewer', estado: 'Pendiente', ultimoAcceso: '—' },
];

const tercerosMock: AccesoTercero[] = [
  { id: '1', empresa: 'ALYC Sur S.A.', persona: 'Carlos Rodriguez', email: 'crodriguez@alycsur.com', secciones: ['KYC', 'Riesgo Crediticio', 'BCRA'], desde: '01 Feb 2025' },
  { id: '2', empresa: 'SGR Norte', persona: 'Ana Martínez', email: 'amartinez@sgrnorte.com', secciones: ['KYC'], desde: '15 Ene 2025' },
];

const empresasBusqueda = [
  { id: '1', nombre: 'ALYC Sur S.A.', cuit: '30-71234567-8' },
  { id: '2', nombre: 'SGR Norte S.A.', cuit: '30-68901234-5' },
  { id: '3', nombre: 'Banco Provincia', cuit: '30-54321098-7' },
  { id: '4', nombre: 'Galeno Seguros', cuit: '30-45678901-2' },
];

const personasPorEmpresa: Record<string, { id: string; nombre: string; email: string }[]> = {
  '1': [
    { id: 'p1', nombre: 'Carlos Rodriguez', email: 'crodriguez@alycsur.com' },
    { id: 'p2', nombre: 'Laura Sánchez', email: 'lsanchez@alycsur.com' },
  ],
  '2': [
    { id: 'p3', nombre: 'Ana Martínez', email: 'amartinez@sgrnorte.com' },
    { id: 'p4', nombre: 'Pablo Torres', email: 'ptorres@sgrnorte.com' },
  ],
  '3': [
    { id: 'p5', nombre: 'Roberto Díaz', email: 'rdiaz@bapro.com' },
  ],
  '4': [
    { id: 'p6', nombre: 'Sofía López', email: 'slopez@galeno.com' },
  ],
};

const seccionesDisponibles = ['KYC', 'Documentos', 'Apoderados', 'Estructura Societaria', 'Riesgo Crediticio', 'BCRA', 'Mercado & Noticias'];

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

export default function UsuariosPage() {
  const [tab, setTab] = useState<Tab>('miembros');
  const [miembros, setMiembros] = useState<Miembro[]>(miembrosMock);
  const [terceros, setTerceros] = useState<AccesoTercero[]>(tercerosMock);
  const [showInvitar, setShowInvitar] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRol, setInviteRol] = useState<Rol>('Viewer');

  // Terceros form
  const [showFormTercero, setShowFormTercero] = useState(false);
  const [busquedaEmpresa, setBusquedaEmpresa] = useState('');
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<typeof empresasBusqueda[0] | null>(null);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<{ id: string; nombre: string; email: string } | null>(null);
  const [seccionesSeleccionadas, setSeccionesSeleccionadas] = useState<string[]>([]);

  const empresasFiltradas = empresasBusqueda.filter(e =>
    e.nombre.toLowerCase().includes(busquedaEmpresa.toLowerCase()) ||
    e.cuit.includes(busquedaEmpresa)
  );

  const handleInvitar = () => {
    if (!inviteEmail) return;
    const nuevo: Miembro = {
      id: Date.now().toString(),
      nombre: inviteEmail.split('@')[0],
      email: inviteEmail,
      rol: inviteRol,
      estado: 'Pendiente',
      ultimoAcceso: '—',
    };
    setMiembros(prev => [...prev, nuevo]);
    setInviteEmail('');
    setShowInvitar(false);
  };

  const handleOtorgarAcceso = () => {
    if (!empresaSeleccionada || !personaSeleccionada || seccionesSeleccionadas.length === 0) return;
    const nuevo: AccesoTercero = {
      id: Date.now().toString(),
      empresa: empresaSeleccionada.nombre,
      persona: personaSeleccionada.nombre,
      email: personaSeleccionada.email,
      secciones: seccionesSeleccionadas,
      desde: new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setTerceros(prev => [...prev, nuevo]);
    setShowFormTercero(false);
    setEmpresaSeleccionada(null);
    setPersonaSeleccionada(null);
    setSeccionesSeleccionadas([]);
    setBusquedaEmpresa('');
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

      {/* Header */}
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
        {[
          { key: 'miembros', label: '👥 Miembros' },
          { key: 'terceros', label: '🔗 Accesos a terceros' },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
            color: tab === t.key ? 'white' : '#555',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Miembros */}
      {tab === 'miembros' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>{miembros.length} miembros</span>
            <button onClick={() => setShowInvitar(!showInvitar)} style={btnPrimary}>
              + Invitar usuario
            </button>
          </div>

          {showInvitar && (
            <div style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '20px', marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Invitar nuevo usuario</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
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
                <button onClick={handleInvitar} style={btnPrimary}>Enviar invitación</button>
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
            {miembros.map((m) => (
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
                <span style={{ fontSize: '12px', color: '#555' }}>{m.ultimoAcceso}</span>
                <button
                  onClick={() => setMiembros(prev => prev.filter(x => x.id !== m.id))}
                  style={{ background: 'none', border: 'none', color: '#ef444460', cursor: 'pointer', fontSize: '13px' }}
                >Eliminar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Terceros */}
      {tab === 'terceros' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: '#555' }}>{terceros.length} accesos activos</span>
            <button onClick={() => setShowFormTercero(!showFormTercero)} style={btnPrimary}>
              + Otorgar acceso
            </button>
          </div>

          {showFormTercero && (
            <div style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '24px', marginBottom: '16px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Otorgar acceso a tercero</h3>

              {/* Paso 1: Buscar empresa */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Paso 1 — Buscar empresa
                </p>
                <input
                  type="text"
                  placeholder="Buscar por nombre o CUIT..."
                  value={busquedaEmpresa}
                  onChange={(e) => { setBusquedaEmpresa(e.target.value); setEmpresaSeleccionada(null); setPersonaSeleccionada(null); }}
                  style={{ ...inputStyle, marginBottom: '8px' }}
                />
                {busquedaEmpresa && !empresaSeleccionada && (
                  <div style={{ backgroundColor: '#0d0d0d', border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                    {empresasFiltradas.length === 0 ? (
                      <div style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>No se encontraron resultados</div>
                    ) : empresasFiltradas.map((e) => (
                      <div key={e.id} onClick={() => { setEmpresaSeleccionada(e); setBusquedaEmpresa(e.nombre); }}
                        style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #1a1a1a' }}
                        onMouseEnter={(ev) => ev.currentTarget.style.backgroundColor = '#141414'}
                        onMouseLeave={(ev) => ev.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontSize: '13px', color: '#fff' }}>{e.nombre}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>CUIT {e.cuit}</div>
                      </div>
                    ))}
                  </div>
                )}
                {empresaSeleccionada && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#6366f120', border: '1px solid #6366f140', borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: '#6366f1', fontWeight: '600' }}>✓ {empresaSeleccionada.nombre}</span>
                    <span style={{ fontSize: '11px', color: '#555' }}>CUIT {empresaSeleccionada.cuit}</span>
                    <button onClick={() => { setEmpresaSeleccionada(null); setBusquedaEmpresa(''); setPersonaSeleccionada(null); }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}>✕</button>
                  </div>
                )}
              </div>

              {/* Paso 2: Elegir persona */}
              {empresaSeleccionada && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Paso 2 — Elegir persona
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(personasPorEmpresa[empresaSeleccionada.id] || []).map((p) => (
                      <div key={p.id} onClick={() => setPersonaSeleccionada(p)}
                        style={{
                          padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                          border: `1px solid ${personaSeleccionada?.id === p.id ? '#6366f1' : '#333'}`,
                          backgroundColor: personaSeleccionada?.id === p.id ? '#6366f120' : '#0d0d0d',
                        }}>
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{p.nombre}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{p.email}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Paso 3: Secciones */}
              {personaSeleccionada && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Paso 3 — Secciones accesibles
                  </p>
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
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowFormTercero(false); setEmpresaSeleccionada(null); setPersonaSeleccionada(null); setBusquedaEmpresa(''); setSeccionesSeleccionadas([]); }} style={btnSecondary}>Cancelar</button>
                <button onClick={handleOtorgarAcceso} style={{
                  ...btnPrimary,
                  opacity: (!empresaSeleccionada || !personaSeleccionada || seccionesSeleccionadas.length === 0) ? 0.5 : 1,
                  cursor: (!empresaSeleccionada || !personaSeleccionada || seccionesSeleccionadas.length === 0) ? 'not-allowed' : 'pointer',
                }}>Otorgar acceso</button>
              </div>
            </div>
          )}

          {/* Lista terceros */}
          <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 2fr 1fr 80px',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
              fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Empresa</span><span>Persona</span><span>Secciones</span><span>Desde</span><span></span>
            </div>
            {terceros.map((t) => (
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
                <span style={{ fontSize: '12px', color: '#555' }}>{t.desde}</span>
                <button onClick={() => setTerceros(prev => prev.filter(x => x.id !== t.id))}
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