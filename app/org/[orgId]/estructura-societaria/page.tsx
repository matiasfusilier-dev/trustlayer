'use client';

import { useState } from 'react';

interface Accionista {
  id: string;
  nombre: string;
  tipo: 'persona_humana' | 'persona_juridica';
  dni_cuit: string;
  porcentaje: number;
  tipoParticipacion: string;
}

interface BeneficiarioFinal {
  id: string;
  nombre: string;
  dni: string;
  cuil: string;
  nacionalidad: string;
  fechaNacimiento: string;
  domicilio: string;
  paisResidencia: string;
  porcentajeDirecto: number;
  porcentajeIndirecto: number;
  dniCargado: boolean;
  cuilVerificado: boolean;
  pep: boolean | null;
}

const accionistasMock: Accionista[] = [
  { id: '1', nombre: 'Juan Carlos Pérez', tipo: 'persona_humana', dni_cuit: '20-20123456-3', porcentaje: 45, tipoParticipacion: 'Acciones ordinarias' },
  { id: '2', nombre: 'Holding XYZ S.A.', tipo: 'persona_juridica', dni_cuit: '30-98765432-1', porcentaje: 35, tipoParticipacion: 'Acciones ordinarias' },
  { id: '3', nombre: 'María Laura Gómez', tipo: 'persona_humana', dni_cuit: '27-25987654-1', porcentaje: 20, tipoParticipacion: 'Acciones preferidas' },
];

const beneficiariosMock: BeneficiarioFinal[] = [
  {
    id: '1', nombre: 'Juan Carlos Pérez', dni: '20.123.456', cuil: '20-20123456-3',
    nacionalidad: 'Argentina', fechaNacimiento: '15/03/1975', domicilio: 'Av. Corrientes 1234, CABA',
    paisResidencia: 'Argentina', porcentajeDirecto: 45, porcentajeIndirecto: 0,
    dniCargado: true, cuilVerificado: true, pep: false,
  },
  {
    id: '2', nombre: 'Roberto Díaz', dni: '18.456.789', cuil: '20-18456789-5',
    nacionalidad: 'Argentina', fechaNacimiento: '08/11/1968', domicilio: 'Reconquista 890, CABA',
    paisResidencia: 'Argentina', porcentajeDirecto: 0, porcentajeIndirecto: 35,
    dniCargado: false, cuilVerificado: false, pep: null,
  },
  {
    id: '3', nombre: 'María Laura Gómez', dni: '25.987.654', cuil: '27-25987654-1',
    nacionalidad: 'Argentina', fechaNacimiento: '22/07/1982', domicilio: 'Av. Santa Fe 567, CABA',
    paisResidencia: 'Argentina', porcentajeDirecto: 20, porcentajeIndirecto: 0,
    dniCargado: true, cuilVerificado: false, pep: null,
  },
];

const tiposParticipacion = ['Acciones ordinarias', 'Acciones preferidas', 'Cuotas parte', 'Otro'];

const emptyAccionista = (): Omit<Accionista, 'id'> => ({
  nombre: '', tipo: 'persona_humana', dni_cuit: '', porcentaje: 0, tipoParticipacion: 'Acciones ordinarias',
});

const emptyBeneficiario = (): Omit<BeneficiarioFinal, 'id'> => ({
  nombre: '', dni: '', cuil: '', nacionalidad: 'Argentina', fechaNacimiento: '',
  domicilio: '', paisResidencia: 'Argentina', porcentajeDirecto: 0, porcentajeIndirecto: 0,
  dniCargado: false, cuilVerificado: false, pep: null,
});

