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