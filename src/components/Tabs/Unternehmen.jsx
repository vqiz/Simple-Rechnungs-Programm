import React, { useCallback, useEffect, useState } from 'react';
import { handleLoadFile, handleSaveFile } from '../../Scripts/Filehandler';
import Cropper from "react-easy-crop";
import { Building2, Save, Image as ImageIcon, AlertCircle, Info } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

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
    bundesland: "",
    invoicePrefix: "R",
    invoiceDateFormat: "YYYY-MM-DD",
    invoiceSeparator: "-",
    waehrung: "€"
  });

  const [oldjson, setoldjson] = useState();
  const [changes, setchanges] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
      const phrased = JSON.parse(jsonstring);
      if (jsonstring === "{}" || !phrased) {
        return;
      }
      setFormData(phrased);
      setoldjson(phrased);
    }
    fetch();
  }, []);

  useEffect(() => {
    if (oldjson && JSON.stringify(formData) !== JSON.stringify(oldjson)) {
      setchanges(true);
    } else {
      setchanges(false);
    }
  }, [formData, oldjson]);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

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

  const handleSaveImage = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      alert("Please select and crop an image first");
      return;
    }

    try {
      const blob = await getCroppedImage(imageSrc, croppedAreaPixels);
      if (!blob) throw new Error("Cropped image blob is undefined");

      const arrayBuffer = await blob.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      const savePath = "logo.png";

      const fullPath = await window.api.getFullpath(savePath);
      const result = await window.api.saveFileToPath(uint8, fullPath);

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 h-screen overflow-y-auto w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Einstellungen</h2>
      </div>

      {/* Information Banner */}
      <div className="flex items-start gap-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4 shadow-sm dark:bg-blue-900/20 dark:border-blue-800">
        <Info className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">Information</h3>
          <div className="mt-1 text-sm text-blue-800/90 dark:text-blue-200/90">
            Hier werden die Unternehmensdaten ihres <strong>eigenen</strong> Unternehmens bearbeitet. Diese werden später auf Rechnungen bei <strong>Verkäufer</strong> angezeigt.<br />
            Alle Pflichtfelder sind für eine E-Rechnung bzw. XRechnung nach geltendem gesetzlichen Standard <strong>unverzichtbar</strong>!
          </div>
        </div>
      </div>

      {changes && (
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 shadow-md dark:bg-orange-900/20 dark:border-orange-800 transition-all duration-300 ease-in-out">
          <div className="flex items-center gap-3 text-orange-800 dark:text-orange-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">Es wurden Änderungen vorgenommen, die noch nicht gespeichert sind.</p>
          </div>
          <Button onClick={save} className="bg-orange-600 hover:bg-orange-700 text-white shrink-0 ml-4">
            <Save className="mr-2 h-4 w-4" />
            Speichern
          </Button>
        </div>
      )}

      <div className="grid gap-6">
        {/* Unternehmensdaten */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              Unternehmensdaten <span className="text-sm font-normal text-muted-foreground ml-2">(Pflichtdaten)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-9 space-y-2">
                <Label htmlFor="unternehmensname">Unternehmensname*</Label>
                <Input id="unternehmensname" placeholder="z.B. Mustermann & Landes GMBH" value={formData.unternehmensname} onChange={(e) => handleChange('unternehmensname', e.target.value)} />
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="postleitzahl">Postleitzahl*</Label>
                <Input id="postleitzahl" type="number" placeholder="z.B. 94315" value={formData.postleitzahl} onChange={(e) => handleChange('postleitzahl', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6 space-y-2">
                <Label htmlFor="strasse">Straße*</Label>
                <Input id="strasse" placeholder="z.B. Musterstraße" value={formData.strasse} onChange={(e) => handleChange('strasse', e.target.value)} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="hausnummer">Hausnummer*</Label>
                <Input id="hausnummer" placeholder="z.B. 92" value={formData.hausnummer} onChange={(e) => handleChange('hausnummer', e.target.value)} />
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label htmlFor="stadt">Stadt | Ort*</Label>
                <Input id="stadt" placeholder="z.B. Straubing" value={formData.stadt} onChange={(e) => handleChange('stadt', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-2">
                <Label htmlFor="laenderCode">Länder Code | ISO-Code*</Label>
                <Input id="laenderCode" placeholder="z.B. DE" value={formData.laenderCode} onChange={(e) => handleChange('laenderCode', e.target.value)} />
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label htmlFor="umsatzsteuerId">Umsatzsteuer-ID</Label>
                <Input id="umsatzsteuerId" placeholder="z.B. DE123456789" value={formData.umsatzsteuerId} onChange={(e) => handleChange('umsatzsteuerId', e.target.value)} />
              </div>
              <div className="md:col-span-4 space-y-2">
                <Label htmlFor="steuernr">Steuer-Nr*</Label>
                <Input id="steuernr" placeholder="z.B. 12/345/67890" value={formData.steuernr} onChange={(e) => handleChange('steuernr', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inhaber">Inhaber*</Label>
                <Input id="inhaber" placeholder="z.B. Max Mustermann" value={formData.inhaber} onChange={(e) => handleChange('inhaber', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bundesland">Bundesland*</Label>
                <Input id="bundesland" placeholder="z.B. Bayern" value={formData.bundesland} onChange={(e) => handleChange('bundesland', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bankverbindung */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Bankverbindung <span className="text-sm font-normal text-muted-foreground ml-2">(Pflichtdaten)</span></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="bic">BIC*</Label>
                <Input id="bic" placeholder="z.B. COBADEHDXXX" value={formData.bic} onChange={(e) => handleChange('bic', e.target.value)} />
              </div>
              <div className="md:col-span-9 space-y-2">
                <Label htmlFor="bankverbindung">Bankverbindung | IBAN*</Label>
                <Input id="bankverbindung" placeholder="z.B. DE21 3704 0044 0532 0130 00" value={formData.bankverbindung} onChange={(e) => handleChange('bankverbindung', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankname">Bankname*</Label>
                <Input id="bankname" placeholder="z.B. Sparkasse Niederbayern-Mitte" value={formData.bankname} onChange={(e) => handleChange('bankname', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kontoinhaber">Kontoinhaber*</Label>
                <Input id="kontoinhaber" placeholder="z.B. Max Mustermann" value={formData.kontoinhaber} onChange={(e) => handleChange('kontoinhaber', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Kontaktperson */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Kontaktperson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kontaktName">Name</Label>
                <Input id="kontaktName" placeholder="z.B Max Mustermann" value={formData.kontaktName} onChange={(e) => handleChange('kontaktName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kontaktEmail">Emailadresse</Label>
                <Input id="kontaktEmail" type="email" placeholder="z.B max.musterman@t-online.de" value={formData.kontaktEmail} onChange={(e) => handleChange('kontaktEmail', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kontaktTelefon">Telefonnummer</Label>
                <Input id="kontaktTelefon" placeholder="+49 1515 1145345" value={formData.kontaktTelefon} onChange={(e) => handleChange('kontaktTelefon', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sonstiges */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Sonstiges & Gewerbeart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="handelsregisternummer">Handelsregisternummer*</Label>
                <Input id="handelsregisternummer" placeholder="HRA 12345" value={formData.handelsregisternummer} onChange={(e) => handleChange('handelsregisternummer', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sonstigeTelefonnummer">Telefonnummer (Firma)</Label>
                <Input id="sonstigeTelefonnummer" placeholder="+49 1515 1145345" value={formData.sonstigeTelefonnummer} onChange={(e) => handleChange('sonstigeTelefonnummer', e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sonstigeEmail">Emailadresse (Firma)*</Label>
                <Input id="sonstigeEmail" type="email" placeholder="z.B. org.example@firma.com" value={formData.sonstigeEmail} onChange={(e) => handleChange('sonstigeEmail', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="z.B. www.test.de" value={formData.website} onChange={(e) => handleChange('website', e.target.value)} />
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-4 py-4 rounded-lg bg-muted/40 p-4 border border-border">
              <Label htmlFor="gewerbeart" className={!formData.mwst ? "font-bold text-primary" : "text-muted-foreground cursor-pointer"}>Kleingewerbe</Label>
              <Switch
                id="gewerbeart"
                checked={formData.mwst}
                onCheckedChange={(checked) => handleChange('mwst', checked)}
              />
              <Label htmlFor="gewerbeart" className={formData.mwst ? "font-bold text-primary" : "text-muted-foreground cursor-pointer"}>Gewerbe (Mit MwSt)</Label>
            </div>
          </CardContent>
        </Card>

        {/* Formatierungen */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Rechnungs- & Währungsformat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Präfix</Label>
                <Input id="invoicePrefix" placeholder="z.B. R" value={formData.invoicePrefix || ""} onChange={(e) => handleChange('invoicePrefix', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDateFormat">Datumsformat</Label>
                <select
                  id="invoiceDateFormat"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.invoiceDateFormat || "YYYY-MM-DD"}
                  onChange={(e) => handleChange('invoiceDateFormat', e.target.value)}
                >
                  <option value="YYYY-MM-DD">2024-03-01</option>
                  <option value="YYYYMMDD">20240301</option>
                  <option value="YYYY-MM">2024-03</option>
                  <option value="YYYY">2024</option>
                  <option value="NONE">Kein Datum</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceSeparator">Trennzeichen</Label>
                <Input id="invoiceSeparator" placeholder="z.B. -" value={formData.invoiceSeparator || ""} onChange={(e) => handleChange('invoiceSeparator', e.target.value)} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border border-border">
              Vorschau: <span className="font-mono text-primary bg-background px-2 py-0.5 rounded ml-2 shadow-sm border border-border">{formData.invoicePrefix || "R"}{formData.invoiceDateFormat !== "NONE" ? (formData.invoiceSeparator || "-") + new Date().getFullYear() + "..." : ""}{formData.invoiceSeparator || "-"}123</span>
            </p>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waehrung">Währungssymbol</Label>
                <select
                  id="waehrung"
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.waehrung || "€"}
                  onChange={(e) => handleChange('waehrung', e.target.value)}
                >
                  <option value="€">Euro (€)</option>
                  <option value="$">Dollar ($)</option>
                  <option value="£">Pfund (£)</option>
                  <option value="CHF">Schweizer Franken (CHF)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              Firmenlogo
            </CardTitle>
            <CardDescription>Dieses Logo wird auf Ihren Rechnungen rechts oben abgebildet.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showcrop ? (
              <div className="space-y-4 rounded-lg border border-border p-6 bg-muted/10">
                <div className="max-w-xs space-y-2">
                  <Label htmlFor="logoUpload">Bild auswählen</Label>
                  <Input id="logoUpload" type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                {imageSrc && (
                  <div className="space-y-4 mt-6">
                    <div className="relative w-full max-w-[400px] h-[400px] rounded-lg overflow-hidden border border-border bg-black/5 mx-auto md:mx-0">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button onClick={handleSaveImage} className="bg-primary text-primary-foreground min-w-[150px]">
                        <Save className="mr-2 h-4 w-4" /> Logo speichern
                      </Button>
                      <Button variant="outline" onClick={() => setShowCrop(false)} className="min-w-[150px]">
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4 pt-2">
                <Button onClick={() => setShowCrop(true)} className="w-full sm:w-auto min-w-[140px]">
                  Logo Ändern
                </Button>
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto min-w-[140px]"
                  onClick={() => {
                    window.api.delFile("logo.png");
                    alert("Logo wurde entfernt");
                  }}
                >
                  Logo Entfernen
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default Unternehmen;
