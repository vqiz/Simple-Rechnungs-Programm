import { encrypt, Key } from "./Cryptor";
import { handleLoadFile, handleSaveFile } from "./Filehandler";

export const rebuildKundenDB = async () => {
    try {
        const folderdata = await window.api.listfiles("kunden/");
        const list = [];

        for (const file of folderdata) {
            if (file.endsWith(".person")) {
                try {
                    const content = await handleLoadFile("kunden/" + file);
                    const k = JSON.parse(content);
                    list.push({
                        name: k.name,
                        id: k.id,
                        istfirma: k.istfirma,
                        email: k.email
                    });
                } catch (e) {
                    console.error("Error reading " + file, e);
                }
            }
        }

        const dbContent = { list: list };
        await handleSaveFile("fast_accsess/kunden.db", JSON.stringify(dbContent));
        return list;
    } catch (err) {
        console.error("Failed to rebuild DB", err);
        return [];
    }
}

export const kundeErstellen = async (name, istfirma, street, number, plz, ort, landcode, email, telefon, ansprechpartner, leitwegid) => {
    const folderdata = await window.api.listfiles("kunden/");
    let id = generateCode();
    while (folderdata.includes(id + ".person")) {
        id = generateCode();
    }
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
        "erstellt": new Date().getTime(),
        "rechnungen": [],
        "id": id,
    }

    await handleSaveFile("kunden/" + id + ".person", JSON.stringify(json));
    const readedjson = await handleLoadFile("fast_accsess/kunden.db");
    let data;
    if (readedjson === "{}") {
        data = JSON.parse('{"list": []}');
    } else {
        data = JSON.parse(readedjson);
    }
    let element = { name, id, istfirma, email };
    data.list.push(element);
    await handleSaveFile("fast_accsess/kunden.db", JSON.stringify(data));
    return id;

}
export function generateCode() {
    return Math.floor(Math.random() * 1e6)
        .toString()
        .padStart(12, "0");
}
