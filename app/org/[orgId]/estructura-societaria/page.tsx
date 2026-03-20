'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://llrdjgcswlllxvwemalp.supabase.co',
  'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'
);

interface Accionista {
  id: string;
  org_id: string;
  nombre: string;
  tipo: 'persona_humana' | 'persona_juridica';
  dni_cuit: string;
  porcentaje: number;
  tipo_participacion: string;
}

interface BeneficiarioFinal {
  id: string;
  org_id: string;
  nombre: string;
  dni: string;
  cuil: string;
  nacionalidad: string;
  fecha_nacimiento: string;
  domicilio: string;
  pais_residencia: string;
  porcentaje_directo: number;
  porcentaje_indirecto: number;
  dni_cargado: boolean;
  cuil_verificado: boolean;
  pep: boolean | null;
}

const tiposParticipacion = ['Acciones ordinarias', 'Acciones preferidas', 'Cuotas parte', 'Otro'];

const emptyAccionista = () => ({
  nombre: '', tipo: 'persona_humana' as const, dni_cuit: '', porcentaje: 0, tipo_participacion: 'Acciones ordinarias',
});

const emptyBeneficiario = () => ({
  nombre: '', dni: '', cuil: '', nacionalidad: 'Argentina', fecha_nacimiento: '',
  domicilio: '', pais_residencia: 'Argentina', porcentaje_directo: 0, porcentaje_indirecto: 0,
  dni_cargado: false, cuil_verificado: false, pep: null as boolean | null,
});

