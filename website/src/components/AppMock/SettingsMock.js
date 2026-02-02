import { Alert, Box, Button, Divider, FormControl, FormLabel, Input, Switch, Typography } from '@mui/joy'
import React, { useState } from 'react'
import MockFrame from './MockFrame';
import Headline from './utils/Headline';
import InfoCard from './utils/InfoCard';

const labelstyle = { color: "gray" }
const boxlinestyle = { display: "flex", width: "auto", flexDirection: "row", gap: 2 }

export default function SettingsMock() {
    const [formData, setFormData] = useState({
        unternehmensname: "Musterfirma GmbH",
        postleitzahl: "12345",
        strasse: "Hauptstraße",
        hausnummer: "1",
        stadt: "Berlin",
        laenderCode: "DE",
        umsatzsteuerId: "DE123456789",
        bankverbindung: "DE00 1234 5678 9000 0000 00",
        bic: "ABCDEFGH",
        bankname: "Musterbank",
        kontoinhaber: "Max Mustermann",
        kontaktName: "Max Mustermann",
        kontaktEmail: "info@musterfirma.de",
        kontaktTelefon: "+49 30 123456",
        handelsregisternummer: "HRB 12345",
        sonstigeTelefonnummer: "030 987654",
        sonstigeEmail: "office@musterfirma.de",
        website: "www.musterfirma.de",
        inhaber: "Max Mustermann",
        steuernr: "12/345/67890",
        mwst: true,
        bundesland: "Berlin",
    });

    const [changes, setchanges] = useState(false);

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setchanges(true);
    };

    return (
        <MockFrame activePage="Einstellungen">
            <Box
                sx={{
                    height: '100%',
                    display: 'block',
                    flexDirection: 'column',
                    gap: 2,
                    p: 0,
                    position: 'relative',
                    overflowY: "auto"
                }}
            >
                <Headline>Unternehmensdaten Verwalten</Headline>
                <Box sx={{ p: 2 }}>
                    <InfoCard headline={"Information"}>Hier werden die Unternehmensdaten ihres <Typography sx={{ fontWeight: "bold" }}>eigenen</Typography> Unternehmens bearbeitet. Diese werden später auf Rechnungen bei <Typography sx={{ fontWeight: "bold" }}>Verkäufer</Typography> angezeigt. <br />
                        Alle Pflichtfelder sind für eine E-Rechnung bzw. XRechnung nach geltendem Gesetzlichen Standart <Typography sx={{ fontWeight: "bold" }}>Unverzichtbar</Typography>! </InfoCard>
                </Box>
                {
                    changes && (
                        <Box sx={{ p: 2 }}>
                            <Alert sx={{ mb: 2 }} variant='soft' color="primary" endDecorator={<Button onClick={() => setchanges(false)}>Speichern</Button>}>
                                Es wurden änderungen vorgenommen die noch nicht Gespeichert sind.
                            </Alert>
                        </Box>
                    )
                }
                <Typography sx={{ color: "gray", ml: 2 }} level="title-md">Unternehmensdaten {"(Pflichtdaten)"}</Typography>
                <Divider orientation="horizontal"></Divider>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "74.6%" }}>
                            <FormLabel sx={labelstyle}>Unternehmensname {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Mustermann & Landes GMBH'
                                value={formData.unternehmensname}
                                onChange={e => handleChange('unternehmensname', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "auto" }}>
                            <FormLabel sx={labelstyle}>Postleitzahl {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                type='number'
                                placeholder='z.B. 94315'
                                value={formData.postleitzahl}
                                onChange={e => handleChange('postleitzahl', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "50%" }}>
                            <FormLabel sx={labelstyle}>Straße {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Musterstraße'
                                value={formData.strasse}
                                onChange={e => handleChange('strasse', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "23.5%" }}>
                            <FormLabel sx={labelstyle}>Hausnummer {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. 92'
                                value={formData.hausnummer}
                                onChange={e => handleChange('hausnummer', e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel sx={labelstyle}>Stadt | Ort {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Straubing'
                                value={formData.stadt}
                                onChange={e => handleChange('stadt', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={boxlinestyle}>
                        <FormControl>
                            <FormLabel sx={labelstyle}>Länder Code | ISO-Code {"(Pflichtfeld)"} </FormLabel>
                            <Input
                                placeholder='z.B. DE'
                                value={formData.laenderCode}
                                onChange={e => handleChange('laenderCode', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "27.5%" }}>
                            <FormLabel sx={labelstyle}>Umsatzsteuer-ID {""}</FormLabel>
                            <Input
                                placeholder='z.B. DE123456789'
                                value={formData.umsatzsteuerId}
                                onChange={e => handleChange('umsatzsteuerId', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "31%" }}>
                            <FormLabel sx={labelstyle}>Steuer-Nr {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. 12/345/67890'
                                value={formData.steuernr}
                                onChange={e => handleChange('steuernr', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "31%" }}>
                            <FormLabel sx={labelstyle}>Inhaber {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Max Mustermann'
                                value={formData.inhaber}
                                onChange={e => handleChange('inhaber', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "31%" }}>
                            <FormLabel sx={labelstyle}>Bundesland {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Bayern'
                                value={formData.bundesland}
                                onChange={e => handleChange('bundesland', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Box>

                <Typography sx={{ color: "gray", ml: 2 }} level="title-md">BankVerbindung {"(Pflichtdaten)"}</Typography>
                <Divider orientation="horizontal"></Divider>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "17.5%" }}>
                            <FormLabel sx={labelstyle}>BIC {"(Pflichtfeld)"} </FormLabel>
                            <Input
                                placeholder='z.B. COBADEHDXXX'
                                value={formData.bic}
                                onChange={e => handleChange('bic', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "39.5%" }}>
                            <FormLabel sx={labelstyle}>Bankverbindung | für Sepa Lastschriften etc. {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. DE21 3704 0044 0532 0130 00'
                                value={formData.bankverbindung}
                                onChange={e => handleChange('bankverbindung', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "50%" }}>
                            <FormLabel sx={labelstyle}>Bankname {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Sparkasse Niederbayern-Mitte'
                                value={formData.bankname}
                                onChange={e => handleChange('bankname', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "39.5%" }}>
                            <FormLabel sx={labelstyle}>Kontoinhaber {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='z.B. Max Mustermann'
                                value={formData.kontoinhaber}
                                onChange={e => handleChange('kontoinhaber', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Box>

                <Typography sx={{ color: "gray", ml: 2 }}>Kontaktperson</Typography>
                <Divider orientation="horizontal" />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "50%" }}>
                            <FormLabel sx={labelstyle}>Name</FormLabel>
                            <Input
                                placeholder='z.B Max Mustermann'
                                value={formData.kontaktName}
                                onChange={e => handleChange('kontaktName', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "39.5%" }}>
                            <FormLabel sx={labelstyle}>Emailadresse</FormLabel>
                            <Input
                                placeholder='z.B max.musterman@t-online.de'
                                value={formData.kontaktEmail}
                                onChange={e => handleChange('kontaktEmail', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "50%" }}>
                            <FormLabel sx={labelstyle}>Telefonnummer</FormLabel>
                            <Input
                                placeholder='+49 1515 1145345'
                                value={formData.contactPhone}
                                onChange={e => handleChange('contactPhone', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Box>

                <Typography sx={{ color: "gray", ml: 2 }}>Sonstiges</Typography>
                <Divider orientation="horizontal" />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    <Box sx={boxlinestyle}>
                        <FormControl sx={{ width: "50%" }}>
                            <FormLabel sx={labelstyle}>Handelsregisternummer {"(Pflichtfeld)"}</FormLabel>
                            <Input
                                placeholder='HRA 12345'
                                value={formData.handelsregisternummer}
                                onChange={e => handleChange('handelsregisternummer', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "39.5%" }}>
                            <FormLabel sx={labelstyle}>Telefonnummer {"(Firma)"}</FormLabel>
                            <Input
                                placeholder='+49 1515 1145345'
                                value={formData.sonstigeTelefonnummer}
                                onChange={e => handleChange('sonstigeTelefonnummer', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                    <Box sx={{ ...boxlinestyle, mb: 5 }}>
                        <FormControl sx={{ width: "49%" }}>
                            <FormLabel sx={labelstyle}>Emailadresse {"Pflichtfeld"}</FormLabel>
                            <Input
                                placeholder='z.B. org.example@firma.com'
                                value={formData.sonstigeEmail}
                                onChange={e => handleChange('sonstigeEmail', e.target.value)}
                            />
                        </FormControl>
                        <FormControl sx={{ width: "40.5%" }}>
                            <FormLabel sx={labelstyle}>Website</FormLabel>
                            <Input
                                placeholder='z.B. www.test.de'
                                value={formData.website}
                                onChange={e => handleChange('website', e.target.value)}
                            />
                        </FormControl>
                    </Box>
                </Box>

                <Typography sx={{ color: "gray", ml: 2 }}>Gewerbeart</Typography>
                <Divider orientation="horizontal" />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
                    <FormControl>
                        <Box sx={{ display: "flex", width: "100%", flexDirection: "row", gap: 2, justifyContent: "center" }}>
                            <Typography sx={labelstyle}>Kleingewerbe</Typography>
                            <Switch checked={formData.mwst} onChange={(e) => handleChange('mwst', e.target.checked)} />
                            <Typography sx={labelstyle}>Gewerbe</Typography>
                        </Box>
                    </FormControl>
                </Box>

                <Typography sx={{ color: "gray", ml: 2 }}>Logo</Typography>
                <Divider orientation="horizontal" />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, mb: 15 }}>
                    <Button sx={{ width: "10%" }}>Logo Ändern</Button>
                    <Button sx={{ width: "10%" }} color='danger'>Logo Entfernen</Button>
                </Box>
            </Box>
        </MockFrame>
    )
}
