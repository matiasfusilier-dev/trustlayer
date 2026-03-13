'use client';

import { useState } from 'react';

type TipoAccion = 'Visualización' | 'Subió documento' | 'Invitó usuario' | 'Otorgó acceso' | 'Revocó acceso' | 'Cambió rol' | 'Descargó documento' | 'Generó dictamen';
type Resultado = 'Exitoso' | 'Fallido';
type TipoUsuario = 'Miembro' | 'Tercero';

interface Registro {
  id: string;
  fecha: string;
  hora: string;
  usuario: string;
  email: string;
  tipoUsuario: TipoUsuario;
  empresa: string;
  accion: TipoAccion;
  seccion: string;
  resultado: Resultado;
  detalle: string;
}

const registrosMock: Registro[] = [
  { id: '1', fecha: '13 Mar 2025', hora: '14:32', usuario: 'Matias Fusilier', email: 'matias@trustlayer.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Generó dictamen', seccion: 'Evaluación KYC', resultado: 'Exitoso', detalle: 'Dictamen KYC generado: Aprobado con observaciones' },
  { id: '2', fecha: '13 Mar 2025', hora: '13:15', usuario: 'Carlos Rodriguez', email: 'crodriguez@alycsur.com', tipoUsuario: 'Tercero', empresa: 'ALYC Sur S.A.', accion: 'Visualización', seccion: 'Riesgo Crediticio', resultado: 'Exitoso', detalle: 'Acceso a tab Score & Dictamen' },
  { id: '3', fecha: '13 Mar 2025', hora: '11:48', usuario: 'Juan Carlos Pérez', email: 'jperez@bancogalicia.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Subió documento', seccion: 'Documentos', resultado: 'Exitoso', detalle: 'Balance certificado - Último ejercicio' },
  { id: '4', fecha: '13 Mar 2025', hora: '10:22', usuario: 'Matias Fusilier', email: 'matias@trustlayer.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Otorgó acceso', seccion: 'Usuarios & Permisos', resultado: 'Exitoso', detalle: 'Acceso otorgado a Carlos Rodriguez (ALYC Sur) — KYC, Riesgo Crediticio' },
  { id: '5', fecha: '12 Mar 2025', hora: '16:55', usuario: 'Ana Martínez', email: 'amartinez@sgrnorte.com', tipoUsuario: 'Tercero', empresa: 'SGR Norte', accion: 'Visualización', seccion: 'KYC', resultado: 'Exitoso', detalle: 'Acceso a Evaluación KYC' },
  { id: '6', fecha: '12 Mar 2025', hora: '15:30', usuario: 'María Laura Gómez', email: 'mgomez@bancogalicia.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Visualización', seccion: 'Apoderados', resultado: 'Exitoso', detalle: 'Visualizó ficha de Juan Carlos Pérez' },
  { id: '7', fecha: '12 Mar 2025', hora: '14:10', usuario: 'Matias Fusilier', email: 'matias@trustlayer.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Invitó usuario', seccion: 'Usuarios & Permisos', resultado: 'Exitoso', detalle: 'Invitación enviada a mgomez@bancogalicia.com con rol Viewer' },
  { id: '8', fecha: '12 Mar 2025', hora: '11:05', usuario: 'Carlos Rodriguez', email: 'crodriguez@alycsur.com', tipoUsuario: 'Tercero', empresa: 'ALYC Sur S.A.', accion: 'Visualización', seccion: 'BCRA', resultado: 'Fallido', detalle: 'Sin permisos para acceder a esta sección' },
  { id: '9', fecha: '11 Mar 2025', hora: '17:22', usuario: 'Juan Carlos Pérez', email: 'jperez@bancogalicia.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Subió documento', seccion: 'Documentos', resultado: 'Exitoso', detalle: 'Estatuto social inscripto en IGJ' },
  { id: '10', fecha: '11 Mar 2025', hora: '09:45', usuario: 'Matias Fusilier', email: 'matias@trustlayer.com', tipoUsuario: 'Miembro', empresa: 'Banco Galicia', accion: 'Generó dictamen', seccion: 'Riesgo Crediticio', resultado: 'Exitoso', detalle: 'Dictamen de riesgo generado: Score 82/100 — Riesgo Bajo' },
];

const accionConfig: Record<TipoAccion, { color: string; bg: string; icon: string }> = {
  'Visualización': { color: '#3b82f6', bg: '#3b82f620', icon: '👁' },
  'Subió documento': { color: '#6366f1', bg: '#6366f120', icon: '📄' },
  'Invitó usuario': { color: '#8b5cf6', bg: '#8b5cf620', icon: '👤' },
  'Otorgó acceso': { color: '#22c55e', bg: '#22c55e20', icon: '🔓' },
  'Revocó acceso': { color: '#ef4444', bg: '#ef444420', icon: '🔒' },
  'Cambió rol': { color: '#f59e0b', bg: '#f59e0b20', icon: '⚙' },
  'Descargó documento': { color: '#06b6d4', bg: '#06b6d420', icon: '⬇' },
  'Generó dictamen': { color: '#a855f7', bg: '#a855f720', icon: '🤖' },
};

const resultadoConfig: Record<Resultado, { color: string; bg: string }> = {
  Exitoso: { color: '#22c55e', bg: '#22c55e20' },
  Fallido: { color: '#ef4444', bg: '#ef444420' },
};

