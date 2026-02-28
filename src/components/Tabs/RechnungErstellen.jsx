import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { getKunde, getNewRechnungsnummer, handleLoadFile, saveKunde, saveRechnung, setInvoiceDueDate } from '../../Scripts/Filehandler';

// Icons
import { Factory, User, Search, PlusCircle, MinusCircle, Save, Trash2, Check, ChevronsUpDown, Package, FileText, CreditCard } from 'lucide-react';

// UI Components
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Badge } from "../ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { Label } from "../ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator as CmdSeparator
} from "../ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { cn } from "../../lib/utils"

function RechnungErstellen({ selUser }) {
  const { userId } = useParams();
  const targetUser = selUser || userId;

  const [kathpath] = useState('kathegories/kathegories.rechnix');
  const [kunden, setkunden] = useState([]);
  const [produkte, setprodukte] = useState(null);

  // Create product properties 
  const [createProduktOpen, setCreateProduktOpen] = useState(false);
  const [price, setprice] = useState(0);
  const [createsteuer, setCreateSteuer] = useState(19);
  const [produktname, setproduktname] = useState("");
  const [error, seterror] = useState(false);

  // Count mask and variables
  const [editCountOpen, setEditCountOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [targetEditCount, setTargetEditCount] = useState();

  // Unternehmen & Config
  const [oldjson, setoldjson] = useState();

  // UI States
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [brutto, setbrutto] = useState(false);

  // Initial Load
  useEffect(() => {
    const fetchSettings = async () => {
      const jsonstring = await handleLoadFile("settings/unternehmen.rechnix");
      if (jsonstring && jsonstring !== "{}") {
        setoldjson(JSON.parse(jsonstring));
      }
    }
    fetchSettings();

    const fetchData = async () => {
      const readjson = await handleLoadFile("fast_accsess/kunden.db");
      if (readjson && readjson !== "{}") {
        setkunden(JSON.parse(readjson).list);
      } else {
        setkunden([]);
      }

      const jsonString = await handleLoadFile(kathpath);
      if (jsonString) {
        setprodukte(JSON.parse(jsonString));
      }
    };
    fetchData();
  }, [kathpath]);

  const [rechnung, setRechnung] = React.useState({
    kundenId: null,
    positionen: new Map(),
    comment: "",
    items: null,
  });

  // Set User from Props/Params
  useEffect(() => {
    if (targetUser) {
      setRechnung((prev) => ({ ...prev, kundenId: targetUser }))
    }
  }, [targetUser]);

  // Search Debonuce
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    handler();
    return () => handler.cancel();
  }, [searchTerm]);

  // Position Handling
  const addPosition = (key, value) => {
    setRechnung((prev) => {
      const updatedMap = new Map(prev.positionen);
      updatedMap.set(key, value);
      return { ...prev, positionen: updatedMap };
    });
  };

  const removePosition = (key) => {
    setRechnung((prev) => {
      const updatedMap = new Map(prev.positionen);
      updatedMap.delete(key);
      return { ...prev, positionen: updatedMap };
    });
  };

  const containsPosition = (key) => {
    return rechnung.positionen.has(key);
  };

  const updatePosition = (key, newValue) => {
    setRechnung((prev) => {
      if (!prev.positionen.has(key)) return prev;
      const updatedMap = new Map(prev.positionen);
      updatedMap.set(key, newValue);
      return { ...prev, positionen: updatedMap };
    });
  };

  const navigate = useNavigate();

  const createRechnung = async () => {
    const nRechnung = { ...rechnung, items: produkte };
    if (!nRechnung.kundenId) return;

    const kunde = await getKunde(nRechnung.kundenId);
    const rnummer = await getNewRechnungsnummer();
    kunde.rechnungen.push(rnummer);

    await saveKunde(kunde, nRechnung.kundenId);
    await saveRechnung(nRechnung, rnummer);
    await setInvoiceDueDate(rnummer, 14);

    setTimeout(() => {
      navigate("/invoices/" + rnummer);
    }, 20);
  }

  const handleAddProduct = () => {
    if (!price || !produktname || produktname === "") {
      seterror(true);
      return;
    }

    const data = { ...produkte };
    const element = {
      name: produktname,
      price: Number(price),
      steuer: Number(createsteuer),
      temporary: true,
    }

    const tempCategory = data.list.find((i) => i.name === "temp");
    if (tempCategory) {
      tempCategory.content.push(element);
    } else {
      const tempkath = {
        name: "temp",
        content: [element],
      };
      data.list.push(tempkath);
    }

    setprodukte(data);
    addPosition("temp_" + produktname, 1);
    setCreateProduktOpen(false);
    setprice(0);
    setproduktname("");
    setCreateSteuer(19);
  };

  // Calculations
  const calculateTotal = () => {
    return Array.from(rechnung.positionen.entries()).reduce((sum, [key, value]) => {
      const [catName, prodName] = key.split("_");
      const product = produkte?.list?.find((c) => c.name === catName)?.content.find((p) => p.name === prodName);
      const pPrice = product?.price || 0;
      const pSteuer = product?.steuer || 19;

      if (brutto || !oldjson?.mwst) {
        return sum + value * pPrice;
      } else {
        return sum + value * pPrice * (1 + pSteuer / 100);
      }
    }, 0);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <FileText className="h-6 w-6 text-primary" />
          <h1>Neue Rechnung</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>Abbrechen</Button>
          <Button
            onClick={createRechnung}
            disabled={rechnung.positionen.size === 0 || !rechnung.kundenId}
          >
            <Save className="mr-2 h-4 w-4" />
            Rechnung erstellen
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar: Product Browser */}
        <aside className="w-80 border-r bg-background flex flex-col">
          <div className="p-4 border-b space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Produkte suchen..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="w-full" variant="secondary" onClick={() => setCreateProduktOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Neues Produkt
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {produkte?.list?.filter((cat) => {
              const s = debouncedSearchTerm.toLowerCase();
              return cat.name !== "temp" && (
                cat.name.toLowerCase().includes(s) ||
                cat.content.some(p => p.name.toLowerCase().includes(s))
              );
            }).map((category) => (
              <div key={category.name}>
                <h3 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category.name}
                </h3>
                <div className="space-y-1">
                  {category.content
                    .filter(p => p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) && !p.temporary)
                    .map((product) => {
                      const key = `${category.name}_${product.name}`;
                      const count = rechnung.positionen.get(key) || 0;

                      return (
                        <div
                          key={product.name}
                          className="group flex items-center justify-between rounded-md p-2 hover:bg-accent hover:text-accent-foreground text-sm transition-colors cursor-default"
                        >
                          <div className="font-medium">{product.name}</div>

                          {count > 0 ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => {
                                  if (count === 1) removePosition(key);
                                  else updatePosition(key, count - 1);
                                }}
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <span className="w-4 text-center font-bold text-primary">{count}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updatePosition(key, count + 1)}
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => addPosition(key, 1)}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content: Invoice Preview */}
        <main className="flex-1 overflow-y-auto p-8 flex justify-center bg-gray-50/50">
          <Card className="w-full max-w-4xl h-fit min-h-[800px] flex flex-col shadow-lg border-border/50">
            <CardHeader className="flex flex-row justify-between items-start border-b pb-6 space-y-0">
              <div>
                <CardTitle className="text-2xl font-bold">Rechnung</CardTitle>
                <CardDescription>Entwurf</CardDescription>
              </div>
              <div className="w-72">
                <Label className="text-xs text-muted-foreground">Kunde</Label>
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between mt-1.5">
                      {rechnung.kundenId
                        ? kunden.find((k) => k.id === rechnung.kundenId)?.name
                        : "Kunde auswählen..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0">
                    <Command>
                      <CommandInput placeholder="Kunde suchen..." />
                      <CommandList>
                        <CommandEmpty>Kein Kunde gefunden.</CommandEmpty>
                        <CommandGroup>
                          {kunden?.map((k) => (
                            <CommandItem
                              key={k.id}
                              value={k.name}
                              onSelect={() => {
                                setRechnung(prev => ({ ...prev, kundenId: k.id }));
                                setOpenCombobox(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", rechnung.kundenId === k.id ? "opacity-100" : "opacity-0")} />
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{k.name}</span>
                                <span className="text-xs text-muted-foreground">{k.email}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {rechnung.kundenId && (
                  <div className="mt-2 text-sm text-muted-foreground pl-1">
                    {(() => {
                      const k = kunden.find(x => x.id === rechnung.kundenId);
                      return k ? (
                        <>
                          <div>{k.strasse} {k.hausnummer}</div>
                          <div>{k.plz} {k.ort}</div>
                        </>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 py-6">
              <div className="space-y-6">
                {/* Positions Table */}
                <div className="rounded-md border">
                  <div className="grid grid-cols-[3fr_1fr_1fr_1fr_40px] gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground border-b uppercase tracking-wider">
                    <div>Position</div>
                    <div className="text-center">Menge</div>
                    <div className="text-right">Einzelpreis</div>
                    <div className="text-right">Gesamt</div>
                    <div></div>
                  </div>
                  {rechnung.positionen.size === 0 && (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      Noch keine Positionen hinzugefügt.
                    </div>
                  )}
                  {Array.from(rechnung.positionen.entries()).map(([key, value]) => {
                    const [catName, prodName] = key.split("_");
                    const product = produkte?.list?.find((c) => c.name === catName)?.content.find((p) => p.name === prodName);
                    const pPrice = product?.price || 0;
                    const pSteuer = product?.steuer || 19;

                    const singlePrice = brutto || !oldjson?.mwst ? pPrice : pPrice * (1 + pSteuer / 100);
                    const totalPosPrice = singlePrice * value;

                    return (
                      <div key={key} className="grid grid-cols-[3fr_1fr_1fr_1fr_40px] gap-4 p-3 items-center text-sm border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <div className="font-medium">{prodName}</div>
                        <div
                          className="text-center cursor-pointer hover:underline text-primary"
                          onClick={() => {
                            setTargetEditCount(key);
                            setCount(value);
                            setEditCountOpen(true);
                          }}
                        >
                          {value}
                        </div>
                        <div className="text-right text-muted-foreground">
                          {singlePrice.toFixed(2)} {oldjson?.waehrung || "€"}
                        </div>
                        <div className="text-right font-medium">
                          {totalPosPrice.toFixed(2)} {oldjson?.waehrung || "€"}
                        </div>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removePosition(key)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Info & Comments */}
                <div className="grid grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2">
                    <Label>Interne Notizen / Kommentar</Label>
                    <Textarea
                      placeholder="Wird auf der Rechnung angezeigt..."
                      value={rechnung.comment}
                      onChange={(e) => setRechnung({ ...rechnung, comment: e.target.value })}
                      className="resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t p-6">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="tax-mode"
                    checked={!brutto}
                    onCheckedChange={(c) => setbrutto(!c)}
                  />
                  <Label htmlFor="tax-mode">Preise {brutto ? 'Netto' : 'Brutto'} anzeigen</Label>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm text-muted-foreground">Gesamtsumme ({oldjson?.waehrung || "€"})</div>
                  <div className="text-3xl font-bold tracking-tight text-primary">
                    {calculateTotal().toFixed(2)} {oldjson?.waehrung || "€"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {brutto ? "exkl. MwSt." : "inkl. MwSt."}
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>

      {/* Dialogs */}

      {/* Create Product Dialog */}
      <Dialog open={createProduktOpen} onOpenChange={setCreateProduktOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
            <DialogDescription>
              Erstellen Sie ein einmaliges Produkt für diese Rechnung.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={produktname} onChange={(e) => { setproduktname(e.target.value); seterror(false); }} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Preis (Netto)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => { setprice(e.target.value.replace(',', '.')); seterror(false); }}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tax" className="text-right">Steuer (%)</Label>
              <Input
                id="tax"
                type="number"
                value={createsteuer}
                onChange={(e) => { setCreateSteuer(Number(e.target.value.replace(',', '.'))); seterror(false); }}
                className="col-span-3"
              />
            </div>
            {error && <p className="text-sm text-destructive text-center">Bitte überprüfen Sie Ihre Eingaben.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateProduktOpen(false)}>Abbrechen</Button>
            <Button onClick={handleAddProduct}>Hinzufügen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Count Dialog */}
      <Dialog open={editCountOpen} onOpenChange={setEditCountOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Anzahl ändern</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Neue Anzahl</Label>
            <Input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCountOpen(false)}>Abbrechen</Button>
            <Button onClick={() => { updatePosition(targetEditCount, count); setEditCountOpen(false); }}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

export default RechnungErstellen