export default function EstructuraSocietariaPage() {
  const [tab, setTab] = useState<'estructura' | 'beneficiarios'>('estructura');
  const [accionistas, setAccionistas] = useState<Accionista[]>(accionistasMock);
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioFinal[]>(beneficiariosMock);
  const [showFormAccionista, setShowFormAccionista] = useState(false);
  const [showFormBeneficiario, setShowFormBeneficiario] = useState(false);
  const [formAccionista, setFormAccionista] = useState(emptyAccionista());
  const [formBeneficiario, setFormBeneficiario] = useState(emptyBeneficiario());
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<BeneficiarioFinal | null>(null);

  const totalPorcentaje = accionistas.reduce((acc, a) => acc + a.porcentaje, 0);

  const handleGuardarAccionista = () => {
    if (!formAccionista.nombre || !formAccionista.porcentaje) return;
    setAccionistas(prev => [...prev, { id: Date.now().toString(), ...formAccionista }]);
    setFormAccionista(emptyAccionista());
    setShowFormAccionista(false);
  };

  const handleGuardarBeneficiario = () => {
    if (!formBeneficiario.nombre || !formBeneficiario.dni) return;
    setBeneficiarios(prev => [...prev, { id: Date.now().toString(), ...formBeneficiario }]);
    setFormBeneficiario(emptyBeneficiario());
    setShowFormBeneficiario(false);
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
    <div style={{ padding: '32px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Estructura Societaria
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Composición accionaria y beneficiarios finales según normativa UIF
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#111', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        {[
          { key: 'estructura', label: 'Composición accionaria' },
          { key: 'beneficiarios', label: 'Beneficiarios finales' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: '500',
              backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
              color: tab === t.key ? 'white' : '#555',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Composición accionaria */}
      {tab === 'estructura' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: totalPorcentaje === 100 ? '#22c55e' : '#f59e0b' }}>
              {totalPorcentaje === 100 ? '✓ Capital distribuido al 100%' : `⚠ Total cargado: ${totalPorcentaje}% (debe sumar 100%)`}
            </div>
            <button onClick={() => setShowFormAccionista(!showFormAccionista)} style={btnPrimary}>
              + Agregar accionista
            </button>
          </div>

          {showFormAccionista && (
            <div style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '24px', marginBottom: '16px'
            }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Nuevo accionista</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Nombre / Razón social *</p>
                  <input type="text" placeholder="Ej: Juan Pérez o Holding XYZ S.A." value={formAccionista.nombre}
                    onChange={(e) => setFormAccionista(p => ({ ...p, nombre: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>DNI / CUIT</p>
                  <input type="text" placeholder="Ej: 20-20123456-3" value={formAccionista.dni_cuit}
                    onChange={(e) => setFormAccionista(p => ({ ...p, dni_cuit: e.target.value }))} style={inputStyle} />
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Tipo de accionista</p>
                  <select value={formAccionista.tipo}
                    onChange={(e) => setFormAccionista(p => ({ ...p, tipo: e.target.value as any }))}
                    style={inputStyle}>
                    <option value="persona_humana">Persona humana</option>
                    <option value="persona_juridica">Persona jurídica</option>
                  </select>
                </div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Porcentaje de participación *</p>
                  <input type="number" placeholder="Ej: 45" min={0} max={100} value={formAccionista.porcentaje || ''}
                    onChange={(e) => setFormAccionista(p => ({ ...p, porcentaje: Number(e.target.value) }))} style={inputStyle} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>Tipo de participación</p>
                  <select value={formAccionista.tipoParticipacion}
                    onChange={(e) => setFormAccionista(p => ({ ...p, tipoParticipacion: e.target.value }))}
                    style={inputStyle}>
                    {tiposParticipacion.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowFormAccionista(false)} style={btnSecondary}>Cancelar</button>
                <button onClick={handleGuardarAccionista} style={btnPrimary}>Guardar</button>
              </div>
            </div>
          )}

          {/* Tabla accionistas */}
          <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
              fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Nombre / Razón social</span>
              <span>Tipo</span>
              <span>Participación</span>
              <span>% Capital</span>
            </div>
            {accionistas.map((a) => (
              <div key={a.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                padding: '14px 20px', borderBottom: '1px solid #1a1a1a', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '500' }}>{a.nombre}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{a.dni_cuit}</div>
                </div>
                <span style={{
                  fontSize: '11px', color: a.tipo === 'persona_humana' ? '#6366f1' : '#3b82f6',
                  backgroundColor: a.tipo === 'persona_humana' ? '#6366f120' : '#3b82f620',
                  padding: '2px 8px', borderRadius: '20px', width: 'fit-content'
                }}>
                  {a.tipo === 'persona_humana' ? 'Persona humana' : 'Persona jurídica'}
                </span>
                <span style={{ fontSize: '12px', color: '#aaa' }}>{a.tipoParticipacion}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
                    <div style={{ width: `${a.porcentaje}%`, height: '4px', backgroundColor: '#6366f1', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', minWidth: '36px' }}>{a.porcentaje}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Beneficiarios finales */}
      {tab === 'beneficiarios' && (
        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ flex: selectedBeneficiario ? '0 0 420px' : '1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                Personas humanas con participación directa o indirecta mayor al 20%
              </p>
              <button onClick={() => { setShowFormBeneficiario(!showFormBeneficiario); setSelectedBeneficiario(null); }} style={btnPrimary}>
                + Agregar
              </button>
            </div>

            {showFormBeneficiario && (
              <div style={{
                backgroundColor: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '24px', marginBottom: '16px'
              }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Nuevo beneficiario final</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  {[
                    { label: 'Nombre y apellido *', key: 'nombre', placeholder: 'Ej: Juan Carlos Pérez' },
                    { label: 'DNI *', key: 'dni', placeholder: 'Ej: 20.123.456' },
                    { label: 'CUIL', key: 'cuil', placeholder: 'Ej: 20-20123456-3' },
                    { label: 'Nacionalidad', key: 'nacionalidad', placeholder: 'Ej: Argentina' },
                    { label: 'Fecha de nacimiento', key: 'fechaNacimiento', placeholder: 'Ej: 15/03/1975' },
                    { label: 'País de residencia', key: 'paisResidencia', placeholder: 'Ej: Argentina' },
                    { label: 'Domicilio', key: 'domicilio', placeholder: 'Ej: Av. Corrientes 1234, CABA' },
                    { label: '% Participación directa', key: 'porcentajeDirecto', placeholder: 'Ej: 45' },
                    { label: '% Participación indirecta', key: 'porcentajeIndirecto', placeholder: 'Ej: 0' },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key} style={key === 'domicilio' ? { gridColumn: '1 / -1' } : {}}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#555' }}>{label}</p>
                      <input type="text" placeholder={placeholder}
                        value={(formBeneficiario as any)[key]}
                        onChange={(e) => setFormBeneficiario(p => ({ ...p, [key]: e.target.value }))}
                        style={inputStyle} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowFormBeneficiario(false)} style={btnSecondary}>Cancelar</button>
                  <button onClick={handleGuardarBeneficiario} style={btnPrimary}>Guardar</button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {beneficiarios.map((b) => (
                <div key={b.id} onClick={() => setSelectedBeneficiario(selectedBeneficiario?.id === b.id ? null : b)}
                  style={{
                    backgroundColor: '#111',
                    border: `1px solid ${selectedBeneficiario?.id === b.id ? '#6366f1' : '#1f1f1f'}`,
                    borderRadius: '12px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px', color: '#fff', marginBottom: '2px' }}>{b.nombre}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>DNI {b.dni} · {b.nacionalidad}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {b.porcentajeDirecto > 0 && (
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1' }}>{b.porcentajeDirecto}% directo</div>
                      )}
                      {b.porcentajeIndirecto > 0 && (
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6' }}>{b.porcentajeIndirecto}% indirecto</div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                      color: b.dniCargado ? '#22c55e' : '#f59e0b',
                      backgroundColor: b.dniCargado ? '#22c55e20' : '#f59e0b20',
                    }}>DNI {b.dniCargado ? '✓ OK' : 'Pendiente'}</span>
                    <span style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                      color: b.cuilVerificado ? '#22c55e' : '#f59e0b',
                      backgroundColor: b.cuilVerificado ? '#22c55e20' : '#f59e0b20',
                    }}>CUIL {b.cuilVerificado ? '✓ OK' : 'Pendiente'}</span>
                    <span style={{
                      fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                      color: b.pep === null ? '#555' : b.pep ? '#ef4444' : '#22c55e',
                      backgroundColor: b.pep === null ? '#55555520' : b.pep ? '#ef444420' : '#22c55e20',
                    }}>PEP {b.pep === null ? 'Sin verificar' : b.pep ? '⚠ Sí' : '✓ No'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel detalle */}
          {selectedBeneficiario && (
            <div style={{
              flex: 1, backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '24px', alignSelf: 'flex-start',
              position: 'sticky', top: '32px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#fff' }}>{selectedBeneficiario.nombre}</h2>
                <button onClick={() => setSelectedBeneficiario(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>✕</button>
              </div>
              {[
                { label: 'DNI', value: selectedBeneficiario.dni },
                { label: 'CUIL', value: selectedBeneficiario.cuil || '—' },
                { label: 'Nacionalidad', value: selectedBeneficiario.nacionalidad },
                { label: 'Fecha de nacimiento', value: selectedBeneficiario.fechaNacimiento || '—' },
                { label: 'País de residencia', value: selectedBeneficiario.paisResidencia },
                { label: 'Domicilio', value: selectedBeneficiario.domicilio || '—' },
                { label: '% Participación directa', value: `${selectedBeneficiario.porcentajeDirecto}%` },
                { label: '% Participación indirecta', value: `${selectedBeneficiario.porcentajeIndirecto}%` },
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
          )}
        </div>
      )}
    </div>
  );
}