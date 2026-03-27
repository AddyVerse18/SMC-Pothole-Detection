export const SURAT_AREAS = [
  "Adajan", "Katargam", "Varachha", "Udhna", "Piplod",
  "Vesu", "Pal", "Rander", "Amroli", "Dindoli",
  "Bhestan", "Godadara", "Bhatar", "Althan", "Magdalla"
] as const;

export type SuratArea = typeof SURAT_AREAS[number];

export const ROADS = [
  "Ring Road", 
  "Dumas Road", 
  "Udhna Main Road", 
  "Varachha Main Road", 
  "L.P. Savani Road"
];

export const VEHICLES = [
  "GJ05AB1234", "GJ05CD5678", "GJ05EF9012", "GJ05GH3456", "GJ05IJ7890"
];

export const ZONES = ['Athwa', 'Varachha', 'Limbayat', 'Katargam', 'Adajan'] as const;
export type SMCZone = typeof ZONES[number];

export const genId = (counter: number) => {
  const idStr = String(counter).padStart(3, '0');
  return `PHE-2024-${idStr}`;
};

export const pick = <T>(arr: T[] | readonly T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};
