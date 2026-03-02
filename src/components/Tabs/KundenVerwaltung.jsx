import React, { useEffect, useState } from 'react';
import MaskProvider from '../MaskProvider';
import KundeErstellung from '../KundenVerwaltung/Masks/KundeErstellung';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { rebuildKundenDB, kundeErstellen } from '../../Scripts/KundenDatenBank';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';

// Shadcn UI & Icons
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, PlusCircle, Upload, Download, RefreshCw, Building2, User } from "lucide-react";

import '../../styles/swiss.css';

function KundenVerwaltung() {
    const [createkunde, setcreatekunde] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const navigate = useNavigate();
    function close() {
        setcreatekunde(false);
    }
    const [data, setdata] = useState(null);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        const readdata = async () => {
            const readjson = await handleLoadFile("fast_accsess/kunden.db");
            if (readjson === "{}") {
                setdata(JSON.parse('{"list": []}'));
                return;
            }
            setdata(JSON.parse(readjson));
        }
        readdata();
    }, []);

    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        handler();
        return () => {
            handler.cancel();
        };
    }, [searchTerm]);

    useEffect(() => {
        const filterData = async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            if (!data || !data.list) {
                setFilteredList([]);
                return;
            }
            const term = debouncedSearchTerm.toLowerCase();
            const filtered = data.list.filter((i) => {
                const nameLower = i.name.toLowerCase();
                const emailLower = i.email.toLowerCase();
                return (
                    nameLower.includes(term) ||
                    emailLower.includes(term) ||
                    i.id.includes(term)
                );
            });
            setFilteredList(filtered);
        };
        filterData();
    }, [data, debouncedSearchTerm]);

    const handleCSVExport = () => {
        if (!data || !data.list || data.list.length === 0) {
            alert("Keine Kunden zum Exportieren vorhanden.");
            return;
        }

        // Define Headers
        const headers = ["ID", "Name", "IstFirma", "Email", "Telefon", "Strasse", "Nummer", "PLZ", "Ort", "Land"];

        // Map Data
        const csvRows = [headers.join(";")];
        data.list.forEach(k => {
            const row = [
                k.id,
                k.name,
                k.istfirma ? "1" : "0",
                k.email || "",
                k.tel || "",
                k.street || "",
                k.number || "",
                k.plz || "",
                k.ort || "",
                k.landcode || "DE"
            ].map(val => `"${String(val).replace(/"/g, '""')}"`); // Escape quotes
            csvRows.push(row.join(";"));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "kunden_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCSVImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const lines = text.split(/\r?\n/).filter(l => l.trim() !== "");
            if (lines.length < 2) return;

            const separator = lines[0].includes(';') ? ';' : ',';
            const headers = lines[0].split(separator).map(h => h.trim().toLowerCase());

            const findIdx = (keys) => headers.findIndex(h => keys.some(k => h === k || h.includes(k)));

            const idxName = findIdx(['name', 'firma', 'kundenname', 'customer']);
            const idxStreet = findIdx(['straße', 'street', 'adresse']);
            const idxNumber = findIdx(['hausnummer', 'nr', 'number']);
            const idxPLZ = findIdx(['plz', 'zip', 'postleitzahl']);
            const idxOrt = findIdx(['ort', 'city', 'stadt']);
            const idxEmail = findIdx(['email', 'mail']);
            const idxTel = findIdx(['telefon', 'phone', 'mobil']);
            const idxContact = findIdx(['ansprechpartner', 'contact']);

            if (idxName === -1) {
                alert("CSV Fehler: Spalte 'Name' nicht gefunden.");
                return;
            }

            let count = 0;
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i].split(separator).map(c => c.trim().replace(/^"|"$/g, ''));
                if (row.length < headers.length * 0.5) continue; // Skip empty/broken rows

                const name = row[idxName] || "";
                if (!name) continue;

                // Smart guess for "istFirma": if no specific flag, assume true if name contains GmbH, UG, AG, etc.
                const istfirma = name.match(/(GmbH|UG|AG|Kg|Limited|Inc)/i) ? true : false;

                await kundeErstellen(
                    name,
                    istfirma,
                    idxStreet > -1 ? row[idxStreet] : "",
                    idxNumber > -1 ? row[idxNumber] : "",
                    idxPLZ > -1 ? row[idxPLZ] : "",
                    idxOrt > -1 ? row[idxOrt] : "",
                    "DE", // Default Land
                    idxEmail > -1 ? row[idxEmail] : "",
                    idxTel > -1 ? row[idxTel] : "",
                    idxContact > -1 ? row[idxContact] : "",
                    "" // LeitwegID
                );
                count++;
            }

            alert(`${count} Kunden erfolgreich importiert.`);
            const list = await rebuildKundenDB();
            setdata({ list });

        } catch (err) {
            console.error(err);
            alert("Fehler beim Import: " + err.message);
        }
        e.target.value = null; // Reset input
    };

    return (
        <div className="flex-1 w-full h-full overflow-y-auto bg-background p-8">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-[24px] font-semibold tracking-tight text-foreground">Kunden</h2>
                    <p className="text-sm text-muted-foreground">Verwalten Sie Ihre Kundenkontakte und Firmen.</p>
                </div>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10 shadow rounded-md font-medium" onClick={() => setcreatekunde(true)}>
                    <PlusCircle className="h-5 w-5" />
                    Neuer Kunde
                </Button>
            </div>

            <div className="mb-6 flex gap-4 items-center mt-6">
                <div className="relative flex-grow max-w-[400px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Suchen..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 rounded-[24px] border-input focus-visible:ring-primary shadow-sm"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-accent border-input shadow-sm" onClick={() => document.getElementById('csv-import').click()} title="CSV Import">
                            <Upload className="h-5 w-5" />
                        </Button>
                        <input id="csv-import" type="file" hidden accept=".csv" onChange={handleCSVImport} />
                    </div>

                    <Button variant="outline" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-accent border-input shadow-sm" onClick={handleCSVExport} title="CSV Export">
                        <Download className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground rounded-xl hover:bg-accent" onClick={async () => {
                        const list = await rebuildKundenDB();
                        setdata({ list });
                    }} title="Liste neu laden">
                        <RefreshCw className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#FAFAFA] dark:bg-muted/50 border-b">
                        <tr>
                            <th className="w-[60px] py-3 px-4 font-semibold text-muted-foreground"></th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Name</th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Typ</th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Email</th>
                            <th className="py-3 px-4 font-semibold text-muted-foreground">Ort</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {filteredList.map((item) => (
                            <tr key={item.id} onClick={() => navigate("/kunden-viewer/" + item.id)} className="hover:bg-muted/40 transition-colors cursor-pointer group">
                                <td className="py-3 px-4 text-center">
                                    {item.istfirma ? (
                                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center mx-auto">
                                            <User className="h-5 w-5" />
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="font-medium text-[15px] group-hover:text-primary transition-colors">{item.name}</div>
                                    <div className="text-xs text-muted-foreground">{item.id}</div>
                                </td>
                                <td className="py-3 px-4">
                                    {item.istfirma ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary">
                                            Firma
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">
                                            Privat
                                        </span>
                                    )}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{item.email || "-"}</td>
                                <td className="py-3 px-4 text-muted-foreground">{item.plz} {item.ort}</td>
                            </tr>
                        ))}
                        {filteredList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Keine Kunden gefunden
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {createkunde && (
                <MaskProvider>
                    <KundeErstellung submit={close} />
                </MaskProvider>
            )}
        </div>
    )
}

export default KundenVerwaltung
