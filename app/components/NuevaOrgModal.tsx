'use client';

import { useState } from 'react';
import { supabase } from '../../src/lib/supabase';

interface Props {
  onClose: () => void;
  onCreated: (org: any) => void;
}

const pasos = ['Datos básicos', 'Tipo', 'Tamaño & Sector', 'Confirmación'];

const tipos = ['Banco', 'ALYC', 'SGR', 'Compañía de Seguro', 'Empresa', 'Otro'];
const tamanios = ['Micro', 'Pequeña', 'Mediana', 'Grande'];
const sectores = ['Agro', 'Construcción', 'Finanzas', 'Industria', 'Servicios', 'Tecnología', 'Comercio', 'Otro'];

export default function NuevaOrgModal({ onClose, onCreated }: Props) {
  const [paso, setPaso] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    name: '', cuit: '', type: '', size: '', sector: '',
  });

  const handleGuardar = async () => {
    if (!form.name || !form.cuit) return;
    setGuardando(true);
    const { data, error } = await supabase
      .from('organizations')
      .insert([{ ...form, kyc_status: 'pendiente', risk_score: null }])
      .select().single();
    if (!error && data) {
      onCreated(data);
      onClose();
    }
    setGuardando(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#0d0d0d', border: '1px solid #333',
    borderRadius: '6px', padding: '10px 12px', color: 'white',
    fontSize: '14px', boxSizing: 'border-box',
  };

  const btnPrimary: React.CSSProperties = {
    backgroundColor: '#6366f1', color: 'white', border: 'none',
    borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer',
  };

  const btnSecondary: React.CSSProperties = {
    backgroundColor: 'transparent', color: '#555', border: '1px solid #333',
    borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#000000aa',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#111', border: '1px solid #1f1f1f',
        borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90vw'
      }}>
        {/* Pasos */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {pasos.map((p, i) => (
            <div key={p} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', margin: '0 auto 4px',
                backgroundColor: i <= paso ? '#6366f1' : '#1f1f1f',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', color: i <= paso ? 'white' : '#555'
              }}>{i + 1}</div>
              <div style={{ fontSize: '10px', color: i === paso ? '#6366f1' : '#555' }}>{p}</div>
            </div>
          ))}
        </div>

        {/* Paso 0 */}
        {paso === 0 && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#fff' }}>Datos básicos</h2>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#555' }}>Nombre de la organización *</p>
              <input type="text" placeholder="Ej: Empresa XYZ S.A." value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#555' }}>CUIT *</p>
              <input type="text" placeholder="Ej: 30-71234567-8" value={form.cuit}
                onChange={(e) => setForm(p => ({ ...p, cuit: e.target.value }))} style={inputStyle} />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} style={btnSecondary}>Cancelar</button>
              <button onClick={() => setPaso(1)} disabled={!form.name || !form.cuit} style={btnPrimary}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Paso 1 */}
        {paso === 1 && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#fff' }}>Tipo de organización</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
              {tipos.map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, type: t }))} style={{
                  padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                  border: `1px solid ${form.type === t ? '#6366f1' : '#333'}`,
                  backgroundColor: form.type === t ? '#6366f120' : 'transparent',
                  color: form.type === t ? '#6366f1' : '#aaa',
                }}>{t}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setPaso(0)} style={btnSecondary}>Atrás</button>
              <button onClick={() => setPaso(2)} disabled={!form.type} style={btnPrimary}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Paso 2 */}
        {paso === 2 && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#fff' }}>Tamaño & Sector</h2>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>Tamaño</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {tamanios.map(t => (
                <button key={t} onClick={() => setForm(p => ({ ...p, size: t }))} style={{
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                  border: `1px solid ${form.size === t ? '#6366f1' : '#333'}`,
                  backgroundColor: form.size === t ? '#6366f120' : 'transparent',
                  color: form.size === t ? '#6366f1' : '#aaa',
                }}>{t}</button>
              ))}
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#555' }}>Sector</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
              {sectores.map(s => (
                <button key={s} onClick={() => setForm(p => ({ ...p, sector: s }))} style={{
                  padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                  border: `1px solid ${form.sector === s ? '#6366f1' : '#333'}`,
                  backgroundColor: form.sector === s ? '#6366f120' : 'transparent',
                  color: form.sector === s ? '#6366f1' : '#aaa',
                }}>{s}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setPaso(1)} style={btnSecondary}>Atrás</button>
              <button onClick={() => setPaso(3)} disabled={!form.size || !form.sector} style={btnPrimary}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Paso 3 */}
        {paso === 3 && (
          <div>
            <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#fff' }}>Confirmación</h2>
            {[
              { label: 'Nombre', value: form.name },
              { label: 'CUIT', value: form.cuit },
              { label: 'Tipo', value: form.type },
              { label: 'Tamaño', value: form.size },
              { label: 'Sector', value: form.sector },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #1a1a1a' }}>
                <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#aaa', fontWeight: '500' }}>{value || '—'}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button onClick={() => setPaso(2)} style={btnSecondary}>Atrás</button>
              <button onClick={handleGuardar} disabled={guardando} style={btnPrimary}>
                {guardando ? 'Creando...' : 'Crear organización'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}