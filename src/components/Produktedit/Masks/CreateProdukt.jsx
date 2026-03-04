import { Modal, ModalDialog, Box } from '@mui/joy';
import React, { useState, useEffect } from 'react';
import { handleLoadFile, handleSaveFile } from '../../../Scripts/Filehandler';
import { CheckCircle2, Package, Tag, Calculator } from "lucide-react";


import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';

function CreateProdukt({ kathname, disable, update, kathpath }) {
  const [price, setprice] = useState("");
  const [produktname, setproduktname] = useState("");
  const [mehrWertSteuer, setMehrWertSteuer] = useState("19");
  const [selectedCategory, setSelectedCategory] = useState(kathname || "");
  const [categories, setCategories] = useState([]);
  const [error, seterror] = useState(false);


  const brutto = (parseFloat(price || 0) * (1 + parseFloat(mehrWertSteuer || 0) / 100)).toFixed(2);

  useEffect(() => {
    if (!kathname) {

      const loadCats = async () => {
        const jsonString = await handleLoadFile(kathpath);
        const json = JSON.parse(jsonString);
        setCategories(json.list || []);
        if (json.list && json.list.length > 0) {
          setSelectedCategory(json.list[0].name);
        }
      };
      loadCats();
    }
  }, [kathname, kathpath]);

  async function addprodukt() {
    if (!price || !produktname || produktname === "" || !selectedCategory) {
      seterror(true);
      return;
    }
    const jsonString = await handleLoadFile(kathpath);
    const json = JSON.parse(jsonString);
    const kath = json.list.find((i) => i.name === selectedCategory);

    if (!kath) {
      console.error("Category not found");
      return;
    }

    kath.content.push({
      name: produktname,
      price: parseFloat(price.replace(',', '.')),
      steuer: parseFloat(price) > 0 ? parseFloat(mehrWertSteuer) : 0,
    });

    await handleSaveFile(kathpath, JSON.stringify(json));
    disable(null);
    update();
  }

  return (
    <Modal open={true} onClose={() => disable(null)} sx={{ backdropFilter: 'blur(2px)' }}>
      <ModalDialog
        variant="plain"
        sx={{
          p: 0,
          border: 'none',
          bgcolor: 'transparent',
          boxShadow: 'none',
          maxWidth: '95vw',
        }}
      >
        <div className="w-[700px] max-w-full">
          <Card className="shadow-2xl border-muted bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-muted">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Artikel Details
              </CardTitle>
              <CardDescription>Tragen Sie Stammdaten für das Inventar ein.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2 relative pb-5">
                  <Label htmlFor="name">Produktname <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="z.B. Webdesign Basic Paket"
                    value={produktname}
                    onChange={(e) => { setproduktname(e.target.value); seterror(false); }}
                    className={error && !produktname ? "border-red-500" : ""}
                  />
                  <p className="absolute bottom-0 left-0 text-[10px] text-muted-foreground leading-tight">
                    (Zeitbasierte Produkte müssen "stunde" enthalten)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Kategorie <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    disabled={!!kathname}
                  >
                    <SelectTrigger className={error && !selectedCategory ? "border-red-500" : ""}>
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {kathname ? (
                        <SelectItem value={kathname}>{kathname}</SelectItem>
                      ) : (
                        categories.map(c => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-5 rounded-lg border bg-card/50 space-y-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <Calculator className="h-4 w-4" />
                  Preisgestaltung
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="netto">Nettopreis (€) <span className="text-red-500">*</span></Label>
                    <Input
                      id="netto"
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => {
                        setprice(e.target.value);
                        seterror(false);
                      }}
                      className={"font-mono " + (error && !price ? "border-red-500" : "")}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax">Steuersatz (%) <span className="text-red-500">*</span></Label>
                    <Select value={mehrWertSteuer.toString()} onValueChange={setMehrWertSteuer}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="19">19% (Standard)</SelectItem>
                        <SelectItem value="7">7% (Ermäßigt)</SelectItem>
                        <SelectItem value="0">0% (Steuerfrei)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brutto">Bruttopreis (€)</Label>
                    <Input
                      id="brutto"
                      value={brutto !== "NaN" ? brutto : "0.00"}
                      disabled
                      className="bg-muted/50 font-mono font-semibold"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="text-sm font-medium text-red-500 text-center">
                  Bitte alle Pflichtfelder überprüfen.
                </div>
              )}

            </CardContent>

            <CardFooter className="bg-muted/30 border-t border-muted px-6 py-4 flex justify-between items-center">
              <Button variant="ghost" onClick={() => disable(null)}>Abbrechen</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={addprodukt}>
                <CheckCircle2 className="h-4 w-4" />
                Produkt speichern
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ModalDialog>
    </Modal>
  );
}

export default CreateProdukt;