'use client';

import { useState } from 'react';

const apoderados = [
  {
    id: '1',
    nombre: 'Juan Carlos Pérez',
    cargo: 'Presidente',
    dni: '20.123.456',
    resumen: 'Ejecutivo con más de 25 años de experiencia en el sector financiero argentino. Ex Director de Banco Nación y actual Presidente de Banco Galicia. Especialista en mercados de capitales y finanzas corporativas.',
    linkedin: {
      url: 'https://linkedin.com/in/juancarlosperez',
      cargoActual: 'Presidente — Banco Galicia',
      empresa: 'Banco Galicia',
      ubicacion: 'Buenos Aires, Argentina',
      conexiones: '500+',
      extracto: 'Líder en el sector financiero con foco en transformación digital bancaria y desarrollo de productos de crédito corporativo.',
    },
    twitter: {
      handle: '@jcperez_fin',
      ultimoTweet: 'El sistema financiero argentino necesita mayor previsibilidad regulatoria para fomentar el crédito productivo. Seguimos trabajando en esa dirección. 🇦🇷',
      fecha: 'Hace 2 días',
      likes: 84,
      retweets: 23,
    },
    noticias: [
      { titulo: 'Banco Galicia anuncia nuevo plan de créditos PyME', fuente: 'El Cronista', fecha: 'Mar 2025', url: '#' },
      { titulo: 'Juan Carlos Pérez expone en el Congreso de Banca Argentina', fuente: 'Infobae', fecha: 'Feb 2025', url: '#' },
      { titulo: 'Perspectivas del crédito corporativo en Argentina 2025', fuente: 'Ámbito', fecha: 'Ene 2025', url: '#' },
    ],
  },
  {
    id: '2',
    nombre: 'María Laura Gómez',
    cargo: 'Apoderada',
    dni: '25.987.654',
    resumen: 'Abogada corporativa especializada en derecho bancario y mercado de capitales. Socia del estudio Gómez & Asociados. Docente universitaria en UBA y UTDT.',
    linkedin: {
      url: 'https://linkedin.com/in/marialaura-gomez',
      cargoActual: 'Socia — Gómez & Asociados',
      empresa: 'Gómez & Asociados',
      ubicacion: 'Buenos Aires, Argentina',
      conexiones: '300+',
      extracto: 'Especialista en estructuración de operaciones de crédito, fideicomisos financieros y cumplimiento normativo UIF.',
    },
    twitter: null,
    noticias: [
      { titulo: 'Las claves del compliance bancario en Argentina', fuente: 'La Ley', fecha: 'Feb 2025', url: '#' },
    ],
  },
  {
    id: '3',
    nombre: 'Roberto Díaz',
    cargo: 'Director Titular',
    dni: '18.456.789',
    resumen: null,
    linkedin: null,
    twitter: null,
    noticias: [],
  },
];

