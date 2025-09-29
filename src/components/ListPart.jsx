import { Box, List, Typography } from "@mui/joy";
import React from "react";
const ListPart = ({ title, children, primary }) => {

    return (
        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "flex-start", width: "100%", flexDirection: "column", mb: 3 }}>
            <Typography
                id={title}
                level="body-xs"
                sx={{ textTransform: 'uppercase', fontWeight: 'lg', mb: 1, ml: 1 }}
                color={primary ? "primary": ""}
            >
                {title}
            </Typography>
            <List size='sm' aria-labelledby={title}>
                {children}
            </List>
        </Box>
    )
}
export default ListPart;