import {
    Accordion,
    accordionClasses,
    AccordionDetails,
    accordionDetailsClasses,
    AccordionGroup,
    AccordionSummary,
    accordionSummaryClasses,
    Box,
    Button,
    Card,
    Typography,
    useTheme
} from '@mui/joy';
import React, { useEffect, useState } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import CreateProduktKathegorie from '../Produktedit/Masks/CreateProduktKathegorie';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import KathAccordationDetail from '../Produktedit/KathAccordationDetail';
import DeleteConfirmation from '../Produktedit/Masks/DeleteConfirmation';
import CreateProdukt from '../Produktedit/Masks/CreateProdukt';
import SingleLineinput from '../Produktedit/Masks/SingleLineinput';
import Headline from '../Headline';
import InfoCard from '../InfoCard';
import MaskProvider from '../MaskProvider';

const ProdukteVerwalten = () => {
    const [kathpath] = useState('kathegories/kathegories.rechnix');
    const [data, setData] = useState();

    // Modals & Overlays
    const [createCategory, setCreateCategory] = useState(false);
    const [deleteCategoryConfirmation, setDeleteCategoryConfirmation] = useState(null);

    const [createProdukt, setCreateProdukt] = useState(null);
    const [produktDeleteConfirm, setProduktDeleteConfirm] = useState(null);
    const [produktDeletionItem, setProduktDeletionItem] = useState(null);

    const [produktEditTitle, setProduktEditTitle] = useState(null);
    const [produktEditTitleKath, setProduktEditTitleKath] = useState(null);

    const [produktEditPrice, setProduktEditPrice] = useState(null);
    const [produktEditPriceKath, setProduktEditPriceKath] = useState(null);

    const [produktEditSteuer,setProduktEditSteuer] = useState(null);
    const [produktEditSteuerKath,setProduktEditSteuerKath] = useState(null);
    const readdata = async () => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        setData(json);
    };

    const deleteKathegorie = async (name) => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);

        json.list = json.list.filter((i) => i.name !== name);

        await handleSaveFile(kathpath, JSON.stringify(json));
        setDeleteCategoryConfirmation(null);
        readdata();
    };

    const deleteProdukt = async () => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);

        const kath = json.list.find((i) => i.name === produktDeleteConfirm.name);
        kath.content = kath.content.filter((i) => i.name !== produktDeletionItem.name);

        await handleSaveFile(kathpath, JSON.stringify(json));
        setProduktDeleteConfirm(null);
        setProduktDeletionItem(null);
        readdata();
    };
    
    const editProduktField = async (kathState, produktState, field, value, resetKath, resetProdukt) => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        const kath = json.list.find((i) => i.name === kathState.name);
        const item = kath.content.find((i) => i.name === produktState.name);
        item[field] = value;
        await handleSaveFile(kathpath, JSON.stringify(json));
        resetProdukt(null);
        resetKath(null);
        readdata();
    };

    const editProdukttitle = async (value) => {
        await editProduktField(produktEditTitleKath, produktEditTitle, "name", value, setProduktEditTitleKath, setProduktEditTitle);
    };
    const editProduktPrice = async (value) => {
        await editProduktField(produktEditPriceKath, produktEditPrice, "price", value, setProduktEditPriceKath, setProduktEditPrice);
    }
    const editProduktSteuer = async (value) => {
        await editProduktField(produktEditSteuerKath, produktEditSteuer, "steuer", value, setProduktEditSteuerKath, setProduktEditSteuer);
    }
    useEffect(() => {
        readdata();
    }, []);
    const theme = useTheme();


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
                produktEditSteuer != null && (
                    <MaskProvider>
                        <SingleLineinput title={"Mehrwertsteuer bearbeiten"} 
                        onClose={() => {
                            setProduktEditSteuer(null);
                            setProduktEditSteuerKath(null);
                        }}
                        val={produktEditSteuer.steuer}
                        inputtype={"number"}
                        onSave={editProduktSteuer}/>
                    </MaskProvider>
                )
            }
            {
                produktEditPrice != null && (
                    <MaskProvider>
                        <SingleLineinput
                            title={"Preiß bearbeiten"}
                            onClose={() => {
                                setProduktEditPrice(null);
                                setProduktEditPriceKath(null);
                            }}
                            val={produktEditPrice.price}
                            inputtype={"number"}
                            onSave={editProduktPrice}
                        />
                    </MaskProvider>
                )

            }
            {produktEditTitle && (
                <MaskProvider>
                    <SingleLineinput
                        title="Produktnamen bearbeiten"
                        onClose={() => {
                            setProduktEditTitle(null);
                            setProduktEditTitleKath(null);
                        }}
                        val={produktEditTitle.name}
                        onSave={editProdukttitle}
                    />
                </MaskProvider>
            )}

            {produktDeleteConfirm && (
                <MaskProvider>
                    <DeleteConfirmation
                        title="Produkt Löschen"
                        confirmfunction={deleteProdukt}
                        disable={setProduktDeleteConfirm}
                        buttontitle="Löschen"
                        description={`Sind sie sicher das Produkt ${produktDeleteConfirm.name} löschen wollen ?`}
                        parameter={null}
                    />
                </MaskProvider>
            )}

            {createProdukt && (
                <MaskProvider>
                    <CreateProdukt
                        kathpath={kathpath}
                        update={readdata}
                        kathname={createProdukt.name}
                        disable={setCreateProdukt}
                    />
                </MaskProvider>
            )}

            {createCategory && (
                <MaskProvider>
                    <CreateProduktKathegorie
                        setcreate={setCreateCategory}
                        path={kathpath}
                        update={readdata}
                    />
                </MaskProvider>
            )}

            {deleteCategoryConfirmation && (
                <MaskProvider>
                    <DeleteConfirmation
                        title="Kategorie Löschen"
                        confirmfunction={deleteKathegorie}
                        disable={setDeleteCategoryConfirmation}
                        buttontitle="Löschen"
                        description={`Sind sie sicher das die die Kategorie ${deleteCategoryConfirmation.name} mit allen Produkten löschen wollen ?`}
                        parameter={deleteCategoryConfirmation.name}
                    />
                </MaskProvider>
            )}

            <Headline>Produkte Verwalten</Headline>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
                <InfoCard
                    headline={"Information"}
                >
                    Hier werden Produkte und Kategorien für die Schnellauswahl beim Erstellen der
                    Rechnung konfiguriert
                </InfoCard>
                <Box sx={{ justifyContent: 'space-between', display: 'flex', mt: 2 }}>
                    <Typography>Kategorien</Typography>
                    <Button onClick={() => setCreateCategory(true)}>Kategorie Erstellen</Button>
                </Box>

                <AccordionGroup
                    variant="outlined"
                    size="lg"
                    transition="0.3s"
                    sx={() => ({
                        mt: 3,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        [`& .${accordionSummaryClasses.root}`]: {
                            bgcolor: theme.vars.palette.background.surface,
                            fontWeight: 600,
                            fontSize: '1rem',
                            color: theme.vars.palette.text.primary,
                            padding: '0.75rem 1rem',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                bgcolor: theme.vars.palette.primary.softHover,
                            },
                        },
                        [`& .${accordionSummaryClasses.expandIcon}`]: {
                            color: theme.vars.palette.primary.main,
                        },
                        [`& .${accordionDetailsClasses.content}`]: {
                            bgcolor: theme.vars.palette.background.body,
                            padding: '1rem 1.5rem',
                            borderTop: `1px solid ${theme.vars.palette.divider}`,
                        },
                        [`& .${accordionSummaryClasses.root} + .${accordionDetailsClasses.root}`]: {
                            marginTop: 0, // Remove margin between summary and details
                        },
                        [`& .${accordionClasses.root}`]: {
                            margin: 0, // Remove default margin between Accordions
                            borderBottom: `1px solid ${theme.vars.palette.divider}`, // optional separator
                        }
                    })}
                >
                    {data?.list?.map((item) => (
                        <Accordion  key={item.name} sx={{ borderBottom: `1px solid ${theme.vars.palette.divider}` }}>
                            <AccordionSummary>{item.name}</AccordionSummary>
                            <AccordionDetails>
                                <KathAccordationDetail
                                    setitem={setProduktDeletionItem}
                                    setproduktdeleteconfirm={setProduktDeleteConfirm}
                                    setcreatep={setCreateProdukt}
                                    item={item}
                                    path={kathpath}
                                    setconfirmation={setDeleteCategoryConfirmation}
                                    settitleedititem={setProduktEditTitle}
                                    settitleitemkath={setProduktEditTitleKath}
                                    setpriceedit={setProduktEditPrice}
                                    setpriceeditkath={setProduktEditPriceKath}
                                    setsteueredit={setProduktEditSteuer}
                                    setsteuereditkath={setProduktEditSteuerKath}
                                />
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionGroup>
            </Box>
        </Box>
    );
};

export default ProdukteVerwalten;