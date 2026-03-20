'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const tipos = ['Banco', 'Empresa', 'ALYC', 'SGR', 'Seguro'];
const tamanios = ['PyME', 'Empresa', 'Corporate'];
const sectores = ['Agro', 'Tecnología', 'Construcción', 'Finanzas', 'Salud', 'Retail', 'Industria', 'Energía', 'Otro'];

interface Props {
  onClose: () => void;
  onCrear: (org: any) => void;
}

export default function NuevaOrgModal({ onClose, onCrear }: Props) {
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState('');
  const [cuit, setCuit] = useState('');
  const [tipo, setTipo] = useState('');
  const [tamanio, setTamanio] = useState('');
  const [sector, setSector] = useState('');

  const formatCuit = (val: string) => {
    const nums = val.replace(/\D/g, '').slice(0, 11);
    if (nums.length <= 2) return nums;
    if (nums.length <= 10) return `${nums.slice(0,2)}-${nums.slice(2)}`;
    return `${nums.slice(0,2)}-${nums.slice(2,10)}-${nums.slice(10)}`;
  };

  const handleCrear = () => {
    onCrear({ nombre, cuit, tipo, tamanio, sector });
    onClose();
  };

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  };

  const modal: React.CSSProperties = {
    backgroundColor: '#111', border: '1px solid #222',
    borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px',
    position: 'relative',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#0d0d0d', border: '1px solid #333',
    borderRadius: '8px', padding: '10px 14px', color: 'white',
    fontSize: '14px', boxSizing: 'border-box', outline: 'none',
  };

  const btnPrimary: React.CSSProperties = {
    backgroundColor: '#6366f1', color: 'white', border: 'none',
    borderRadius: '8px', padding: '10px 20px', fontSize: '14px',
    cursor: 'pointer', fontWeight: '500',
  };

  const btnSecondary: React.CSSProperties = {
    backgroundColor: 'transparent', color: '#555', border: '1px solid #333',
    borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer',
  };

  return (
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={modal}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: 'white' }}>Nueva organización</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
          {[1,2,3,4].map(n => (
            <div key={n} style={{
              flex: 1, height: '3px', borderRadius: '99px',
              backgroundColor: n <= paso ? '#6366f1' : '#222',
              transition: 'background-color 0.2s',
            }} />
          ))}
        </div>

        {/* PASO 1 */}
        {paso === 1 && (
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Paso 1 — Identificación</p>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'white' }}>¿Cómo se llama la organización?</h3>
            <div style={{ marginBottom: '14px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#555' }}>Razón social *</p>
              <input
                type="text" placeholder="Ej: Banco Galicia S.A."
                value={nombre} onChange={e => setNombre(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#555' }}>CUIT *</p>
              <input
                type="text" placeholder="XX-XXXXXXXX-X"
                value={cuit} onChange={e => setCuit(formatCuit(e.target.value))}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setPaso(2)}
                disabled={!nombre || cuit.length < 13}
                style={{ ...btnPrimary, opacity: (!nombre || cuit.length < 13) ? 0.4 : 1, cursor: (!nombre || cuit.length < 13) ? 'not-allowed' : 'pointer' }}
              >Siguiente →</button>
            </div>
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Paso 2 — Tipo</p>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'white' }}>¿Qué tipo de organización es?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
              {tipos.map(t => (
                <div key={t} onClick={() => setTipo(t)} style={{
                  padding: '16px 12px', borderRadius: '10px', textAlign: 'center',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                  border: `1px solid ${tipo === t ? '#6366f1' : '#222'}`,
                  backgroundColor: tipo === t ? '#6366f120' : '#0d0d0d',
                  color: tipo === t ? '#6366f1' : '#666',
                  transition: 'all 0.15s',
                }}>{t}</div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPaso(1)} style={btnSecondary}>← Atrás</button>
              <button onClick={() => setPaso(3)} disabled={!tipo}
                style={{ ...btnPrimary, opacity: !tipo ? 0.4 : 1, cursor: !tipo ? 'not-allowed' : 'pointer' }}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Paso 3 — Datos</p>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'white' }}>Tamaño y sector</h3>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555' }}>Tamaño</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {tamanios.map(t => (
                  <div key={t} onClick={() => setTamanio(t)} style={{
                    flex: 1, padding: '10px', borderRadius: '8px', textAlign: 'center',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                    border: `1px solid ${tamanio === t ? '#6366f1' : '#222'}`,
                    backgroundColor: tamanio === t ? '#6366f120' : '#0d0d0d',
                    color: tamanio === t ? '#6366f1' : '#666',
                  }}>{t}</div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555' }}>Sector / industria</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {sectores.map(s => (
                  <div key={s} onClick={() => setSector(s)} style={{
                    padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '500',
                    border: `1px solid ${sector === s ? '#6366f1' : '#222'}`,
                    backgroundColor: sector === s ? '#6366f120' : 'transparent',
                    color: sector === s ? '#6366f1' : '#555',
                  }}>{s}</div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPaso(2)} style={btnSecondary}>← Atrás</button>
              <button onClick={() => setPaso(4)} disabled={!tamanio || !sector}
                style={{ ...btnPrimary, opacity: (!tamanio || !sector) ? 0.4 : 1, cursor: (!tamanio || !sector) ? 'not-allowed' : 'pointer' }}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 4 */}
        {paso === 4 && (
          <div>
            <p style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#6366f1', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Paso 4 — Confirmación</p>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', color: 'white' }}>Revisá los datos</h3>
            <div style={{ backgroundColor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
              {[
                { label: 'Razón social', value: nombre },
                { label: 'CUIT', value: cuit },
                { label: 'Tipo', value: tipo },
                { label: 'Tamaño', value: tamanio },
                { label: 'Sector', value: sector },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid #1a1a1a',
                }}>
                  <span style={{ fontSize: '13px', color: '#555' }}>{item.label}</span>
                  <span style={{ fontSize: '13px', color: 'white', fontWeight: '500' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setPaso(3)} style={btnSecondary}>← Atrás</button>
              <button onClick={handleCrear} style={{ ...btnPrimary, backgroundColor: '#22c55e' }}>
                ✓ Crear organización
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}