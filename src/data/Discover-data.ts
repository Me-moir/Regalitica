export interface TeamMember {
  name: string;
  role: string;
  color: string;
}

export interface OverviewSection {
  title: string;
  description: string[];
  buttonText: string;
}

export interface OverviewContent {
  icon: string;
  title: string;
  description: string[];
}

export interface SubSection {
  key: string;
  /** Text shown on the tab button — unchanged */
  label: string;
  /** Heading rendered inside the content area */
  contentTitle: string;
  description: string[];
}

export interface AboutContent {
  title: string;
  subsections: SubSection[];
  buttonType: 'link' | 'tabs' | 'cards';
  buttonText?: string;
  buttonLink?: string;
}

export interface AboutGridItem {
  key: 'company' | 'philosophy' | 'ecosystem' | 'direction' | 'governance' | 'ethics';
  title: string;
  subtitle: string;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export interface Founder {
  id: string;
  codename: string;
  name: string;
  title: string;
  role: string;
  src: string | null;
  bio: string;
  since: string;
  linkedin: string;
}

export interface DynastyStat {
  value: string;
  accent: boolean;
  label: string;
}

export const FOUNDERS: Founder[] = [
  {
    id: 'F-001',
    codename: 'Alpha',
    name: 'Founder Name',
    title: 'Chief Executive Officer',
    role: 'Vision & Strategy',
    src: '/assets/Founder-1.jpg',
    bio: "Leading the Notus Dynasty with an unwavering focus on long-term vision and strategic direction. Responsible for shaping the organizational culture and ensuring every unit operates in alignment with the dynasty's core mission.",
    since: '2021',
    linkedin: '#',
  },
  {
    id: 'F-002',
    codename: 'Beta',
    name: 'Founder Name',
    title: 'Chief Operating Officer',
    role: 'Operations & Structure',
    src: '/assets/Founder-2.jpg',
    bio: 'Architect of the operational backbone that keeps six active units running with precision. Converts high-level strategy into executable systems, ensuring efficiency and accountability across all levels of the organization.',
    since: '2021',
    linkedin: '#',
  },
  {
    id: 'F-003',
    codename: 'Delta',
    name: 'Founder Name',
    title: 'Chief Technology Officer',
    role: 'Systems & Infrastructure',
    src: '/assets/Founder-3.jpg',
    bio: "Drives the technological foundation of the dynasty — from internal infrastructure to external-facing systems. Ensures every tool, platform, and pipeline is built to scale alongside the organization's ambitions.",
    since: '2021',
    linkedin: '#',
  },
  {
    id: 'F-004',
    codename: 'Epsilon',
    name: 'Founder Name',
    title: 'Chief Creative Officer',
    role: 'Design & Perception',
    src: '/assets/Founder-4.jpg',
    bio: 'Defines the visual language and creative identity of the Notus Dynasty. Responsible for every touchpoint of brand perception — from aesthetics and communications to the emotional resonance the organization creates.',
    since: '2021',
    linkedin: '#',
  },
];

export const DYNASTY_STATS: DynastyStat[] = [
  { value: '4',  accent: true,  label: 'Founders'      },
  { value: '6',  accent: false, label: 'Active Units'  },
  { value: '44', accent: false, label: 'Total Members' },
];

// ─── Overview ─────────────────────────────────────────────────────────────────

export const OverviewContent: OverviewContent[] = [
  {
    icon: 'bi-collection',
    title: 'Venture-Building Platform',
    description: [
      'We develop and oversee multiple ventures through a centralized operating framework, rather than managing a single standalone company.'
    ]
  },
  {
    icon: 'bi-arrows-move',
    title: 'Cross-Sector Mandate',
    description: [
      'Our activities are sector-agnostic, allowing capital and effort to be allocated toward opportunities with asymmetric impact.'
    ]
  },
  {
    icon: 'bi-mortarboard',
    title: 'Founder-Operator Model',
    description: [
      'Notus Regalia functions as a founder-operator platform. While student-founded, ventures are governed with institutional discipline and long-term ownership principles.'
    ]
  },
  {
    icon: 'bi-leaf',
    title: 'Early-Stage Capital Formation',
    description: [
      'We focus on converting undeveloped concepts into venture-ready entities through disciplined validation and controlled deployment of resources.'
    ]
  },
  {
    icon: 'bi-eye-slash',
    title: 'Stealth Operations',
    description: [
      'Operating in stealth enables concentrated development, reduced external signaling, and strategic optionality ahead of public exposure.'
    ]
  }
];

// ─── About Panel ──────────────────────────────────────────────────────────────

export const ABOUT_PANEL_ITEMS: AboutGridItem[] = [
  { key: 'company',    title: 'Company',                subtitle: 'About Us, Our Story, Timeline' },
  { key: 'philosophy', title: 'Philosophy',              subtitle: 'Core Beliefs, Operating Doctrine, Systems Principles' },
  { key: 'ecosystem',  title: 'Ecosystem',               subtitle: 'Subsidiaries, Venture Model, Platform Architecture' },
  { key: 'direction',  title: 'Direction',               subtitle: 'Mission, Vision, Focus Areas, Ambitions' },
  { key: 'governance', title: 'Governance',              subtitle: 'Organizational Structure, Leadership Model' },
  { key: 'ethics',     title: 'Ethics & Responsibility', subtitle: 'Ethical Framework, Risk & Compliance' }
];

export const ABOUT_PANEL_CONTENT: Record<
  'company' | 'philosophy' | 'ecosystem' | 'direction' | 'governance' | 'ethics',
  AboutContent
> = {
  company: {
    title: 'Company',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'what-we-do',
        label: 'What We Do',
        contentTitle: 'We build foundational information systems for complex, real-world data.',
        description: [
          'Based in the Philippines, Notus Regalia is a tech startup and parent organization building the future of connected information systems. While we are currently in our pre-seed stealth phase, our core focus remains clear: engineering the backend architecture and data ecosystems required to scale high-impact tech ventures. At Notus Regalia, we are not just developing software—we are building the engine that will drive the next wave of technological innovation in Southeast Asia and beyond.'
        ]
      },
      {
        key: 'why-we-exist',
        label: 'Why We Exist',
        contentTitle: 'Born from a belief that builders closest to the problem should own the solution.',
        description: [
          'Founded with a vision to bridge the gap between emerging technology and real-world impact, Notus Regalia began as a student-led initiative focused on solving complex challenges through innovative solutions.',
          'What started as a small group of passionate builders has evolved into a multi-venture platform operating across diverse sectors including healthcare, fintech, cleantech, and education.',
          'Our journey has been marked by a commitment to disciplined execution, strategic partnerships, and a relentless focus on creating value that extends beyond traditional metrics.'
        ]
      },
      {
        key: 'timeline',
        label: 'Timeline',
        contentTitle: 'Every milestone is a decision made, a lesson earned, and a capability built.',
        description: [
          'Our growth trajectory reflects our commitment to sustainable expansion and meaningful impact across multiple ventures and sectors.',
          'From initial concept validation to full-scale operations, each milestone represents strategic decisions, lessons learned, and capabilities developed through hands-on execution.'
        ]
      }
    ]
  },
  philosophy: {
    title: 'Philosophy',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'core-beliefs',
        label: 'Core Beliefs',
        contentTitle: 'Responsible innovation is not a constraint — it is our competitive edge.',
        description: [
          'Our core beliefs center on responsible innovation, systems thinking, and long-term value creation.'
        ]
      },
      {
        key: 'operating-doctrine',
        label: 'Operating Doctrine',
        contentTitle: 'Discipline and autonomy are not opposites — they are the same engine running at different speeds.',
        description: [
          'We operate with disciplined processes that balance autonomy and governance to enable rapid, responsible experimentation.'
        ]
      },
      {
        key: 'systems-principles',
        label: 'Systems Principles',
        contentTitle: 'We design for resilience first, because fragile systems do not scale.',
        description: [
          'We design for resilience, composability, and human-centered outcomes across products and platforms.'
        ]
      }
    ]
  },
  ecosystem: {
    title: 'Ecosystem',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'subsidiaries',
        label: 'Subsidiaries',
        contentTitle: 'Each subsidiary is a focused operator within a unified platform.',
        description: [
          'An overview of our subsidiary ventures and how they interoperate within the platform.'
        ]
      },
      {
        key: 'venture-model',
        label: 'Venture Model',
        contentTitle: 'We do not just fund ideas — we build, validate, and own them.',
        description: [
          'How we incubate, validate, and scale venture ideas using a founder-operator framework.'
        ]
      },
      {
        key: 'platform-architecture',
        label: 'Platform Architecture',
        contentTitle: 'Shared infrastructure. Independent velocity. No duplicated effort.',
        description: [
          'Technical and operational architecture that enables shared services, data flows, and scalable infrastructure.'
        ]
      }
    ]
  },
  direction: {
    title: 'Direction',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'mission',
        label: 'Mission',
        contentTitle: 'Identify, develop, and scale ventures that solve real problems through technology.',
        description: [
          'Our mission is to identify, develop, and scale ventures that solve real-world problems through innovative technology and strategic execution.'
        ]
      },
      {
        key: 'vision',
        label: 'Vision',
        contentTitle: 'A future where technology empowers human flourishing at scale.',
        description: [
          'We envision a future where technology empowers human flourishing and sustainable progress at scale.'
        ]
      },
      {
        key: 'strategic-focus',
        label: 'Strategic Focus Areas',
        contentTitle: 'We concentrate where the gap between impact and investment is widest.',
        description: [
          'Priority areas where we concentrate capital, talent, and operational effort to maximize impact.'
        ]
      },
      {
        key: 'ambition',
        label: 'Ambition',
        contentTitle: 'We are building for decades, not quarters.',
        description: [
          'Outcomes and compounding effects we aim to achieve over multiple decades of sustained work.'
        ]
      }
    ]
  },
  governance: {
    title: 'Governance',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'org-structure',
        label: 'Organizational Structure',
        contentTitle: 'Oversight without bottleneck. Autonomy without drift.',
        description: [
          'A description of how the organization is structured to balance oversight and operational autonomy.'
        ]
      },
      {
        key: 'leadership-model',
        label: 'Leadership Model',
        contentTitle: 'Leadership is distributed by design, not by default.',
        description: [
          'How leadership is distributed, decision-making flows, and roles are defined across the platform.'
        ]
      },
      {
        key: 'advisory-framework',
        label: 'Advisory Framework',
        contentTitle: 'External expertise sharpens internal judgment.',
        description: [
          'The composition and role of advisory bodies and external experts that support governance and strategy.'
        ]
      }
    ]
  },
  ethics: {
    title: 'Ethics & Responsibility',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'ethical-framework',
        label: 'Ethical Framework',
        contentTitle: 'Our values are not a policy document — they are the operating system.',
        description: [
          'Principles and values that guide our decision-making and product development.'
        ]
      },
      {
        key: 'compliance-risk',
        label: 'Risk and Compliance',
        contentTitle: 'We treat risk identification as a continuous practice, not a periodic audit.',
        description: [
          'How we identify, monitor, and mitigate operational, regulatory, and reputational risks.'
        ]
      }
    ]
  }
};

