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

// New Affiliation Entry Interface for table-like layout
export interface SubSection {
  key: string;
  label: string;
  description: string[];
  // entries removed — sections are paragraph-only
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
        'Notosphere functions as a founder-operator platform. While student-founded, ventures are governed with institutional discipline and long-term ownership principles.'
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

  // ABOUT PANEL Content
  export const ABOUT_PANEL_ITEMS: AboutGridItem[] = [
    { key: 'company', title: 'Company', subtitle: 'About Us, Our Story, Timeline' },
    { key: 'philosophy', title: 'Philosophy', subtitle: 'Core Beliefs, Operating Doctrine, Systems Principles' },
    { key: 'ecosystem', title: 'Ecosystem', subtitle: 'Subsidiaries, Venture Model, Platform Architecture' },
    { key: 'direction', title: 'Direction', subtitle: 'Mission, Vision, Focus Areas, Ambitions' },
    { key: 'governance', title: 'Governance', subtitle: 'Organizational Structure, Leadership Model' },
    { key: 'ethics', title: 'Ethics & Responsibility', subtitle: 'Ethical Framework, Risk & Compliance' }
  ];

  export const ABOUT_PANEL_CONTENT: Record<'company' | 'philosophy' | 'ecosystem' | 'direction' | 'governance' | 'ethics', AboutContent> = {
    company: {
      title: 'Company',
      buttonType: 'tabs',
      subsections: [
        {
          key: 'about-us',
          label: 'About us',
          description: [
            'Meet the leadership and executive team guiding the organization.'
          ]
        },
        {
          key: 'our-story',
          label: 'Our Story',
          description: [
            'Founded with a vision to bridge the gap between emerging technology and real-world impact, Notosphere began as a student-led initiative focused on solving complex challenges through innovative solutions.',
            'What started as a small group of passionate builders has evolved into a multi-venture platform operating across diverse sectors including healthcare, fintech, cleantech, and education.',
            'Our journey has been marked by a commitment to disciplined execution, strategic partnerships, and a relentless focus on creating value that extends beyond traditional metrics.'
          ]
        },
        {
          key: 'timeline',
          label: 'Timeline',
          description: [
            'Our growth trajectory reflects our commitment to sustainable expansion and meaningful impact across multiple ventures and sectors.',
            'From initial concept validation to full-scale operations, each milestone represents strategic decisions, lessons learned, and capabilities developed through hands-on execution.'
          ]
        }
      ],
      
    },
    philosophy: {
      title: 'Philosophy',
      buttonType: 'tabs',
      subsections: [
        {
          key: 'core-beliefs',
          label: 'Core Beliefs',
          description: [
            'Our core beliefs center on responsible innovation, systems thinking, and long-term value creation.'
          ]
        },
        {
          key: 'operating-doctrine',
          label: 'Operating Doctrine',
          description: [
            'We operate with disciplined processes that balance autonomy and governance to enable rapid, responsible experimentation.'
          ]
        },
        {
          key: 'systems-principles',
          label: 'Systems Principles',
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
          description: [
            'An overview of our subsidiary ventures and how they interoperate within the platform.'
          ]
        },
        {
          key: 'venture-model',
          label: 'Venture Model',
          description: [
            'How we incubate, validate, and scale venture ideas using a founder-operator framework.'
          ]
        },
        {
          key: 'platform-architecture',
          label: 'Platform Architecture',
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
          description: [
            'Our mission is to identify, develop, and scale ventures that solve real-world problems through innovative technology and strategic execution.'
          ]
        },
        {
          key: 'vision',
          label: 'Vision',
          description: [
            'We envision a future where technology empowers human flourishing and sustainable progress at scale.'
          ]
        },
        {
          key: 'strategic-focus',
          label: 'Strategic Focus Areas',
          description: [
            'Priority areas where we concentrate capital, talent, and operational effort to maximize impact.'
          ]
        },
        {
          key: 'ambition',
          label: 'Ambition',
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
          description: [
            'A description of how the organization is structured to balance oversight and operational autonomy.'
          ]
        },
        {
          key: 'leadership-model',
          label: 'Leadership Model',
          description: [
            'How leadership is distributed, decision-making flows, and roles are defined across the platform.'
          ]
        },
        {
          key: 'advisory-framework',
          label: 'Advisory Framework',
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
          description: [
            'Principles and values that guide our decision-making and product development.'
          ]
        },
        {
          key: 'compliance-risk',
          label: 'Risk and Compliance',
          description: [
            'How we identify, monitor, and mitigate operational, regulatory, and reputational risks.'
          ]
        }
      ]
    }
  };