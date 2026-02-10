import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { change_PayStatus, get_uRechnungen, getKunde } from '../Scripts/Filehandler';
import { Avatar, Box, Button, Chip, Dropdown, IconButton, Input, ListItem, ListItemDecorator, Menu, MenuButton, MenuItem, Table, Tooltip, Typography, Divider } from '@mui/joy';
import Headline from '../components/Headline'; // Check if needed or if we use custom header
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ListPart from '../components/ListPart'; // Might replace with custom
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PaymentStatusBadge from '../components/Payment/PaymentStatusBadge';
import PaymentModal from '../components/Payment/PaymentModal';
import { getbrutto } from '../Scripts/ERechnungInterpretter';
import { handleLoadFile } from '../Scripts/Filehandler';
import debounce from 'lodash/debounce';
import InfoCard from '../components/InfoCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../components/MaskProvider';
import KundenEditor from '../components/KundenVerwaltung/Masks/KundenEditor';
import AvatarTabeUtil from '../components/AvatarTabeUtil'; // Reuse for consistent avatars
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

  if (!kunde) return <Box sx={{ p: 4 }}>Lade Kundendaten...</Box>;

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden', bgcolor: 'var(--md-sys-color-background)' }}>

      {/* LEFT SIDEBAR: PROFILE */}
      <Box sx={{
        width: '320px',
        bgcolor: 'var(--md-sys-color-surface)',
        borderRight: '1px solid var(--md-sys-color-outline)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        p: 3,
        gap: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/clients')} variant="plain" sx={{ ml: -1 }}>
            <ArrowCircleLeftOutlinedIcon />
          </IconButton>
          <Typography level="title-sm" sx={{ color: 'var(--md-sys-color-on-surface-variant)' }}>Zurück zur Übersicht</Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Avatar sx={{ width: 80, height: 80, fontSize: 32, mb: 2 }}>{kunde.name.charAt(0)}</Avatar>
          <Typography level="h3" sx={{ fontWeight: 600, mb: 0.5 }}>{kunde.name}</Typography>
          <Chip variant="soft" color={kunde.istfirma ? 'primary' : 'neutral'} size="sm">
            {kunde.istfirma ? 'Firmenkunde' : 'Privatkunde'}
          </Chip>
        </Box>

        <Divider />

        <Box>
          <Typography level="title-sm" sx={{ mb: 1, color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>Kontakt</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <ApartmentOutlinedIcon sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 20 }} />
              <div>
                <Typography level="body-sm">{kunde.street} {kunde.number}</Typography>
                <Typography level="body-sm">{kunde.plz} {kunde.ort}</Typography>
              </div>
            </div>
            {kunde.tel && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <LocalPhoneOutlinedIcon sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 20 }} />
                <Typography level="body-sm">{kunde.tel}</Typography>
              </div>
            )}
            {kunde.email && (
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <AlternateEmailOutlinedIcon sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 20 }} />
                <Typography level="body-sm" sx={{ wordBreak: 'break-all' }}>{kunde.email}</Typography>
              </div>
            )}
          </div>
        </Box>

        {kunde.istfirma && (
          <Box>
            <Typography level="title-sm" sx={{ mb: 1, color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>Ansprechpartner</Typography>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <PersonPinCircleOutlinedIcon sx={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: 20 }} />
              <Typography level="body-sm">{kunde.ansprechpartner || 'Keine Angabe'}</Typography>
            </div>
          </Box>
        )}

        <Box>
          <Typography level="title-sm" sx={{ mb: 1, color: 'var(--md-sys-color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>Meta</Typography>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Typography level="body-xs" sx={{ color: 'var(--md-sys-color-on-surface-variant)', width: '80px' }}>Kunden-Nr</Typography>
              <Typography level="body-xs">{kunde.id}</Typography>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Typography level="body-xs" sx={{ color: 'var(--md-sys-color-on-surface-variant)', width: '80px' }}>Seit</Typography>
              <Typography level="body-xs">{new Date(kunde.erstellt).toLocaleDateString("de-DE")}</Typography>
            </div>
          </div>
        </Box>

        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button variant="outlined" color="primary" startDecorator={<EditOutlinedIcon />} onClick={() => setEditKunde(true)}>
            Bearbeiten
          </Button>
        </Box>
      </Box>


      {/* MAIN CONTENT: INVOICES & HISTORY */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header/Toolbar */}
        <Box sx={{
          p: 3,
          borderBottom: '1px solid var(--md-sys-color-outline)',
          bgcolor: 'var(--md-sys-color-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography level="h4">Rechnungen</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Input
              placeholder="Rechnung suchen..."
              startDecorator={<SearchIcon />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: '250px', borderRadius: '20px' }}
            />
            <Button startDecorator={<AddCircleOutlineOutlinedIcon />} onClick={() => navigate("/invoices/create/" + id)}>
              Neue Rechnung
            </Button>
          </Box>
        </Box>

        {/* List */}
        <Box sx={{ p: 4, overflowY: 'auto', flex: 1 }}>
          {(!kunde.rechnungen || kunde.rechnungen.length === 0) ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8, opacity: 0.6 }}>
              <ReceiptLongOutlinedIcon sx={{ fontSize: 64, mb: 2 }} />
              <Typography>Keine Rechnungen vorhanden</Typography>
            </Box>
          ) : (
            <div className="swiss-card" style={{ padding: 0, overflow: 'hidden' }}>
              <Table hoverRow sx={{ '--TableCell-headBackground': 'var(--swiss-gray-50)' }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}></th>
                    <th>Rechnung Nr.</th>
                    <th>Datum</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
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
                          style={{ cursor: 'pointer' }}
                        >
                          <td style={{ textAlign: 'center', color: 'var(--swiss-gray-400)' }}>
                            <ReceiptLongOutlinedIcon fontSize="small" />
                          </td>
                          <td>
                            <Typography fontWeight="md">{item}</Typography>
                          </td>
                          <td>
                            <Typography level="body-sm">
                              {kunde?.rechnungsDatum?.[item] ? new Date(kunde.rechnungsDatum[item]).toLocaleDateString("de-DE") : "-"}
                            </Typography>
                          </td>
                          <td>
                            <PaymentStatusBadge invoiceNumber={item} />
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </Table>
            </div>
          )}
        </Box>
      </Box>

      {/* Modals & Menus */}
      {editkunde && (
        <MaskProvider>
          <KundenEditor id={id} close={oneditclose} />
        </MaskProvider>
      )}

      {anchor && (
        <Box
          sx={{
            position: "absolute",
            top: anchor.mouseY,
            left: anchor.mouseX,
            bgcolor: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1300,
            p: 1,
            minWidth: '150px'
          }}
          onMouseLeave={handleClose}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", p: 1, cursor: "pointer", "&:hover": { bgcolor: "#f5f5f5" }, borderRadius: '4px' }}
            onClick={() => {
              openPaymentModal(target.item);
              handleClose();
            }}
          >
            <AttachMoneyOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'var(--swiss-success)' }} />
            <Typography level="body-sm">Zahlung erfassen</Typography>
          </Box>
        </Box>
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
    </Box>
  )
}

export default KundenViewer
