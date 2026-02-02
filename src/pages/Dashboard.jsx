import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Scripts
import { get_uRechnungen, handleLoadFile } from '../Scripts/Filehandler';
import { getNetto } from '../Scripts/ERechnungInterpretter';
import { checkRecurringExpenses } from '../Scripts/AusgabenHandler';

// Icons (using MUI icons as they are already installed)
import EuroIcon from '@mui/icons-material/Euro';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="swiss-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: color + '20', // 20% opacity
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon style={{ fontSize: '24px' }} />
        </div>
        <div>
            <div style={{ fontSize: '12px', color: 'var(--swiss-gray-500)', fontWeight: 500 }}>{title}</div>
            <div style={{ fontSize: '24px', fontWeight: 600 }}>{value}</div>
        </div>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [u_rechnungen, setURechnung] = useState();
    const [count, setCount] = useState(0);
    const [ges, setGes] = useState(0);
    const [monthUmsatz, setMonthUmsatz] = useState(0);
    const [yearUmsatz, setYearUmsatz] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            // Check for recurring expenses
            await checkRecurringExpenses();

            // Load invoices
            try {
                const data = await get_uRechnungen();
                setURechnung(data);
            } catch (e) { console.error(e); }

            // Load invoice count
            try {
                const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
                const json = JSON.parse(jsonstring);
                setCount(json.count || 0);
            } catch (e) { console.error("Error loading config", e); }

            // Calculate totals
            try {
                const filedata = await window.api.listfiles("rechnungen/");
                if (!filedata) return;

                const uniqueFiles = [...new Set(filedata)].filter(f => f.name && f.name.startsWith("R"));
                const currentYear = new Date().getFullYear();
                const currentMonth = new Date().getMonth() + 1;

                let total = 0, year = 0, month = 0;

                const updates = await Promise.all(uniqueFiles.map(async (file) => {
                    let amount = 0;
                    try {
                        const string = await handleLoadFile("rechnungen/" + file.name);
                        const json = JSON.parse(string);
                        amount = Number(getNetto(json)) || 0;
                    } catch (e) { console.error(e); }

                    const parts = file.name.split("-");
                    let fileYear = 0, fileMonth = 0;
                    if (parts.length >= 2) {
                        fileYear = parseInt(parts[0].replace("R", ""));
                        fileMonth = parseInt(parts[1]);
                    }
                    return { amount, fileYear, fileMonth };
                }));

                for (let u of updates) {
                    total += u.amount;
                    if (u.fileYear === currentYear) {
                        year += u.amount;
                        if (u.fileMonth === currentMonth) {
                            month += u.amount;
                        }
                    }
                }

                setGes(total.toFixed(2));
                setYearUmsatz(year.toFixed(2));
                setMonthUmsatz(month.toFixed(2));
            } catch (e) {
                console.error("Error calculating turnover", e);
            }
        };
        loadData();
    }, []);

    return (
        <div style={{ padding: '0 40px 40px 40px' }}>
            <header style={{ height: '80px', display: 'flex', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px' }}>Dashboard</h1>
            </header>

            <div className="swiss-grid-4" style={{ marginBottom: '32px' }}>
                <StatCard title="Gesamter Umsatz" value={`${ges}€`} icon={EuroIcon} color="#34c759" />
                <StatCard title="Jahresumsatz" value={`${yearUmsatz}€`} icon={TrendingUpIcon} color="#ffcc00" />
                <StatCard title="Monatlicher Umsatz" value={`${monthUmsatz}€`} icon={CalendarTodayIcon} color="#86868b" />
                <StatCard title="Anzahl Rechnungen" value={count} icon={ReceiptLongIcon} color="#0071e3" />
            </div>

            <div className="swiss-card">
                <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Unbezahlte Rechnungen</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--swiss-gray-200)' }}>
                                <th style={{ padding: '12px 0', fontSize: '13px', color: 'var(--swiss-gray-500)', fontWeight: 500 }}>Rechnungsnummer</th>
                                <th style={{ padding: '12px 0', fontSize: '13px', color: 'var(--swiss-gray-500)', fontWeight: 500 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {u_rechnungen?.list && u_rechnungen.list.length > 0 ? (
                                u_rechnungen.list.map((item) => (
                                    <tr
                                        key={item.rechnung}
                                        onClick={() => navigate("/kunden-viewer/" + item.id)}
                                        style={{ cursor: 'pointer', borderBottom: '1px solid var(--swiss-gray-100)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--swiss-gray-50)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <td style={{ padding: '16px 0', fontSize: '14px' }}>{item.rechnung}</td>
                                        <td style={{ padding: '16px 0' }}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                padding: '4px 8px',
                                                borderRadius: '999px',
                                                backgroundColor: '#ff3b3020',
                                                color: '#ff3b30',
                                                fontSize: '12px',
                                                fontWeight: 500
                                            }}>
                                                <FiberManualRecordIcon style={{ fontSize: '10px', marginRight: '4px' }} /> Unbezahlt
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} style={{ padding: '24px', textAlign: 'center', color: 'var(--swiss-gray-500)' }}>
                                        Keine unbezahlten Rechnungen
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
