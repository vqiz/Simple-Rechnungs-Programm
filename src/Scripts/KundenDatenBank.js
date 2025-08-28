import { handleSaveFile } from "./Filehandler";

export const kundeErstellen = async (name,istfirma,street,number,plz,ort,landcode, email,telefon,ansprechpartner, leitwegid) => {
    const json = {
        "name": name,
        "istfirma": istfirma,
        "street": street,
        "number": number,
        "plz": plz,
        "ort": ort,
        "landcode": landcode,
        "email": email,
        "tel": telefon,
        "ansprechpartner": ansprechpartner,
        "leitwegid": leitwegid,
        "rechnungen": {},
    }
    const folderdata = await window.api.listfiles("kunden/");
    let id = generateCode();
    while (folderdata.includes(id + ".person")){
        id = generateCode();
    }
    await handleSaveFile("kunden/" + id + ".person", JSON.stringify(json));
}
export function generateCode() {
  return Math.floor(Math.random() * 1e12) 
    .toString()
    .padStart(12, "0"); 

}