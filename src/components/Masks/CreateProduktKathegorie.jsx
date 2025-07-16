import { Box, Button, Input, Sheet, Typography } from '@mui/joy'
import React, { useState } from 'react'
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';

function CreateProduktKathegorie({ setcreate, path, update }) {
    const [name, setname] = useState("");
    const [error, seterror] = useState(false);
    async function createKatheigorie(e) {
        if (e){
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
        <form onSubmit={(e) => createKatheigorie(e)}>
            <Sheet
                sx={{
                    borderRadius: "15px",
                    height: "auto",
                    width: "55vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                    boxShadow: "sm",
                }}
            >
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
                {
                    error && (
                        <Box sx={{ width: "100%" }}>
                            <Typography ml={0.5} level="body-xs" color='danger'>Bitte gib einen namen an</Typography>
                        </Box>

                    )
                }
                <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => setcreate(false)} variant='outlined' color="danger">
                        Abbrechen
                    </Button>
                    <Button onClick={() => createKatheigorie()} color="neutral" variant='outlined'>
                        Speichern
                    </Button>
                </Box>

            </Sheet>
        </form>
    )
}

export default CreateProduktKathegorie
