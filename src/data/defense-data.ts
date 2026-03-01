// ── Types ──────────────────────────────────────────────────────────────────
export interface CountryInfo {
  name: string; iso: string; region: string;
  threat: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  partners: number; contracts: number;
}

export interface Product {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  tag: string;
  bgImage: string;
}

// ── Products (carousel) ────────────────────────────────────────────────────
export const PRODUCTS: Product[] = [
  {
    id: 'megiddo',
    eyebrow: 'SEC-01 // The Brain',
    title: 'MEGIDDO',
    subtitle: '  Matrix for Executive Governance in Intelligence, Defense, and Directive Operations\n\nMEGIDDO is a Flagship Strategic Intelligence Platform for Command & Control Systems engineered to power secure command and control environments. It integrates multi-domain data, advanced analytics, and AI-driven modeling into a unified operational interface, enabling real-time situational awareness and executive-level strategic oversight.',
    tag: 'C2',
    bgImage: '/assets/megiddo-bg.png',
  },
  {
    id: 'argos',
    eyebrow: 'SEC-02 // SECRET',
    title: 'ARGOS',
    subtitle: 'Reconnaissance & Geospatial Surveillance System\n\nARGOS is an integrated reconnaissance and geospatial surveillance platform designed to deliver persistent domain awareness across air, land, and maritime environments. Through advanced sensing and secure data transmission, ARGOS provides high-fidelity intelligence streams to strategic command infrastructures.',
    tag: 'ISR',
    bgImage: '/assets/argos-bg.png',
  },
];

