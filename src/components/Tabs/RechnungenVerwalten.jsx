import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Trash2, FileText, MoreVertical, Eye, RotateCw, X } from 'lucide-react';

import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import { getNetto } from '../../Scripts/ERechnungInterpretter';
import RechnungsViewer from '../../viewer/RechnungsViewer';

// Shadcn Components
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export default function RechnungenVerwalten() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState("overview");
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [unternehmen, setUnternehmen] = useState(null);

    // Initial Load
    useEffect(() => {
        loadData();
        loadTabs();
        loadUnternehmen();
    }, []);

    // Handle URL param ID (open invoice from URL)
    useEffect(() => {
        if (id && id !== "overview") {
            openTab(id);
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        try {
            const files = await window.api.listfiles("rechnungen/");
            if (!files) {
                setInvoices([]);
                setLoading(false);
                return;
            }

            const invoiceFiles = files.filter(f => f.name && f.name.startsWith("R") && !f.name.includes("conf"));

            const loadedInvoices = await Promise.all(invoiceFiles.map(async (file) => {
                let details = {
                    id: file.name,
                    date: file.time || 0,
                    amount: 0,
                    customerName: "Unbekannt"
                };

                try {
                    const content = await handleLoadFile("rechnungen/" + file.name);
                    const json = JSON.parse(content);
                    details.customerName = json.items?.list?.find(i => i.name === "Kunde")?.content?.[0]?.name || "Unbekannt";
                    details.kundenId = json.kundenId;
                    details.amount = getNetto(json);
                    details.date = json.date || file.time;
                } catch (e) {
                    console.warn("Failed to parse invoice", file.name, e);
                }

                return details;
            }));

            const kundenFile = await handleLoadFile("fast_accsess/kunden.db");
            const kundenList = kundenFile && kundenFile !== "{}" ? JSON.parse(kundenFile).list : [];

            const enhancedInvoices = loadedInvoices.map(inv => {
                const k = kundenList.find(k => k.id === inv.kundenId);
                return {
                    ...inv,
                    customerName: k ? k.name : (inv.customerName === "Unbekannt" ? inv.kundenId : inv.customerName)
                };
            }).sort((a, b) => b.date - a.date);

            setInvoices(enhancedInvoices);
        } catch (e) {
            console.error("Error loading invoices", e);
        } finally {
            setLoading(false);
        }
    };

    const loadTabs = async () => {
        const storedTabsString = await handleLoadFile("fast_accsess/tabs.rechnix");
        if (storedTabsString && storedTabsString !== "{}") {
            setTabs(JSON.parse(storedTabsString));
        }
    };

    const loadUnternehmen = async () => {
        const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
        if (jsonstring && jsonstring !== "{}") {
            setUnternehmen(JSON.parse(jsonstring));
        }
    };

    const openTab = async (invoiceId) => {
        if (!invoiceId) return;

        let newTabs = [...tabs];
        if (!newTabs.includes(invoiceId)) {
            newTabs.push(invoiceId);
            setTabs(newTabs);
            await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(newTabs));
        }
        setSelectedTab(invoiceId);
    };

    const closeTab = async (e, invoiceId) => {
        e.stopPropagation();
        const newTabs = tabs.filter(t => t !== invoiceId);
        setTabs(newTabs);
        await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(newTabs));

        if (selectedTab === invoiceId) {
            setSelectedTab("overview");
        }
    };

    const handleDelete = async (invoiceId) => {
        if (window.confirm(`Rechnung ${invoiceId} wirklich löschen?`)) {
            await window.api.deleteFile("rechnungen/" + invoiceId);
            const newTabs = tabs.filter(t => t !== invoiceId);
            setTabs(newTabs);
            await handleSaveFile("fast_accsess/tabs.rechnix", JSON.stringify(newTabs));
            loadData();
        }
    };

    const handleCreateNew = () => {
        navigate('/invoices/create');
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Tab Bar */}
            <div className="flex items-center space-x-1 border-b px-4 pt-3 bg-muted/40 overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setSelectedTab("overview")}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors border-b-2 ${selectedTab === "overview"
                            ? "bg-background border-primary text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }`}
                >
                    Übersicht
                </button>
                {tabs.map(tabId => (
                    <div
                        key={tabId}
                        onClick={() => setSelectedTab(tabId)}
                        className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer border-b-2 flex-shrink-0 max-w-[200px] ${selectedTab === tabId
                                ? "bg-background border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
                            }`}
                        title={tabId}
                    >
                        <span className="truncate">{tabId}</span>
                        <button
                            onClick={(e) => closeTab(e, tabId)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-muted-foreground/20 rounded-full transition-all flex-shrink-0"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
                {selectedTab === "overview" && (
                    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight">Rechnungen</h1>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" onClick={loadData}>
                                    <RotateCw className="h-4 w-4" />
                                </Button>
                                <Button onClick={handleCreateNew}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Neue Rechnung
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Suche..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[180px]">Rechnungs-Nr.</TableHead>
                                        <TableHead>Datum</TableHead>
                                        <TableHead>Kunde</TableHead>
                                        <TableHead className="text-right">Betrag</TableHead>
                                        <TableHead className="w-[100px] text-right">Aktionen</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvoices.map(inv => (
                                        <TableRow key={inv.id} className="cursor-pointer" onDoubleClick={() => openTab(inv.id)}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {inv.id}
                                                </div>
                                            </TableCell>
                                            <TableCell>{new Date(inv.date || Date.now()).toLocaleDateString("de-DE")}</TableCell>
                                            <TableCell>{inv.customerName}</TableCell>
                                            <TableCell className="text-right font-mono">
                                                {parseFloat(inv.amount || 0).toFixed(2)} {unternehmen?.waehrung || '€'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => openTab(inv.id)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredInvoices.length === 0 && !loading && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                Keine Rechnungen gefunden.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {tabs.map(tabId => (
                    <div key={tabId} className={`h-full ${selectedTab === tabId ? 'block' : 'hidden'}`}>
                        <RechnungsViewer rechnung={tabId} unternehmen={unternehmen} />
                    </div>
                ))}
            </div>
        </div>
    );
}
