import fs from 'fs';

const segments = [
    // Athwa Gate Main Road (approx 21.1820, 72.8160 to 21.1730, 72.8230)
    ['72.8160,21.1820', '72.8230,21.1730'],
    // Dumas Road
    ['72.8100,21.1700', '72.8000,21.1600'],
    // Varachha Express Way
    ['72.8410,21.1580', '72.8620,21.1680'],
    // Kapodra Circular Road
    ['72.8540,21.1702', '72.8620,21.1800'],
    // Ring Road Bypass
    ['72.8370,21.1880', '72.8450,21.1950']
];

async function fetchRoutes() {
    let out = '';
    for (const [start, end] of segments) {
        const url = `http://router.project-osrm.org/route/v1/driving/${start};${end}?geometries=geojson`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data && data.routes && data.routes.length > 0) {
                const coords = data.routes[0].geometry.coordinates;
                const latlngs = coords.map(([lng, lat]) => [Number(lat.toFixed(5)), Number(lng.toFixed(5))]);
                out += `-----\n${JSON.stringify(latlngs)}\n`;
            } else {
                out += `-----\nFailed: ${JSON.stringify(data)}\n`;
            }
        } catch (e) {
            out += `-----\nError: ${e.message}\n`;
        }
    }
    fs.writeFileSync('./routes_output.txt', out);
    console.log("Done computing routes.");
}
fetchRoutes();
