import { Alert, Avatar, Box, Button, Divider, FormControl, FormLabel, Input, Switch, Typography } from '@mui/joy'
import React, { useCallback, useEffect, useState } from 'react'
import Headline from '../Headline'
import InfoCard from '../InfoCard'
import FactoryIcon from '@mui/icons-material/Factory';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import Cropper from "react-easy-crop";
const labelstyle = { color: "gray" }
const boxlinestyle = { display: "flex", width: "auto", flexDirection: "row", gap: 2 }
function Unternehmen() {
  const [formData, setFormData] = React.useState({
    unternehmensname: "",
    postleitzahl: "",
    strasse: "",
    hausnummer: "",
    stadt: "",
    laenderCode: "",
    umsatzsteuerId: "",
    bankverbindung: "",
    bic: "",
    bankname: "",
    kontoinhaber: "",
    kontaktName: "",
    kontaktEmail: "",
    kontaktTelefon: "",
    handelsregisternummer: "",
    sonstigeTelefonnummer: "",
    sonstigeEmail: "",
    website: "",
    inhaber: "",
    steuernr: "",
    mwst: false,
  });
  const [oldjson, setoldjson] = useState();
  const [changes, setchanges] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
      const phrased = JSON.parse(jsonstring);
      if (jsonstring === "{}") {
        return;
      }
      setFormData(phrased);
      setoldjson(phrased);
    }
    fetch();
  }, []);
  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(oldjson)) {
      setchanges(true);
    } else {
      setchanges(false);
    }
  }, [formData])
  const save = async () => {
    handleSaveFile("settings/unternehmen.rechnix", JSON.stringify(formData));
    setchanges(false);
    setoldjson(formData);
  }

  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showcrop, setShowCrop] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Load image from input
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  // Get cropped image blob
  async function getCroppedImage(imageSrc, cropPixels) {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      cropPixels.width,
      cropPixels.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to create blob from canvas"));
        resolve(blob);
      }, "image/png");
    });
  }

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      alert("Please select and crop an image first");
      return;
    }

    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      if (!blob) throw new Error("Cropped image blob is undefined");

      const arrayBuffer = await blob.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      const savePath = "public/logo.png"; // adjust path as needed

      const result = await window.api.saveFileToPath(uint8, savePath);

      if (result && result.success) {
        alert("Logo wurde gespeichert");
        setShowCrop(false);
      } else {
        alert("Fehler: " + (result?.error || "Unknown error"));
      }
    } catch (error) {
      alert("Fehler: " + error.message);
    }
  };








  return (
    <Box
      sx={{
        height: '100vh',
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
            <Alert sx={{ mb: 2 }} variant='soft' color="primary" endDecorator={<Button onClick={() => save()}>Speichern</Button>}>
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
              onChange={e => setFormData({ ...formData, unternehmensname: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "auto" }}>
            <FormLabel sx={labelstyle}>Postleitzahl {"(Pflichtfeld)"}</FormLabel>
            <Input
              type='number'
              placeholder='z.B. 94315'
              value={formData.postleitzahl}
              onChange={e => setFormData({ ...formData, postleitzahl: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Straße {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. Musterstraße'
              value={formData.strasse}
              onChange={e => setFormData({ ...formData, strasse: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "23.5%" }}>
            <FormLabel sx={labelstyle}>Hausnummer {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. 92'
              value={formData.hausnummer}
              onChange={e => setFormData({ ...formData, hausnummer: e.target.value })}
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={labelstyle}>Stadt | Ort {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. Straubing'
              value={formData.stadt}
              onChange={e => setFormData({ ...formData, stadt: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl>
            <FormLabel sx={labelstyle}>Länder Code | ISO-Code {"(Pflichtfeld)"} </FormLabel>
            <Input
              placeholder='z.B. DE'
              value={formData.laenderCode}
              onChange={e => setFormData({ ...formData, laenderCode: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "27.5%" }}>
            <FormLabel sx={labelstyle}>Umsatzsteuer-ID {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. DE123456789'
              value={formData.umsatzsteuerId}
              onChange={e => setFormData({ ...formData, umsatzsteuerId: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "31%" }}>
            <FormLabel sx={labelstyle}>Steuer-Nr {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. 12/345/67890'
              value={formData.steuernr}
              onChange={e => setFormData({ ...formData, steuernr: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "31%" }}>
            <FormLabel sx={labelstyle}>Inhaber {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. Max Mustermann'
              value={formData.inhaber}
              onChange={e => setFormData({ ...formData, inhaber: e.target.value })}
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
              onChange={e => setFormData({ ...formData, bic: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormLabel sx={labelstyle}>Bankverbindung | für Sepa Lastschriften etc. {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. DE21 3704 0044 0532 0130 00'
              value={formData.bankverbindung}
              onChange={e => setFormData({ ...formData, bankverbindung: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Bankname {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. Sparkasse Niederbayern-Mitte'
              value={formData.bankname}
              onChange={e => setFormData({ ...formData, bankname: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormLabel sx={labelstyle}>Kontoinhaber {"(Pflichtfeld)"}</FormLabel>
            <Input
              placeholder='z.B. Max Mustermann'
              value={formData.kontoinhaber}
              onChange={e => setFormData({ ...formData, kontoinhaber: e.target.value })}
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
              onChange={e => setFormData({ ...formData, kontaktName: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormLabel sx={labelstyle}>Emailadresse</FormLabel>
            <Input
              placeholder='z.B max.musterman@t-online.de'
              value={formData.kontaktEmail}
              onChange={e => setFormData({ ...formData, kontaktEmail: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Telefonnummer</FormLabel>
            <Input
              placeholder='+49 1515 1145345'
              value={formData.kontaktTelefon}
              onChange={e => setFormData({ ...formData, kontaktTelefon: e.target.value })}
            />
          </FormControl>
        </Box>
      </Box>

      <Typography sx={{ color: "gray", ml: 2 }}>Sonstiges</Typography>
      <Divider orientation="horizontal" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}>
        <Box sx={boxlinestyle}>
          <FormControl sx={{ width: "50%" }}>
            <FormLabel sx={labelstyle}>Handelsregisternummer</FormLabel>

            <Input
              placeholder='HRA 12345'
              value={formData.handelsregisternummer}
              onChange={e => setFormData({ ...formData, handelsregisternummer: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "39.5%" }}>
            <FormLabel sx={labelstyle}>Telefonnummer {"(Firma)"}</FormLabel>
            <Input
              placeholder='+49 1515 1145345'
              value={formData.sonstigeTelefonnummer}
              onChange={e => setFormData({ ...formData, sonstigeTelefonnummer: e.target.value })}
            />
          </FormControl>
        </Box>
        <Box sx={{ ...boxlinestyle, mb: 5 }}>
          <FormControl sx={{ width: "49%" }}>
            <FormLabel sx={labelstyle}>Emailadresse {"Pflichtfeld"}</FormLabel>
            <Input
              placeholder='z.B. org.example@firma.com'
              value={formData.sonstigeEmail}
              onChange={e => setFormData({ ...formData, sonstigeEmail: e.target.value })}
            />
          </FormControl>
          <FormControl sx={{ width: "40.5%" }}>
            <FormLabel sx={labelstyle}>Website</FormLabel>
            <Input
              placeholder='z.B. www.test.de'
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
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
            <Switch checked={formData.mwst} onChange={(e) => setFormData({ ...formData, mwst: e.target.checked })} />
            <Typography sx={labelstyle}>Gewerbe</Typography>
          </Box>
        </FormControl>
      </Box>



      <Typography sx={{ color: "gray", ml: 2 }}>Logo</Typography>
      <Divider orientation="horizontal" />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, mb: 15 }}>
        {
          showcrop ? (
            <FormControl>
              <div style={{ padding: "20px" }}>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div
                  style={{
                    position: "relative",
                    width: 400,
                    height: 400,
                    marginTop: 20,

                  }}
                >
                  {imageSrc && (
                    <Cropper
                      image={imageSrc}
                      crop={crop}
                      zoom={zoom}
                      aspect={1} // 1:1 square
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                    />
                  )}
                </div>
                {
                  imageSrc && (
                    <Button
                      onClick={handleSave}
                      sx={{ mt: 4 }}
                    >
                      Logo speichern
                    </Button>
                  )
                }
              </div>
            </FormControl>

          ) : (
            <>
              <Button onClick={() => setShowCrop(true)} sx={{ width: "10%" }}>Logo Ändern</Button>
              <Button sx={{ width: "10%" }} onClick={() => {
                window.api.delFile("public/logo.png");
                alert("Logo wurde entfernt");
              }} color='danger'>Logo Entfernen</Button>
            </>
          )
        }

      </Box>
    </Box>

  )
}

export default Unternehmen