const tipoUsuarioConfig: Record<TipoUsuario, { color: string; bg: string }> = {
  Miembro: { color: '#6366f1', bg: '#6366f120' },
  Tercero: { color: '#f59e0b', bg: '#f59e0b20' },
};

export default function AccesosPage() {
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroAccion, setFiltroAccion] = useState('');
  const [filtroSeccion, setFiltroSeccion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const registrosFiltrados = registrosMock.filter(r => {
    const matchUsuario = !filtroUsuario || r.usuario.toLowerCase().includes(filtroUsuario.toLowerCase()) || r.email.toLowerCase().includes(filtroUsuario.toLowerCase());
    const matchAccion = !filtroAccion || r.accion === filtroAccion;
    const matchSeccion = !filtroSeccion || r.seccion === filtroSeccion;
    const matchTipo = !filtroTipo || r.tipoUsuario === filtroTipo;
    return matchUsuario && matchAccion && matchSeccion && matchTipo;
  });

  const secciones = [...new Set(registrosMock.map(r => r.seccion))];
  const acciones = [...new Set(registrosMock.map(r => r.accion))];

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#111', border: '1px solid #1f1f1f',
    borderRadius: '6px', padding: '7px 12px', color: 'white',
    fontSize: '12px', boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1000px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Registro de Accesos
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Historial completo de actividad de miembros y terceros
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total registros', valor: registrosMock.length, color: '#6366f1' },
          { label: 'Accesos miembros', valor: registrosMock.filter(r => r.tipoUsuario === 'Miembro').length, color: '#6366f1' },
          { label: 'Accesos terceros', valor: registrosMock.filter(r => r.tipoUsuario === 'Tercero').length, color: '#f59e0b' },
          { label: 'Accesos fallidos', valor: registrosMock.filter(r => r.resultado === 'Fallido').length, color: '#ef4444' },
        ].map(({ label, valor, color }) => (
          <div key={label} style={{
            backgroundColor: '#111', border: '1px solid #1f1f1f',
            borderRadius: '12px', padding: '16px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color, marginBottom: '4px' }}>{valor}</div>
            <div style={{ fontSize: '12px', color: '#555' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: '#111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '16px', marginBottom: '16px',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'
      }}>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#555' }}>Buscar usuario</p>
          <input type="text" placeholder="Nombre o email..." value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#555' }}>Tipo de usuario</p>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}>
            <option value="">Todos</option>
            <option value="Miembro">Miembro</option>
            <option value="Tercero">Tercero</option>
          </select>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#555' }}>Acción</p>
          <select value={filtroAccion} onChange={(e) => setFiltroAccion(e.target.value)} style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}>
            <option value="">Todas</option>
            {acciones.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#555' }}>Sección</p>
          <select value={filtroSeccion} onChange={(e) => setFiltroSeccion(e.target.value)} style={{ ...inputStyle, width: '100%', cursor: 'pointer' }}>
            <option value="">Todas</option>
            {secciones.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '120px 1.5fr 1fr 1fr 1fr 80px',
          padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
          fontSize: '11px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>
          <span>Fecha / Hora</span>
          <span>Usuario</span>
          <span>Acción</span>
          <span>Sección</span>
          <span>Resultado</span>
          <span></span>
        </div>

        {registrosFiltrados.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>
            No hay registros que coincidan con los filtros
          </div>
        )}

        {registrosFiltrados.map((r) => (
          <div key={r.id}>
            <div style={{
              display: 'grid', gridTemplateColumns: '120px 1.5fr 1fr 1fr 1fr 80px',
              padding: '14px 20px', borderBottom: '1px solid #0f0f0f', alignItems: 'center',
              cursor: 'pointer',
            }} onClick={() => setExpanded(expanded === r.id ? null : r.id)}>
              <div>
                <div style={{ fontSize: '12px', color: '#aaa' }}>{r.fecha}</div>
                <div style={{ fontSize: '11px', color: '#555' }}>{r.hora}</div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{r.usuario}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{
                    fontSize: '10px', fontWeight: '500',
                    color: tipoUsuarioConfig[r.tipoUsuario].color,
                    backgroundColor: tipoUsuarioConfig[r.tipoUsuario].bg,
                    padding: '1px 6px', borderRadius: '20px'
                  }}>{r.tipoUsuario}</span>
                  <span style={{ fontSize: '11px', color: '#555' }}>{r.empresa}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{accionConfig[r.accion].icon}</span>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  color: accionConfig[r.accion].color,
                  backgroundColor: accionConfig[r.accion].bg,
                  padding: '2px 10px', borderRadius: '20px'
                }}>{r.accion}</span>
              </div>
              <span style={{ fontSize: '12px', color: '#aaa' }}>{r.seccion}</span>
              <span style={{
                fontSize: '11px', fontWeight: '500',
                color: resultadoConfig[r.resultado].color,
                backgroundColor: resultadoConfig[r.resultado].bg,
                padding: '2px 10px', borderRadius: '20px', width: 'fit-content'
              }}>{r.resultado}</span>
              <span style={{ fontSize: '12px', color: '#555' }}>{expanded === r.id ? '▲' : '▼'}</span>
            </div>

            {expanded === r.id && (
              <div style={{
                padding: '12px 20px 16px 20px', backgroundColor: '#0d0d0d',
                borderBottom: '1px solid #0f0f0f'
              }}>
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detalle</div>
                <div style={{ fontSize: '13px', color: '#aaa' }}>{r.detalle}</div>
                <div style={{ fontSize: '11px', color: '#444', marginTop: '8px' }}>{r.email}</div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