export default function EstructuraSocietariaPage({ params }: { params: { orgId: string } }) {
  const [tab, setTab] = useState<'estructura' | 'beneficiarios'>('estructura');
  const [accionistas, setAccionistas] = useState<Accionista[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<BeneficiarioFinal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFormAccionista, setShowFormAccionista] = useState(false);
  const [showFormBeneficiario, setShowFormBeneficiario] = useState(false);
  const [formAccionista, setFormAccionista] = useState(emptyAccionista());
  const [formBeneficiario, setFormBeneficiario] = useState(emptyBeneficiario());
  const [selectedBeneficiario, setSelectedBeneficiario] = useState<BeneficiarioFinal | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [params.orgId]);

  const cargarDatos = async () => {
    setLoading(true);
    const [{ data: a }, { data: b }] = await Promise.all([
      supabase.from('accionistas').select('*').eq('org_id', params.orgId).order('created_at'),
      supabase.from('beneficiarios_finales').select('*').eq('org_id', params.orgId).order('created_at'),
    ]);
    if (a) setAccionistas(a);
    if (b) setBeneficiarios(b);
    setLoading(false);
  };

  const totalPorcentaje = accionistas.reduce((acc, a) => acc + Number(a.porcentaje), 0);

  const handleGuardarAccionista = async () => {
    if (!formAccionista.nombre || !formAccionista.porcentaje) return;
    setGuardando(true);
    const { data, error } = await supabase
      .from('accionistas')
      .insert([{ ...formAccionista, org_id: params.orgId }])
      .select().single();
    if (!error && data) {
      setAccionistas(prev => [...prev, data]);
      setFormAccionista(emptyAccionista());
      setShowFormAccionista(false);
    }
    setGuardando(false);
  };

  const handleEliminarAccionista = async (id: string) => {
    await supabase.from('accionistas').delete().eq('id', id);
    setAccionistas(prev => prev.filter(a => a.id !== id));
  };

  const handleGuardarBeneficiario = async () => {
    if (!formBeneficiario.nombre || !formBeneficiario.dni) return;
    setGuardando(true);
    const { data, error } = await supabase
      .from('beneficiarios_finales')
      .insert([{ ...formBeneficiario, org_id: params.orgId }])
      .select().single();
    if (!error && data) {
      setBeneficiarios(prev => [...prev, data]);
      setFormBeneficiario(emptyBeneficiario());
      setShowFormBeneficiario(false);
    }
    setGuardando(false);
  };

  const handleEliminarBeneficiario = async (id: string) => {
    await supabase.from('beneficiarios_finales').delete().eq('id', id);
    setBeneficiarios(prev => prev.filter(b => b.id !== id));
    setSelectedBeneficiario(null);
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
          <button key={t.key} onClick={() => setTab(t.key as any)} style={{
            padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            backgroundColor: tab === t.key ? '#6366f1' : 'transparent',
            color: tab === t.key ? 'white' : '#555',
          }}>{t.label}</button>
        ))}
      </div>

      {/* TAB: Composición accionaria */}
      {tab === 'estructura' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '13px', color: totalPorcentaje === 100 ? '#22c55e' : '#f59e0b' }}>
              {loading ? 'Cargando...' : totalPorcentaje === 100 ? '✓ Capital distribuido al 100%' : `⚠ Total cargado: ${totalPorcentaje}% (debe sumar 100%)`}
            </div>
            <button onClick={() => setShowFormAccionista(!showFormAccionista)} style={btnPrimary}>
              + Agregar accionista
            </button>
          </div>

          {showFormAccionista && (
            <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
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
                    onChange={(e) => setFormAccionista(p => ({ ...p, tipo: e.target.value as any }))} style={inputStyle}>
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
                  <select value={formAccionista.tipo_participacion}
                    onChange={(e) => setFormAccionista(p => ({ ...p, tipo_participacion: e.target.value }))} style={inputStyle}>
                    {tiposParticipacion.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => setShowFormAccionista(false)} style={btnSecondary}>Cancelar</button>
                <button onClick={handleGuardarAccionista} disabled={guardando} style={btnPrimary}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          )}

          <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
              padding: '12px 20px', borderBottom: '1px solid #1a1a1a',
              fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Nombre / Razón social</span><span>Tipo</span><span>Participación</span><span>% Capital</span><span></span>
            </div>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Cargando...</div>
            ) : accionistas.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>No hay accionistas registrados</div>
            ) : accionistas.map((a) => (
              <div key={a.id} style={{
                display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
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
                <span style={{ fontSize: '12px', color: '#aaa' }}>{a.tipo_participacion}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
                    <div style={{ width: `${a.porcentaje}%`, height: '4px', backgroundColor: '#6366f1', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1', minWidth: '36px' }}>{a.porcentaje}%</span>
                </div>
                <button onClick={() => handleEliminarAccionista(a.id)}
                  style={{ background: 'none', border: 'none', color: '#ef444460', cursor: 'pointer', fontSize: '13px' }}>
                  ✕
                </button>
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
              <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
                <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>Nuevo beneficiario final</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  {[
                    { label: 'Nombre y apellido *', key: 'nombre', placeholder: 'Ej: Juan Carlos Pérez' },
                    { label: 'DNI *', key: 'dni', placeholder: 'Ej: 20.123.456' },
                    { label: 'CUIL', key: 'cuil', placeholder: 'Ej: 20-20123456-3' },
                    { label: 'Nacionalidad', key: 'nacionalidad', placeholder: 'Ej: Argentina' },
                    { label: 'Fecha de nacimiento', key: 'fecha_nacimiento', placeholder: 'Ej: 15/03/1975' },
                    { label: 'País de residencia', key: 'pais_residencia', placeholder: 'Ej: Argentina' },
                    { label: 'Domicilio', key: 'domicilio', placeholder: 'Ej: Av. Corrientes 1234, CABA' },
                    { label: '% Participación directa', key: 'porcentaje_directo', placeholder: 'Ej: 45' },
                    { label: '% Participación indirecta', key: 'porcentaje_indirecto', placeholder: 'Ej: 0' },
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
                  <button onClick={handleGuardarBeneficiario} disabled={guardando} style={btnPrimary}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#555', fontSize: '13px' }}>Cargando...</div>
            ) : beneficiarios.length === 0 ? (
              <div style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
                <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>No hay beneficiarios finales registrados</p>
              </div>
            ) : (
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
                        {b.porcentaje_directo > 0 && (
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#6366f1' }}>{b.porcentaje_directo}% directo</div>
                        )}
                        {b.porcentaje_indirecto > 0 && (
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6' }}>{b.porcentaje_indirecto}% indirecto</div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                        color: b.dni_cargado ? '#22c55e' : '#f59e0b',
                        backgroundColor: b.dni_cargado ? '#22c55e20' : '#f59e0b20',
                      }}>DNI {b.dni_cargado ? '✓ OK' : 'Pendiente'}</span>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                        color: b.cuil_verificado ? '#22c55e' : '#f59e0b',
                        backgroundColor: b.cuil_verificado ? '#22c55e20' : '#f59e0b20',
                      }}>CUIL {b.cuil_verificado ? '✓ OK' : 'Pendiente'}</span>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px', borderRadius: '20px',
                        color: b.pep === null ? '#555' : b.pep ? '#ef4444' : '#22c55e',
                        backgroundColor: b.pep === null ? '#55555520' : b.pep ? '#ef444420' : '#22c55e20',
                      }}>PEP {b.pep === null ? 'Sin verificar' : b.pep ? '⚠ Sí' : '✓ No'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                { label: 'Fecha de nacimiento', value: selectedBeneficiario.fecha_nacimiento || '—' },
                { label: 'País de residencia', value: selectedBeneficiario.pais_residencia },
                { label: 'Domicilio', value: selectedBeneficiario.domicilio || '—' },
                { label: '% Participación directa', value: `${selectedBeneficiario.porcentaje_directo}%` },
                { label: '% Participación indirecta', value: `${selectedBeneficiario.porcentaje_indirecto}%` },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid #1a1a1a'
                }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                  <span style={{ fontSize: '13px', color: '#aaa' }}>{value}</span>
                </div>
              ))}
              <button onClick={() => handleEliminarBeneficiario(selectedBeneficiario.id)}
                style={{
                  width: '100%', backgroundColor: 'transparent', color: '#ef4444',
                  border: '1px solid #ef444440', borderRadius: '6px',
                  padding: '8px', fontSize: '13px', cursor: 'pointer', marginTop: '16px'
                }}>
                Eliminar beneficiario
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}