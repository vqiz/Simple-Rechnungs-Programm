import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import { Autocomplete, Avatar, Box, Button, ButtonGroup, Card, Divider, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Table, Tooltip, Typography } from '@mui/joy'
import InfoCard from '../InfoCard'
import { handleLoadFile } from '../../Scripts/Filehandler';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import TableContainer from '@mui/material/TableContainer';
import MaskProvider from '../MaskProvider';
function RechnungErstellen() {

  const [kathpath] = useState('kathegories/kathegories.rechnix');
  const [kunden, setkunden] = useState();
  const [produkte, setprodukte] = useState();



  //create produkt properties 
  const [createProdukt, setCreateProdukt] = useState(false);
  const [price, setprice] = useState(0);
  const [produktname, setproduktname] = useState("");
  const [error, seterror] = useState(false);
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
    positionen: new Map(),
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
  const addPosition = (key, value) => {
    setRechnung((prev) => {
      const updatedMap = new Map(prev.positionen);
      updatedMap.set(key, value);
      return { ...prev, positionen: updatedMap };
    });
  };

  const removePosition = (key) => {
    setRechnung((prev) => {
      const updatedMap = new Map(prev.positionen);
      updatedMap.delete(key);
      return { ...prev, positionen: updatedMap };
    });
  };
  const containsPosition = (key) => {
    return rechnung.positionen.has(key);
  };
  const updatePosition = (key, newValue) => {
    setRechnung((prev) => {
      if (!prev.positionen.has(key)) {
        console.warn(`Position with key "${key}" not found`);
        return prev; // no change
      }
      const updatedMap = new Map(prev.positionen);
      updatedMap.set(key, newValue); // overwrite value
      return { ...prev, positionen: updatedMap };
    });
  };
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        position: 'relative',
        bgcolor: 'background.level1',
        alignItems: 'center',
      }}
    >
      <Headline>Rechnung erstellen</Headline>
      {
        createProdukt && (
          <MaskProvider>
            <Modal open={"true"}>
              <ModalDialog
                variant="outlined"
                sx={{
                  borderRadius: "md",
                  width: "55vh",
                  maxWidth: "90vw",
                }}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                  }}
                  style={{ width: "100%" }}
                >
                  <Typography level='h3' mb={1}>
                    Produkt hinzufügen
                  </Typography>
                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <FormControl sx={{ width: "60%" }}>
                      <FormLabel sx={{ color: 'gray' }}>Produktname</FormLabel>
                      <Input
                        value={produktname}
                        onChange={(e) => {
                          setproduktname(e.target.value);
                          seterror(false);
                        }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel sx={{ color: 'gray' }}>Brutto Betrag in €</FormLabel>
                      <Input
                        onChange={(e) => {
                          const value = e.target.value.replace(',', '.');
                          setprice(value);
                          seterror(false);
                        }}
                        type='number'
                        value={price}
                        inputProps={{ step: "0.01" }}
                      />
                    </FormControl>
                  </Box>

                  {error && (
                    <Typography color='danger' level="body-xs" mt={1}>
                      Bitte überprüfe deine Eingabe
                    </Typography>
                  )}

                  <Box
                    sx={{
                      width: "100%",
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => setCreateProdukt(false)}
                      variant='outlined'
                      color="neutral"
                    >
                      Abbrechen
                    </Button>

                    <Button
                      
                      color="success"
                      variant='solid'
                    >
                      Hinzufügen
                    </Button>
                  </Box>
                </form>
              </ModalDialog>
            </Modal>
          </MaskProvider>
        )
      }

      <Box sx={{ p: 2 }}>
        <InfoCard headline={"Information"}>
          Im Folgenden können Sie eine Rechnung erstellen. Wählen Sie einen Kunden aus oder erstellen Sie einen, falls dieser noch nicht existiert.
          <br /> Bestehende Rechnungen können sie unter dem jeweiligen Kunden finden. Diese sind unter <Typography sx={{ fontWeight: "bold" }}>KundenVerwaltung</Typography> zu finden
        </InfoCard>
      </Box>
      <Box sx={{ p: 2, display: "flex", flexDirection: "row", gap: 2, width: '100%', maxWidth: 1200 }}>
        <Card variant="outlined" sx={{ width: "30%", height: "70vh", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: 2, boxShadow: "md", p: 2 }}>
          <Typography level="title-md" sx={{ fontWeight: "bold", mb: 1, mt: 1 }}>Produktauswahl</Typography>
          <Divider orientation="horizontal" sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexDirection: "row", gap: 2 }}>
            <Input
              placeholder="Produkt suchen"
              variant="outlined"
              sx={{ flexGrow: 1, display: "flex", maxWidth: "83.6%" }}
              onChange={(e) => setSearchTerm(e.target.value)}

              startDecorator={<SearchIcon />}
            />
            <Tooltip title={"Produkt hinzufügen das nicht in der Schnellauswahl vorhanden ist"}>
              <IconButton onClick={() => setCreateProdukt(true)} color="primary" size='sm'>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>

          </Box>
          <Box sx={{
            flex: 1,
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" }
          }}>
            {
              produkte && produkte.list?.filter((i) => {
                const overname = i.name.toLocaleLowerCase();
                const search = debouncedSearchTerm.toLocaleLowerCase();
                const matchesCategory = overname.includes(search);
                const matchesSubitem = i.content.some((sub) => sub.name.toLocaleLowerCase().includes(search));
                return matchesCategory || matchesSubitem;
              }).map((item) => {
                const overname = item.name;
                const items = item.content;
                return (
                  <Box key={overname}>
                    <Typography level="title-lg" sx={{ mt: 1, mb: 1 }}>{overname}</Typography>
                    <Divider sx={{ my: 1 }} orientation="horizontal" />
                    {
                      items.filter((i) => i.name.toLocaleLowerCase().includes(debouncedSearchTerm.toLocaleLowerCase())).map((subitem) => {
                        const name = subitem.name;
                        const price = subitem.price;
                        return (
                          <Box key={name} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", p: 1, borderRadius: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography color="neutral" level="body-md" fontWeight={"bold"}>{name}</Typography>
                            </Box>
                            <ButtonGroup sx={{ mb: 0.5 }}>
                              {
                                containsPosition(overname + "_" + name) && (
                                  <Tooltip title={"Position veringern/entfernen"}>
                                    <IconButton onClick={() => {
                                      const n = overname + "_" + name;
                                      if (rechnung.positionen.get(n) == 1) {
                                        removePosition(n);
                                        return;
                                      }
                                      updatePosition(n, rechnung.positionen.get(n) - 1);
                                    }} color="danger">
                                      <RemoveCircleOutlineOutlinedIcon />
                                    </IconButton>
                                  </Tooltip>

                                )
                              }
                              <Tooltip title={"Position hinzufügen"}>
                                <IconButton onClick={() => {
                                  const n = overname + "_" + name;
                                  if (containsPosition(n)) {
                                    updatePosition(n, rechnung.positionen.get(n) + 1);
                                    return;
                                  }
                                  addPosition(n, 1);
                                }} color="success">
                                  <AddCircleOutlineOutlinedIcon />
                                </IconButton>
                              </Tooltip>

                            </ButtonGroup>
                          </Box>
                        )


                      })
                    }
                  </Box>
                );

              })
            }
          </Box>

        </Card>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl variant="outlined" sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: "sm", bgcolor: "white" }}>
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
          <TableContainer sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            <Table stickyHeader={!createProdukt} size="md" sx={{ bgcolor: "white", overflowY: "auto" }}>
              <thead>
                <th>Rechnungs Positionen</th>
              </thead>
              <tbody>
                {
                  Array.from(rechnung.positionen.entries()).map(([key, value]) => (
                    <tr key={key}>
                      <td>
                        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", p: 2 }}>
                          <Typography sx={{ mt: 1 }}>{key.split("_")[1]} (x{value})</Typography>
                          <Box sx={{ gap: 2, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                            <Typography color="success">
                              {(
                                value *
                                (
                                  produkte.list
                                    ?.find((i) => i.name === key.split("_")[0])
                                    ?.content.find((i) => i.name === key.split("_")[1])
                                    ?.price || 0
                                )
                              ).toFixed(2)}€
                            </Typography>
                            <Tooltip title={"Position entfernen"}>
                              <IconButton onClick={() => { removePosition(key) }} color='danger'>
                                <RemoveCircleOutlineOutlinedIcon />
                              </IconButton>
                            </Tooltip>

                          </Box>

                        </Box>

                      </td>
                    </tr>
                  ))
                }
                {
                  rechnung.positionen.size > 0 && rechnung.kundenId && (
                    <tr>
                      <td>
                        <Box sx={{ width: "100%", justifyContent: "center", alignItems: "center" }}>
                          <Button>Rechnung generieren</Button>
                        </Box>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

    </Box>
  )
}

export default RechnungErstellen
