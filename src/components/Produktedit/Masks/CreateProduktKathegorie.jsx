import {
  Box,
  Button,
  Input,
  Typography,
  Modal,
  ModalDialog
} from '@mui/joy'
import React, { useState } from 'react'
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';

function CreateProduktKathegorie({ setcreate, path, update }) {
  const [name, setname] = useState("");
  const [error, seterror] = useState(false);

  async function createKatheigorie(e) {
    if (e) {
      e.preventDefault();
    }
    if (!name || name === "") {
      seterror(true);
      return;
    }
    let content = {
      name: name,
      content: [],
    }
    console.log("Pfad", path)
    const jsonString = await handleLoadFile(path);
    console.log(jsonString);
    const json = JSON.parse(jsonString);
    if (!("list" in json)) {
      json.list = [];
    }
    json.list.push(content);
    await handleSaveFile(path, JSON.stringify(json));
    setcreate(false);
    await update();
  }

  return (
    <Modal open={true} onClose={() => setcreate(false)}>
      <ModalDialog
        variant="outlined"
        sx={{
          borderRadius: "md",
          width: "55vh",
          maxWidth: "90vw",
        }}
      >
        <form onSubmit={(e) => createKatheigorie(e)} style={{ width: "100%" }}>
          <Typography level="h3" mt={1}>
            Kathegorie Erstellen
          </Typography>
          <Box mt={2} sx={{ height: "1px", bgcolor: "lightgray", width: "100%" }} />

          <Input
            sx={{ mt: 4, width: "100%", borderColor: error ? "red" : null }}
            value={name}
            onChange={(e) => { setname(e.target.value); seterror(false) }}
            placeholder="Kathegoriename"
            required
          />
          {error && (
            <Box sx={{ width: "100%" }}>
              <Typography ml={0.5} level="body-xs" color='danger'>
                Bitte gib einen Namen an
              </Typography>
            </Box>
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
              onClick={() => setcreate(false)}
              variant='outlined'
              color="danger"
            >
              Abbrechen
            </Button>
            <Button
              onClick={() => createKatheigorie()}
              color="neutral"
              variant='outlined'
            >
              Speichern
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  )
}

export default CreateProduktKathegorie