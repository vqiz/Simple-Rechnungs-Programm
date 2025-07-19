import { Box, Button, Divider, Sheet, Typography } from '@mui/joy'
import React from 'react'

function DeleteConfirmation({title,confirmfunction,disable, buttontitle, description, parameter}) {
    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            confirmfunction();
        }}>
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
                <Typography level="h3" mt={1} mb={2}>
                    {title}
                </Typography>
                <Divider orientation="horizontal" />
                <Typography mt={2}>
                    {description}
                </Typography>
                <Box sx={{ width: "100%", mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button onClick={() => disable(null)} variant='outlined' color="neutral">
                        Abbrechen
                    </Button>
                    <Button onClick={() => confirmfunction(parameter)} color="danger" variant='outlined'>
                       {buttontitle} 
                    </Button>
                </Box>

            </Sheet>
        </form>
    )
}

export default DeleteConfirmation
