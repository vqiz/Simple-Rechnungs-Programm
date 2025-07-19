import { Badge, Box, Button, Chip, Divider, Dropdown, IconButton, List, ListItem, ListItemDecorator, Menu, MenuButton, MenuItem, Table, Typography } from '@mui/joy'
import React, { useState } from 'react'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EuroSymbolOutlinedIcon from '@mui/icons-material/EuroSymbolOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import DeleteConfirmation from '../Masks/DeleteConfirmation';
function KathAccordationDetail({ item, setconfirmation, setcreatep, setproduktdeleteconfirm, setitem }) {


    return (
        <>

            <List component="ol" marker="decimal">
                {
                    item && item.content.map((i, index) => {
                        return (
                            <>
                                <ListItem>
                                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <Box sx={{ width: "50%", mt: 1 }}>
                                            <Typography>{index + 1}. {i.name}</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", gap: 2, width: "50%", justifyContent: "flex-end" }}>
                                            <Chip sx={{ ml: 5 }} color="success">{i.price}€</Chip>
                                            <Box sx={{mr: 4}}>
                                                <Dropdown>
                                                    <MenuButton><SettingsOutlinedIcon /></MenuButton>
                                                    <Menu>
                                                        <MenuItem>
                                                            <ListItemDecorator>
                                                                <EditOutlinedIcon />
                                                            </ListItemDecorator>
                                                            Titel bearbeiten
                                                        </MenuItem>
                                                        <MenuItem sx={{ color: "green" }}>
                                                            <ListItemDecorator>
                                                                <EuroSymbolOutlinedIcon />
                                                            </ListItemDecorator>
                                                            Preiß Bearbeiten
                                                        </MenuItem>
                                                        <MenuItem onClick={() => {
                                                            setproduktdeleteconfirm(item);
                                                            setitem(i);
                                                        }} sx={{ color: "red" }}>
                                                            <ListItemDecorator>
                                                                <DeleteOutlineOutlinedIcon />
                                                            </ListItemDecorator>
                                                            Eintrag löschen
                                                        </MenuItem>
                                                    </Menu>
                                                </Dropdown>
                                            </Box>
                                        </Box>
                                    </Box>

                                </ListItem>
                                <Divider orientation="horizontal" />
                            </>
                        )
                    })
                }
                <Box sx={{ width: "100%", justifyContent: "space-evenly", flexDirection: "row", display: "flex", mt: 2 }}>
                    <Button
                        color='danger'
                        variant="outlined"
                        startDecorator={<DeleteOutlineOutlinedIcon />}
                        onClick={() => setconfirmation(item)}
                    >Kathegorie Löschen</Button>

                    <Button
                        color="success"
                        variant='outlined'
                        startDecorator={<AddCircleOutlineOutlinedIcon />}
                        onClick={() => setcreatep(item)}
                    >
                        Produkt Hinzufügen
                    </Button>
                </Box>
            </List>
        </>


    )
}

export default KathAccordationDetail