// ── Country data ───────────────────────────────────────────────────────────
export const COUNTRY_DATA: Record<string, CountryInfo> = {
  'United States of America': { name: 'United States', iso: 'USA', region: 'NORTHAM', threat: 'LOW', partners: 47, contracts: 132 },
  'United Kingdom': { name: 'United Kingdom', iso: 'GBR', region: 'EUROPE', threat: 'LOW', partners: 18, contracts: 44 },
  'Germany': { name: 'Germany', iso: 'DEU', region: 'EUROPE', threat: 'LOW', partners: 12, contracts: 28 },
  'France': { name: 'France', iso: 'FRA', region: 'EUROPE', threat: 'LOW', partners: 9, contracts: 21 },
  'Russia': { name: 'Russia', iso: 'RUS', region: 'EURASIA', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'China': { name: 'China', iso: 'CHN', region: 'INDOPAC', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'Iran': { name: 'Iran', iso: 'IRN', region: 'MIDEAST', threat: 'HIGH', partners: 0, contracts: 0 },
  'North Korea': { name: 'North Korea', iso: 'PRK', region: 'INDOPAC', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'Israel': { name: 'Israel', iso: 'ISR', region: 'MIDEAST', threat: 'LOW', partners: 14, contracts: 36 },
  'Japan': { name: 'Japan', iso: 'JPN', region: 'INDOPAC', threat: 'LOW', partners: 11, contracts: 24 },
  'South Korea': { name: 'South Korea', iso: 'KOR', region: 'INDOPAC', threat: 'LOW', partners: 8, contracts: 19 },
  'Australia': { name: 'Australia', iso: 'AUS', region: 'INDOPAC', threat: 'LOW', partners: 13, contracts: 31 },
  'India': { name: 'India', iso: 'IND', region: 'INDOPAC', threat: 'MEDIUM', partners: 5, contracts: 11 },
  'Pakistan': { name: 'Pakistan', iso: 'PAK', region: 'CENTASIA', threat: 'HIGH', partners: 1, contracts: 2 },
  'Saudi Arabia': { name: 'Saudi Arabia', iso: 'SAU', region: 'MIDEAST', threat: 'MEDIUM', partners: 6, contracts: 14 },
  'Turkey': { name: 'Turkey', iso: 'TUR', region: 'EUROPE', threat: 'MEDIUM', partners: 3, contracts: 7 },
  'Ukraine': { name: 'Ukraine', iso: 'UKR', region: 'EUROPE', threat: 'HIGH', partners: 4, contracts: 9 },
  'Poland': { name: 'Poland', iso: 'POL', region: 'EUROPE', threat: 'LOW', partners: 7, contracts: 16 },
  'Canada': { name: 'Canada', iso: 'CAN', region: 'NORTHAM', threat: 'LOW', partners: 15, contracts: 38 },
  'Brazil': { name: 'Brazil', iso: 'BRA', region: 'SOUTHAM', threat: 'LOW', partners: 3, contracts: 6 },
  'Italy': { name: 'Italy', iso: 'ITA', region: 'EUROPE', threat: 'LOW', partners: 7, contracts: 18 },
  'Spain': { name: 'Spain', iso: 'ESP', region: 'EUROPE', threat: 'LOW', partners: 6, contracts: 15 },
  'Norway': { name: 'Norway', iso: 'NOR', region: 'EUROPE', threat: 'LOW', partners: 4, contracts: 9 },
  'Sweden': { name: 'Sweden', iso: 'SWE', region: 'EUROPE', threat: 'LOW', partners: 5, contracts: 11 },
  'Denmark': { name: 'Denmark', iso: 'DNK', region: 'EUROPE', threat: 'LOW', partners: 4, contracts: 8 },
  'Belgium': { name: 'Belgium', iso: 'BEL', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 7 },
  'Netherlands': { name: 'Netherlands', iso: 'NLD', region: 'EUROPE', threat: 'LOW', partners: 5, contracts: 12 },
  'Switzerland': { name: 'Switzerland', iso: 'CHE', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 4 },
  'Austria': { name: 'Austria', iso: 'AUT', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 4 },
  'Greece': { name: 'Greece', iso: 'GRC', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 7 },
  'Portugal': { name: 'Portugal', iso: 'PRT', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 5 },
  'South Africa': { name: 'South Africa', iso: 'ZAF', region: 'AFRICA', threat: 'LOW', partners: 2, contracts: 4 },
  'Egypt': { name: 'Egypt', iso: 'EGY', region: 'MIDEAST', threat: 'MEDIUM', partners: 3, contracts: 7 },
  'Nigeria': { name: 'Nigeria', iso: 'NGA', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Argentina': { name: 'Argentina', iso: 'ARG', region: 'SOUTHAM', threat: 'LOW', partners: 2, contracts: 3 },
  'Mexico': { name: 'Mexico', iso: 'MEX', region: 'NORTHAM', threat: 'MEDIUM', partners: 3, contracts: 6 },
  'Indonesia': { name: 'Indonesia', iso: 'IDN', region: 'INDOPAC', threat: 'LOW', partners: 3, contracts: 6 },
  'Malaysia': { name: 'Malaysia', iso: 'MYS', region: 'INDOPAC', threat: 'LOW', partners: 2, contracts: 4 },
  'Singapore': { name: 'Singapore', iso: 'SGP', region: 'INDOPAC', threat: 'LOW', partners: 4, contracts: 9 },
  'Thailand': { name: 'Thailand', iso: 'THA', region: 'INDOPAC', threat: 'LOW', partners: 2, contracts: 5 },
  'Philippines': { name: 'Philippines', iso: 'PHL', region: 'INDOPAC', threat: 'LOW', partners: 3, contracts: 6 },
  'Vietnam': { name: 'Vietnam', iso: 'VNM', region: 'INDOPAC', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'United Arab Emirates': { name: 'UAE', iso: 'ARE', region: 'MIDEAST', threat: 'LOW', partners: 5, contracts: 11 },
  'Qatar': { name: 'Qatar', iso: 'QAT', region: 'MIDEAST', threat: 'LOW', partners: 3, contracts: 6 },
  'Iraq': { name: 'Iraq', iso: 'IRQ', region: 'MIDEAST', threat: 'HIGH', partners: 0, contracts: 1 },
  'Syria': { name: 'Syria', iso: 'SYR', region: 'MIDEAST', threat: 'HIGH', partners: 0, contracts: 0 },
  'Kazakhstan': { name: 'Kazakhstan', iso: 'KAZ', region: 'CENTASIA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Mongolia': { name: 'Mongolia', iso: 'MNG', region: 'INDOPAC', threat: 'LOW', partners: 1, contracts: 1 },
  'Ethiopia': { name: 'Ethiopia', iso: 'ETH', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Kenya': { name: 'Kenya', iso: 'KEN', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Ghana': { name: 'Ghana', iso: 'GHA', region: 'AFRICA', threat: 'LOW', partners: 1, contracts: 2 },
  'Tanzania': { name: 'Tanzania', iso: 'TZA', region: 'AFRICA', threat: 'LOW', partners: 1, contracts: 1 },
  'Morocco': { name: 'Morocco', iso: 'MAR', region: 'AFRICA', threat: 'LOW', partners: 2, contracts: 3 },
  'Algeria': { name: 'Algeria', iso: 'DZA', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'Angola': { name: 'Angola', iso: 'AGO', region: 'AFRICA', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'DR Congo': { name: 'DR Congo', iso: 'COD', region: 'AFRICA', threat: 'HIGH', partners: 0, contracts: 0 },
  'Myanmar': { name: 'Myanmar', iso: 'MMR', region: 'INDOPAC', threat: 'HIGH', partners: 0, contracts: 0 },
  'Cambodia': { name: 'Cambodia', iso: 'KHM', region: 'INDOPAC', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'Laos': { name: 'Laos', iso: 'LAO', region: 'INDOPAC', threat: 'MEDIUM', partners: 0, contracts: 0 },
  'Bangladesh': { name: 'Bangladesh', iso: 'BGD', region: 'INDOPAC', threat: 'MEDIUM', partners: 1, contracts: 1 },
  'Sri Lanka': { name: 'Sri Lanka', iso: 'LKA', region: 'INDOPAC', threat: 'LOW', partners: 1, contracts: 1 },
  'Nepal': { name: 'Nepal', iso: 'NPL', region: 'INDOPAC', threat: 'LOW', partners: 0, contracts: 0 },
  'New Zealand': { name: 'New Zealand', iso: 'NZL', region: 'INDOPAC', threat: 'LOW', partners: 4, contracts: 8 },
  'Finland': { name: 'Finland', iso: 'FIN', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 6 },
  'Czech Republic': { name: 'Czech Republic', iso: 'CZE', region: 'EUROPE', threat: 'LOW', partners: 3, contracts: 5 },
  'Romania': { name: 'Romania', iso: 'ROU', region: 'EUROPE', threat: 'LOW', partners: 2, contracts: 4 },
  'Hungary': { name: 'Hungary', iso: 'HUN', region: 'EUROPE', threat: 'MEDIUM', partners: 1, contracts: 2 },
  'Chile': { name: 'Chile', iso: 'CHL', region: 'SOUTHAM', threat: 'LOW', partners: 2, contracts: 3 },
  'Colombia': { name: 'Colombia', iso: 'COL', region: 'SOUTHAM', threat: 'MEDIUM', partners: 2, contracts: 3 },
  'Peru': { name: 'Peru', iso: 'PER', region: 'SOUTHAM', threat: 'LOW', partners: 1, contracts: 2 },
  'Venezuela': { name: 'Venezuela', iso: 'VEN', region: 'SOUTHAM', threat: 'HIGH', partners: 0, contracts: 0 },
  'Jordan': { name: 'Jordan', iso: 'JOR', region: 'MIDEAST', threat: 'LOW', partners: 3, contracts: 6 },
  'Kuwait': { name: 'Kuwait', iso: 'KWT', region: 'MIDEAST', threat: 'LOW', partners: 2, contracts: 4 },
  'Oman': { name: 'Oman', iso: 'OMN', region: 'MIDEAST', threat: 'LOW', partners: 2, contracts: 3 },
  'Yemen': { name: 'Yemen', iso: 'YEM', region: 'MIDEAST', threat: 'CRITICAL', partners: 0, contracts: 0 },
  'Libya': { name: 'Libya', iso: 'LBY', region: 'AFRICA', threat: 'HIGH', partners: 0, contracts: 0 },
  'Sudan': { name: 'Sudan', iso: 'SDN', region: 'AFRICA', threat: 'HIGH', partners: 0, contracts: 0 },
};

export const THREAT_COLORS: Record<string, string> = {
  LOW: '#00c853', MEDIUM: '#f5a623', HIGH: '#ff6b35', CRITICAL: '#E31B54',
};

// ── Capital city data ──────────────────────────────────────────────────────
export interface Capital {
  name: string; country: string; lon: number; lat: number;
  leader: string; title: string; gov: string; iso: string;
  countryMapName?: string;
}

export const CAPITALS: Capital[] = [
  { name: 'Washington D.C.', country: 'United States', lon: -77.04, lat: 38.91, leader: 'Donald Trump', title: 'President', gov: 'Federal Republic', iso: 'USA', countryMapName: 'United States of America' },
  { name: 'Ottawa', country: 'Canada', lon: -75.70, lat: 45.42, leader: 'Mark Carney', title: 'Prime Minister', gov: 'Federal Parliamentary Monarchy', iso: 'CAN', countryMapName: 'Canada' },
  { name: 'Mexico City', country: 'Mexico', lon: -99.13, lat: 19.43, leader: 'Claudia Sheinbaum', title: 'President', gov: 'Federal Presidential Republic', iso: 'MEX', countryMapName: 'Mexico' },
  { name: 'Havana', country: 'Cuba', lon: -82.38, lat: 23.13, leader: 'Miguel Díaz-Canel', title: 'President', gov: 'Unitary One-Party State', iso: 'CUB' },
  { name: 'Guatemala City', country: 'Guatemala', lon: -90.52, lat: 14.64, leader: 'Bernardo Arévalo', title: 'President', gov: 'Presidential Republic', iso: 'GTM' },
  { name: 'San José', country: 'Costa Rica', lon: -84.09, lat: 9.93, leader: 'Rodrigo Chaves', title: 'President', gov: 'Presidential Republic', iso: 'CRI' },
  { name: 'Panama City', country: 'Panama', lon: -79.52, lat: 8.99, leader: 'José Raúl Mulino', title: 'President', gov: 'Presidential Republic', iso: 'PAN' },
  { name: 'Santo Domingo', country: 'Dominican Republic', lon: -69.90, lat: 18.48, leader: 'Luis Abinader', title: 'President', gov: 'Presidential Republic', iso: 'DOM' },
  { name: 'Brasilia', country: 'Brazil', lon: -47.93, lat: -15.78, leader: 'Luiz Inácio Lula da Silva', title: 'President', gov: 'Federal Presidential Republic', iso: 'BRA', countryMapName: 'Brazil' },
  { name: 'Buenos Aires', country: 'Argentina', lon: -58.38, lat: -34.61, leader: 'Javier Milei', title: 'President', gov: 'Federal Presidential Republic', iso: 'ARG', countryMapName: 'Argentina' },
  { name: 'Santiago', country: 'Chile', lon: -70.67, lat: -33.45, leader: 'Gabriel Boric', title: 'President', gov: 'Presidential Republic', iso: 'CHL', countryMapName: 'Chile' },
  { name: 'Bogotá', country: 'Colombia', lon: -74.07, lat: 4.71, leader: 'Gustavo Petro', title: 'President', gov: 'Presidential Republic', iso: 'COL', countryMapName: 'Colombia' },
  { name: 'Lima', country: 'Peru', lon: -77.04, lat: -12.05, leader: 'Dina Boluarte', title: 'President', gov: 'Presidential Republic', iso: 'PER', countryMapName: 'Peru' },
  { name: 'Caracas', country: 'Venezuela', lon: -66.90, lat: 10.49, leader: 'Nicolás Maduro', title: 'President', gov: 'Presidential Republic', iso: 'VEN', countryMapName: 'Venezuela' },
  { name: 'Quito', country: 'Ecuador', lon: -78.52, lat: -0.23, leader: 'Daniel Noboa', title: 'President', gov: 'Presidential Republic', iso: 'ECU' },
  { name: 'La Paz', country: 'Bolivia', lon: -68.12, lat: -16.50, leader: 'Luis Arce', title: 'President', gov: 'Presidential Republic', iso: 'BOL' },
  { name: 'London', country: 'United Kingdom', lon: -0.12, lat: 51.51, leader: 'Keir Starmer', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'GBR', countryMapName: 'United Kingdom' },
  { name: 'Paris', country: 'France', lon: 2.35, lat: 48.85, leader: 'Emmanuel Macron', title: 'President', gov: 'Semi-Presidential Republic', iso: 'FRA', countryMapName: 'France' },
  { name: 'Berlin', country: 'Germany', lon: 13.38, lat: 52.52, leader: 'Friedrich Merz', title: 'Chancellor', gov: 'Federal Republic', iso: 'DEU', countryMapName: 'Germany' },
  { name: 'Rome', country: 'Italy', lon: 12.50, lat: 41.90, leader: 'Giorgia Meloni', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'ITA', countryMapName: 'Italy' },
  { name: 'Madrid', country: 'Spain', lon: -3.70, lat: 40.42, leader: 'Pedro Sánchez', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'ESP', countryMapName: 'Spain' },
  { name: 'Amsterdam', country: 'Netherlands', lon: 4.90, lat: 52.37, leader: 'Dick Schoof', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'NLD', countryMapName: 'Netherlands' },
  { name: 'Brussels', country: 'Belgium', lon: 4.35, lat: 50.85, leader: 'Alexander De Croo', title: 'Prime Minister', gov: 'Federal Constitutional Monarchy', iso: 'BEL', countryMapName: 'Belgium' },
  { name: 'Bern', country: 'Switzerland', lon: 7.45, lat: 46.95, leader: 'Karin Keller-Sutter', title: 'President', gov: 'Federal Directorial Republic', iso: 'CHE', countryMapName: 'Switzerland' },
  { name: 'Vienna', country: 'Austria', lon: 16.37, lat: 48.21, leader: 'Herbert Kickl', title: 'Chancellor', gov: 'Federal Parliamentary Republic', iso: 'AUT', countryMapName: 'Austria' },
  { name: 'Stockholm', country: 'Sweden', lon: 18.07, lat: 59.33, leader: 'Ulf Kristersson', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'SWE', countryMapName: 'Sweden' },
  { name: 'Oslo', country: 'Norway', lon: 10.75, lat: 59.91, leader: 'Jonas Gahr Støre', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'NOR', countryMapName: 'Norway' },
  { name: 'Copenhagen', country: 'Denmark', lon: 12.57, lat: 55.68, leader: 'Mette Frederiksen', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'DNK', countryMapName: 'Denmark' },
  { name: 'Helsinki', country: 'Finland', lon: 25.00, lat: 60.17, leader: 'Alexander Stubb', title: 'President', gov: 'Semi-Presidential Republic', iso: 'FIN', countryMapName: 'Finland' },
  { name: 'Athens', country: 'Greece', lon: 23.73, lat: 37.98, leader: 'Kyriakos Mitsotakis', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'GRC', countryMapName: 'Greece' },
  { name: 'Lisbon', country: 'Portugal', lon: -9.14, lat: 38.72, leader: 'Luís Montenegro', title: 'Prime Minister', gov: 'Semi-Presidential Republic', iso: 'PRT', countryMapName: 'Portugal' },
  { name: 'Warsaw', country: 'Poland', lon: 21.01, lat: 52.23, leader: 'Donald Tusk', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'POL', countryMapName: 'Poland' },
  { name: 'Prague', country: 'Czech Republic', lon: 14.42, lat: 50.09, leader: 'Petr Pavel', title: 'President', gov: 'Parliamentary Republic', iso: 'CZE', countryMapName: 'Czech Republic' },
  { name: 'Budapest', country: 'Hungary', lon: 19.04, lat: 47.50, leader: 'Viktor Orbán', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'HUN', countryMapName: 'Hungary' },
  { name: 'Bucharest', country: 'Romania', lon: 26.10, lat: 44.44, leader: 'Călin Georgescu', title: 'President', gov: 'Semi-Presidential Republic', iso: 'ROU', countryMapName: 'Romania' },
  { name: 'Kyiv', country: 'Ukraine', lon: 30.52, lat: 50.45, leader: 'Volodymyr Zelensky', title: 'President', gov: 'Semi-Presidential Republic', iso: 'UKR', countryMapName: 'Ukraine' },
  { name: 'Ankara', country: 'Turkey', lon: 32.86, lat: 39.93, leader: 'Recep Tayyip Erdoğan', title: 'President', gov: 'Presidential Republic', iso: 'TUR', countryMapName: 'Turkey' },
  { name: 'Moscow', country: 'Russia', lon: 37.62, lat: 55.75, leader: 'Vladimir Putin', title: 'President', gov: 'Federal Semi-Presidential Republic', iso: 'RUS', countryMapName: 'Russia' },
  { name: 'Astana', country: 'Kazakhstan', lon: 71.45, lat: 51.18, leader: 'Kassym-Jomart Tokayev', title: 'President', gov: 'Presidential Republic', iso: 'KAZ', countryMapName: 'Kazakhstan' },
  { name: 'Tbilisi', country: 'Georgia', lon: 44.83, lat: 41.69, leader: 'Mikheil Kavelashvili', title: 'President', gov: 'Parliamentary Republic', iso: 'GEO' },
  { name: 'Yerevan', country: 'Armenia', lon: 44.51, lat: 40.18, leader: 'Vahagn Khachaturyan', title: 'President', gov: 'Parliamentary Republic', iso: 'ARM' },
  { name: 'Baku', country: 'Azerbaijan', lon: 49.87, lat: 40.41, leader: 'Ilham Aliyev', title: 'President', gov: 'Presidential Republic', iso: 'AZE' },
  { name: 'Tashkent', country: 'Uzbekistan', lon: 69.27, lat: 41.30, leader: 'Shavkat Mirziyoyev', title: 'President', gov: 'Presidential Republic', iso: 'UZB' },
  { name: 'Bishkek', country: 'Kyrgyzstan', lon: 74.60, lat: 42.87, leader: 'Sadyr Japarov', title: 'President', gov: 'Presidential Republic', iso: 'KGZ' },
  { name: 'Dushanbe', country: 'Tajikistan', lon: 68.78, lat: 38.56, leader: 'Emomali Rahmon', title: 'President', gov: 'Presidential Republic', iso: 'TJK' },
  { name: 'Ashgabat', country: 'Turkmenistan', lon: 58.38, lat: 37.95, leader: 'Serdar Berdimuhamedow', title: 'President', gov: 'Presidential Republic', iso: 'TKM' },
  { name: 'Ulaanbaatar', country: 'Mongolia', lon: 106.91, lat: 47.89, leader: 'Luvsannamsrain Oyun-Erdene', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'MNG', countryMapName: 'Mongolia' },
  { name: 'Beijing', country: 'China', lon: 116.39, lat: 39.91, leader: 'Xi Jinping', title: 'General Secretary', gov: 'Unitary One-Party State', iso: 'CHN', countryMapName: 'China' },
  { name: 'Tehran', country: 'Iran', lon: 51.42, lat: 35.69, leader: 'Masoud Pezeshkian', title: 'President', gov: 'Theocratic Republic', iso: 'IRN', countryMapName: 'Iran' },
  { name: 'Riyadh', country: 'Saudi Arabia', lon: 46.72, lat: 24.69, leader: 'Mohammed bin Salman', title: 'Prime Minister', gov: 'Absolute Monarchy', iso: 'SAU', countryMapName: 'Saudi Arabia' },
  { name: 'Abu Dhabi', country: 'UAE', lon: 54.37, lat: 24.45, leader: 'Mohamed bin Zayed', title: 'President', gov: 'Federal Monarchy', iso: 'ARE', countryMapName: 'United Arab Emirates' },
  { name: 'Doha', country: 'Qatar', lon: 51.53, lat: 25.29, leader: 'Tamim bin Hamad Al Thani', title: 'Emir', gov: 'Constitutional Monarchy', iso: 'QAT', countryMapName: 'Qatar' },
  { name: 'Kuwait City', country: 'Kuwait', lon: 47.98, lat: 29.37, leader: 'Mishal Al-Ahmad Al-Sabah', title: 'Emir', gov: 'Constitutional Monarchy', iso: 'KWT', countryMapName: 'Kuwait' },
  { name: 'Muscat', country: 'Oman', lon: 58.59, lat: 23.61, leader: 'Haitham bin Tariq', title: 'Sultan', gov: 'Absolute Monarchy', iso: 'OMN', countryMapName: 'Oman' },
  { name: 'Amman', country: 'Jordan', lon: 35.93, lat: 31.96, leader: 'Abdullah II', title: 'King', gov: 'Constitutional Monarchy', iso: 'JOR', countryMapName: 'Jordan' },
  { name: 'Tel Aviv', country: 'Israel', lon: 34.78, lat: 32.08, leader: 'Benjamin Netanyahu', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'ISR', countryMapName: 'Israel' },
  { name: 'Baghdad', country: 'Iraq', lon: 44.36, lat: 33.34, leader: 'Mohammed Shia Al-Sudani', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'IRQ', countryMapName: 'Iraq' },
  { name: 'Damascus', country: 'Syria', lon: 36.29, lat: 33.51, leader: 'Ahmad al-Sharaa', title: 'President', gov: 'Transitional Government', iso: 'SYR', countryMapName: 'Syria' },
  { name: 'Beirut', country: 'Lebanon', lon: 35.50, lat: 33.89, leader: 'Joseph Aoun', title: 'President', gov: 'Parliamentary Republic', iso: 'LBN' },
  { name: "Sana'a", country: 'Yemen', lon: 44.21, lat: 15.35, leader: 'Rashad al-Alimi', title: 'President', gov: 'Transitional Government', iso: 'YEM', countryMapName: 'Yemen' },
  { name: 'New Delhi', country: 'India', lon: 77.21, lat: 28.61, leader: 'Narendra Modi', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'IND', countryMapName: 'India' },
  { name: 'Islamabad', country: 'Pakistan', lon: 73.04, lat: 33.72, leader: 'Shehbaz Sharif', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'PAK', countryMapName: 'Pakistan' },
  { name: 'Dhaka', country: 'Bangladesh', lon: 90.41, lat: 23.72, leader: 'Muhammad Yunus', title: 'Chief Adviser', gov: 'Parliamentary Republic', iso: 'BGD', countryMapName: 'Bangladesh' },
  { name: 'Colombo', country: 'Sri Lanka', lon: 79.86, lat: 6.93, leader: 'Anura Kumara Dissanayake', title: 'President', gov: 'Presidential Republic', iso: 'LKA', countryMapName: 'Sri Lanka' },
  { name: 'Kathmandu', country: 'Nepal', lon: 85.32, lat: 27.72, leader: 'KP Sharma Oli', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'NPL', countryMapName: 'Nepal' },
  { name: 'Kabul', country: 'Afghanistan', lon: 69.18, lat: 34.53, leader: 'Hibatullah Akhundzada', title: 'Supreme Leader', gov: 'Theocratic Emirate', iso: 'AFG' },
  { name: 'Tokyo', country: 'Japan', lon: 139.69, lat: 35.69, leader: 'Sanae Takaichi', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'JPN', countryMapName: 'Japan' },
  { name: 'Seoul', country: 'South Korea', lon: 126.98, lat: 37.57, leader: 'Lee Jae-myung', title: 'President', gov: 'Unitary Presidential Republic', iso: 'KOR', countryMapName: 'South Korea' },
  { name: 'Pyongyang', country: 'North Korea', lon: 125.73, lat: 39.02, leader: 'Kim Jong-un', title: 'Supreme Leader', gov: 'Unitary One-Party State', iso: 'PRK', countryMapName: 'North Korea' },
  { name: 'Taipei', country: 'Taiwan', lon: 121.56, lat: 25.04, leader: 'Lai Ching-te', title: 'President', gov: 'Semi-Presidential Republic', iso: 'TWN' },
  { name: 'Manila', country: 'Philippines', lon: 120.98, lat: 14.60, leader: 'Ferdinand Marcos Jr.', title: 'President', gov: 'Presidential Republic', iso: 'PHL', countryMapName: 'Philippines' },
  { name: 'Jakarta', country: 'Indonesia', lon: 106.82, lat: -6.17, leader: 'Prabowo Subianto', title: 'President', gov: 'Presidential Republic', iso: 'IDN', countryMapName: 'Indonesia' },
  { name: 'Kuala Lumpur', country: 'Malaysia', lon: 101.69, lat: 3.14, leader: 'Anwar Ibrahim', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'MYS', countryMapName: 'Malaysia' },
  { name: 'Singapore', country: 'Singapore', lon: 103.82, lat: 1.35, leader: 'Lawrence Wong', title: 'Prime Minister', gov: 'Parliamentary Republic', iso: 'SGP', countryMapName: 'Singapore' },
  { name: 'Bangkok', country: 'Thailand', lon: 100.50, lat: 13.75, leader: 'Paetongtarn Shinawatra', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'THA', countryMapName: 'Thailand' },
  { name: 'Hanoi', country: 'Vietnam', lon: 105.85, lat: 21.03, leader: 'Tô Lâm', title: 'General Secretary', gov: 'Unitary One-Party State', iso: 'VNM', countryMapName: 'Vietnam' },
  { name: 'Naypyidaw', country: 'Myanmar', lon: 96.13, lat: 19.75, leader: 'Min Aung Hlaing', title: 'Prime Minister', gov: 'Military Junta', iso: 'MMR', countryMapName: 'Myanmar' },
  { name: 'Phnom Penh', country: 'Cambodia', lon: 104.92, lat: 11.56, leader: 'Hun Manet', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'KHM', countryMapName: 'Cambodia' },
  { name: 'Vientiane', country: 'Laos', lon: 102.60, lat: 17.97, leader: 'Sonexay Siphandon', title: 'Prime Minister', gov: 'Unitary One-Party State', iso: 'LAO', countryMapName: 'Laos' },
  { name: 'Bandar Seri Begawan', country: 'Brunei', lon: 114.94, lat: 4.94, leader: 'Hassanal Bolkiah', title: 'Sultan', gov: 'Absolute Monarchy', iso: 'BRN' },
  { name: 'Dili', country: 'Timor-Leste', lon: 125.58, lat: -8.56, leader: 'Kay Rala Xanana Gusmão', title: 'Prime Minister', gov: 'Semi-Presidential Republic', iso: 'TLS' },
  { name: 'Canberra', country: 'Australia', lon: 149.13, lat: -35.28, leader: 'Anthony Albanese', title: 'Prime Minister', gov: 'Federal Parliamentary Monarchy', iso: 'AUS', countryMapName: 'Australia' },
  { name: 'Wellington', country: 'New Zealand', lon: 174.78, lat: -41.29, leader: 'Christopher Luxon', title: 'Prime Minister', gov: 'Parliamentary Monarchy', iso: 'NZL', countryMapName: 'New Zealand' },
  { name: 'Port Moresby', country: 'Papua New Guinea', lon: 147.19, lat: -9.44, leader: 'James Marape', title: 'Prime Minister', gov: 'Parliamentary Monarchy', iso: 'PNG' },
  { name: 'Pretoria', country: 'South Africa', lon: 28.19, lat: -25.75, leader: 'Cyril Ramaphosa', title: 'President', gov: 'Constitutional Republic', iso: 'ZAF', countryMapName: 'South Africa' },
  { name: 'Cairo', country: 'Egypt', lon: 31.24, lat: 30.04, leader: 'Abdel Fattah el-Sisi', title: 'President', gov: 'Presidential Republic', iso: 'EGY', countryMapName: 'Egypt' },
  { name: 'Abuja', country: 'Nigeria', lon: 7.49, lat: 9.06, leader: 'Bola Tinubu', title: 'President', gov: 'Federal Presidential Republic', iso: 'NGA', countryMapName: 'Nigeria' },
  { name: 'Addis Ababa', country: 'Ethiopia', lon: 38.74, lat: 9.03, leader: 'Abiy Ahmed', title: 'Prime Minister', gov: 'Federal Parliamentary Republic', iso: 'ETH', countryMapName: 'Ethiopia' },
  { name: 'Nairobi', country: 'Kenya', lon: 36.82, lat: -1.29, leader: 'William Ruto', title: 'President', gov: 'Presidential Republic', iso: 'KEN', countryMapName: 'Kenya' },
  { name: 'Accra', country: 'Ghana', lon: -0.19, lat: 5.56, leader: 'John Mahama', title: 'President', gov: 'Presidential Republic', iso: 'GHA', countryMapName: 'Ghana' },
  { name: 'Dar es Salaam', country: 'Tanzania', lon: 39.29, lat: -6.79, leader: 'Samia Suluhu Hassan', title: 'President', gov: 'Presidential Republic', iso: 'TZA', countryMapName: 'Tanzania' },
  { name: 'Rabat', country: 'Morocco', lon: -6.85, lat: 34.01, leader: 'Aziz Akhannouch', title: 'Prime Minister', gov: 'Constitutional Monarchy', iso: 'MAR', countryMapName: 'Morocco' },
  { name: 'Algiers', country: 'Algeria', lon: 3.06, lat: 36.74, leader: 'Abdelmadjid Tebboune', title: 'President', gov: 'Presidential Republic', iso: 'DZA', countryMapName: 'Algeria' },
  { name: 'Luanda', country: 'Angola', lon: 13.23, lat: -8.84, leader: 'João Lourenço', title: 'President', gov: 'Presidential Republic', iso: 'AGO', countryMapName: 'Angola' },
  { name: 'Kinshasa', country: 'DR Congo', lon: 15.32, lat: -4.32, leader: 'Félix Tshisekedi', title: 'President', gov: 'Presidential Republic', iso: 'COD', countryMapName: 'DR Congo' },
  { name: 'Khartoum', country: 'Sudan', lon: 32.53, lat: 15.55, leader: 'Abdel Fattah al-Burhan', title: 'Chairman', gov: 'Military Council', iso: 'SDN', countryMapName: 'Sudan' },
  { name: 'Tripoli', country: 'Libya', lon: 13.19, lat: 32.90, leader: 'Abdul Hamid Dbeibeh', title: 'Prime Minister', gov: 'Transitional Government', iso: 'LBY', countryMapName: 'Libya' },
  { name: 'Dakar', country: 'Senegal', lon: -17.45, lat: 14.73, leader: 'Bassirou Diomaye Faye', title: 'President', gov: 'Presidential Republic', iso: 'SEN' },
  { name: 'Kampala', country: 'Uganda', lon: 32.58, lat: 0.32, leader: 'Yoweri Museveni', title: 'President', gov: 'Presidential Republic', iso: 'UGA' },
  { name: 'Harare', country: 'Zimbabwe', lon: 31.05, lat: -17.83, leader: 'Emmerson Mnangagwa', title: 'President', gov: 'Presidential Republic', iso: 'ZWE' },
  { name: 'Tunis', country: 'Tunisia', lon: 10.18, lat: 36.82, leader: 'Kais Saied', title: 'President', gov: 'Presidential Republic', iso: 'TUN' },
  { name: 'Mogadishu', country: 'Somalia', lon: 45.34, lat: 2.05, leader: 'Hassan Sheikh Mohamud', title: 'President', gov: 'Federal Parliamentary Republic', iso: 'SOM' },
  { name: "N'Djamena", country: 'Chad', lon: 15.04, lat: 12.11, leader: 'Mahamat Déby', title: 'President', gov: 'Presidential Republic', iso: 'TCD' },
  { name: 'Bamako', country: 'Mali', lon: -8.00, lat: 12.65, leader: 'Assimi Goïta', title: 'President', gov: 'Military Junta', iso: 'MLI' },
  { name: 'Maputo', country: 'Mozambique', lon: 32.59, lat: -25.97, leader: 'Daniel Chapo', title: 'President', gov: 'Presidential Republic', iso: 'MOZ' },
  { name: 'Lusaka', country: 'Zambia', lon: 28.28, lat: -15.42, leader: 'Hakainde Hichilema', title: 'President', gov: 'Presidential Republic', iso: 'ZMB' },
];

// ISS Tooltip data
export const ISS_INFO = {
  fullName: 'International Space Station',
  altitude: '408 km',
  speed: '27,600 km/h',
  countries: ['United States', 'Russia', 'Japan', 'Canada', 'Belgium', 'Denmark', 'France', 'Germany', 'Italy', 'Netherlands', 'Norway', 'Spain', 'Sweden', 'Switzerland', 'United Kingdom'],
  launched: '1998',
  crewCapacity: '7',
};

// ── Philippine Satellites ──────────────────────────────────────────────────
export interface PhSatellite {
  id: string;
  name: string;
  fullName: string;
  altitude: string;
  speed: string;
  inclinationDeg: number;
  periodMs: number;
  launched: string;
  status: string;
  operator: string;
  color: string;
  notes: string;
}

export const PH_SATELLITES: PhSatellite[] = [
  {
    id: 'diwata2',
    name: 'DIWATA-2',
    fullName: 'Diwata-2 (PHL-Microsat-2)',
    altitude: '590 km (SSO)',
    speed: '27,200 km/h',
    inclinationDeg: 97.8,
    periodMs: 140000,
    launched: '2018',
    status: 'ACTIVE',
    operator: 'DOST-ASTI / Tohoku-Hokkaido',
    color: '#00e676',
    notes: 'Earth observation microsatellite. Multispectral & hyperspectral imagers. Disaster monitoring & agricultural mapping.',
  },
  {
    id: 'agila',
    name: 'MAYA-6',
    fullName: 'Maya-6 (Agila CubeSat)',
    altitude: '580 km (SSO)',
    speed: '27,230 km/h',
    inclinationDeg: 97.5,
    periodMs: 155000,
    launched: '2023',
    status: 'ACTIVE',
    operator: 'STAMINA4Space / Univ. Philippines',
    color: '#ffd740',
    notes: 'CubeSat for APRS digipeater & store-and-forward comms. Part of the BIRDS program. Maritime domain awareness support.',
  },
];

// ── Beacon tooltip interface ───────────────────────────────────────────────
export interface BeaconTooltip {
  capital: Capital;
  x: number;
  y: number;
}

export interface ISSTooltip {
  x: number;
  y: number;
}

// ── Philippine military bases ──
export interface MilBase {
  name: string; shortName: string; lon: number; lat: number;
  type: 'AIR' | 'NAVAL' | 'ARMY' | 'JOINT';
  rangeKm: number;
  notes: string;
}

export const PH_MILITARY_BASES: MilBase[] = [
  { name: 'Clark Air Base / CFB', shortName: 'CLARK', lon: 120.559, lat: 15.186, type: 'AIR', rangeKm: 450, notes: 'Largest air base complex; former US base, now Clark Freeport. USAF rotational access.' },
  { name: 'Basa Air Base', shortName: 'BASA', lon: 120.492, lat: 14.987, type: 'AIR', rangeKm: 380, notes: 'HQ 5th Fighter Wing PAF. FA-50 & T-50 ops. Primary northern air defense.' },
  { name: 'Antonio Bautista Air Base', shortName: 'A.BAUTISTA', lon: 118.727, lat: 8.984, type: 'AIR', rangeKm: 520, notes: 'Key WPS power-projection base; Palawan. C-130 & ISR rotational access.' },
  { name: 'Mactan-Benito Ebuen AB', shortName: 'MACTAN', lon: 124.007, lat: 10.263, type: 'AIR', rangeKm: 400, notes: 'HQ 520th AW; tactical airlift & SAR hub for Visayas.' },
  { name: 'Edwin Andrews Air Base', shortName: 'ZAMBO', lon: 122.059, lat: 6.924, type: 'AIR', rangeKm: 340, notes: 'Western Mindanao Command air element; counter-terrorism role.' },
  { name: 'Lumbia Air Base', shortName: 'LUMBIA', lon: 124.611, lat: 8.415, type: 'AIR', rangeKm: 300, notes: 'Eastern Mindanao logistics & rotary-wing base.' },
  { name: 'Naval Station Cavite', shortName: 'NSC', lon: 120.884, lat: 14.491, type: 'NAVAL', rangeKm: 280, notes: 'Historic PN headquarters; patrol craft & anti-submarine assets.' },
  { name: 'Naval Station Leovigildo Gantioqui', shortName: 'SAN ANTONIO', lon: 120.084, lat: 15.392, type: 'NAVAL', rangeKm: 350, notes: 'Developed under EDCA; deep-water port; US Navy rotational access.' },
  { name: 'Naval Station Ulugan Bay', shortName: 'ULUGAN', lon: 118.656, lat: 9.783, type: 'NAVAL', rangeKm: 480, notes: 'Palawan; proximity to Spratly Islands. Key WPS patrol hub.' },
  { name: 'BRP Base Subic', shortName: 'SUBIC', lon: 120.273, lat: 14.793, type: 'NAVAL', rangeKm: 420, notes: 'Former US Naval Station; PN presence & US access under VFA.' },
  { name: 'Camp Melchor F. Dela Cruz', shortName: 'MAGSAYSAY', lon: 120.699, lat: 15.447, type: 'ARMY', rangeKm: 120, notes: 'Primary combined-arms training area; frequent US-PH Balikatan exercises.' },
  { name: 'Fort Magsaysay', shortName: 'FT.MAG', lon: 121.019, lat: 15.437, type: 'ARMY', rangeKm: 150, notes: 'Largest military reservation in PH. 7th Infantry Division HQ.' },
  { name: 'Camp Aguinaldo (AFP GHQ)', shortName: 'GHQ', lon: 121.056, lat: 14.619, type: 'JOINT', rangeKm: 80, notes: 'AFP General Headquarters. Primary C2 hub.' },
  { name: 'Camp Lallo', shortName: 'LALLO', lon: 121.665, lat: 18.197, type: 'JOINT', rangeKm: 200, notes: 'Northern Luzon; near Cagayan. Northernmost major AFP installation.' },
];

export const BASE_TYPE_COLORS: Record<MilBase['type'], string> = {
  AIR:   '#00dcff',
  NAVAL: '#E31B54',
  ARMY:  '#f5a623',
  JOINT: '#9b51e0',
};

// ── WPS Conflict Zones ──
export type ConflictStatus = 'CHN_MILITARIZED' | 'DISPUTED' | 'PHL_CONTROLLED' | 'INCIDENT_ZONE';

export interface ConflictZone {
  id: string;
  name: string;
  shortName: string;
  lon: number; lat: number;
  radiusKm: number;
  status: ConflictStatus;
  chineseName?: string;
  description: string;
  incidents: string;
}

export const CONFLICT_STATUS_COLORS: Record<ConflictStatus, string> = {
  CHN_MILITARIZED: '#E31B54',
  DISPUTED:        '#f5a623',
  PHL_CONTROLLED:  '#00c853',
  INCIDENT_ZONE:   '#ff6b35',
};

export const WPS_CONFLICT_ZONES: ConflictZone[] = [
  {
    id: 'scarborough',
    name: 'Scarborough Shoal',
    shortName: 'SCARBOROUGH',
    lon: 117.75, lat: 15.13,
    radiusKm: 28,
    status: 'CHN_MILITARIZED',
    chineseName: 'Huangyan Dao',
    description: 'Seized by China in 2012. CCG vessels maintain permanent blockade. PHL fishermen denied access. ~230km from Luzon — within PHL EEZ.',
    incidents: 'Water cannon attacks on PHL vessels (2023–2024). BRP Sierra Madre resupply interdictions ongoing.',
  },
  {
    id: 'second-thomas',
    name: 'Second Thomas Shoal (Ayungin)',
    shortName: 'AYUNGIN',
    lon: 115.87, lat: 9.72,
    radiusKm: 22,
    status: 'INCIDENT_ZONE',
    chineseName: "Ren'ai Jiao",
    description: 'BRP Sierra Madre intentionally grounded 1999 as sovereignty marker. PHL Marines stationed aboard. China demands ship removal.',
    incidents: 'CCG laser attacks, water cannon, physical seizure of resupply vessels (2023–2024). Highest friction point in WPS.',
  },
  {
    id: 'mischief-reef',
    name: 'Mischief Reef (Panganiban)',
    shortName: 'PANGANIBAN',
    lon: 115.53, lat: 9.90,
    radiusKm: 18,
    status: 'CHN_MILITARIZED',
    chineseName: 'Meiji Jiao',
    description: 'Occupied by China 1995. Converted to full military base with runway, hangars, and radar arrays. Within PHL EEZ.',
    incidents: 'PLA-N and PLAAF deployed. Runway operational for fighter jets. SAM systems confirmed by satellite imagery.',
  },
  {
    id: 'subi-reef',
    name: 'Subi Reef (Zamora)',
    shortName: 'ZAMORA',
    lon: 114.08, lat: 10.92,
    radiusKm: 16,
    status: 'CHN_MILITARIZED',
    chineseName: 'Zhubi Jiao',
    description: 'Massive artificial island. Full airstrip, port facilities, military barracks. Radar and electronic warfare systems deployed.',
    incidents: 'PLAN frigate and CCG patrols. SIGINT collection operations confirmed. Covers northern Spratly approaches.',
  },
  {
    id: 'fiery-cross',
    name: 'Fiery Cross Reef (Kagitingan)',
    shortName: 'KAGITINGAN',
    lon: 111.92, lat: 9.55,
    radiusKm: 20,
    status: 'CHN_MILITARIZED',
    chineseName: 'Yongshu Jiao',
    description: 'Largest Chinese artificial island in Spratlys. 3km runway, deep-water harbor, missile defense systems, hangars for 24 fighters.',
    incidents: 'H-6K bomber capable runway. J-11 and J-10 deployments confirmed. Advanced HQ-9B SAMs operational.',
  },
  {
    id: 'johnson-reef',
    name: 'Johnson South Reef (Mabini)',
    shortName: 'MABINI',
    lon: 114.28, lat: 9.72,
    radiusKm: 10,
    status: 'CHN_MILITARIZED',
    chineseName: 'Chigua Jiao',
    description: 'Site of 1988 naval battle. China seized from Vietnam. Now a militarized outpost with radar arrays.',
    incidents: '1988 Johnson South Reef clash — 64 Vietnamese sailors killed. Outpost expanded post-2014.',
  },
  {
    id: 'spratly-island',
    name: 'Spratly Island (Kalayaan)',
    shortName: 'KALAYAAN',
    lon: 114.42, lat: 10.36,
    radiusKm: 8,
    status: 'PHL_CONTROLLED',
    description: 'Largest PHL-held feature in Spratly group. Municipality of Kalayaan, Palawan. PAF airstrip and civilian settlers.',
    incidents: 'Regular supply missions. Chinese harassment of PHL fishing vessels in surrounding waters.',
  },
  {
    id: 'pagasa',
    name: 'Pag-asa Island (Thitu)',
    shortName: 'PAG-ASA',
    lon: 114.29, lat: 11.05,
    radiusKm: 9,
    status: 'PHL_CONTROLLED',
    description: 'Largest PHL-held island in WPS. Civilian population, PN detachment, airstrip. Major resupply hub.',
    incidents: 'Chinese militia vessels loiter nearby. 2019: 200+ Chinese vessels anchored at nearby Whitsun Reef.',
  },
  {
    id: 'whitsun-reef',
    name: 'Whitsun Reef (Julian Felipe)',
    shortName: 'WHITSUN',
    lon: 115.04, lat: 9.78,
    radiusKm: 14,
    status: 'DISPUTED',
    chineseName: "Niu'e Jiao",
    description: 'Within PHL EEZ. China denies sovereignty claim. Chinese maritime militia routinely mass at this feature.',
    incidents: '2021: 220 Chinese vessels massed — largest militia fleet gathering recorded. Ongoing militia presence.',
  },
  {
    id: 'nine-dash',
    name: 'Nine-Dash Line (Illegal Claim)',
    shortName: '9-DASH ZONE',
    lon: 114.0, lat: 12.5,
    radiusKm: 45,
    status: 'DISPUTED',
    description: "China's unlawful maritime claim. 2016 UNCLOS Arbitral Tribunal ruled it has no legal basis. China refuses to comply.",
    incidents: 'Entire WPS zone treated by China as territorial waters. Basis for all CCG/PLAN enforcement actions.',
  },
];
