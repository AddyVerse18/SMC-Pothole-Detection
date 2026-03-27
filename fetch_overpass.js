import fs from 'fs';

const query = `
[out:json][timeout:25];
area["name"="Surat"]->.searchArea;
(
  way["name"~"Udhna Main Road",i](area.searchArea);
  way["name"~"Dumas Road",i](area.searchArea);
  way["name"~"Varachha Main Road",i](area.searchArea);
  way["name"~"Ring Road",i](area.searchArea);
);
out geom;
`;

async function fetchOverpass() {
    try {
        const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query
        });
        const data = await res.json();
        fs.writeFileSync("./overpass_data.json", JSON.stringify(data, null, 2));
        console.log("Success! Saved to overpass_data.json");
    } catch (e) {
        console.error("Failed:", e.message);
    }
}
fetchOverpass();
