'use client';

import { useState } from 'react';

type KycCheck = 'ok' | 'pendiente' | 'alerta';

interface Apoderado {
  id: string;
  nombre: string;
  dni: string;
  cuil: string;
  nacionalidad: string;
  fechaNacimiento: string;
  domicilio: string;
  cargo: string;
  dniCargado: KycCheck;
  cuilVerificado: KycCheck;
  pep: boolean | null;
}

const checkConfig: Record<KycCheck, { label: string; color: string; bg: string }> = {
  ok: { label: '✓ OK', color: '#22c55e', bg: '#22c55e20' },
  pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#f59e0b20' },
  alerta: { label: '⚠ Alerta', color: '#ef4444', bg: '#ef444420' },
};

const cargos = ['Presidente', 'Vicepresidente', 'Director Titular', 'Director Suplente', 'Apoderado', 'Socio Gerente', 'Síndico', 'Otro'];

const apoderadosMock: Apoderado[] = [
  {
    id: '1', nombre: 'Juan Carlos Pérez', dni: '20.123.456', cuil: '20-20123456-3',
    nacionalidad: 'Argentina', fechaNacimiento: '15/03/1975', domicilio: 'Av. Corrientes 1234, CABA',
    cargo: 'Presidente', dniCargado: 'ok', cuilVerificado: 'ok', pep: false,
  },
  {
    id: '2', nombre: 'María Laura Gómez', dni: '25.987.654', cuil: '27-25987654-1',
    nacionalidad: 'Argentina', fechaNacimiento: '22/07/1982', domicilio: 'Av. Santa Fe 567, CABA',
    cargo: 'Apoderado', dniCargado: 'ok', cuilVerificado: 'pendiente', pep: false,
  },
  {
    id: '3', nombre: 'Roberto Díaz', dni: '18.456.789', cuil: '20-18456789-5',
    nacionalidad: 'Argentina', fechaNacimiento: '08/11/1968', domicilio: 'Reconquista 890, CABA',
    cargo: 'Director Titular', dniCargado: 'pendiente', cuilVerificado: 'pendiente', pep: null,
  },
];

