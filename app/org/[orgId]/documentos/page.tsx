'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../src/lib/supabase';

const categorias = [
  {
    titulo: 'Documentos Societarios',
    docs: [
      { id: 'estatuto', label: 'Estatuto social / Contrato social', obligatorio: true, multiple: false, placeholder: 'Ej: Estatuto social inscripto en IGJ, última modificación 2023' },
      { id: 'acta_constitucion', label: 'Acta de constitución', obligatorio: true, multiple: false, placeholder: 'Ej: Acta de constitución original inscripta en IGJ' },
      { id: 'acta_autoridades', label: 'Acta de designación de autoridades vigente', obligatorio: true, multiple: false, placeholder: 'Ej: Acta N°45 de designación de directorio vigente hasta 2026' },
      { id: 'nomina_firmantes', label: 'Nómina de autoridades y firmantes', obligatorio: true, multiple: false, placeholder: 'Ej: Nómina actualizada de directores y apoderados con firmas' },
      { id: 'poder_notarial', label: 'Poder notarial (si hay apoderados)', obligatorio: false, multiple: false, placeholder: 'Ej: Poder notarial otorgado a Juan Pérez, escritura N°123' },
    ]
  },
  {
    titulo: 'Documentos de Identidad',
    docs: [
      { id: 'dni_frente', label: 'DNI frente de cada apoderado/firmante', obligatorio: true, multiple: false, placeholder: 'Ej: DNI frente de Juan Pérez, Director Titular' },
      { id: 'dni_dorso', label: 'DNI dorso de cada apoderado/firmante', obligatorio: true, multiple: false, placeholder: 'Ej: DNI dorso de Juan Pérez, Director Titular' },
      { id: 'cuil', label: 'CUIL de cada apoderado/firmante', obligatorio: true, multiple: false, placeholder: 'Ej: Constancia CUIL de Juan Pérez - 20-12345678-9' },
    ]
  },
  {
    titulo: 'Documentos Impositivos',
    docs: [
      { id: 'constancia_afip', label: 'Constancia de inscripción AFIP (CUIT)', obligatorio: true, multiple: false, placeholder: 'Ej: Constancia AFIP CUIT 30-12345678-9, fecha emisión enero 2025' },
      { id: 'constancia_iibb', label: 'Constancia de inscripción Ingresos Brutos', obligatorio: true, multiple: false, placeholder: 'Ej: Constancia IIBB provincia Buenos Aires, convenio multilateral' },
      { id: 'ddjj_iva', label: 'Último formulario DJ IVA o Ganancias', obligatorio: true, multiple: false, placeholder: 'Ej: DJ IVA período fiscal diciembre 2024, F.2002' },
    ]
  },
  {
    titulo: 'Documentos Contables',
    docs: [
      { id: 'balance_1', label: 'Balance certificado - Último ejercicio', obligatorio: true, multiple: false, placeholder: 'Ej: Balance ejercicio fiscal 2024, certificado por CP Juan García mat. 12345' },
      { id: 'estado_patrimonial', label: 'Estado de situación patrimonial', obligatorio: true, multiple: false, placeholder: 'Ej: Estado patrimonial al 31/12/2024, firmado por contador' },
      { id: 'ddjj_ganancias', label: 'Últimas 3 DJ de Ganancias', obligatorio: false, multiple: false, placeholder: 'Ej: DJ Ganancias períodos 2022, 2023 y 2024' },
      { id: 'balances_anteriores', label: 'Balances ejercicios anteriores', obligatorio: false, multiple: true, placeholder: 'Ej: Balance ejercicio 2022 certificado por CP Juan García' },
    ]
  },
  {
    titulo: 'Documentos de la Empresa',
    docs: [
      { id: 'domicilio', label: 'Comprobante de domicilio (servicio a nombre de la empresa)', obligatorio: true, multiple: false, placeholder: 'Ej: Factura Edesur a nombre de la empresa, domicilio Av. Corrientes 1234' },
      { id: 'referencias', label: 'Referencias bancarias o comerciales', obligatorio: false, multiple: false, placeholder: 'Ej: Carta de referencia comercial de Proveedor XYZ' },
    ]
  },
];

type DocStatus = 'pendiente' | 'subido' | 'revision' | 'aprobado' | 'rechazado';

