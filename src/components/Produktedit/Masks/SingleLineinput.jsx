import React, { useState } from "react";
import {
    Box,
    Button,
    Divider,
    Input,
    Modal,
    ModalDialog,
    Typography,
    IconButton,
    FormControl,
    FormLabel
} from "@mui/joy";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

function SingleLineinput({ title, onClose, onSave, val, inputtype }) {
    const [value, setValue] = useState(val);
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        let finalValue = value;

        if (inputtype === "number") {
            const num = Number(value.toString().replace(",", "."));
            if (isNaN(num)) {
                setError(true);
                return;
            }
            finalValue = parseFloat(num.toFixed(2));
        } else {
            if (!value || value.trim() === "") {
                setError(true);
                return;
            }
        }

        if (onSave) onSave(finalValue);
        if (onClose) onClose();
    };

    return (
        <Modal open={true} onClose={() => onClose(null)}>
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
                        {title}
                    </Typography>
                    <IconButton onClick={() => onClose(null)} variant="plain" color="neutral" sx={{ borderRadius: '50%' }}>
                        <CloseOutlinedIcon />
                    </IconButton>
                </Box>
                <Divider />

                {/* Body */}
                <Box sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <FormControl error={error}>
                            <Input
                                value={value}
                                onChange={(e) => { setValue(e.target.value); setError(false); }}
                                placeholder=""
                                autoFocus
                                slotProps={{ input: { step: inputtype === 'number' ? '0.01' : undefined, type: inputtype || 'text' } }}
                            />
                            {error && (
                                <Typography level="body-xs" color="danger" sx={{ mt: 1 }}>
                                    Bitte einen gültigen Wert eingeben.
                                </Typography>
                            )}
                        </FormControl>
                    </form>
                </Box>
                <Divider />

                {/* Footer */}
                <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
                    <Button variant="plain" color="neutral" onClick={() => onClose(null)}>Abbrechen</Button>
                    <Button onClick={handleSubmit} startDecorator={<EditOutlinedIcon />}>Speichern</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}

export default SingleLineinput;