//Later Task add encryption
export const handleLoadFile = async (filePath) => {
  console.log("called handle load File")
  if (filePath) {
    console.log("Entered the filepath block")
    try {
      const content = await window.api.readFile(filePath);
      console.log("Gelesener Inhalt:", content);
      return content;
    } catch (err) {
      console.error("Fehler beim Lesen:", err);
    }
  }
};

export const handleSaveFile = async (filePath, content) => {
  if (filePath && content !== undefined) {
    try {
      await window.api.writeFile(filePath, content);
      console.log("💾 Gespeichert:", filePath);
    } catch (err) {
      console.error("❌ Fehler beim Schreiben:", err);
    }
  }
};
export const getNewRechnungsnummer = async () => {
  const jsonstring = await handleLoadFile("fast_accsess/config.rechnix");
  const date = new Date();
  if (jsonstring === "{}") {
    const newjson = {
      count: 1,
    }
    await handleSaveFile("fast_accsess/config.rechnix", JSON.stringify(newjson))
    return "R" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + "1";
  }
  const json = JSON.parse(jsonstring);
  json.count = json.count + 1;
  const nummer = "R" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + json.count;
  await handleSaveFile("fast_accsess/config.rechnix", JSON.stringify(json))
  return nummer;
}
export const getKunde = async (id) => {
  console.log("kunden/" + id + ".person");
  const jsonstring = await handleLoadFile("kunden/" + id + ".person");
  const json = JSON.parse(jsonstring);
  return json;

}
export const saveKunde = async (json, id) => {
  await handleSaveFile("kunden/" + id + ".person", JSON.stringify(json));
} 
export const saveRechnung = async (json, nummer) => {
  const path = "rechnungen/" + nummer;
  json.positionen = Object.fromEntries(json.positionen);
  await handleLoadFile(path)
  await handleSaveFile(path,JSON.stringify(json));
}