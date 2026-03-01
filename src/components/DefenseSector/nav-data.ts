export interface SubtabItem {
  id: string;
  label: string;
  sectionId?: string;
  isSpecial?: boolean;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  subtabs: SubtabItem[];
}

export const DEFENSE_NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    label: 'Systems Overview',
    icon: 'bi-house',
    subtabs: [
      { id: 'return-main', label: '\u2190 Return to Main Site', isSpecial: true },
      { id: 'overview', label: 'Overview', sectionId: 'defense-section-overview' },
      { id: 'features', label: 'Features', sectionId: 'defense-section-features' },
      { id: 'systems-portfolio', label: 'Systems Portfolio', sectionId: 'defense-section-portfolio' },
    ],
  },
  {
    id: 'megiddo',
    label: 'Megiddo',
    icon: 'bi-bounding-box',
    subtabs: [
      { id: 'strategic-overview', label: 'Strategic Overview' },
      { id: 'operational-role', label: 'Operational Role' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'framework', label: 'Framework' },
      { id: 'documentations', label: 'Documentations' },
      { id: 'request-demo', label: 'Request Demo' },
    ],
  },
  {
    id: 'argos',
    label: 'Argos',
    icon: 'bi-crosshair',
    subtabs: [
      { id: 'strategic-overview', label: 'Strategic Overview' },
      { id: 'operational-role', label: 'Operational Role' },
      { id: 'capabilities', label: 'Capabilities' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'framework', label: 'Framework' },
      { id: 'documentations', label: 'Documentations' },
      { id: 'request-demo', label: 'Request Demo' },
    ],
  },
  {
    id: 'rnd',
    label: 'Research & Development',
    icon: 'bi-cpu',
    subtabs: [
      { id: 'rnd-overview', label: 'Overview' },
      { id: 'rnd-programs', label: 'Programs' },
      { id: 'rnd-publications', label: 'Publications' },
    ],
  },
];

export const DEFAULT_SUBTABS: Record<string, string> = {
  home: 'overview',
  megiddo: 'strategic-overview',
  argos: 'strategic-overview',
  rnd: 'rnd-overview',
};
