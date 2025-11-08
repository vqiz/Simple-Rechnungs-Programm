import { Box, Button, Input, Table } from '@mui/joy'
import React, { useEffect, useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import LieferantenCreator from '../LieferantenVerwaltung/LieferantenCreator';
import MaskProvider from '../MaskProvider';
import { useNavigate } from 'react-router-dom';
import AvatarTabeUtil from '../AvatarTabeUtil';
import { handleLoadFile } from '../../Scripts/Filehandler';
import { debounce } from 'lodash';
function LieferantenVerwaltung() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [createLieferant, setCreateLieferant] = useState(false);
    const navigate = useNavigate();
    const [items, setItems] = useState();
    const [emails, setEmails] = useState({});
    const [filteredList, setFilteredList] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            const list = await window.api.listfiles("lieferanten/");
            const listWithoutTest = list.filter((i) => i.name !== "test.data");
            setItems(listWithoutTest);
            const emailMap = {};
            for (const i of listWithoutTest) {
                const json = await handleLoadFile("lieferanten/" + i.name);
                const obj = JSON.parse(json);
                console.log(obj)
                emailMap[i.name] = obj.email === "" ? obj.tel : obj.email;
            }
            console.log(emailMap);
            setEmails(emailMap);
        }
        fetch()


    }, []);

    const close = (n) => {
        setCreateLieferant(false);
        if (n) {
            navigate("/lieferanten-viewer/" + n);


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
    useEffect(() => {
        const filterData = async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            if (!items) {
                setFilteredList([]);
                return;
            }
            const term = debouncedSearchTerm.toLowerCase();
            const filtered = items.filter((i) => {
                const nameLower = i.name.toLowerCase();
                return (
                    nameLower.includes(term)

                );
            });
            setFilteredList(filtered);
        };
        filterData();
    }, [items, debouncedSearchTerm]);
    return (
        <Box
            sx={{
                height: '100vh',
                maxHeight: "100vh",
                overflowY: 'auto',
                display: 'block',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative',

            }}
        >
            {
                createLieferant && (
                    <MaskProvider>
                        <LieferantenCreator close={close} />
                    </MaskProvider>

                )
            }
            <Headline>Lieferanten Verwaltung</Headline>
            <Box sx={{ p: 2 }}>
                <InfoCard headline={"Information"}>Hier können Sie Ausgaben in Form von E-Rechnungen oder PDF-Dokumenten hinterlegen.</InfoCard>
            </Box>



            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: "50%" }}>
                    <Input
                        placeholder="Lieferant suchen..."
                        variant="outlined"
                        sx={{ flexGrow: 1, }}
                        onChange={(e) => setSearchTerm(e.target.value)}

                        startDecorator={<SearchIcon />}
                    />
                </Box>
                <Button onClick={() => setCreateLieferant(true)} startDecorator={<AddCircleOutlineOutlinedIcon />} sx={{ mt: -1.8 }}>Lieferant erstellen</Button>
            </Box>
            <Box
                sx={{
                    px: 2,
                    maxWidth: "100%",
                    mb: 5,
                    mx: "auto",
                    width: "100%"
                }}
            >
                <Table sx={{ borderRadius: "15px",maxWidth: "98%"  }}>
                    <thead>
                        <tr>
                            <th>Lieferanten und Rechnungen</th>

                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredList.map((item) => {
                                const name = item.name;
                                return (
                                    <Box
                                        component="tr"
                                        key={name}
                                        sx={{
                                            transition: 'background-color 0.2s',
                                            '&:hover': {
                                                bgcolor: 'neutral.plainHoverBg',
                                            },
                                            cursor: "pointer"
                                        }}
                                        onClick={() => navigate("/lieferanten-viewer/" + name)}
                                    >
                                        <AvatarTabeUtil email={emails[name]} name={name} istfirma={true} />
                                    </Box>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default LieferantenVerwaltung
