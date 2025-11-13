import { Avatar, Box, Chip, Dropdown, Input, ListItem, Menu, MenuButton, MenuItem, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../components/Headline'
import { useNavigate, useParams } from 'react-router-dom'
import { handleLoadFile, handleSaveFile } from '../Scripts/Filehandler';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ListPart from '../components/ListPart';
import NavigationOutlinedIcon from '@mui/icons-material/NavigationOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import PersonPinCircleOutlinedIcon from '@mui/icons-material/PersonPinCircleOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DangerousOutlinedIcon from '@mui/icons-material/DangerousOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import debounce from 'lodash/debounce';
import InfoCard from '../components/InfoCard';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../components/MaskProvider';
import KundenEditor from '../components/KundenVerwaltung/Masks/KundenEditor';
import { generateCode } from '../Scripts/KundenDatenBank';
function LieferantenViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState();
    function onb() {
        navigate("/home/5/-1");
    }
    const fetch = async () => {
        const string = await handleLoadFile("lieferanten/" + id);
        const json = JSON.parse(string);
        setData(json);
    }
    useEffect(() => {
        fetch();
    }, []);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const addNewFile = async () => {
        //the folder gets created like this
        await handleLoadFile("lieferantenrechnungen/dump.rechnix");

        // "" that it becomes a string
        let code = generateCode();
        const folderdata = await window.api.listfiles("lieferantenrechnungen/")
        while (folderdata.includes(code + "")) {
            //new code so an unused gets generated
            code = generateCode();
        }

        const result = await window.api.copyFile("lieferantenrechnungen/" + code);
        console.log(result);
        if (result.success) {
            let type = "PDF";
            //define data type
            const content = await handleLoadFile(result.destination);
            if (content.includes("</Invoice>")) {
                type = "X-Rechnung";
            }
            const item = {
                name: result.name,
                id: code,
                "type": type,
            }
            data.rechnungen.push(item);
            await handleSaveFile("lieferanten/" + id, JSON.stringify(data));
            fetch();
        }
    }
    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        handler();
        return () => {
            handler.cancel();
        };
    }, [searchTerm]);
    const openFile = (item) => {
        sessionStorage.setItem(item.id, JSON.stringify(item));
        navigate("/view-file/" + item.id + "/" + id);
    }
    return (
        <Box>
            <Headline back={true} onback={onb}>{id}</Headline>
            <Box sx={{ width: "100%", height: "calc(100vh - 55px)", display: "flex", overflowY: "auto", flexDirection: "row" }}>
                <Box
                    sx={{
                        height: "100%",
                        width: "15%",
                        borderRight: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        p: 2,
                        boxSizing: "border-box",
                        bgcolor: "",
                    }}
                >
                    <Avatar sx={{ mt: 5, mb: 2 }} size='lg' />
                    <Typography sx={{ fontWeight: "5px", fontWeight: "bold" }}>{data?.name}</Typography>
                    <Box sx={{ mt: 5, width: "100%", alignContent: "flex-start", justifyContent: "flex-start", display: "flex", flexDirection: "column" }}>
                        <ListPart title={"Anschrift"}>
                            <ListItem>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        startDecorator={<NavigationOutlinedIcon />}
                                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                                    >
                                        {data?.straße} {data?.hausnummer}
                                    </Typography>
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        startDecorator={<ApartmentOutlinedIcon />}
                                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                                    >
                                        {data?.plz}, {data?.city}
                                    </Typography>
                                </Box>
                            </ListItem>
                        </ListPart>
                        <ListPart title={"Kontakt"}>
                            <ListItem>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        startDecorator={<LocalPhoneOutlinedIcon />}
                                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                                    >
                                        {data?.tel}
                                    </Typography>
                                </Box>
                            </ListItem>
                            <ListItem>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        startDecorator={<AlternateEmailOutlinedIcon />}
                                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                                    >
                                        {data?.email}
                                    </Typography>
                                </Box>
                            </ListItem>
                        </ListPart>

                        <ListPart title={"Ansprechpartner"}>
                            <ListItem>
                                <Box>
                                    <Typography
                                        level="body-xs"
                                        startDecorator={<PersonPinCircleOutlinedIcon />}
                                        sx={{ "&:hover": { color: "primary.plainColor" }, cursor: "pointer" }}
                                    >
                                        {data?.ansprechpartner}
                                    </Typography>
                                </Box>
                            </ListItem>
                        </ListPart>


                    </Box>
                </Box>
                <Box sx={{ width: "85%", p: 2, display: "block", overflowY: "auto" }}>
                    <InfoCard headline={"Information"}>Hier finden sie alle abgelegten Daten für {data?.name} aufgelistet. <br></br></InfoCard>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2, mt: 7 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "55%", flexDirection: "row" }}>
                            <Input
                                placeholder="Rechnung suchen..."
                                variant="outlined"
                                sx={{ flexGrow: 1, userSelect: "all" }}
                                onChange={(e) => setSearchTerm(e.target.value)}

                                startDecorator={<SearchIcon />}
                            />
                        </Box>
                        <Dropdown>
                            <MenuButton color="primary" sx={{ mt: -1.7 }}>
                                <EditOutlinedIcon />
                                Bearbeiten
                            </MenuButton>
                            <Menu>
                                <MenuItem onClick={() => addNewFile()}><AddCircleOutlineOutlinedIcon />Datei Hinzufügen</MenuItem>
                                <MenuItem><EditOutlinedIcon />Lieferant bearbeiten</MenuItem>
                            </Menu>
                        </Dropdown>

                    </Box>
                    <Table sx={{ mt: 2, "& th:nth-of-type(1)": { width: "70%" }, "& th:nth-of-type(2)": { width: "20%" }, "& th:nth-of-type(3)": { width: "10%" } }}>
                        <thead>
                            <tr>
                                <th>Rechnung</th>
                                <th>Art</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.rechnungen.slice().reverse().filter((item) => item.name.includes(debouncedSearchTerm)).map((item) => {
                                    return (
                                        <Box
                                            component={"tr"}
                                            key={item.id} sx={{
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    bgcolor: 'neutral.plainHoverBg',
                                                },
                                                cursor: "pointer"

                                            }}
                                            onClick={() => openFile(item)}
                                        >
                                            <Box component="td" sx={{ padding: '12px 16px' }}>
                                                <Box sx={{
                                                    display: "flex", alignContent: "center", flexDirection: "row",
                                                }}>
                                                    <ReceiptLongOutlinedIcon />
                                                    <Box sx={{ display: "flex", flexDirection: "column", ml: 1, cursor: "pointer" }}>
                                                        <Typography level="body-md" sx={{ cursor: "pointer", userSelect: "none" }}>{item.name}</Typography>
                                                        <Typography sx={{ color: "darkgray", cursor: "pointer", userSelect: "none" }} level="body-sm">{ }</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <td><Chip>{item.type}</Chip></td>
                                        </Box>
                                    )



                                })
                            }
                        </tbody>
                    </Table>
                </Box>
            </Box>
        </Box>
    )
}

export default LieferantenViewer
