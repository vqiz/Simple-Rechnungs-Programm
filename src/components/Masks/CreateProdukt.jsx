import { Box, Button, Divider, FormControl, FormLabel, Input, Sheet, Step, Typography } from '@mui/joy'
import React, { useState } from 'react'
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';

function CreateProdukt({ kathname, disable, update, kathpath }) {
    const [price, setprice] = useState(0);
    const [produktname, setproduktname] = useState("");
    const [error, seterror] = useState(false);
    async function addprodukt() {
        if (price === 0 || !price || !produktname || produktname === "") {
            seterror(true);
            return;
        }
        console.log("addfunction called");
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        const kath = json.list.find((i) => i.name === kathname);
        const element = {
            name: produktname,
            price: price,
        }
        kath.content.push(element);
        await handleSaveFile(kathpath, JSON.stringify(json));
        disable(null);
        update();




    }
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                addprodukt();
            }}
        >
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
                <Typography level='h3'>
                    Produkt hinzufügen
                </Typography>
                <Divider sx={{ mt: 1, }} orientation="horizontal" />
                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", gap: 2, mt: 2 }}>
                    <FormControl sx={{ width: "60%" }}>
                        <FormLabel sx={{ color: 'gray' }}>Produktname</FormLabel>
                        <Input value={produktname} onChange={(e) => { setproduktname(e.target.value); seterror(false) }} />
                    </FormControl>
                    <FormControl>
                        <FormLabel sx={{ color: 'gray' }}>Brutto betrag in €</FormLabel>
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
                {
                    error && (
                        <Typography color='danger' level="body-xs">Bitte überprüfe deine Eingabe</Typography>
                    )
                }
                <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "space-between" }}>

                    <Button onClick={() => disable(null)} variant='outlined' color="neutral">
                        Abbrechen
                    </Button>


                    <Button onClick={() => addprodukt()} color="success" variant='outlined'>
                        Hinzufügen
                    </Button>
                </Box>


            </Sheet>
        </form>
    )
}

export default CreateProdukt
