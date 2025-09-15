import { Box, Button, Dropdown, Menu, MenuButton, MenuItem, Table, Typography, ListItemDecorator } from '@mui/joy';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EuroSymbolOutlinedIcon from '@mui/icons-material/EuroSymbolOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

function KathAccordationDetail({
    item,
    setconfirmation,
    setcreatep,
    setproduktdeleteconfirm,
    setitem,
    settitleedititem,
    settitleitemkath,
    setpriceedit,
    setpriceeditkath,
    setsteueredit,
    setsteuereditkath,
}) {
    return (
        <Box>
            <Table
                borderAxis="both"
                stickyHeader
                sx={{ mt: 2 }}
            >
                <thead>
                    <tr>
                        <th>Produktname</th>
                        <th style={{ textAlign: 'right' }}>Preis</th>
                        <th style={{ textAlign: "right" }}>Mehrwertsteuer</th>
                        <th style={{ textAlign: 'right' }}>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {item && item.content.map((i, index) => (
                        <tr key={index}>
                            <td>
                                <Typography level="body1">{i.name}</Typography>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <Typography>{i.price}€</Typography>
                            </td>
                            <td style={{ textAlign: "right" }}>
                                <Typography>{i.steuer}%</Typography>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                <Dropdown>
                                    <MenuButton><SettingsOutlinedIcon /></MenuButton>
                                    <Menu>
                                        <MenuItem onClick={() => {
                                            settitleedititem(i);
                                            settitleitemkath(item);
                                        }}>
                                            <ListItemDecorator><EditOutlinedIcon /></ListItemDecorator>
                                            Titel bearbeiten
                                        </MenuItem>
                                        <MenuItem
                                            sx={{ color: "green" }}
                                            onClick={() => {
                                                setpriceedit(i);
                                                setpriceeditkath(item);
                                            }}
                                        >
                                            <ListItemDecorator><EuroSymbolOutlinedIcon /></ListItemDecorator>
                                            Preis bearbeiten
                                        </MenuItem>
                                        <MenuItem
                                        color='primary'
                                        onClick={() => {
                                            setsteueredit(i);
                                            setsteuereditkath(item);
                                        }}
                                        >
                                            <ListItemDecorator><AccountBalanceIcon /></ListItemDecorator>
                                            Mehrwertsteuer bearbeiten
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setproduktdeleteconfirm(item);
                                                setitem(i);
                                            }}
                                            sx={{ color: "red" }}
                                        >
                                            <ListItemDecorator><DeleteOutlineOutlinedIcon /></ListItemDecorator>
                                            Eintrag löschen
                                        </MenuItem>
                                    </Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
                <Button
                    color='danger'
                    variant="outlined"
                    startDecorator={<DeleteOutlineOutlinedIcon />}
                    onClick={() => setconfirmation(item)}
                >
                    Kathegorie Löschen
                </Button>
                <Button
                    color="success"
                    variant='outlined'
                    startDecorator={<AddCircleOutlineOutlinedIcon />}
                    onClick={() => setcreatep(item)}
                >
                    Produkt Hinzufügen
                </Button>
            </Box>
        </Box>
    );
}
export default KathAccordationDetail;