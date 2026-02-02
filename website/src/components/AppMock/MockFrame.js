import React from 'react';
import '../../css/swiss-mock.css';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';

const SidebarItem = ({ icon: Icon, label, active }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 16px',
                margin: '4px 8px',
                borderRadius: '8px',
                cursor: 'default',
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

const MockFrame = ({ activePage, children }) => {
    const menuItems = [
        { label: 'Dashboard', icon: DashboardIcon },
        { label: 'Rechnungen', icon: ReceiptIcon },
        { label: 'Kunden', icon: PeopleIcon },
        { label: 'Produkte', icon: InventoryIcon },
        { label: 'Ausgaben', icon: AccountBalanceWalletIcon },
        { label: 'Statistiken', icon: AssessmentIcon },
        { label: 'Einstellungen', icon: SettingsIcon },
    ];

    return (
        <div className="swiss-mock-container" style={{ display: 'grid', gridTemplateColumns: '260px 1fr' }}>
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
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            active={activePage === item.label}
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

            <main className="swiss-main">
                {children}
            </main>
        </div>
    );
};

export default MockFrame;
