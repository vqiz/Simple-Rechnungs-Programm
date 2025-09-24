import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import { Autocomplete, Avatar, Box, Button, ButtonGroup, Card, Divider, FormControl, FormLabel, IconButton, Input, Link, Modal, ModalDialog, Switch, Table, Tooltip, Typography } from '@mui/joy'
import InfoCard from '../InfoCard'
import { getKunde, handleLoadFile } from '../../Scripts/Filehandler';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { debounce } from 'lodash';
import SearchIcon from '@mui/icons-material/Search';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import TableContainer from '@mui/material/TableContainer';
import MaskProvider from '../MaskProvider';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
function RechnungErstellen() {

  const [kathpath] = useState('kathegories/kathegories.rechnix');
  const [kunden, setkunden] = useState(null);
  const [produkte, setprodukte] = useState();



  //create produkt properties 
  const [createProdukt, setCreateProdukt] = useState(false);
  const [price, setprice] = useState(0);
  const [createsteuer,setCreateSteuer] = useState(19);
  const [produktname, setproduktname] = useState("");
  const [error, seterror] = useState(false);

  //count mask and variables
  const [editCount, seteditCount] = useState(false);
  const [count, setCount] = useState(0);
  const [targetEditCount, setTargetEditCount] = useState();

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
    kundenId: null,
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
  const createRechnung = async () => {
    //const kunde = await getKunde(rechnung.kundenId);









  }
  const [brutto, setbrutto] = useState(false);
  //bgcolor: 'background.level1',
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.level1",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {
        editCount && (
          <MaskProvider>
            <Modal open={true}>
              <ModalDialog
                variant="outlined"
                sx={{
                  borderRadius: "md",
                  width: "55vh",
                  maxWidth: "90vw",
                }}>
                <form onSubmit={() => { updatePosition(targetEditCount, count); seteditCount(false) }}>
                  <Typography level='h3' mb={1}>
                    Anzahl ändern
                  </Typography>
                  <Divider />
                  <Input type='number' value={count} onChange={(e) => {
                    setCount(Number(e.target.value))
                  }} />
                  <Box
                    sx={{
                      width: "100%",
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      onClick={() => seteditCount(false)}
                      variant='outlined'
                      color="neutral"
                    >
                      Abbrechen
                    </Button>

                    <Button
                      color="primary"
                      variant='solid'
                      onClick={() => { updatePosition(targetEditCount, count); seteditCount(false) }}
                    >
                      Speichern
                    </Button>
                  </Box>
                </form>
              </ModalDialog>
            </Modal>
          </MaskProvider>

        )
      }


      {
        createProdukt && (
          <MaskProvider>
            <Modal open={true}>
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
                      <FormLabel sx={{ color: 'gray' }}>Netto Betrag in €</FormLabel>
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
                    <FormControl>
                      <FormLabel sx={{color: "gray"}}>
                        Mehrwertsteuer in %
                      </FormLabel>
                      <Input onChange={(e) => {
                            const value = e.target.value.replace(',', '.');
                            setCreateSteuer(Number(value));
                            seterror(false);
                      }}
                      type='number'
                      value={createsteuer} 
                      inputProps={{ step: "0.01" }}/>
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
                      onClick={() => {
                        if (!price || !produktname || produktname === "") {
                          seterror(true);
                          return;
                        }
                        const data = produkte;
                        const element = {
                          name: produktname,
                          price: price,
                          steuer: createsteuer,
                          temporary: true,
                        }
                        const tempCategory = data.list.find((i) => i.name === "temp");

                        if (tempCategory) {
                          tempCategory.content.push(element);
                        } else {
                          const tempkath = {
                            name: "temp",
                            content: [element],
                          };
                          data.list.push(tempkath);
                        }
                        setprodukte(data);
                        addPosition("temp_" + produktname, 1);
                        setCreateProdukt(false);
                        console.log(produkte);
                        setprice(0);
                        setproduktname("");
                        setCreateSteuer(19);
                      }}
                      color="primary"
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
      {/* Top AppBar */}
      <Box
        sx={{
          maxHeight: 56,
          height: 56,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
        }}
      >
        <Typography level="h4" fontWeight="lg">
          Neue Rechnung
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="solid"
            color="primary"
            onClick={() => createRechnung()}
            startDecorator={<SaveOutlinedIcon />}
            disabled={rechnung.positionen.size === 0 || !rechnung.kundenId}
          >
            Rechnung erstellen
          </Button>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar: Produkt Browser */}
        <Card
          variant="outlined"
          sx={{
            width: 320,
            p: 2,
            borderRadius: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Suche */}
          <Input
            placeholder="Produkte durchsuchen..."
            startDecorator={<SearchIcon />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button
            fullWidth
            variant="soft"
            color="primary"
            startDecorator={<AddCircleOutlineOutlinedIcon />}
            onClick={() => setCreateProdukt(true)}
          >
            Neues Produkt
          </Button>

          {/* Kategorien */}
          <Box sx={{ flex: 1, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" }, maxHeight: "82vh" }}>
            {produkte &&
              produkte.list
                ?.filter((cat) => {
                  const s = debouncedSearchTerm.toLowerCase();
                  const catMatch = cat.name.toLowerCase().includes(s);
                  const prodMatch = cat.content.some((p) =>
                    p.name.toLowerCase().includes(s)
                  );
                  return cat.name !== "temp" && (catMatch || prodMatch);
                })
                .map((category) => (
                  <Box key={category.name} mb={2}>
                    <Typography level="body-sm" sx={{ fontWeight: "lg", color: "text.secondary", mb: 1 }}>
                      {category.name}
                    </Typography>
                    {category.content
                      .filter((p) =>
                        p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
                      )
                      .filter((p) => !p.temporary)
                      .map((product) => {
                        const key = `${category.name}_${product.name}`;
                        return (
                          <Box
                            key={product.name}
                            sx={{
                              px: 1.5,
                              py: 1,
                              borderRadius: "md",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              "&:hover": { bgcolor: "neutral.softBg", cursor: "pointer" },
                            }}
                          >
                            <Typography level="body-md">{product.name}</Typography>
                            <ButtonGroup size="sm" variant="plain">
                              {containsPosition(key) && (
                                <IconButton
                                  color="danger"
                                  onClick={() => {
                                    if (rechnung.positionen.get(key) === 1) {
                                      removePosition(key);
                                    } else {
                                      updatePosition(key, rechnung.positionen.get(key) - 1);
                                    }
                                  }}
                                >
                                  <RemoveCircleOutlineOutlinedIcon />
                                </IconButton>
                              )}
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  if (containsPosition(key)) {
                                    updatePosition(key, rechnung.positionen.get(key) + 1);
                                  } else {
                                    addPosition(key, 1);
                                  }
                                }}
                              >
                                <AddCircleOutlineOutlinedIcon />
                              </IconButton>
                            </ButtonGroup>
                          </Box>
                        );
                      })}
                  </Box>
                ))}

          </Box>
        </Card>

        {/* Main Workspace: Invoice Preview */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            p: 4,
            bgcolor: "neutral.softBg",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              width: "100%",
              maxWidth: 900,
              p: 4,
              borderRadius: "2xl",
              boxShadow: "lg",
              bgcolor: "background.surface",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Customer */}
            <Box>
              <FormLabel>Kunde</FormLabel>
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

            </Box>

            {/* Invoice Items */}
            <Box sx={{ flex: 1, maxHeight: "70vh", overflowY: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
              {Array.from(rechnung.positionen.entries()).map(([key, value]) => {
                const [catName, prodName] = key.split("_");
                const product = produkte?.list
                  ?.find((c) => c.name === catName)
                  ?.content.find((p) => p.name === prodName);
                const price = product?.price || 0;
                const steuer = product?.steuer || 19;
                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Tooltip title="Anzahl ändern">
                      <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => {
                          seteditCount(true);
                          setTargetEditCount(key);
                          setCount(value);
                        }}
                      >
                        {prodName} <Link>(x{value})</Link>
                      </Typography>
                    </Tooltip>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography fontWeight="md" color="primary">
                        {
                          brutto
                            ? (value * price).toFixed(2) + "€"   // Brutto = before Steuer
                            : (value * price * (1 + steuer / 100)).toFixed(2) + "€"  // Netto = after Steuer
                        }
                      </Typography>
                      <IconButton color="danger" onClick={() => removePosition(key)}>
                        <RemoveCircleOutlineOutlinedIcon />
                      </IconButton>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Total */}
            <Box
              sx={{
                mt: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                gap: 2
              }}
            >
              <Typography level="title-lg" fontWeight="xl">
                {brutto ? "Netto (ohne Steuer)" : "Brutto (mit Steuer)"} gesamt:{" "}
                {Array.from(rechnung.positionen.entries())
                  .reduce((sum, [key, value]) => {
                    const [catName, prodName] = key.split("_");
                    const productPrice =
                      produkte?.list
                        ?.find((c) => c.name === catName)
                        ?.content.find((p) => p.name === prodName)?.price || 0;
                    const steuer =
                      produkte?.list
                        ?.find((c) => c.name === catName)
                        ?.content.find((p) => p.name === prodName)?.steuer || 19;
                    if (brutto) {
                      return sum + value * productPrice;
                    } else {
                      return sum + value * productPrice * (1 + steuer / 100);
                    }
                  }, 0)
                  .toFixed(2)}{" "}
                €
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Typography level="title-lg" fontWeight="xl">Netto</Typography>
                <Switch onChange={(e) => setbrutto(e.target.checked)} checked={brutto} />
                <Typography level="title-lg" fontWeight="xl">Brutto</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Box>


    </Box>
  );
}

export default RechnungErstellen