const statusConfig: Record<DocStatus, { label: string; color: string; bg: string }> = {
  pendiente: { label: 'Pendiente', color: '#555', bg: '#55555520' },
  subido: { label: 'Subido', color: '#3b82f6', bg: '#3b82f620' },
  revision: { label: 'En revisión', color: '#f59e0b', bg: '#f59e0b20' },
  aprobado: { label: 'Aprobado', color: '#22c55e', bg: '#22c55e20' },
  rechazado: { label: 'Rechazado', color: '#ef4444', bg: '#ef444420' },
};

interface DocExtra {
  id: string;
  nombre: string;
  descripcion: string;
  status: DocStatus;
  file_url?: string;
}

export default function DocumentosPage() {
  const params = useParams();
  const orgId = params.orgId as string;

  const [statuses, setStatuses] = useState<Record<string, DocStatus>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [fileUrls, setFileUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [showDescInput, setShowDescInput] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docsAdicionales, setDocsAdicionales] = useState<DocExtra[]>([]);
  const [showAdicionalForm, setShowAdicionalForm] = useState(false);
  const [nuevoDoc, setNuevoDoc] = useState({ nombre: '', descripcion: '' });
  const [balancesAnteriores, setBalancesAnteriores] = useState<DocExtra[]>([]);
  const [showBalanceForm, setShowBalanceForm] = useState(false);
  const [nuevoBalance, setNuevoBalance] = useState({ nombre: '', descripcion: '' });
  const [balanceFile, setBalanceFile] = useState<File | null>(null);
  const [adicionalFile, setAdicionalFile] = useState<File | null>(null);

  useEffect(() => {
    cargarDocumentos();
  }, [orgId]);

  const cargarDocumentos = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('organization_id', orgId);

    if (error) { console.error(error); return; }

    const newStatuses: Record<string, DocStatus> = {};
    const newDescriptions: Record<string, string> = {};
    const newFileUrls: Record<string, string> = {};
    const extras: DocExtra[] = [];
    const balances: DocExtra[] = [];

    (data || []).forEach((doc: any) => {
      if (doc.category === 'adicional') {
        extras.push({ id: doc.id, nombre: doc.name, descripcion: doc.type, status: doc.ai_status as DocStatus, file_url: doc.file_url });
      } else if (doc.type === 'balances_anteriores') {
        balances.push({ id: doc.id, nombre: doc.name, descripcion: '', status: doc.ai_status as DocStatus, file_url: doc.file_url });
      } else {
        newStatuses[doc.type] = doc.ai_status as DocStatus;
        newDescriptions[doc.type] = doc.name;
        newFileUrls[doc.type] = doc.file_url || '';
      }
    });

    setStatuses(newStatuses);
    setDescriptions(newDescriptions);
    setFileUrls(newFileUrls);
    setDocsAdicionales(extras);
    setBalancesAnteriores(balances);
  };

  const handleUpload = async (docId: string) => {
    if (!selectedFile) return;
    setUploading(docId);

    const ext = selectedFile.name.split('.').pop();
    const filePath = `${orgId}/${docId}_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, selectedFile);

    if (uploadError) {
      console.error('Error subiendo archivo:', uploadError);
      alert('Error al subir el archivo');
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('documentos')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('documents')
      .upsert({
        organization_id: orgId,
        name: descriptions[docId] || selectedFile.name,
        type: docId,
        category: 'kyc_obligatorio',
        file_url: urlData.publicUrl,
        file_size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
        ai_status: 'revision',
      }, { onConflict: 'organization_id,type' });

    if (dbError) {
      console.error('Error guardando metadata:', dbError);
    } else {
      setStatuses(prev => ({ ...prev, [docId]: 'revision' }));
      setFileUrls(prev => ({ ...prev, [docId]: urlData.publicUrl }));
    }

    setUploading(null);
    setShowDescInput(null);
    setSelectedFile(null);
  };

  const handleAgregarBalance = async () => {
    if (!nuevoBalance.nombre || !balanceFile) return;
    setUploading('balance_ant');

    const ext = balanceFile.name.split('.').pop();
    const filePath = `${orgId}/balance_ant_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, balanceFile);

    if (uploadError) { alert('Error al subir'); setUploading(null); return; }

    const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(filePath);

    const { data, error } = await supabase.from('documents').insert({
      organization_id: orgId,
      name: nuevoBalance.nombre,
      type: 'balances_anteriores',
      category: 'contable',
      file_url: urlData.publicUrl,
      file_size: `${(balanceFile.size / 1024).toFixed(0)} KB`,
      ai_status: 'revision',
    }).select().single();

    if (!error && data) {
      setBalancesAnteriores(prev => [...prev, { id: data.id, nombre: data.name, descripcion: '', status: 'revision', file_url: data.file_url }]);
    }

    setNuevoBalance({ nombre: '', descripcion: '' });
    setBalanceFile(null);
    setShowBalanceForm(false);
    setUploading(null);
  };

  const handleAgregarAdicional = async () => {
    if (!nuevoDoc.nombre || !adicionalFile) return;
    setUploading('adicional');

    const ext = adicionalFile.name.split('.').pop();
    const filePath = `${orgId}/adicional_${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('documentos')
      .upload(filePath, adicionalFile);

    if (uploadError) { alert('Error al subir'); setUploading(null); return; }

    const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(filePath);

    const { data, error } = await supabase.from('documents').insert({
      organization_id: orgId,
      name: nuevoDoc.nombre,
      type: nuevoDoc.descripcion || 'adicional',
      category: 'adicional',
      file_url: urlData.publicUrl,
      file_size: `${(adicionalFile.size / 1024).toFixed(0)} KB`,
      ai_status: 'revision',
    }).select().single();

    if (!error && data) {
      setDocsAdicionales(prev => [...prev, { id: data.id, nombre: data.name, descripcion: data.type, status: 'revision', file_url: data.file_url }]);
    }

    setNuevoDoc({ nombre: '', descripcion: '' });
    setAdicionalFile(null);
    setShowAdicionalForm(false);
    setUploading(null);
  };

  const totalObligatorios = categorias.flatMap(c => c.docs).filter(d => d.obligatorio).length;
  const totalAprobados = Object.values(statuses).filter(s => s === 'aprobado').length;
  const progreso = Math.round((totalAprobados / totalObligatorios) * 100);

  const inputStyle: React.CSSProperties = {
    width: '100%', backgroundColor: '#111', border: '1px solid #333',
    borderRadius: '6px', padding: '8px 12px', color: 'white',
    fontSize: '13px', boxSizing: 'border-box', marginBottom: '12px'
  };

  const btnPrimary: React.CSSProperties = {
    backgroundColor: '#6366f1', color: 'white', border: 'none',
    borderRadius: '6px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer'
  };

  const btnSecondary: React.CSSProperties = {
    backgroundColor: 'transparent', color: '#555', border: '1px solid #333',
    borderRadius: '6px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer'
  };

  const btnOutline: React.CSSProperties = {
    backgroundColor: '#1a1a2e', color: '#6366f1', border: '1px solid #6366f1',
    borderRadius: '6px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer'
  };

  return (
    <div style={{ padding: '32px' }}>

      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', margin: '0 0 4px 0', color: 'white' }}>
          Documentos KYC
        </h1>
        <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>
          Cargá la documentación requerida para completar el proceso KYC bancario
        </p>
      </div>

      <div style={{
        backgroundColor: '#111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '20px', marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', color: '#aaa' }}>Progreso KYC</span>
          <span style={{ fontSize: '13px', fontWeight: '600', color: progreso === 100 ? '#22c55e' : '#f59e0b' }}>
            {totalAprobados} / {totalObligatorios} documentos aprobados
          </span>
        </div>
        <div style={{ backgroundColor: '#1f1f1f', borderRadius: '4px', height: '6px' }}>
          <div style={{
            width: `${progreso}%`, height: '6px',
            backgroundColor: progreso === 100 ? '#22c55e' : '#6366f1',
            borderRadius: '4px', transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {categorias.map((cat) => (
        <div key={cat.titulo} style={{
          backgroundColor: '#111', border: '1px solid #1f1f1f',
          borderRadius: '12px', padding: '24px', marginBottom: '16px'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
            {cat.titulo}
          </h2>
          {cat.docs.map((doc) => {
            const status = statuses[doc.id] || 'pendiente';
            const cfg = statusConfig[status];
            const isUploading = uploading === doc.id;
            const showDesc = showDescInput === doc.id;

            if (doc.multiple) {
              return (
                <div key={doc.id}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid #1a1a1a'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: '#aaa' }}>{doc.label}</span>
                      <span style={{ fontSize: '10px', color: '#444', border: '1px solid #333', padding: '1px 6px', borderRadius: '4px' }}>
                        Opcional · Múltiples
                      </span>
                      {balancesAnteriores.length > 0 && (
                        <span style={{ fontSize: '11px', color: '#6366f1' }}>
                          {balancesAnteriores.length} archivo{balancesAnteriores.length > 1 ? 's' : ''} subido{balancesAnteriores.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <button onClick={() => setShowBalanceForm(!showBalanceForm)} style={btnOutline}>
                      + Agregar
                    </button>
                  </div>

                  {showBalanceForm && (
                    <div style={{
                      backgroundColor: '#0d0d0d', border: '1px solid #222',
                      borderRadius: '8px', padding: '16px', margin: '8px 0'
                    }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#aaa' }}>Nombre del balance *</p>
                      <input
                        type="text"
                        placeholder={doc.placeholder}
                        value={nuevoBalance.nombre}
                        onChange={(e) => setNuevoBalance(prev => ({ ...prev, nombre: e.target.value }))}
                        style={inputStyle}
                      />
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#aaa' }}>Archivo *</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setBalanceFile(e.target.files?.[0] || null)}
                        style={{ ...inputStyle, padding: '6px' }}
                      />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowBalanceForm(false)} style={btnSecondary}>Cancelar</button>
                        <button
                          onClick={handleAgregarBalance}
                          disabled={!nuevoBalance.nombre || !balanceFile || uploading === 'balance_ant'}
                          style={{ ...btnPrimary, opacity: (!nuevoBalance.nombre || !balanceFile) ? 0.5 : 1 }}
                        >
                          {uploading === 'balance_ant' ? 'Subiendo...' : 'Subir balance'}
                        </button>
                      </div>
                    </div>
                  )}

                  {balancesAnteriores.map((b) => (
                    <div key={b.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0 10px 16px', borderBottom: '1px solid #1a1a1a'
                    }}>
                      <div style={{ fontSize: '13px', color: '#888' }}>
                        {b.file_url ? (
                          <a href={b.file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>
                            {b.nombre} ↗
                          </a>
                        ) : b.nombre}
                      </div>
                      <span style={{
                        fontSize: '11px', fontWeight: '500',
                        color: statusConfig[b.status].color, backgroundColor: statusConfig[b.status].bg,
                        padding: '3px 10px', borderRadius: '20px'
                      }}>{statusConfig[b.status].label}</span>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div key={doc.id}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 0', borderBottom: showDesc ? 'none' : '1px solid #1a1a1a'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#aaa' }}>{doc.label}</span>
                    {!doc.obligatorio && (
                      <span style={{ fontSize: '10px', color: '#444', border: '1px solid #333', padding: '1px 6px', borderRadius: '4px' }}>
                        Opcional
                      </span>
                    )}
                    {fileUrls[doc.id] && (
                      <a href={fileUrls[doc.id]} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '11px', color: '#6366f1', textDecoration: 'none' }}>
                        Ver archivo ↗
                      </a>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '500',
                      color: cfg.color, backgroundColor: cfg.bg,
                      padding: '3px 10px', borderRadius: '20px'
                    }}>{cfg.label}</span>
                    {status === 'pendiente' || status === 'rechazado' ? (
                      <button
                        onClick={() => { setShowDescInput(showDesc ? null : doc.id); setSelectedFile(null); }}
                        disabled={isUploading}
                        style={btnOutline}
                      >
                        {isUploading ? 'Subiendo...' : '↑ Subir'}
                      </button>
                    ) : status === 'aprobado' ? (
                      <span style={{ fontSize: '12px', color: '#22c55e' }}>✓</span>
                    ) : (
                      <button
                        onClick={() => { setShowDescInput(showDesc ? null : doc.id); setSelectedFile(null); }}
                        style={{ ...btnOutline, opacity: 0.6 }}
                      >
                        Reemplazar
                      </button>
                    )}
                  </div>
                </div>

                {showDesc && (
                  <div style={{
                    backgroundColor: '#0d0d0d', border: '1px solid #222',
                    borderRadius: '8px', padding: '16px', marginBottom: '8px'
                  }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555' }}>
                      Descripción del documento (opcional)
                    </p>
                    <input
                      type="text"
                      placeholder={doc.placeholder}
                      value={descriptions[doc.id] || ''}
                      onChange={(e) => setDescriptions(prev => ({ ...prev, [doc.id]: e.target.value }))}
                      style={inputStyle}
                    />
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#555' }}>
                      Archivo *
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      style={{ ...inputStyle, padding: '6px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button onClick={() => { setShowDescInput(null); setSelectedFile(null); }} style={btnSecondary}>Cancelar</button>
                      <button
                        onClick={() => handleUpload(doc.id)}
                        disabled={!selectedFile || isUploading}
                        style={{ ...btnPrimary, opacity: !selectedFile ? 0.5 : 1 }}
                      >
                        {isUploading ? 'Subiendo...' : 'Confirmar y subir'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div style={{
        backgroundColor: '#111', border: '1px solid #1f1f1f',
        borderRadius: '12px', padding: '24px', marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
              Documentación adicional
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#555' }}>
              No requerida para KYC pero puede mejorar el análisis crediticio
            </p>
          </div>
          <button onClick={() => setShowAdicionalForm(!showAdicionalForm)} style={btnOutline}>
            + Agregar documento
          </button>
        </div>

        {showAdicionalForm && (
          <div style={{
            backgroundColor: '#0d0d0d', border: '1px solid #222',
            borderRadius: '8px', padding: '16px', marginBottom: '16px'
          }}>
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#aaa' }}>Nombre del documento *</p>
            <input
              type="text"
              placeholder="Ej: Proyección de ventas 2025"
              value={nuevoDoc.nombre}
              onChange={(e) => setNuevoDoc(prev => ({ ...prev, nombre: e.target.value }))}
              style={inputStyle}
            />
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#aaa' }}>Descripción</p>
            <input
              type="text"
              placeholder="Ej: Flujo de fondos proyectado para los próximos 12 meses"
              value={nuevoDoc.descripcion}
              onChange={(e) => setNuevoDoc(prev => ({ ...prev, descripcion: e.target.value }))}
              style={inputStyle}
            />
            <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#aaa' }}>Archivo *</p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setAdicionalFile(e.target.files?.[0] || null)}
              style={{ ...inputStyle, padding: '6px' }}
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowAdicionalForm(false); setAdicionalFile(null); }} style={btnSecondary}>Cancelar</button>
              <button
                onClick={handleAgregarAdicional}
                disabled={!nuevoDoc.nombre || !adicionalFile || uploading === 'adicional'}
                style={{ ...btnPrimary, opacity: (!nuevoDoc.nombre || !adicionalFile) ? 0.5 : 1 }}
              >
                {uploading === 'adicional' ? 'Subiendo...' : 'Subir documento'}
              </button>
            </div>
          </div>
        )}

        {docsAdicionales.length === 0 && !showAdicionalForm && (
          <div style={{ textAlign: 'center', padding: '24px', color: '#444', fontSize: '13px' }}>
            No hay documentos adicionales cargados
          </div>
        )}

        {docsAdicionales.map((doc) => (
          <div key={doc.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 0', borderBottom: '1px solid #1a1a1a'
          }}>
            <div>
              <div style={{ fontSize: '13px', color: '#aaa' }}>
                {doc.file_url ? (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', textDecoration: 'none' }}>
                    {doc.nombre} ↗
                  </a>
                ) : doc.nombre}
              </div>
              {doc.descripcion && (
                <div style={{ fontSize: '11px', color: '#555', marginTop: '2px', fontStyle: 'italic' }}>
                  {doc.descripcion}
                </div>
              )}
            </div>
            <span style={{
              fontSize: '11px', fontWeight: '500',
              color: statusConfig[doc.status].color, backgroundColor: statusConfig[doc.status].bg,
              padding: '3px 10px', borderRadius: '20px'
            }}>
              {statusConfig[doc.status].label}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}