// ─── Strategic Capital ────────────────────────────────────────────────────────

export type InvestorType =
  | 'Founder Capital'
  | 'Angel Investor'
  | 'Private Investor'
  | 'Strategic Investor'
  | 'Institutional Investor'
  | 'Seed Investor'
  | 'Growth Investor';

export type InvestmentStructure =
  | 'Equity'
  | 'SAFE'
  | 'Convertible'
  | 'Direct';

export interface Investor {
  id: string;
  name: string;
  /** URL to logo image — omit to use auto-generated initials placeholder */
  logo?: string;
  type: InvestorType;
  /** Internal phase ID, e.g. 'phase-1' */
  phase: string;
  /** Human-readable label shown in modal eyebrow, e.g. 'Phase I — Foundational Capital' */
  phaseLabel: string;
  description: string;
  year: string;
  roundName: string;
  investmentStructure: InvestmentStructure;
  strategicImpact: string[];
  link?: string;
}

export interface CapitalPhase {
  id: string;
  label: string;
  title: string;
  description: string;
  investors: Investor[];
  /** true = render investor cards; false = render Coming Soon block */
  live: boolean;
  /** Optional date shown in the Coming Soon block, e.g. 'January 2027' */
  comingSoonDate?: string;
}

export interface CapitalStat {
  value: string;
  label: string;
  accent: boolean;
}

