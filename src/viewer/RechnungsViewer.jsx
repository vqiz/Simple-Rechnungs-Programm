import { Box, IconButton, Table, Tooltip, Typography } from '@mui/joy';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Headline from '../components/Headline';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { getKunde, handleLoadFile } from '../Scripts/Filehandler';
function RechnungsViewer({ rechnung, unternehmen }) {
  const [data, setData] = useState();
  const [kunde, setkunde] = useState();
  useEffect(() => {
    const fetchdata = async () => {
      const jsonstring = await handleLoadFile("rechnungen/" + rechnung);
      const json = JSON.parse(jsonstring);
      setData(json);
    }
    fetchdata();
  }, []);

  useEffect(() => {
    if (!data) {
      return;
    }
    const fetchkunde = async () => {
      const k = await getKunde(data.kundenId);
      setkunde(k);
    }
    fetchkunde();
  }, [data]);
  function Head({ page, of }) {
    return (
      <>
        <Box sx={{ width: 450, minHeight: 45, mb: 14 }}>
          <Typography level="h2">{unternehmen?.unternehmensname}</Typography>
        </Box>
        <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", mb: 15 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography level='body-md'>Herr/Frau</Typography>
            <Typography level="body-md">{kunde?.name}</Typography>
            <Typography level="body-md">{kunde?.street} {kunde?.number}</Typography>
            <Typography level='body-md'><br></br></Typography>
            <Typography level='body-md'>{kunde?.plz} {kunde?.ort}</Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
            <Typography level='title-md'>Rechnung</Typography>
            <Typography level='body-md'>Rechnungs-Nr: {rechnung.split("-")[3]}</Typography>
            <Typography level='body-md'>Kunden-Nr: {data?.kundenId}</Typography>
            <Typography level='body-md'>  Ausstellungsdatum: {(() => {
              const parts = rechnung.split("-");
              if (parts.length >= 4) {
                const jahr = parts[0].substring(1);
                const monat = parts[1];
                const tag = parts[2];
                return `${tag}.${monat}.${jahr}`;
              }
              return rechnung;
            })()}</Typography>
            <Typography level='body-md'>Seite {page} von {of} </Typography>
          </Box>
        </Box>

      </>
    );
  }
  function Footer() {
    return (
      <Box sx={{height: "150px", width: "100%", mt: 25}}>
        <Typography level="body-xs" fontWeight={"bold"}>{unternehmen?.unternehmensname}</Typography>
        <Typography level='body-xs'>{unternehmen?.strasse} {unternehmen?.hausnummer}, {unternehmen?.postleitzahl} {unternehmen?.stadt}</Typography>
        <Typography level='body-xs'>Tel: {unternehmen?.sonstigeTelefonnummer}, Email: {unternehmen?.sonstigeEmail}, {unternehmen?.website}</Typography>
        <Typography level='body-xs'>{unternehmen?.bankname}, IBAN: {unternehmen?.bankverbindung}, BIC: {unternehmen?.bic}</Typography>
        <Typography level='body-xs'>{unternehmen?.handelsregisternummer}, Inhaber: {unternehmen?.inhaber},USt-ID-NR: {unternehmen?.umsatzsteuerId}, Steuer-Nr: {unternehmen?.steuernr}</Typography>
      </Box>



    )
  }



  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "fixed",
          right: 25,
          top: "50%",
          transform: "translateY(-50%)",
          width: 80,
          background: "linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingY: 2,
          gap: 1.5,
          zIndex: 20,
          "&:hover": {
            boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
            transition: "box-shadow 0.3s ease",
          },
        }}
      >
        {[
          { icon: <PersonOutlinedIcon />, label: "zum Kunden" },
          { icon: <IosShareOutlinedIcon />, label: "Als PDF exportieren" },
          { icon: <IosShareOutlinedIcon />, label: "Als E-Rechnung exportieren" },
          { icon: <LocalPrintshopOutlinedIcon />, label: "Drucken" },
          { icon: <DeleteOutlineOutlinedIcon />, label: "Löschen", color: 'danger' },
        ].map((item, index) => (
          <Tooltip key={index} title={item.label} placement="left">
            <IconButton
              variant="soft"
              color={item.color}
              size="lg"
              sx={{
                borderRadius: "12px",
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "scale(1.1)",

                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>


      <Box
        sx={{
          width: 794,
          height: 1123,
          border: 'none',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1)',
          overflow: 'auto',
          padding: 6,
          margin: '20px auto',
          backgroundColor: '#fff',
          flexDirection: "column",
          display: "flex",
        }}
      >
        <Head page={1} of={2} />
        <Table sx={{ bgcolor: "white", borderRadius: "15px", fontWeight: "bold" }}>
          <thead>
            <tr>
              <th>Position</th>
              <th>Menge</th>
              <th>Einzelpreiß</th>
              <th>Gesammt</th>
            </tr>

          </thead>
          <tbody>
            {data?.positionen &&
              Array.from(Object.entries(data.positionen)).map(([key, value]) => {
                const [category, itemName] = key.split("_");
                const amount = value;
                const item = data?.items?.list?.find(i => i.name === category);
                const price = item?.content.find((i) => i.name == itemName).price;
                const total = amount * price;

                return (
                  <tr key={key}>
                    <td>{itemName}</td>
                    <td>{amount}x</td>
                    <td>{price}€</td>
                    <td>{total}€</td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
        <Footer/>
      </Box>





    </Box>
  )
}

export default RechnungsViewer
