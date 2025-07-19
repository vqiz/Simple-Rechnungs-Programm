import { Button, Divider, Input, Typography } from '@mui/joy'
import React from 'react'

function SingleLineinput({title}) {
    return (
        <form>
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
                <Typography mt={2} mb={2} level="h3">{title}</Typography>
                <Divider orientation="horizontal"/>
                <Input />
                <Button>Speichern</Button>

            </Sheet>
        </form>
    )
}

export default SingleLineinput
