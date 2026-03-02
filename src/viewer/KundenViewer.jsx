import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { change_PayStatus, get_uRechnungen, getKunde } from '../Scripts/Filehandler';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Info, ArrowLeft, Building2, MapPin, Phone, Mail, User, Search, PlusCircle, Receipt, DollarSign } from "lucide-react";

import PaymentStatusBadge from '../components/Payment/PaymentStatusBadge';
import PaymentModal from '../components/Payment/PaymentModal';
import { getbrutto } from '../Scripts/ERechnungInterpretter';
import { handleLoadFile } from '../Scripts/Filehandler';
import debounce from 'lodash/debounce';
import MaskProvider from '../components/MaskProvider';
import KundenEditor from '../components/KundenVerwaltung/Masks/KundenEditor';
import '../styles/swiss.css';

function KundenViewer() {
  const { id } = useParams();
  const [kunde, setkunde] = useState();
  const [u_Rechnungen, set_uRechnungen] = useState();
  const [editkunde, setEditKunde] = useState();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState(null);
  const [selectedInvoiceTotal, setSelectedInvoiceTotal] = useState(0);

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [anchor, setAnchor] = React.useState(null);
  const [target, settarget] = useState(null);

  const handleContextMenu = (event, item, payed) => {
    event.preventDefault();
    settarget({ item, payed });
    setAnchor({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const openPaymentModal = async (invoiceTitle) => {
    try {
      const jsonstring = await handleLoadFile("rechnungen/" + invoiceTitle);
      const json = JSON.parse(jsonstring);
      const total = getbrutto(json);
      setSelectedInvoiceForPayment(invoiceTitle);
      setSelectedInvoiceTotal(parseFloat(total));
      setPaymentModalOpen(true);
    } catch (e) {
      console.error("Could not load invoice for payment", e);
    }
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const fetch = async () => {
    const fkunde = await getKunde(id);
    setkunde(fkunde);

    const u_R = await get_uRechnungen();
    set_uRechnungen(u_R);
  }

  useEffect(() => {
    fetch();
  }, [id]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    handler();
    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  const oneditclose = () => {
    setEditKunde(false);
    fetch();
  }

  if (!kunde) return <div className="p-4">Lade Kundendaten...</div>;

  return (
    <div className="flex h-full overflow-hidden bg-background">

      {/* LEFT SIDEBAR: PROFILE */}
      <div className="w-[320px] border-r bg-background flex flex-col overflow-y-auto p-6 gap-6 shrink-0">
        {/* Back Button */}
        <div className="flex items-center gap-2 -ml-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/clients')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-muted-foreground">Zurück zur Übersicht</span>
        </div>

        {/* Avatar & Name */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary text-3xl font-semibold flex items-center justify-center mb-4">
            {kunde.name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-semibold mb-1">{kunde.name}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${kunde.istfirma ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {kunde.istfirma ? 'Firmenkunde' : 'Privatkunde'}
          </span>
        </div>

        <hr className="border-border" />

        {/* KONTAKT Section */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-primary mb-3">Kontakt</p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{kunde.street} {kunde.number}</p>
                <p className="text-sm text-muted-foreground">{kunde.plz} {kunde.ort}</p>
              </div>
            </div>
            {kunde.tel && (
              <div className="flex gap-3 items-center">
                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm">{kunde.tel}</p>
              </div>
            )}
            {kunde.email && (
              <div className="flex gap-3 items-center">
                <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
                <p className="text-sm break-all">{kunde.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* ANSPRECHPARTNER */}
        {kunde.istfirma && kunde.ansprechpartner && (
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-primary mb-3">Ansprechpartner</p>
            <div className="flex gap-3 items-center">
              <User className="h-5 w-5 text-muted-foreground shrink-0" />
              <p className="text-sm font-medium">{kunde.ansprechpartner}</p>
            </div>
          </div>
        )}

        {/* META Section */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.5px] text-primary mb-3">Kunden-Akte</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-center">
              <span className="text-xs text-muted-foreground w-20">Kunden-Nr.</span>
              <span className="text-xs font-mono font-medium">{kunde.id}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-xs text-muted-foreground w-20">Seit</span>
              <span className="text-xs font-medium">{new Date(kunde.erstellt).toLocaleDateString("de-DE")}</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-auto flex flex-col gap-2">
          <Button variant="outline" className="w-full gap-2 border" onClick={() => setEditKunde(true)}>
            Kunde bearbeiten
          </Button>
        </div>
      </div>

      {/* MAIN CONTENT: INVOICES & HISTORY */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar Header */}
        <div className="p-6 border-b bg-background flex items-center justify-between shrink-0">
          <h4 className="text-xl font-semibold">Rechnungen</h4>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechnung suchen..."
                className="pl-9 min-w-[250px] rounded-[20px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gap-2" onClick={() => navigate("/invoices/create/" + id)}>
              <PlusCircle className="h-4 w-4" />
              Neue Rechnung
            </Button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {(!kunde.rechnungen || kunde.rechnungen.length === 0) ? (
            <div className="flex flex-col items-center justify-center mt-12 opacity-60">
              <Receipt className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium text-muted-foreground">Keine Rechnungen vorhanden</h3>
            </div>
          ) : (
            <div className="rounded-xl border shadow-sm bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAFA] dark:bg-muted/50 border-b">
                  <tr>
                    <th className="w-[60px] py-3 px-4 text-left text-muted-foreground font-semibold"></th>
                    <th className="py-3 px-4 text-left text-muted-foreground font-semibold">Rechnung Nr.</th>
                    <th className="py-3 px-4 text-left text-muted-foreground font-semibold">Datum</th>
                    <th className="py-3 px-4 text-left text-muted-foreground font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(kunde?.rechnungen || [])
                    .filter((i) => i.includes(debouncedSearchTerm))
                    .slice().reverse()
                    .sort((a, b) => {
                      const isAUnpaid = u_Rechnungen?.list?.some(r => r.id === id && r.rechnung === a);
                      const isBUnpaid = u_Rechnungen?.list?.some(r => r.id === id && r.rechnung === b);
                      if (isAUnpaid && !isBUnpaid) return -1;
                      if (!isAUnpaid && isBUnpaid) return 1;
                      const dateA = kunde?.rechnungsDatum?.[a] ? new Date(kunde.rechnungsDatum[a]) : new Date(0);
                      const dateB = kunde?.rechnungsDatum?.[b] ? new Date(kunde.rechnungsDatum[b]) : new Date(0);
                      return dateB - dateA;
                    }).map((item) => {
                      const isUnpaid = u_Rechnungen?.list?.some(r => r.id === id && r.rechnung === item);
                      return (
                        <tr
                          key={item}
                          onClick={() => navigate("/invoices/" + item)}
                          onContextMenu={(e) => handleContextMenu(e, item, !isUnpaid)}
                          className="hover:bg-muted/30 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4 text-center text-muted-foreground">
                            <Receipt className="h-5 w-5 mx-auto" />
                          </td>
                          <td className="py-3 px-4 font-medium">{item}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {kunde?.rechnungsDatum?.[item] ? new Date(kunde.rechnungsDatum[item]).toLocaleDateString("de-DE") : "-"}
                          </td>
                          <td className="py-3 px-4">
                            <PaymentStatusBadge invoiceNumber={item} />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals & Menus */}
      {editkunde && (
        <MaskProvider>
          <KundenEditor id={id} close={oneditclose} />
        </MaskProvider>
      )}

      {anchor && (
        <div
          style={{
            position: "absolute",
            top: anchor.mouseY,
            left: anchor.mouseX,
            zIndex: 1300,
          }}
          className="bg-white border rounded shadow-lg p-1 min-w-[150px]"
          onMouseLeave={handleClose}
        >
          <div
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded"
            onClick={() => {
              openPaymentModal(target.item);
              handleClose();
            }}
          >
            <DollarSign className="h-4 w-4 mr-2 text-green-600" />
            <span className="text-sm font-medium">Zahlung erfassen</span>
          </div>
        </div>
      )}

      {paymentModalOpen && (
        <PaymentModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          invoiceNumber={selectedInvoiceForPayment}
          invoiceTotal={selectedInvoiceTotal}
          onPaymentRecorded={() => {
            fetch();
            setPaymentModalOpen(false);
          }}
        />
      )}
    </div>
  )
}

export default KundenViewer
