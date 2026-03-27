import urllib.request
import json

headers = {'User-Agent': 'Mozilla/5.0'}
segments = [
    # Athwa Gate Main Road (approx 21.1820, 72.8160 to 21.1730, 72.8230)
    ('72.8160,21.1820', '72.8230,21.1730'),
    # Dumas Road
    ('72.8100,21.1700', '72.8000,21.1600'),
    # Varachha Express Way
    ('72.8410,21.1580', '72.8620,21.1680'),
    # Kapodra Circular Road
    ('72.8540,21.1702', '72.8620,21.1800'),
    # Ring Road Bypass
    ('72.8370,21.1880', '72.8450,21.1950')
]

for start, end in segments:
    url = f"http://router.project-osrm.org/route/v1/driving/{start};{end}?geometries=geojson"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read())
            coords = data['routes'][0]['geometry']['coordinates']
            # OSRM returns [lng, lat], leaflet needs [lat, lng]
            latlngs = [[round(lat, 5), round(lng, 5)] for lng, lat in coords]
            print(f"-----\n{latlngs}")
    except Exception as e:
        print(f"Failed {start} to {end}: {e}")
