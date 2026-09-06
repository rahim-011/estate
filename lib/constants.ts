import { PropertyTypes, Wilaya } from "@prisma/client";





export interface PriceOptions {
  value: "all" | "0-5000000" | "5000000-10000000" | "10000000-20000000" | "20000000-50000000" | "50000000-max";
  label: string;
}

export interface BedsOptions {
  value: "any" | "1" | "2" | "3" | "4" | "5";
  label: string;
}

export interface BathsOptions {
  value: "any" | "1" | "2" | "3";
  label: string;
}

export interface HomeTypeOptions {
  value: "apartment" | "land" | "singleFamily" | "townHouse" | "all"
  label: string;
}

export interface SortOptions {
  value: "newest" | "price_asc" | "price_desc" | "featured" | "area_desc";
  label: string;
}



export type FilterOptions = {
  wilaya: Wilaya
  sort: SortOptions,
  price: PriceOptions,
  beds : BedsOptions,
  baths: BathsOptions,
  homeType: HomeTypeOptions
}
export type filterKey = keyof FilterOptions;

export type allOptions = FilterOptions[filterKey];

export interface DropDownProps <K extends filterKey =filterKey>{
  filterKey: K,
  options: FilterOptions[K][],
  placeholder:string
}

interface TourTypesOptions{
  label:string,
  value: 'inPerson' | 'videoCall'
}

export const TourTypes:TourTypesOptions[] =[
  {label:'In Person',value:'inPerson'},
  {label:'Video Call',value:'videoCall'}
]
export const TourTypesKeys = ['inPerson','videoCall']


export const propertyTypeOptions: HomeTypeOptions [] = [
  { value: "singleFamily", label: "Single Family" },
  { value: "townHouse", label: "Townhouse" },
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land" },
  {value:"all",label:"All"}
] as const;

export const propertyKeys = ['singleFamily','townHouse','apartment','land','all'];

export const WILAYAS = [
  { value: "adrar", label: "01 - Adrar" },
  { value: "chlef", label: "02 - Chlef" },
  { value: "laghouat", label: "03 - Laghouat" },
  { value: "oum_el_bouaghi", label: "04 - Oum El Bouaghi" },
  { value: "batna", label: "05 - Batna" },
  { value: "bejaia", label: "06 - Béjaïa" },
  { value: "biskra", label: "07 - Biskra" },
  { value: "bechar", label: "08 - Béchar" },
  { value: "blida", label: "09 - Blida" },
  { value: "bouira", label: "10 - Bouira" },
  { value: "tamanrasset", label: "11 - Tamanrasset" },
  { value: "tebessa", label: "12 - Tébessa" },
  { value: "tlemcen", label: "13 - Tlemcen" },
  { value: "tiaret", label: "14 - Tiaret" },
  { value: "tizi_ouzou", label: "15 - Tizi Ouzou" },
  { value: "alger", label: "16 - Alger" },
  { value: "djelfa", label: "17 - Djelfa" },
  { value: "jijel", label: "18 - Jijel" },
  { value: "setif", label: "19 - Sétif" },
  { value: "saida", label: "20 - Saïda" },
  { value: "skikda", label: "21 - Skikda" },
  { value: "sidi_bel_abbes", label: "22 - Sidi Bel Abbès" },
  { value: "annaba", label: "23 - Annaba" },
  { value: "guelma", label: "24 - Guelma" },
  { value: "constantine", label: "25 - Constantine" },
  { value: "medea", label: "26 - Médéa" },
  { value: "mostaganem", label: "27 - Mostaganem" },
  { value: "msila", label: "28 - M'Sila" },
  { value: "mascara", label: "29 - Mascara" },
  { value: "ouargla", label: "30 - Ouargla" },
  { value: "oran", label: "31 - Oran" },
  { value: "el_bayadh", label: "32 - El Bayadh" },
  { value: "illizi", label: "33 - Illizi" },
  { value: "bordj_bou_arreridj", label: "34 - Bordj Bou Arréridj" },
  { value: "boumerdes", label: "35 - Boumerdès" },
  { value: "el_tarf", label: "36 - El Tarf" },
  { value: "tindouf", label: "37 - Tindouf" },
  { value: "tissemsilt", label: "38 - Tissemsilt" },
  { value: "el_oued", label: "39 - El Oued" },
  { value: "khenchela", label: "40 - Khenchela" },
  { value: "souk_ahras", label: "41 - Souk Ahras" },
  { value: "tipaza", label: "42 - Tipaza" },
  { value: "mila", label: "43 - Mila" },
  { value: "ain_defla", label: "44 - Aïn Defla" },
  { value: "naama", label: "45 - Naâma" },
  { value: "ain_temouchent", label: "46 - Aïn Témouchent" },
  { value: "ghardaia", label: "47 - Ghardaïa" },
  { value: "relizane", label: "48 - Relizane" },
  { value: "timimoun", label: "49 - Timimoun" },
  { value: "bordj_badji_mokhtar", label: "50 - Bordj Badji Mokhtar" },
  { value: "ouled_djellal", label: "51 - Ouled Djellal" },
  { value: "beni_abbes", label: "52 - Béni Abbès" },
  { value: "in_salah", label: "53 - In Salah" },
  { value: "in_guezzam", label: "54 - In Guezzam" },
  { value: "touggourt", label: "55 - Touggourt" },
  { value: "djanet", label: "56 - Djanet" },
  { value: "el_mghair", label: "57 - El M'Ghair" },
  { value: "el_meniaa", label: "58 - El Meniaa" },
] as const;

