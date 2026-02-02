import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Modal,
  ModalDialog,
  Select,
  Option
} from '@mui/joy';
import React, { useState, useEffect } from 'react';
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';

function CreateProdukt({ kathname, disable, update, kathpath }) {
  const [price, setprice] = useState("");
  const [produktname, setproduktname] = useState("");
  const [mehrWertSteuer, setMehrWertSteuer] = useState(19);
  const [selectedCategory, setSelectedCategory] = useState(kathname || "");
  const [categories, setCategories] = useState([]);
  const [error, seterror] = useState(false);

  useEffect(() => {
    if (!kathname) {
      // Load categories if not provided
      const loadCats = async () => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        setCategories(json.list || []);
        if (json.list && json.list.length > 0) {
          setSelectedCategory(json.list[0].name);
        }
      };
      loadCats();
    }
  }, [kathname, kathpath]);

  async function addprodukt() {
    if (!price || !produktname || produktname === "" || !selectedCategory) {
      seterror(true);
      return;
    }
    const jsonString = await handleLoadFile(kathpath);
    const json = JSON.parse(jsonString);
    const kath = json.list.find((i) => i.name === selectedCategory);

    if (!kath) {
      console.error("Category not found");
      return;
    }

    kath.content.push({
      name: produktname,
      price: parseFloat(price),
      steuer: parseFloat(price) > 0 ? mehrWertSteuer : 0,
    });

    await handleSaveFile(kathpath, JSON.stringify(json));
    disable(null);
    update();
  }

  return (
    <Modal open={true} onClose={() => disable(null)}>
      <ModalDialog
        variant="outlined"
        sx={{
          borderRadius: "md",
          width: "63vh",
          maxWidth: "90vw",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addprodukt();
          }}
          style={{ width: "100%" }}
        >
          <Typography level='h3' mb={1}>
            Produkt hinzufügen
          </Typography>
          <Divider />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            {!kathname && (
              <FormControl>
                <FormLabel>Kategorie</FormLabel>
                <Select value={selectedCategory} onChange={(e, val) => setSelectedCategory(val)}>
                  {categories.map(c => (
                    <Option key={c.name} value={c.name}>{c.name}</Option>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl>
              <FormLabel>Produktname {'(Zeitbasierte Produkte müssen "stunde" enthalten)'}</FormLabel>
              <Input
                placeholder="Bezeichnung..."
                value={produktname}
                onChange={(e) => {
                  setproduktname(e.target.value);
                  seterror(false);
                }}
              />
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>Netto Betrag (€)</FormLabel>
                <Input
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.');
                    setprice(value);
                    seterror(false);
                  }}
                  type='number'
                  value={price}
                  placeholder="0.00"
                  inputProps={{ step: "0.01" }}
                />
              </FormControl>
              <FormControl sx={{ flex: 1 }}>
                <FormLabel>MwSt (%)</FormLabel>
                <Select value={mehrWertSteuer} onChange={(e, val) => setMehrWertSteuer(val)}>
                  <Option value={19}>19% (Standard)</Option>
                  <Option value={7}>7% (Ermäßigt)</Option>
                  <Option value={0}>0% (Steuerfrei)</Option>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {error && (
            <Typography color='danger' level="body-xs" mt={1}>
              Bitte alle Felder überprüfen.
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
              onClick={() => disable(null)}
              variant='outlined'
              color="neutral"
            >
              Abbrechen
            </Button>

            <Button
              onClick={addprodukt}
              color="success"
              variant='solid'
            >
              Hinzufügen
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  );
}

export default CreateProdukt;