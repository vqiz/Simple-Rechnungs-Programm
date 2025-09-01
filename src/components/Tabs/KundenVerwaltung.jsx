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
function KundenVerwaltung() {
    const [createkunde, setcreatekunde] = useState(false);
    function close() {
        setcreatekunde(false);
    }
    const [data, setdata] = useState(null);
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
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative'
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
                        startDecorator={<SearchIcon />}
                    />
                </Box>
                <Button onClick={() => setcreatekunde(true)} startDecorator={<AddCircleOutlineOutlinedIcon />} sx={{ mt: -1.8 }}>Kunde erstellen</Button>
            </Box>
            <Box sx={{ px: 2, maxWidth: "130vh" }}>
                <Table sx={{ borderRadius: "15px" }}>
                    <thead>
                        <tr>
                            <th>Kunden und Rechnungen</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.list && data.list.map((item) => {
                                const name = item.name;
                                const id = item.id;
                                const istfirma = item.istfirma;
                                const email = item.email;
                                return (
                                    <tr>
                                        <td>
                                            <Box sx={{ display: "flex", alignContent: "center", flexDirection: "row" }}>
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
                                                <Box sx={{display: "flex", flexDirection: "column", ml: 1}}>
                                                    <Typography level="body-md">{name}</Typography>
                                                    <Typography sx={{color: "darkgray"}} level="body-sm">{email}</Typography>
                                                </Box>
                                            </Box>
                                        </td>
                                        <td>
                                            {
                                                istfirma ? (
                                                    <Chip>Unternehmen</Chip>
                                                ) : (
                                                    <Chip>PrivatKunde</Chip>
                                                )
                                            }
                                        </td>
                                    </tr>


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