export const WILAYA_KEYS = [
  "adrar", "chlef", "laghouat", "oum_el_bouaghi", "batna", "bejaia", "biskra", "bechar", "blida", "bouira",
  "tamanrasset", "tebessa", "tlemcen", "tiaret", "tizi_ouzou", "alger", "djelfa", "jijel", "setif", "saida",
  "skikda", "sidi_bel_abbes", "annaba", "guelma", "constantine", "medea", "mostaganem", "msila", "mascara", "ouargla",
  "oran", "el_bayadh", "illizi", "bordj_bou_arreridj", "boumerdes", "el_tarf", "tindouf", "tissemsilt", "el_oued", "khenchela",
  "souk_ahras", "tipaza", "mila", "ain_defla", "naama", "ain_temouchent", "ghardaia", "relizane", "timimoun", "bordj_badji_mokhtar",
  "ouled_djellal", "beni_abbes", "in_salah", "in_guezzam", "touggourt", "djanet", "el_mghair", "el_meniaa"
] as const;
export type WilayaKey = typeof WILAYA_KEYS[number];

export const WILAYA_COORDS: Record<WilayaKey, [number, number]> = {
  adrar: [27.8742, -0.2939],
  chlef: [36.1653, 1.3347],
  laghouat: [33.8000, 2.8651],
  oum_el_bouaghi: [35.8754, 7.1135],
  batna: [35.5559, 6.1741],
  bejaia: [36.7511, 5.0567],
  biskra: [34.8500, 5.7333],
  bechar: [31.6167, -2.2167],
  blida: [36.4700, 2.8300],
  bouira: [36.3749, 3.9020],
  tamanrasset: [22.7850, 5.5228],
  tebessa: [35.4042, 8.1242],
  tlemcen: [34.8783, -1.3150],
  tiaret: [35.3710, 1.3170],
  tizi_ouzou: [36.7118, 4.0459],
  alger: [36.7538, 3.0588],
  djelfa: [34.6728, 3.2630],
  jijel: [36.8205, 5.7667],
  setif: [36.1901, 5.4137],
  saida: [34.8303, 0.1517],
  skikda: [36.8792, 6.9042],
  sidi_bel_abbes: [35.1899, -0.6308],
  annaba: [36.9000, 7.7667],
  guelma: [36.4622, 7.4261],
  constantine: [36.3650, 6.6147],
  medea: [36.2642, 2.7539],
  mostaganem: [35.9311, 0.0892],
  msila: [35.7058, 4.5419],
  mascara: [35.3966, 0.1403],
  ouargla: [31.9493, 5.3250],
  oran: [35.6971, -0.6308],
  el_bayadh: [33.6831, 1.0193],
  illizi: [26.4833, 8.4667],
  bordj_bou_arreridj: [36.0732, 4.7611],
  boumerdes: [36.7664, 3.4772],
  el_tarf: [36.7672, 7.8517],
  tindouf: [27.6711, -8.1478],
  tissemsilt: [35.6072, 1.8106],
  el_oued: [33.3683, 6.8674],
  khenchela: [35.4358, 7.1433],
  souk_ahras: [36.2864, 7.9511],
  tipaza: [36.5897, 2.4475],
  mila: [36.4503, 6.2644],
  ain_defla: [36.2641, 1.9679],
  naama: [33.2667, -0.3167],
  ain_temouchent: [35.2981, -1.1403],
  ghardaia: [32.4900, 3.6733],
  relizane: [35.7373, 0.5559],
  timimoun: [29.2639, 0.2310],
  bordj_badji_mokhtar: [21.3283, 0.9228],
  ouled_djellal: [34.4218, 5.0669],
  beni_abbes: [30.1333, -2.1667],
  in_salah: [27.1936, 2.4828],
  in_guezzam: [19.5721, 5.7692],
  touggourt: [33.1053, 6.0581],
  djanet: [24.5539, 9.4842],
  el_mghair: [33.9500, 5.9200],
  el_meniaa: [30.5833, 2.8833]
};

export const famousWilayas: Record<string, string> = {
  alger: '/image/algiers.jpg',    
  batna: '/image/batnaaa.jpg',
  setif: '/image/setif.jpg',
  tlemcen: '/image/tlemcan.jpg',    
  blida: '/image/blida.jpg',
  oran: '/image/oran.jpg',          
  constantine: '/image/constantine.jpg',
};



export const sortOptions: SortOptions[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Low to High" },
  { value: "price_desc", label: "High to Low" },
  { value: "featured", label: "Featured" },
  { value: "area_desc", label: "Largest Area" },
];


export const priceOptions: PriceOptions[] = [
  { label: "Any Price", value: "all" },
  { label: "Under 5,000,000 DZD", value: "0-5000000" },
  { label: "5M - 10M DZD", value: "5000000-10000000" },
  { label: "10M - 20M DZD", value: "10000000-20000000" },
  { label: "20M - 50M DZD", value: "20000000-50000000" },
  { label: "50M+ DZD", value: "50000000-max" },
];

export const bedsOptions: BedsOptions[] = [
  { label: "Any Beds", value: "any" },
  { label: "1+ Bed", value: "1" },
  { label: "2+ Beds", value: "2" },
  { label: "3+ Beds", value: "3" },
  { label: "4+ Beds", value: "4" },
  { label: "5+ Beds", value: "5" },
];
export const bathsOptions: BathsOptions[] = [
  { label: "Any Baths", value: "any" },
  { label: "1+ Bath", value: "1" },
  { label: "2+ Baths", value: "2" },
  { label: "3+ Baths", value: "3" },
];






export type FilterPageProps = {
  searchParams:Promise<{
    wilaya?:Wilaya,
    page?:string,
    baths?: string,
    homeType?: PropertyTypes,
    priceRange?:string,
    beds?:string,
    sort?:'newest' | 'price_asc' | 'price_desc' | 'featured' | 'area_desc'
  }>
}

