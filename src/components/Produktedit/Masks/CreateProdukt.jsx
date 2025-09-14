import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Typography,
  Modal,
  ModalDialog
} from '@mui/joy';
import React, { useState } from 'react';
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';

function CreateProdukt({ kathname, disable, update, kathpath }) {
  const [price, setprice] = useState(0);
  const [produktname, setproduktname] = useState("");
  const [mehrWertSteuer,setMehrWertSteuer] = useState(19);
  const [error, seterror] = useState(false);

  async function addprodukt() {
    if (price === 0 || !price || !produktname || produktname === "") {
      seterror(true);
      return;
    }
    const jsonString = await handleLoadFile(kathpath);
    const json = JSON.parse(jsonString);
    const kath = json.list.find((i) => i.name === kathname);

    kath.content.push({
      name: produktname,
      price: price,
      steuer: mehrWertSteuer,
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
          width: "55vh",
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
            <FormControl>
              <FormLabel sx={{color: "gray"}}>Mehrwertsteuer in %</FormLabel>
              <Input type='number' value={mehrWertSteuer} onChange={(e) => setMehrWertSteuer(e.target.value)}/>
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