export default function InfoApoderadosPage() {
  const [selected, setSelected] = useState(apoderados[0]);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState<string[]>([apoderados[0].id]);

  const handleBuscar = (id: string) => {
    if (buscado.includes(id)) return;
    setBuscando(true);
    setTimeout(() => {
      setBuscando(false);
      setBuscado(prev => [...prev, id]);
    }, 2000);
  };

  return (
    <div style={{ padding: '32px', display: 'flex', gap: '24px' }}>

      {/* Lista izquierda */}
      <div style={{ width: '260px', flexShrink: 0 }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
            Info de Apoderados
          </h1>
          <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
            Perfil público de cada apoderado
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {apoderados.map((a) => (
            <div
              key={a.id}
              onClick={() => { setSelected(a); handleBuscar(a.id); }}
              style={{
                backgroundColor: '#111',
                border: `1px solid ${selected.id === a.id ? '#6366f1' : '#1f1f1f'}`,
                borderRadius: '10px', padding: '14px', cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '14px', fontWeight: '700',
                  color: '#6366f1', flexShrink: 0,
                }}>
                  {a.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>{a.nombre}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{a.cargo}</div>
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                {a.resumen ? (
                  <span style={{ fontSize: '10px', color: '#22c55e', backgroundColor: '#22c55e20', padding: '2px 8px', borderRadius: '20px' }}>
                    ✓ Info disponible
                  </span>
                ) : (
                  <span style={{ fontSize: '10px', color: '#555', backgroundColor: '#1f1f1f', padding: '2px 8px', borderRadius: '20px' }}>
                    Sin info pública
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1 }}>

        {/* Sin info */}
        {!selected.resumen && !buscando && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #1f1f1f',
            borderRadius: '12px', padding: '48px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
              Sin información pública disponible
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              No se encontraron resultados públicos para {selected.nombre}
            </div>
          </div>
        )}

        {/* Buscando */}
        {buscando && (
          <div style={{
            backgroundColor: '#111', border: '1px solid #1f1f1f',
            borderRadius: '12px', padding: '48px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>
              Buscando información pública...
            </div>
            <div style={{ fontSize: '13px', color: '#555' }}>
              Analizando LinkedIn, Twitter y noticias para {selected.nombre}
            </div>
          </div>
        )}

        {/* Con info */}
        {selected.resumen && !buscando && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Header apoderado */}
            <div style={{
              backgroundColor: '#111', border: '1px solid #1f1f1f',
              borderRadius: '12px', padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '20px', fontWeight: '700', color: '#6366f1',
                }}>
                  {selected.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '2px' }}>{selected.nombre}</div>
                  <div style={{ fontSize: '13px', color: '#555' }}>{selected.cargo} · DNI {selected.dni}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#555', backgroundColor: '#1f1f1f', padding: '6px 12px', borderRadius: '6px' }}>
                  🤖 Búsqueda automática
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#aaa', lineHeight: '1.7' }}>
                {selected.resumen}
              </p>
            </div>

            {/* LinkedIn */}
            {selected.linkedin && (
              <div style={{
                backgroundColor: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px' }}>💼</span>
                  <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>LinkedIn</h2>
                  <a href={selected.linkedin.url} target="_blank" rel="noreferrer" style={{
                    marginLeft: 'auto', fontSize: '11px', color: '#6366f1', textDecoration: 'none',
                    border: '1px solid #6366f140', padding: '3px 10px', borderRadius: '6px'
                  }}>Ver perfil →</a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { label: 'Cargo actual', valor: selected.linkedin.cargoActual },
                    { label: 'Empresa', valor: selected.linkedin.empresa },
                    { label: 'Ubicación', valor: selected.linkedin.ubicacion },
                    { label: 'Conexiones', valor: selected.linkedin.conexiones },
                  ].map(({ label, valor }) => (
                    <div key={label}>
                      <div style={{ fontSize: '11px', color: '#555', marginBottom: '2px' }}>{label}</div>
                      <div style={{ fontSize: '13px', color: '#aaa', fontWeight: '500' }}>{valor}</div>
                    </div>
                  ))}
                </div>
                <div style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '12px' }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#888', lineHeight: '1.6', fontStyle: 'italic' }}>
                    "{selected.linkedin.extracto}"
                  </p>
                </div>
              </div>
            )}

            {/* Twitter */}
            {selected.twitter && (
              <div style={{
                backgroundColor: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px' }}>𝕏</span>
                  <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Twitter / X</h2>
                  <span style={{ fontSize: '12px', color: '#555', marginLeft: '4px' }}>{selected.twitter.handle}</span>
                </div>
                <div style={{ backgroundColor: '#0d0d0d', borderRadius: '8px', padding: '16px' }}>
                  <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#aaa', lineHeight: '1.7' }}>
                    {selected.twitter.ultimoTweet}
                  </p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#555' }}>
                    <span>🕐 {selected.twitter.fecha}</span>
                    <span>❤️ {selected.twitter.likes}</span>
                    <span>🔁 {selected.twitter.retweets}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Noticias */}
            {selected.noticias.length > 0 && (
              <div style={{
                backgroundColor: '#111', border: '1px solid #1f1f1f',
                borderRadius: '12px', padding: '24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '16px' }}>📰</span>
                  <h2 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#fff' }}>Noticias recientes</h2>
                </div>
                {selected.noticias.map((n) => (
                  <div key={n.titulo} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid #1a1a1a'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '2px' }}>{n.titulo}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{n.fuente} · {n.fecha}</div>
                    </div>
                    <a href={n.url} style={{
                      fontSize: '11px', color: '#6366f1', textDecoration: 'none',
                      border: '1px solid #6366f140', padding: '3px 10px', borderRadius: '6px', flexShrink: 0, marginLeft: '12px'
                    }}>Ver →</a>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}