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
  Option,
  Stack,
  IconButton
} from '@mui/joy';
import React, { useState, useEffect } from 'react';
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

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
        role="alertdialog"
        sx={{
          borderRadius: "xl",
          width: "500px",
          maxWidth: "95vw",
          p: 0,
          overflow: 'hidden',
          bgcolor: 'white'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'var(--md-sys-color-surface-container)' }}>
          <Typography level='h4' fontWeight="lg">
            Produkt hinzufügen
          </Typography>
          <IconButton onClick={() => disable(null)} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ p: 3 }}>
          <Stack spacing={2}>
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

            <FormControl required error={error && !produktname}>
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

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl required error={error && !price}>
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
                  slotProps={{ input: { step: "0.01" } }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>MwSt (%)</FormLabel>
                <Select value={mehrWertSteuer} onChange={(e, val) => setMehrWertSteuer(val)}>
                  <Option value={19}>19% (Standard)</Option>
                  <Option value={7}>7% (Ermäßigt)</Option>
                  <Option value={0}>0% (Steuerfrei)</Option>
                </Select>
              </FormControl>
            </Box>
            {error && (
              <Typography color='danger' level="body-xs">
                Bitte alle Felder überprüfen.
              </Typography>
            )}
          </Stack>
        </Box>
        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
          <Button variant="plain" color="neutral" onClick={() => disable(null)}>Abbrechen</Button>
          <Button onClick={addprodukt} startDecorator={<AddCircleOutlineOutlinedIcon />}>Hinzufügen</Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}

export default CreateProdukt;