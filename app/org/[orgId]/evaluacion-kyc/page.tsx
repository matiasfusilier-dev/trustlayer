'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://llrdjgcswlllxvwemalp.supabase.co',
  'sb_publishable_uRQNo-ap4Lqn_QjDNvfXWw_pDkok0VL'
);

interface Documento {
  id: string;
  name: string;
  file_type: string;
  created_at: string;
}

interface Apoderado {
  id: string;
  nombre: string;
  cargo: string;
  dni_cargado: string;
  cuil_verificado: string;
  pep: boolean | null;
}

interface Org {
  id: string;
  name: string;
  cuit: string;
  type: string;
  size: string;
  sector: string;
}

interface Requisito {
  label: string;
  estado: 'ok' | 'pendiente' | 'faltante';
  observacion?: string;
}

interface SeccionKYC {
  id: string;
  label: string;
  icon: string;
  requisitos: Requisito[];
  observacion: string;
}

interface Dictamen {
  resultado: 'aprobado' | 'observaciones' | 'rechazado';
  score: number;
  resumen: string;
  observaciones: string[];
  secciones: SeccionKYC[];
}

const estadoConfig = {
  ok: { label: '✓ OK', color: '#22c55e', bg: '#22c55e20' },
  pendiente: { label: 'Pendiente', color: '#f59e0b', bg: '#f59e0b20' },
  faltante: { label: 'Faltante', color: '#ef4444', bg: '#ef444420' },
};

const dictamenConfig = {
  aprobado: { label: 'KYC Aprobado', color: '#22c55e', bg: '#22c55e15', border: '#22c55e40', icon: '✓' },
  observaciones: { label: 'Aprobado con observaciones', color: '#f59e0b', bg: '#f59e0b15', border: '#f59e0b40', icon: '⚠' },
  rechazado: { label: 'KYC Rechazado', color: '#ef4444', bg: '#ef444415', border: '#ef444440', icon: '✗' },
};

