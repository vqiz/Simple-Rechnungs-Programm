import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import { Autocomplete, Avatar, Box, Button, ButtonGroup, Card, Divider, FormControl, FormLabel, IconButton, Input, Table, Typography } from '@mui/joy'
import InfoCard from '../InfoCard'
import { handleLoadFile } from '../../Scripts/Filehandler';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
function RechnungErstellen() {

  const [kathpath] = useState('kathegories/kathegories.rechnix');
  const [kunden, setkunden] = useState();
  const [produkte, setprodukte] = useState();
  useEffect(() => {
    const readdata = async () => {
      const readjson = await handleLoadFile("fast_accsess/kunden.db");
      if (readjson === "{}") {
        setkunden(JSON.parse('{"list": []}').list);
        return;
      }
      setkunden(JSON.parse(readjson).list);
    }
    const readproduktdata = async () => {
      const jsonString = await handleLoadFile(kathpath);
      const json = JSON.parse(jsonString);
      setprodukte(json);
    };
    readdata();
    readproduktdata();
  }, []);

  const [rechnung, setRechnung] = React.useState({
    kundenId: -1,
    positionen: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    handler();
    return () => {
      handler.cancel();
    };
  }, [searchTerm]);
  function addItem(item) {
    //const update = rechnung.positione
    //setRechnung({...rechnung, positionen: })
  }
  function removeItem(item) {

  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 0,
        position: 'relative'
      }}
    >
      <Headline>Rechnung erstellen</Headline>
      <Box sx={{ p: 2 }}>
        <InfoCard headline={"Information"}>
          Im Folgenden können Sie eine Rechnung erstellen. Wählen Sie einen Kunden aus oder erstellen Sie einen, falls dieser noch nicht existiert.
          <br /> Bestehende Rechnungen können sie unter dem jeweiligen Kunden finden. Diese sind unter <Typography sx={{ fontWeight: "bold" }}>KundenVerwaltung</Typography> zu finden
        </InfoCard>
      </Box>
      <Box sx={{ p: 2, display: "flex", flexDirection: "row", gap: 2 }}>
        <Card sx={{ width: "30%", height: "70vh", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <Typography level="body-md" sx={{ fontWeight: "bold" }}>Produktauswahl</Typography>
          <Divider orientation="horizontal" />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2}}>
            <Input
              placeholder="Produkt suchen"
              variant="outlined"
              sx={{ flexGrow: 1, }}
              onChange={(e) => setSearchTerm(e.target.value)}

              startDecorator={<SearchIcon />}
            />
          </Box>

          {
            produkte && produkte.list?.map((item) => {
              const name = item.name;
              const items = item.content;
              return (
                <Box>
                  <Typography level="title-lg">{name}</Typography>
                  <Divider sx={{mb: 1}} orientation="horizontal"/>
                  {
                    items.map((subitem) => {
                      const name = subitem.name;
                      const price = subitem.price;
                      return (
                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                          <Typography color="neutral" level="body-md">{name}</Typography>
                          <IconButton color="success">
                            <AddCircleOutlineOutlinedIcon/>
                          </IconButton>


                        </Box>
                      )


                    })
                  }
                </Box>
              );

            })
          }





        </Card>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <FormControl sx={{ mb: 3 }}>
            <FormLabel>Kunde auswählen</FormLabel>
            <Autocomplete
              value={kunden?.find((i) => i.id === rechnung.kundenId)}
              onChange={(e, newval) => {
                setRechnung({ ...rechnung, kundenId: newval })
              }}
              options={kunden || []}
              getOptionLabel={(option) => {
                if (typeof option === "string") {
                  return option;
                }
                if (option && typeof option === "object") {
                  return option.name || "";
                }
                return "";
              }}
              renderOption={(props, item) => (
                <Box
                  {...props}
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "8px 12px",
                    minHeight: "50px",
                    userSelect: "none",
                    cursor: "default",
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: 'neutral.plainHoverBg',
                    },
                  }}
                >
                  {item.istfirma ? (
                    <Avatar size="sm">
                      <FactoryOutlinedIcon />
                    </Avatar>
                  ) : (
                    <Avatar size="sm">
                      <AccountCircleOutlinedIcon />
                    </Avatar>
                  )}
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography level="body-md">{item.name}</Typography>
                    <Typography level="body-sm" sx={{ color: "darkgray" }}>
                      {item.email}
                    </Typography>
                  </Box>
                </Box>
              )}
              placeholder="Bitte wählen"
            />

          </FormControl>
          <Table sx={{ maxWidth: "90vh", height: "65vh", bgcolor: "white", borderRadius: "15px" }}>
            <thead>
              <th>Rechnungs Positionen</th>
            </thead>
            <tbody>

            </tbody>
          </Table>

        </Box>
      </Box>

    </Box>
  )
}

export default RechnungErstellen
