import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';

export const TenantPortalLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Navbar onSignOut={() => navigate('/login')} />
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '24px 20px' }}>
        {children}
      </main>
      <footer style={{ borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', padding: '16px 24px', textAlign: 'center', fontSize: '12px', color: '#64748b' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>© 2026 SMART LMS Enterprise Multi-Tenant Platform. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', fontFamily: 'monospace' }}>
            <span>Institute Academic ERP</span>
            <span>•</span>
            <span>Corporate L&D Workforce</span>
            <span>•</span>
            <span>Node.js / Express / MySQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TenantPortalLayout;