export default function EvaluacionKYCPage({ params }: { params: { orgId: string } }) {
  const [org, setOrg] = useState<Org | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [apoderados, setApoderados] = useState<Apoderado[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluando, setEvaluando] = useState(false);
  const [dictamen, setDictamen] = useState<Dictamen | null>(null);
  const [ultimaEvaluacion, setUltimaEvaluacion] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [params.orgId]);

  const cargarDatos = async () => {
    setLoading(true);

    const [{ data: orgData }, { data: docsData }, { data: apodData }, { data: analisisData }] = await Promise.all([
      supabase.from('organizations').select('*').eq('id', params.orgId).single(),
      supabase.from('documents').select('*').eq('organization_id', params.orgId),
      supabase.from('apoderados').select('*').eq('org_id', params.orgId),
      supabase.from('credit_analysis').select('*').eq('organization_id', params.orgId).eq('tipo', 'kyc').order('created_at', { ascending: false }).limit(1),
    ]);

    if (orgData) setOrg(orgData);
    if (docsData) setDocumentos(docsData);
    if (apodData) setApoderados(apodData);

    if (analisisData && analisisData.length > 0) {
      const ultimo = analisisData[0];
      if (ultimo.kyc_dictamen) {
        try {
          const parsed = JSON.parse(ultimo.kyc_dictamen);
          setDictamen(parsed);
          setUltimaEvaluacion(ultimo.created_at);
        } catch {}
      }
    }

    setLoading(false);
  };

  const handleEvaluar = async () => {
    if (!org) return;
    setEvaluando(true);
    setDictamen(null);

    const prompt = `Sos un experto en cumplimiento normativo KYC para bancos argentinos. 
Tu tarea es evaluar el estado KYC de una empresa basándote en los datos provistos y determinar qué documentos y verificaciones son necesarios según la normativa argentina (UIF, BCRA, CNV).

DATOS DE LA EMPRESA:
- Nombre: ${org.name}
- CUIT: ${org.cuit}
- Tipo: ${org.type || 'No especificado'}
- Tamaño: ${org.size || 'No especificado'}
- Sector: ${org.sector || 'No especificado'}

DOCUMENTOS CARGADOS (${documentos.length} documentos):
${documentos.length > 0 ? documentos.map(d => `- ${d.name} (${d.file_type})`).join('\n') : '- Sin documentos cargados'}

APODERADOS REGISTRADOS (${apoderados.length} apoderados):
${apoderados.length > 0 ? apoderados.map(a => `- ${a.nombre} (${a.cargo}): DNI ${a.dni_cargado === 'ok' ? '✓' : 'pendiente'}, CUIL ${a.cuil_verificado === 'ok' ? '✓' : 'pendiente'}, PEP ${a.pep === null ? 'sin verificar' : a.pep ? 'ES PEP' : 'no es PEP'}`).join('\n') : '- Sin apoderados registrados'}

INSTRUCCIONES:
1. Determiná dinámicamente qué documentos son REQUERIDOS para este tipo de empresa según normativa argentina
2. Verificá cuáles están presentes y cuáles faltan
3. Evaluá el estado de los apoderados
4. Generá un dictamen KYC profesional

Respondé ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "resultado": "aprobado" | "observaciones" | "rechazado",
  "score": número entre 0 y 100,
  "resumen": "texto del dictamen profesional en español",
  "observaciones": ["observación 1", "observación 2"],
  "secciones": [
    {
      "id": "documentos",
      "label": "Documentación",
      "icon": "📄",
      "requisitos": [
        { "label": "nombre del documento", "estado": "ok" | "pendiente" | "faltante", "observacion": "opcional" }
      ],
      "observacion": "resumen de la sección"
    }
  ]
}`;

    try {
      const response = await fetch('/api/kyc-evaluacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, orgId: params.orgId }),
      });

      const data = await response.json();

      if (data.dictamen) {
        setDictamen(data.dictamen);
        setUltimaEvaluacion(new Date().toISOString());
      }
    } catch (error) {
      console.error('Error evaluando KYC:', error);
    }

    setEvaluando(false);
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', color: '#555', fontSize: '14px' }}>Cargando datos...</div>
    );
  }

  const todasSecciones = dictamen?.secciones || [];
  const totalRequisitos = todasSecciones.flatMap(s => s.requisitos).length;
  const requisitosOk = todasSecciones.flatMap(s => s.requisitos).filter(r => r.estado === 'ok').length;

  return (
    <div style={{ padding: '32px', maxWidth: '900px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Evaluación KYC
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Revisión integral con dictamen automático basado en normativa argentina (UIF / BCRA)
        </p>
      </div>

      {/* Panel de datos cargados */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Documentos cargados', value: documentos.length, color: documentos.length > 0 ? '#22c55e' : '#f59e0b' },
          { label: 'Apoderados registrados', value: apoderados.length, color: apoderados.length > 0 ? '#22c55e' : '#f59e0b' },
          { label: 'Última evaluación', value: ultimaEvaluacion ? new Date(ultimaEvaluacion).toLocaleDateString('es-AR') : 'Nunca', color: ultimaEvaluacion ? '#6366f1' : '#555' },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '22px', fontWeight: '700', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Botón evaluar */}
      <div style={{
        backgroundColor: '#111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '24px', marginBottom: '24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          {dictamen ? (
            <div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: dictamen.score >= 80 ? '#22c55e' : dictamen.score >= 60 ? '#f59e0b' : '#ef4444' }}>
                {dictamen.score}%
              </div>
              <div style={{ fontSize: '13px', color: '#555' }}>Score KYC · {requisitosOk}/{totalRequisitos} requisitos OK</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                Listo para evaluar
              </div>
              <div style={{ fontSize: '13px', color: '#555' }}>
                {documentos.length} documentos · {apoderados.length} apoderados cargados
              </div>
            </div>
          )}
        </div>
        <button
          onClick={handleEvaluar}
          disabled={evaluando}
          style={{
            backgroundColor: evaluando ? '#333' : '#6366f1',
            color: 'white', border: 'none', borderRadius: '10px',
            padding: '14px 28px', fontSize: '14px', fontWeight: '600',
            cursor: evaluando ? 'not-allowed' : 'pointer', minWidth: '200px',
          }}
        >
          {evaluando ? '⏳ Analizando con IA...' : '🤖 Generar dictamen KYC'}
        </button>
      </div>

      {/* Dictamen */}
      {dictamen && (
        <div style={{
          backgroundColor: dictamenConfig[dictamen.resultado].bg,
          border: `1px solid ${dictamenConfig[dictamen.resultado].border}`,
          borderRadius: '12px', padding: '24px', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px', fontWeight: '700', color: dictamenConfig[dictamen.resultado].color }}>
              {dictamenConfig[dictamen.resultado].icon}
            </span>
            <span style={{ fontSize: '16px', fontWeight: '700', color: dictamenConfig[dictamen.resultado].color }}>
              {dictamenConfig[dictamen.resultado].label}
            </span>
          </div>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#aaa', lineHeight: '1.7' }}>
            {dictamen.resumen}
          </p>
          {dictamen.observaciones.length > 0 && (
            <div>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Observaciones
              </p>
              {dictamen.observaciones.map((obs, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 0', borderBottom: '1px solid #ffffff10' }}>
                  <span style={{ color: '#f59e0b' }}>⚠</span>
                  <span style={{ fontSize: '13px', color: '#888' }}>{obs}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Secciones */}
      {dictamen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dictamen.secciones.map((sec) => {
            const okCount = sec.requisitos.filter(r => r.estado === 'ok').length;
            const total = sec.requisitos.length;
            const completo = okCount === total;
            const isOpen = expandido === sec.id;

            return (
              <div key={sec.id} style={{ backgroundColor: '#111', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
                <div
                  onClick={() => setExpandido(isOpen ? null : sec.id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px' }}>{sec.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{sec.label}</span>
                    <span style={{
                      fontSize: '11px', fontWeight: '500',
                      color: completo ? '#22c55e' : '#f59e0b',
                      backgroundColor: completo ? '#22c55e20' : '#f59e0b20',
                      padding: '2px 10px', borderRadius: '20px'
                    }}>{okCount}/{total}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '100px', backgroundColor: '#1f1f1f', borderRadius: '4px', height: '4px' }}>
                      <div style={{ width: `${(okCount / total) * 100}%`, height: '4px', backgroundColor: completo ? '#22c55e' : '#6366f1', borderRadius: '4px' }} />
                    </div>
                    <span style={{ color: '#555', fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {isOpen && (
                  <div style={{ borderTop: '1px solid #1a1a1a' }}>
                    {sec.observacion && (
                      <div style={{ padding: '12px 24px', backgroundColor: '#0d0d0d', fontSize: '13px', color: '#555' }}>
                        {sec.observacion}
                      </div>
                    )}
                    {sec.requisitos.map((req, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 24px', borderBottom: '1px solid #0f0f0f' }}>
                        <div>
                          <span style={{ fontSize: '13px', color: '#888' }}>{req.label}</span>
                          {req.observacion && <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>{req.observacion}</div>}
                        </div>
                        <span style={{
                          fontSize: '11px', fontWeight: '500',
                          color: estadoConfig[req.estado].color,
                          backgroundColor: estadoConfig[req.estado].bg,
                          padding: '2px 10px', borderRadius: '20px'
                        }}>
                          {estadoConfig[req.estado].label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}