import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Input,
    Modal,
    ModalDialog,
    Sheet,
    Typography,
} from "@mui/joy";

function SingleLineinput({ title, onClose, onSave, val }) {
    const [value, setValue] = useState(val);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (value && value != "") {
            if (onSave) onSave(value);
            setValue("");
            if (onClose) onClose();
        }


    };

    return (
        <Modal open={true} onClose={onClose}>
            <ModalDialog>
                <form onSubmit={handleSubmit}>
                    <Sheet
                        sx={{
                            borderRadius: "16px",
                            width: "400px",
                            p: 2,
                            boxShadow: "lg",
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            bgcolor: "background.surface",
                        }}
                    >
                        <Typography level="h4" textAlign="center">
                            {title}
                        </Typography>

                        <Divider />

                        <Input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder=""
                            sx={{
                                "--Input-radius": "8px",
                                fontSize: "1rem",
                                bgcolor: "background.body",
                            }}
                            autoFocus
                        />

                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Button
                                onClick={() => onClose(null)}
                                variant='outlined'
                                color="neutral"
                            >
                                Abbrechen
                            </Button>

                            <Button
                                onClick={() => handleSubmit()}
                                color="success"
                                variant='solid'
                            >
                                Speichern
                            </Button>
                        </Box>
                    </Sheet>
                </form>
            </ModalDialog>
        </Modal>
    );
}

export default SingleLineinput;