const emptyApoderado = (): Omit<Apoderado, 'id'> => ({
  nombre: '', dni: '', cuil: '', nacionalidad: 'Argentina',
  fechaNacimiento: '', domicilio: '', cargo: 'Apoderado',
  dniCargado: 'pendiente', cuilVerificado: 'pendiente', pep: null,
});

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState<Apoderado[]>(apoderadosMock);
  const [selected, setSelected] = useState<Apoderado | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyApoderado());

  const kycCompleto = (a: Apoderado) => a.dniCargado === 'ok' && a.cuilVerificado === 'ok' && a.pep !== null;

  const handleGuardar = () => {
    if (!form.nombre || !form.dni) return;
    const nuevo: Apoderado = { id: Date.now().toString(), ...form };
    setApoderados(prev => [...prev, nuevo]);
    setForm(emptyApoderado());
    setShowForm(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#0d0d0d', border: '1px solid #333',
    borderRadius: '6px', padding: '8px 12px', color: 'white',
    fontSize: '13px', boxSizing: 'border-box',
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: 'pointer',
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
    <div style={{ padding: '32px', display: 'flex', gap: '24px' }}>

      {/* Lista izquierda */}
      <div style={{ flex: selected ? '0 0 380px' : '1' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>Apoderados</h1>
            <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>{apoderados.length} apoderados registrados</p>
          </div>
          <button onClick={() => { setShowForm(true); setSelected(null); }} style={btnPrimary}>
            + Nuevo apoderado
          </button>
        </div>

        {/* Formulario nuevo apoderado */}
        {showForm && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #1f1f1f',
            borderRadius: '12px', padding: '24px', marginBottom: '16px'
          }}>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              Nuevo apoderado
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              {[
                { label: 'Nombre y apellido *', key: 'nombre', placeholder: 'Ej: Juan Carlos Pérez' },
                { label: 'DNI *', key: 'dni', placeholder: 'Ej: 20.123.456' },
                { label: 'CUIL', key: 'cuil', placeholder: 'Ej: 20-20123456-3' },
                { label: 'Nacionalidad', key: 'nacionalidad', placeholder: 'Ej: Argentina' },
                { label: 'Fecha de nacimiento', key: 'fechaNacimiento', placeholder: 'Ej: 15/03/1975' },
                { label: 'Domicilio', key: 'domicilio', placeholder: 'Ej: Av. Corrientes 1234, CABA' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>{label}</p>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={(form as any)[key]}
                    onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Cargo</p>
              <select
                value={form.cargo}
                onChange={(e) => setForm(prev => ({ ...prev, cargo: e.target.value }))}
                style={selectStyle}
              >
                {cargos.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={btnSecondary}>Cancelar</button>
              <button onClick={handleGuardar} style={btnPrimary}>Guardar apoderado</button>
            </div>
          </div>
        )}

        {/* Lista de apoderados */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {apoderados.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelected(selected?.id === a.id ? null : a)}
              style={{
                backgroundColor: '#111',
                border: `1px solid ${selected?.id === a.id ? '#6366f1' : '#1f1f1f'}`,
                borderRadius: '12px', padding: '20px', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{a.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#555' }}>{a.cargo} · DNI {a.dni}</div>
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  color: kycCompleto(a) ? '#22c55e' : '#f59e0b',
                  backgroundColor: kycCompleto(a) ? '#22c55e20' : '#f59e0b20',
                  padding: '3px 10px', borderRadius: '20px'
                }}>
                  {kycCompleto(a) ? 'KYC completo' : 'KYC incompleto'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px', color: checkConfig[a.dniCargado].color,
                  backgroundColor: checkConfig[a.dniCargado].bg,
                  padding: '2px 8px', borderRadius: '20px'
                }}>DNI {checkConfig[a.dniCargado].label}</span>
                <span style={{
                  fontSize: '11px', color: checkConfig[a.cuilVerificado].color,
                  backgroundColor: checkConfig[a.cuilVerificado].bg,
                  padding: '2px 8px', borderRadius: '20px'
                }}>CUIL {checkConfig[a.cuilVerificado].label}</span>
                <span style={{
                  fontSize: '11px',
                  color: a.pep === null ? '#555' : a.pep ? '#ef4444' : '#22c55e',
                  backgroundColor: a.pep === null ? '#55555520' : a.pep ? '#ef444420' : '#22c55e20',
                  padding: '2px 8px', borderRadius: '20px'
                }}>
                  PEP {a.pep === null ? 'Sin verificar' : a.pep ? '⚠ Sí' : '✓ No'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel detalle derecha */}
      {selected && (
        <div style={{
          flex: 1, backgroundColor: '#111', border: '1px solid #1f1f1f',
          borderRadius: '12px', padding: '24px', alignSelf: 'flex-start',
          position: 'sticky', top: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>{selected.nombre}</h2>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>✕</button>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Datos personales</p>
            {[
              { label: 'Cargo', value: selected.cargo },
              { label: 'DNI', value: selected.dni },
              { label: 'CUIL', value: selected.cuil || '—' },
              { label: 'Nacionalidad', value: selected.nacionalidad },
              { label: 'Fecha de nacimiento', value: selected.fechaNacimiento || '—' },
              { label: 'Domicilio', value: selected.domicilio || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid #1a1a1a'
              }}>
                <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#aaa' }}>{value}</span>
              </div>
            ))}
          </div>

          <div>
            <p style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Estado KYC</p>
            {[
              { label: 'DNI cargado', status: selected.dniCargado },
              { label: 'CUIL verificado', status: selected.cuilVerificado },
            ].map(({ label, status }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 0', borderBottom: '1px solid #1a1a1a'
              }}>
                <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                <span style={{
                  fontSize: '11px', fontWeight: '500',
                  color: checkConfig[status].color, backgroundColor: checkConfig[status].bg,
                  padding: '3px 10px', borderRadius: '20px'
                }}>{checkConfig[status].label}</span>
              </div>
            ))}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '8px 0', borderBottom: '1px solid #1a1a1a'
            }}>
              <span style={{ fontSize: '13px', color: '#555' }}>PEP</span>
              <span style={{
                fontSize: '11px', fontWeight: '500',
                color: selected.pep === null ? '#555' : selected.pep ? '#ef4444' : '#22c55e',
                backgroundColor: selected.pep === null ? '#55555520' : selected.pep ? '#ef444420' : '#22c55e20',
                padding: '3px 10px', borderRadius: '20px'
              }}>
                {selected.pep === null ? 'Sin verificar' : selected.pep ? '⚠ Es PEP' : '✓ No es PEP'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}