/** Accent color per investor type — used by cards and modal. */
export const INVESTOR_TYPE_COLORS: Record<InvestorType, string> = {
  'Founder Capital':                       '#E31B54',
  'Angel Investor':                        '#f59e0b',
  'Private Investor':                      '#8b5cf6',
  'Strategic Investor':                    '#3b82f6',
  'Institutional Investor':                '#06b6d4',
  'Seed Investor':                         '#10b981',
  'Growth Investor':                       '#f97316',
};

// ── Phase I investors ─────────────────────────────────────────────────────────

const PHASE_I_INVESTORS: Investor[] = [
  {
    id: 'inv-001',
    name: 'Notus Founding Capital',
    type: 'Founder Capital',
    phase: 'phase-1',
    phaseLabel: 'Phase I — Foundational Capital',
    description:
      'Internal capital allocated directly by the founding team to establish the core architecture and initial R&D framework of the Notus continuum.',
    year: '2025',
    roundName: 'Phase I',
    investmentStructure: 'Direct',
    strategicImpact: ['Core system development', 'Infrastructure scaling', 'Research expansion'],
    link: '#',
  },
  {
    id: 'inv-002',
    name: 'Arclight Holdings',
    type: 'Angel Investor',
    phase: 'phase-1',
    phaseLabel: 'Phase I — Foundational Capital',
    description:
      'An early backer with deep conviction in the Notus thesis, providing foundational capital that enabled the team to move with speed before external validation.',
    year: '2025',
    roundName: 'Phase I',
    investmentStructure: 'SAFE',
    strategicImpact: ['Core system development', 'Team growth'],
    link: '#',
  },
  {
    id: 'inv-003',
    name: 'Meridian Private Office',
    type: 'Private Investor',
    phase: 'phase-1',
    phaseLabel: 'Phase I — Foundational Capital',
    description:
      'A family office aligned with long-horizon mission ventures, joining Phase I to support the architecture and governance formation of the platform.',
    year: '2025',
    roundName: 'Phase I',
    investmentStructure: 'Convertible',
    strategicImpact: ['Infrastructure scaling', 'Research expansion', 'Market validation'],
    link: '#',
  },
  {
    id: 'inv-004',
    name: 'Vantage Syndicate',
    type: 'Strategic Investor',
    phase: 'phase-1',
    phaseLabel: 'Phase I — Foundational Capital',
    description:
      'A strategic vehicle that contributed both capital and operational context, specifically enabling early contracts and technology deployment groundwork.',
    year: '2026',
    roundName: 'Phase I',
    investmentStructure: 'Equity',
    strategicImpact: ['Core system development', 'Market validation', 'Team growth'],
    link: '#',
  },
];

