import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                margin: '4px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: active ? 'var(--swiss-gray-200)' : 'transparent',
                color: active ? 'var(--swiss-black)' : 'var(--swiss-gray-500)',
                transition: 'all 0.2s ease'
            }}
        >
            <Icon sx={{ fontSize: 20, marginRight: '12px', color: 'inherit' }} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>{label}</span>
        </div>
    );
};

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', icon: DashboardIcon, path: '/' },
        { label: 'Rechnungen', icon: ReceiptIcon, path: '/invoices' },
        { label: 'Kunden', icon: PeopleIcon, path: '/clients' },
        { label: 'Produkte', icon: InventoryIcon, path: '/products' },
        { label: 'Einstellungen', icon: SettingsIcon, path: '/settings' },
    ];

    return (
        <div style={{
            width: 'var(--sidebar-width)',
            backgroundColor: 'var(--swiss-gray-50)',
            borderRight: 'var(--border-light)',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 0'
        }}>
            <div style={{ padding: '0 24px 32px 24px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Rechnix</h1>
                <span style={{ fontSize: '12px', color: 'var(--swiss-gray-500)' }}>Rechnungsmanagement</span>
            </div>

            <div style={{ flex: 1 }}>
                {menuItems.map((item) => (
                    <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path))}
                        onClick={() => navigate(item.path)}
                    />
                ))}
            </div>

            <div style={{ padding: '24px' }}>
                <div style={{
                    padding: '12px',
                    backgroundColor: 'var(--swiss-white)',
                    borderRadius: '8px',
                    border: 'var(--border-light)',
                    fontSize: '12px',
                    color: 'var(--swiss-gray-500)'
                }}>
                    Status: Online<br />
                    Version: 1.0.0
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
