import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { change_PayStatus, get_uRechnungen, getKunde } from '../Scripts/Filehandler';
import { Avatar, Box, Button, Chip, Dropdown, IconButton, Input, ListItem, ListItemDecorator, Menu, MenuButton, MenuItem, Table, Tooltip, Typography } from '@mui/joy';
import Headline from '../components/Headline';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ListPart from '../components/ListPart';
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
import debounce from 'lodash/debounce';
import InfoCard from '../components/InfoCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

function KundenViewer() {
  const { id } = useParams();
  const [kunde, setkunde] = useState();
  const [u_Rechnungen, set_uRechnungen] = useState();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [anchor, setAnchor] = React.useState(null);

  const [target, settarget] = useState(null);
  const handleContextMenu = (event, item, payed) => {
    event.preventDefault(); // Standard-Menü verhindern
    settarget({ item, payed });
    setAnchor({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleClose = () => {
    setAnchor(null);
  };
  useEffect(() => {
    const fetch = async () => {
      const fkunde = await getKunde(Number(id));
      setkunde(fkunde);

      const u_R = await get_uRechnungen();
      set_uRechnungen(u_R);
    }
    fetch();
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
  async function change_pstatus(item) {
    await change_PayStatus(item, id);
    const u_R = await get_uRechnungen();
    set_uRechnungen(u_R);
  }
  function onb() {
    navigate("/home/2/-1");
  }
  return (
    <Box>
      <Headline back={true} onback={onb}>{kunde?.name}</Headline>
      {anchor && (
        <Box
          sx={{
            position: "absolute",
            top: anchor.mouseY,
            left: anchor.mouseX,
            bgcolor: "background.surface",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "4px",
            boxShadow: 3,
            zIndex: 1300,
            p: 1,
          }}
          onMouseLeave={handleClose}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", p: 1, cursor: "pointer", "&:hover": { bgcolor: "neutral.plainHoverBg" } }}
            onClick={() => { alert("PDF Export"); handleClose(); }}
          >
            <IosShareOutlinedIcon fontSize="small" />
            <Typography level="body-sm" sx={{ ml: 1 }}>Als PDF Exportieren</Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", p: 1, cursor: "pointer", "&:hover": { bgcolor: "neutral.plainHoverBg" } }}
            onClick={() => { alert("E-Rechnung Export"); handleClose(); }}
          >
            <IosShareOutlinedIcon fontSize="small" />
            <Typography level="body-sm" sx={{ ml: 1 }}>Als E-Rechnung Exportieren</Typography>
          </Box>
          <Box
            sx={{ display: "flex", alignItems: "center", p: 1, cursor: "pointer", "&:hover": { bgcolor: "neutral.plainHoverBg" } }}
            onClick={() => { change_pstatus(target.item); handleClose(); }}
          >
            {target?.payed ? <AccountBalanceWalletOutlinedIcon fontSize="small" /> : <DangerousOutlinedIcon fontSize="small" />}
            <Typography level="body-sm" sx={{ ml: 1 }}>
              Als {target?.payed ? "Bezahlt" : "Ausstehend"} kennzeichnen
            </Typography>
          </Box>
        </Box>
      )}


      <Box sx={{ width: "100%", height: "calc(100vh - 55px)", display: "flex", overflowY: "auto", flexDirection: "row" }}>
        <Box
          sx={{
            height: "100%",
            width: "15%",
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            p: 2,
            boxSizing: "border-box",
            bgcolor: "",
          }}
        >
          <Avatar sx={{ mt: 5, mb: 2 }} size='lg' />
          <Typography sx={{ fontWeight: "5px", fontWeight: "bold" }}>{kunde?.name}</Typography>
          <Box sx={{ mt: 5, width: "100%", alignContent: "flex-start", justifyContent: "flex-start", display: "flex", flexDirection: "column" }}>
            <ListPart title={"Anschrift"}>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<NavigationOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.street} {kunde?.number}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<ApartmentOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.plz}, {kunde?.ort}
                  </Typography>
                </Box>
              </ListItem>
            </ListPart>
            <ListPart title={"Kontakt"}>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<LocalPhoneOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.tel}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<AlternateEmailOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    {kunde?.email}
                  </Typography>
                </Box>
              </ListItem>
            </ListPart>
            {

              kunde?.istfirma && (
                <ListPart title={"Ansprechpartner"}>
                  <ListItem>
                    <Box>
                      <Typography
                        level="body-xs"
                        startDecorator={<PersonPinCircleOutlinedIcon />}
                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                      >
                        {kunde?.ansprechpartner}
                      </Typography>
                    </Box>
                  </ListItem>
                </ListPart>
              )
            }
            <ListPart title={"Sonstiges"}>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<DateRangeOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    Kunde seit {new Date(kunde?.erstellt).toLocaleDateString("de-DE")}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem>
                <Box>
                  <Typography
                    level="body-xs"
                    startDecorator={<FormatListNumberedOutlinedIcon />}
                    sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                  >
                    Leitwegid {kunde?.leitwegid ? kunde?.leitwegid : "Nicht angegeben"}
                  </Typography>
                </Box>
              </ListItem>
            </ListPart>
          </Box>
        </Box>
        <Box sx={{ width: "85%", p: 2, display: "block", overflowY: "auto" }}>
          <InfoCard headline={"Information"}>Hier finden sie alle Rechnungen für {kunde?.name} aufgelistet. <br></br> Unbezahlte Rechnungen werden <Typography fontWeight={"bold"}>immer</Typography> ganz oben angezeigt</InfoCard>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2, mt: 7 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "55%", flexDirection: "row" }}>
              <Input
                placeholder="Rechnung suchen..."
                variant="outlined"
                sx={{ flexGrow: 1, userSelect: "all" }}
                onChange={(e) => setSearchTerm(e.target.value)}

                startDecorator={<SearchIcon />}
              />
            </Box>
            <Dropdown>
              <MenuButton color="primary" sx={{ mt: -1.7 }}>
                <EditOutlinedIcon />
                Bearbeiten
              </MenuButton>
              <Menu>
                <MenuItem onClick={() => navigate("/home/0/" + id)}><AddCircleOutlineOutlinedIcon />Rechnung hinzufügen</MenuItem>
                <MenuItem><EditOutlinedIcon />Kunden bearbeiten</MenuItem>
              </Menu>
            </Dropdown>

          </Box>
          <Table sx={{ mt: 2, "& th:nth-of-type(1)": { width: "70%" }, "& th:nth-of-type(2)": { width: "20%" }, "& th:nth-of-type(3)": { width: "10%" } }}>
            <thead>
              <tr>
                <th>Rechnung</th>
                <th>Status</th>

              </tr>
            </thead>
            <tbody>
              {
                kunde?.rechnungen
                  .filter((i) => i.includes(debouncedSearchTerm))
                  .slice().reverse() // Kopie
                  .sort((a, b) => {
                    const isAUnpaid = u_Rechnungen?.list?.some(r => r.id === id && r.rechnung === a);
                    const isBUnpaid = u_Rechnungen?.list?.some(r => r.id === id && r.rechnung === b);

                    // Unbezahlte zuerst
                    if (isAUnpaid && !isBUnpaid) return -1;
                    if (!isAUnpaid && isBUnpaid) return 1;

                    // Beide gleich, nach Datum absteigend
                    const dateA = kunde?.rechnungsDatum?.[a] ? new Date(kunde.rechnungsDatum[a]) : new Date(0);
                    const dateB = kunde?.rechnungsDatum?.[b] ? new Date(kunde.rechnungsDatum[b]) : new Date(0);

                    return dateB - dateA;
                  }).map((item, index) => {
                    const payed = u_Rechnungen?.list
                      .filter((i) => i.id === id)  // compare strings
                      .some((i) => i.rechnung === item);
                    return (
                      <Box
                        component="tr"
                        key={index}
                        onContextMenu={(e) => handleContextMenu(e, item, payed)}

                        sx={{
                          transition: 'background-color 0.2s',
                          '&:hover': {
                            bgcolor: 'neutral.plainHoverBg',
                          },
                          cursor: "pointer"
                        }}
                        onClick={() => navigate("/home/" + 1 + "/" + item)}
                      >

                        <Box component="td" sx={{ padding: '12px 16px' }}>
                          <Box sx={{
                            display: "flex", alignContent: "center", flexDirection: "row",
                          }}>
                            <ReceiptLongOutlinedIcon />
                            <Box sx={{ display: "flex", flexDirection: "column", ml: 1, cursor: "pointer" }}>
                              <Typography level="body-md" sx={{ cursor: "pointer", userSelect: "none" }}>{item}</Typography>
                              <Typography sx={{ color: "darkgray", cursor: "pointer", userSelect: "none" }} level="body-sm">{ }</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box component="td" sx={{ padding: '12px 16px' }}>
                          {
                            u_Rechnungen?.list
                              .filter((i) => i.id === id)  // compare strings
                              .some((i) => i.rechnung === item) ? (
                              <Tooltip title="diese Rechnung wurde noch nicht bezahlt">
                                <Chip startDecorator={<DangerousOutlinedIcon />} color='danger'>Ausstehend</Chip>
                              </Tooltip>
                            ) : (

                              <Chip startDecorator={<AccountBalanceWalletOutlinedIcon />} color="success">Bezahlt</Chip>
                            )
                          }
                        </Box>

                      </Box>
                    )
                  })
              }
            </tbody>
          </Table>
        </Box>
      </Box>
    </Box>

  )
}

export default KundenViewer
