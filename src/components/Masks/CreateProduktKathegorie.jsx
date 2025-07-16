import { Box, Button, Input, Sheet, Typography } from '@mui/joy'
import React, { useState } from 'react'

function CreateProduktKathegorie({ setcreate }) {
    const [name, setname] = useState("");
    function createKatheigorie(){
        let content = {
            name: name,
            content
        }



    }

    return (
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
                sx={{ mt: 4, width: "100%" }}
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="Kathegoriename"
            />
            <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button onClick={() => setcreate(false)} variant='outlined' color="danger">
                    Abbrechen
                </Button>
                <Button color="neutral" variant='outlined'>
                    Speichern
                </Button>
            </Box>

        </Sheet>
    )
}

export default CreateProduktKathegorie
