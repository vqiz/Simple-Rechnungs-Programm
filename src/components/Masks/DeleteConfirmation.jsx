import { Box, Button, Divider, Typography, Modal, ModalDialog } from '@mui/joy'
import React from 'react'

function DeleteConfirmation({ title, confirmfunction, disable, buttontitle, description, parameter }) {
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
            confirmfunction(parameter);
          }}
          style={{ width: "100%" }}
        >
          <Typography level="h3" mt={1} mb={2}>
            {title}
          </Typography>
          <Divider orientation="horizontal" />
          <Typography mt={2}>
            {description}
          </Typography>

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
              onClick={() => confirmfunction(parameter)}
              color="danger"
              variant='outlined'
            >
              {buttontitle}
            </Button>
          </Box>
        </form>
      </ModalDialog>
    </Modal>
  )
}

export default DeleteConfirmation