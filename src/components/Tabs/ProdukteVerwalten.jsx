import {
    Accordion,
    AccordionDetails,
    accordionDetailsClasses,
    AccordionGroup,
    AccordionSummary,
    accordionSummaryClasses,
    Box,
    Button,
    Card,
    Typography
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

    const editProdukttitle = async (value) => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        const kath = json.list.find((i) => i.name === produktEditTitleKath.name);
        const item = kath.content.find((i) => i.name === produktEditTitle.name);
        item.name = value;
        await handleSaveFile(kathpath, JSON.stringify(json));
        setProduktEditTitle(null);
        setProduktEditTitleKath(null);
        readdata();
    };
    const editProduktPrice = async (value) => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        const kath = json.list.find((i) => i.name === produktEditPriceKath.name);
        const item = kath.content.find((i) => i.name === produktEditPrice.name);
        item.price = value;
        await handleSaveFile(kathpath, JSON.stringify(json));
        setProduktEditPrice(null);
        setProduktEditPriceKath(null);
        readdata();
    }

    useEffect(() => {
        readdata();
    }, []);



    return (
        <Box
            sx={{
                height: '100vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 0,
                position: 'relative',
                
            }}
        >
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
                        title="Kathegorie Löschen"
                        confirmfunction={deleteKathegorie}
                        disable={setDeleteCategoryConfirmation}
                        buttontitle="Löschen"
                        description={`Sind sie sicher das die die Kathegorie ${deleteCategoryConfirmation.name} mit allen Produkten löschen wollen ?`}
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
                    <Typography>Kathegorien</Typography>
                    <Button onClick={() => setCreateCategory(true)}>Kathegorie Erstellen</Button>
                </Box>

                <AccordionGroup
                    variant="outlined"
                    size="lg"
                    transition="0.2s"
                    sx={(theme) => ({
                        mt: 2,
                        borderRadius: 'lg',
                        [`& .${accordionSummaryClasses.button}:hover`]: {
                            bgcolor: 'transparent'
                        },
                        [`& .${accordionDetailsClasses.content}`]: {
                            boxShadow: `inset 0 1px ${theme.vars.palette.divider}`,
                            [`&.${accordionDetailsClasses.expanded}`]: {
                                paddingBlock: '0.75rem'
                            }
                        },
                        overflowY: 'auto'
                    })}
                >
                    {data?.list?.map((item) => (
                        <Accordion key={item.name}>
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