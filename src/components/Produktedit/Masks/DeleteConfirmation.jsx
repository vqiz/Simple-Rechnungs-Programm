import { Box, Button, Divider, Typography, Modal, ModalDialog, IconButton } from '@mui/joy'
import React from 'react'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

function DeleteConfirmation({ title, confirmfunction, disable, buttontitle, description, parameter }) {
  return (
    <Modal open={true} onClose={() => disable(null)}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        sx={{
          borderRadius: "xl",
          width: "450px",
          maxWidth: "95vw",
          p: 0,
          overflow: 'hidden',
          bgcolor: 'var(--md-sys-color-surface)'
        }}
      >
        <Box sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '50%',
            bgcolor: 'var(--md-sys-color-error-container)',
            color: 'var(--md-sys-color-on-error-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <WarningAmberRoundedIcon />
          </Box>
          <Box>
            <Typography level="h4" fontWeight="lg">
              {title}
            </Typography>
            <Typography level="body-sm" sx={{ mt: 0.5 }}>
              {description}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1, bgcolor: 'var(--swiss-gray-50)' }}>
          <Button variant="plain" color="neutral" onClick={() => disable(null)}>Abbrechen</Button>
          <Button
            onClick={() => confirmfunction(parameter)}
            color="danger"
            variant="solid"
          >
            {buttontitle || "Löschen"}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  )
}

export default DeleteConfirmation