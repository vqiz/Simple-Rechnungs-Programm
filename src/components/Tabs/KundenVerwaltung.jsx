import { Avatar, Box, Button, Chip, Input, Table, Typography } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MaskProvider from '../MaskProvider';
import KundeErstellung from '../KundenVerwaltung/Masks/KundeErstellung';
import { handleLoadFile } from '../../Scripts/Filehandler';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import debounce from 'lodash/debounce';

function KundenVerwaltung() {
    const [createkunde, setcreatekunde] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    function close() {
        setcreatekunde(false);
    }
    const [data, setdata] = useState(null);
    const [filteredList, setFilteredList] = useState([]);

    useEffect(() => {
        const readdata = async () => {
            const readjson = await handleLoadFile("fast_accsess/kunden.db");
            if (readjson === "{}") {
                setdata(JSON.parse('{"list": []}'));
                return;
            }
            setdata(JSON.parse(readjson));
        }
        readdata();


    }, []);

    useEffect(() => {
        const handler = debounce(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        handler();
        return () => {
            handler.cancel();
        };
    }, [searchTerm]);

    useEffect(() => {
        const filterData = async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            if (!data || !data.list) {
                setFilteredList([]);
                return;
            }
            const term = debouncedSearchTerm.toLowerCase();
            const filtered = data.list.filter((i) => {
                const nameLower = i.name.toLowerCase();
                const emailLower = i.email.toLowerCase();
                return (
                    nameLower.includes(term) ||
                    emailLower.includes(term) ||
                    i.id.includes(term)
                );
            });
            setFilteredList(filtered);
        };
        filterData();
    }, [data, debouncedSearchTerm]);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative',

            }}
        >
            <Headline>Kundenverwaltung</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline={"Information"}>In der Kundenverwaltung können sie nach Kunden und Rechnungsnummern suchen um vorgänge nachvollziehen zu können und alte rechnungen wieder zu finden.</InfoCard>
            </Box>

            {
                createkunde && (
                    <MaskProvider>
                        <KundeErstellung submit={close} />
                    </MaskProvider>
                )
            }




            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
                    <Input
                        placeholder="Kunden oder Rechnungsnummer suchen..."
                        variant="outlined"
                        sx={{ flexGrow: 1, }}
                        onChange={(e) => setSearchTerm(e.target.value)}

                        startDecorator={<SearchIcon />}
                    />
                </Box>
                <Button onClick={() => setcreatekunde(true)} startDecorator={<AddCircleOutlineOutlinedIcon />} sx={{ mt: -1.8 }}>Kunde erstellen</Button>
            </Box>
            <Box sx={{ px: 2, maxWidth: "130vh", mb: 5 }}>
                <Table sx={{ borderRadius: "15px" }}>
                    <thead>
                        <tr>
                            <th>Kunden und Rechnungen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredList.map((item) => {
                                const name = item.name;
                                const id = item.id;
                                const istfirma = item.istfirma;
                                const email = item.email;

                                return (
                                    <Box
                                        component="tr"
                                        key={id}
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                bgcolor: 'neutral.plainHoverBg',
                                            },
                                        }}
                                    >
                                        <Box component="td" sx={{ padding: '12px 16px' }}>
                                            <Box sx={{
                                                display: "flex", alignContent: "center", flexDirection: "row",
                                            }}>
                                                {
                                                    istfirma ? (
                                                        <Avatar size="lg">
                                                            <FactoryOutlinedIcon />
                                                        </Avatar>

                                                    ) : (
                                                        <Avatar size="lg">
                                                            <AccountCircleOutlinedIcon />
                                                        </Avatar>

                                                    )
                                                }
                                                <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
                                                    <Typography level="body-md">{name}</Typography>
                                                    <Typography sx={{ color: "darkgray" }} level="body-sm">{email}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box component="td" sx={{ padding: '12px 16px' }}>
                                            {
                                                istfirma ? (
                                                    <Chip>Unternehmen</Chip>
                                                ) : (
                                                    <Chip>PrivatKunde</Chip>
                                                )
                                            }
                                        </Box>
                                    </Box>


                                );

                            })
                        }
                    </tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default KundenVerwaltung
