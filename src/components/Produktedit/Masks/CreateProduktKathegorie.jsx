import {
  Box,
  Button,
  Input,
  Typography,
  Modal,
  ModalDialog,
  Divider,
  IconButton,
  FormControl,
  FormLabel,
  Stack
} from '@mui/joy'
import React, { useState } from 'react'
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

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
    try {
      const jsonString = await handleLoadFile(path);
      const json = JSON.parse(jsonString);
      if (!("list" in json)) {
        json.list = [];
      }
      json.list.push(content);
      await handleSaveFile(path, JSON.stringify(json));
      setcreate(false);
      await update();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal open={true} onClose={() => setcreate(false)}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          borderRadius: "xl",
          width: "400px",
          maxWidth: "95vw",
          p: 0,
          overflow: 'hidden',
          bgcolor: 'var(--md-sys-color-surface)'
        }}
      >
        {/* Header */}
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: 'var(--md-sys-color-surface-container)' }}>
          <Typography level='h4' fontWeight="lg">
            Kategorie erstellen
          </Typography>
          <IconButton onClick={() => setcreate(false)} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Body */}
        <Box sx={{ p: 3 }}>
          <form onSubmit={(e) => createKatheigorie(e)}>
            <FormControl required error={error}>
              <FormLabel>Kategoriename</FormLabel>
              <Input
                value={name}
                onChange={(e) => { setname(e.target.value); seterror(false) }}
                placeholder="z.B. Dienstleistungen"
                autoFocus
              />
              {error && (
                <Typography level="body-xs" color='danger' sx={{ mt: 1 }}>
                  Bitte einen Namen eingeben.
                </Typography>
              )}
            </FormControl>
          </form>
        </Box>
        <Divider />

        {/* Footer */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
          <Button variant="plain" color="neutral" onClick={() => setcreate(false)}>Abbrechen</Button>
          <Button onClick={() => createKatheigorie()} startDecorator={<AddCircleOutlineOutlinedIcon />}>Erstellen</Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default CreateProduktKathegorie