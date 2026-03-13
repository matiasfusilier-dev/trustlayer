'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    section: 'GENERAL',
    items: [
      { href: '/', label: 'Dashboard', icon: '⊞' },
    ]
  },
  {
    section: 'KYC',
    items: [
      { href: '/empresas', label: 'Empresas', icon: '🏢' },
      { href: '/documentos', label: 'Documentos', icon: '📄' },
      { href: '/apoderados', label: 'Apoderados', icon: '👤' },
      { href: '/beneficiarios', label: 'Beneficiarios Finales', icon: '👥' },
      { href: '/evaluacion-kyc', label: 'Evaluación KYC', icon: '✓' },
    ]
  },
  {
    section: 'ANÁLISIS',
    items: [
      { href: '/riesgo', label: 'Riesgo Crediticio', icon: '📊' },
      { href: '/apoderados-info', label: 'Info de Apoderados', icon: '🔍' },
      { href: '/bcra', label: 'BCRA', icon: '🏦' },
      { href: '/mercado', label: 'Mercado & Noticias', icon: '📈' },
    ]
  },
  {
    section: 'ADMINISTRACIÓN',
    items: [
      { href: '/usuarios', label: 'Usuarios & Permisos', icon: '⚙' },
      { href: '/accesos', label: 'Registro de Accesos', icon: '📋' },
    ]
  }
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <div
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: expanded ? '220px' : '56px',
        backgroundColor: '#0a0a0a',
        borderRight: '1px solid #1a1a1a',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '16px',
      }}
    >
      {/* Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 12px 24px 12px',
        borderBottom: '1px solid #1a1a1a',
        marginBottom: '16px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#6366f1',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '13px',
          color: 'white',
          flexShrink: 0,
        }}>TL</div>
        {expanded && (
          <span style={{
            fontWeight: '600',
            fontSize: '15px',
            color: 'white',
            whiteSpace: 'nowrap',
          }}>TrustLayer</span>
        )}
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {navItems.map((group) => (
          <div key={group.section} style={{ marginBottom: '24px' }}>
            {expanded && (
              <div style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#444',
                letterSpacing: '0.08em',
                padding: '0 16px 8px 16px',
                whiteSpace: 'nowrap',
              }}>
                {group.section}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 12px',
                    margin: '1px 6px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    backgroundColor: isActive ? '#1a1a2e' : 'transparent',
                    color: isActive ? '#6366f1' : '#888',
                    transition: 'background-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#141414';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#888';
                    }
                  }}
                >
                  <span style={{ fontSize: '16px', flexShrink: 0, width: '20px', textAlign: 'center' }}>
                    {item.icon}
                  </span>
                  {expanded && (
                    <span style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}