// ── Phase definitions ─────────────────────────────────────────────────────────

export const CAPITAL_PHASES: CapitalPhase[] = [
  {
    id: 'phase-1',
    label: 'Phase I',
    title: 'Phase I — Foundational Capital (Pre-Seed, Seed Capital)',
    description:
      'Initial seed funding from founders and early angel investors allocated toward foundational development, system architecture, and early-stage execution.',
    investors: PHASE_I_INVESTORS,
    live: true,
  },
  {
    id: 'phase-2',
    label: 'Phase II',
    title: 'Phase II — Strategic Capital (Series A Stage)',
    description:
      'Selective external investors participating in structured growth funding to support product scaling, operational expansion, and early market deployment (Seed Extension).',
    investors: [],
    live: false,
    comingSoonDate: 'January 2027',
  },
  {
    id: 'phase-3',
    label: 'Phase III',
    title: 'Phase III — Institutional Capital (Series A+ ,Series B Stage)',
    description:
      'Institutional investors and structured funds supporting large-scale expansion, infrastructure development, and long-term market growth (Growth Stage).',
    investors: [],
    live: false,
    comingSoonDate: 'October 2027',
  },
];

// ── Hero stats box ────────────────────────────────────────────────────────────

export const CAPITAL_STATS: CapitalStat[] = [
  { value: String(PHASE_I_INVESTORS.length), label: 'Phase I Backers', accent: false },
  { value: '₱1.5M',                          label: 'Raised in Phase I', accent: true  },
  { value: '2026',                           label: 'Active Since',     accent: false },
];