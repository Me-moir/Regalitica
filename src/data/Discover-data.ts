export interface TeamMember {
  name: string;
  role: string;
  color: string;
}

export interface Industry {
  name: string;
  description: string;
  problem: string;
  valueProposition: string;
  team: TeamMember[];
}

export interface Project {
  title: string;
  industryName: string;
  industryDescription: string;
  description: string;
  problem: string;
  valueProposition: string;
  team: TeamMember[];
  domains: string[];
  features: string[];
  timeline: { stage: string; date: string; status: 'complete' | 'current' | 'future' }[];
}

export interface OverviewSection {
  title: string;
  description: string[];
  buttonText: string;
}

export interface OverviewContent {
  title: string;
  description: string[];
}

export interface FeatureSection {
  icon: string;
  title: string;
  description: string;
}

// New Affiliation Entry Interface for table-like layout
export interface AffiliationEntry {
  id: string;
  name: string;
  dateJoined: string;
  logo?: string; // Optional logo URL/path
}

export interface SubSection {
  key: string;
  label: string;
  description: string[];
  entries?: AffiliationEntry[]; // For Affiliations section
}

// Executive Card Interface
export interface ExecutiveCard {
  id: string;
  position: string;
  initials: string;
  name: string;
  department?: string;
}

export interface WorldContent {
  title: string;
  subsections: SubSection[];
  buttonType: 'link' | 'tabs' | 'cards';
  buttonText?: string;
  buttonLink?: string;
  executives?: ExecutiveCard[]; // For Teams section
}

export interface WorldGridItem {
  key: 'company' | 'direction' | 'teams' | 'governance' | 'affiliations' | 'reachout';
  title: string;
  subtitle: string;
}

export const FeatureSections: FeatureSection[] = [
  {
    icon: 'bi-collection',
    title: 'Venture-Building Platform',
    description:
      'We develop and oversee multiple ventures through a centralized operating framework, rather than managing a single standalone company.'
  },
  {
    icon: 'bi-arrows-move',
    title: 'Cross-Sector Mandate',
    description:
      'Our activities are sector-agnostic, allowing capital and effort to be allocated toward opportunities with asymmetric impact.'
  },
  {
    icon: 'bi-mortarboard',
    title: 'Founder-Operator Model',
    description:
      'Regalitica functions as a founder-operator platform. While student-founded, ventures are governed with institutional discipline and long-term ownership principles.'
  },
  {
    icon: 'bi-leaf',
    title: 'Early-Stage Capital Formation',
    description:
      'We focus on converting undeveloped concepts into venture-ready entities through disciplined validation and controlled deployment of resources.'
  },
  {
    icon: 'bi-eye-slash',
    title: 'Stealth Operations',
    description:
      'Operating in stealth enables concentrated development, reduced external signaling, and strategic optionality ahead of public exposure.'
  }
];

export const industries: Industry[] = [
  {
    name: 'Healthcare',
    description: 'Revolutionary healthcare solutions that make quality care accessible, affordable, and personalized for everyone.',
    problem: 'Rural patients lack access to real-time specialist care, leading to delayed diagnoses and increased healthcare costs. Traditional telemedicine solutions fail to address connectivity issues in underserved areas.',
    valueProposition: 'AI-powered diagnostic assistant that works offline, providing immediate preliminary assessments and prioritizing cases for remote specialist review when connectivity is restored.',
    team: [
      { name: 'Dr. Sarah Chen', role: 'Team Leader', color: 'bg-[#DC143C]' },
      { name: 'Marcus Johnson', role: 'Lead Developer', color: 'bg-blue-500' },
      { name: 'Aisha Patel', role: 'UX Designer', color: 'bg-purple-500' },
      { name: 'David Kim', role: 'Data Scientist', color: 'bg-green-500' },
    ],
  },
  {
    name: 'FinTech',
    description: 'Next-generation financial technology that democratizes access to banking, investing, and wealth management.',
    problem: 'Small businesses in emerging markets lack access to affordable credit and financial services, limiting their growth potential and economic impact.',
    valueProposition: 'Blockchain-based microfinancing platform with AI credit scoring that reduces lending costs by 60% while expanding access to previously unbanked populations.',
    team: [
      { name: 'James Martinez', role: 'CEO & Founder', color: 'bg-[#DC143C]' },
      { name: 'Priya Sharma', role: 'Blockchain Lead', color: 'bg-cyan-500' },
      { name: 'Alex Wong', role: 'Risk Analyst', color: 'bg-indigo-500' },
    ],
  },
  {
    name: 'CleanTech',
    description: 'Sustainable technologies that combat climate change while creating profitable business models.',
    problem: 'Industrial facilities struggle to reduce carbon emissions due to high costs and lack of real-time monitoring systems.',
    valueProposition: 'IoT-enabled carbon capture system with real-time analytics that reduces industrial emissions by 45% while generating tradeable carbon credits.',
    team: [
      { name: 'Dr. Lisa Zhang', role: 'Chief Scientist', color: 'bg-[#DC143C]' },
      { name: 'Robert Green', role: 'Engineering Lead', color: 'bg-teal-500' },
      { name: 'Maya Okafor', role: 'Sustainability Advisor', color: 'bg-lime-500' },
    ],
  },
  {
    name: 'EdTech',
    description: 'Innovative learning platforms powered by AI that provide personalized education pathways.',
    problem: 'Students in developing regions lack access to quality STEM education, with teacher shortages limiting opportunities.',
    valueProposition: 'AI tutor platform with adaptive learning that provides personalized STEM education at scale, proven to improve test scores by 35%.',
    team: [
      { name: 'Prof. Ahmed Hassan', role: 'Chief Educator', color: 'bg-[#DC143C]' },
      { name: 'Jessica Park', role: 'AI/ML Engineer', color: 'bg-violet-500' },
      { name: 'Carlos Rivera', role: 'Content Director', color: 'bg-fuchsia-500' },
    ],
  },
];

export const allProjects: Project[] = [
  {
    title: 'AI Telemedicine Platform',
    industryName: 'Healthcare',
    industryDescription: industries[0].description,
    description: 'An AI-powered diagnostic assistant for remote healthcare delivery in underserved areas.',
    problem: industries[0].problem,
    valueProposition: industries[0].valueProposition,
    team: industries[0].team,
    domains: ['AI', 'SaaS', 'HealthTech'],
    features: ['Offline Mode', 'AI Diagnostics', 'Real-time Sync', 'HIPAA Compliant', 'Multi-language', 'Cloud Backup'],
    timeline: [
      { stage: 'Concept', date: 'Jan 2024', status: 'complete' },
      { stage: 'Development', date: 'Mar 2024', status: 'complete' },
      { stage: 'Private Beta', date: 'Nov 2024', status: 'current' },
      { stage: 'Live', date: 'Q1 2025', status: 'future' },
      { stage: 'Scale', date: 'Q3 2025', status: 'future' },
    ],
  },
  {
    title: 'Micro-Lending Blockchain',
    industryName: 'FinTech',
    industryDescription: industries[1].description,
    description: 'Blockchain-based microfinancing with AI credit scoring for emerging markets.',
    problem: industries[1].problem,
    valueProposition: industries[1].valueProposition,
    team: industries[1].team,
    domains: ['Blockchain', 'DeFi', 'Web3'],
    features: ['Smart Contracts', 'AI Credit Score', 'Multi-currency', 'KYC Integration', 'Mobile First', 'Low Fees'],
    timeline: [
      { stage: 'Concept', date: 'Feb 2024', status: 'complete' },
      { stage: 'Development', date: 'May 2024', status: 'complete' },
      { stage: 'Beta', date: 'Dec 2024', status: 'current' },
      { stage: 'Launch', date: 'Q2 2025', status: 'future' },
      { stage: 'Expand', date: 'Q4 2025', status: 'future' },
    ],
  },
  {
    title: 'Smart Carbon Capture',
    industryName: 'CleanTech',
    industryDescription: industries[2].description,
    description: 'IoT-enabled carbon capture system with real-time analytics and credit generation.',
    problem: industries[2].problem,
    valueProposition: industries[2].valueProposition,
    team: industries[2].team,
    domains: ['IoT', 'CleanTech', 'AI'],
    features: ['Real-time Monitor', 'Carbon Credits', 'Predictive AI', 'Dashboard', 'API Access', 'Compliance'],
    timeline: [
      { stage: 'Research', date: 'Mar 2024', status: 'complete' },
      { stage: 'Prototype', date: 'Jul 2024', status: 'complete' },
      { stage: 'Pilot', date: 'Jan 2025', status: 'current' },
      { stage: 'Deploy', date: 'Q3 2025', status: 'future' },
      { stage: 'Scale', date: 'Q1 2026', status: 'future' },
    ],
  },
  {
    title: 'Adaptive STEM Learning',
    industryName: 'EdTech',
    industryDescription: industries[3].description,
    description: 'AI tutor platform with personalized learning paths for global STEM education.',
    problem: industries[3].problem,
    valueProposition: industries[3].valueProposition,
    team: industries[3].team,
    domains: ['EdTech', 'AI', 'Mobile'],
    features: ['Adaptive Learning', 'Progress Track', 'Gamification', 'Offline Mode', 'Teacher Tools', 'Analytics'],
    timeline: [
      { stage: 'Design', date: 'Apr 2024', status: 'complete' },
      { stage: 'Build', date: 'Aug 2024', status: 'complete' },
      { stage: 'Testing', date: 'Feb 2025', status: 'current' },
      { stage: 'Release', date: 'Q2 2025', status: 'future' },
      { stage: 'Global', date: 'Q4 2025', status: 'future' },
    ],
  },
];

// InsideOurWorld Content
export const WORLD_GRID_ITEMS: WorldGridItem[] = [
  { key: 'company', title: 'Company', subtitle: 'About, Our Story, Timeline' },
  { key: 'direction', title: 'Direction', subtitle: 'Vision, Mission, Focus' },
  { key: 'teams', title: 'Teams', subtitle: 'Core Executives, Venture Teams' },
  { key: 'governance', title: 'Governance', subtitle: 'Structure, Principles' },
  { key: 'affiliations', title: 'Affiliations', subtitle: 'Investors, Sponsors, Partners' },
  { key: 'reachout', title: 'Reach Out', subtitle: 'Inquiry, Funding & Support, Partner With Us' }
];

export const WORLD_CONTENT_DATA: Record<'company' | 'direction' | 'teams' | 'governance' | 'affiliations' | 'reachout', WorldContent> = {
  company: {
    title: 'Company',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'about',
        label: 'About',
        description: [
          'Regalitica is a technology-focused collective dedicated to building intelligent systems, digital platforms, and future-oriented solutions.',
          'We operate at the intersection of design, data, and engineering — creating products that are not only functional, but meaningful, scalable, and sustainable.',
          'Our work is driven by a belief that technology should enhance human capability, not replace it. We approach every project with systems thinking, research-first methodology, and long-term impact in mind.',
          'Regalitica exists for organizations and individuals who value depth over hype, structure over noise, and innovation with purpose.'
        ]
      },
      {
        key: 'our-story',
        label: 'Our Story',
        description: [
          'Founded with a vision to bridge the gap between emerging technology and real-world impact, Regalitica began as a student-led initiative focused on solving complex challenges through innovative solutions.',
          'What started as a small group of passionate builders has evolved into a multi-venture platform operating across diverse sectors including healthcare, fintech, cleantech, and education.',
          'Our journey has been marked by a commitment to disciplined execution, strategic partnerships, and a relentless focus on creating value that extends beyond traditional metrics.',
          'Today, we continue to build with the same foundational principles that guided our inception: innovation with integrity, impact with purpose, and growth with responsibility.'
        ]
      },
      {
        key: 'timeline',
        label: 'Timeline',
        description: [
          'Our growth trajectory reflects our commitment to sustainable expansion and meaningful impact across multiple ventures and sectors.',
          'From initial concept validation to full-scale operations, each milestone represents strategic decisions, lessons learned, and capabilities developed through hands-on execution.',
          'Key milestones include establishing our venture-building framework, launching our first market-ready products, forming strategic partnerships, and expanding our team of specialized operators.',
          'As we continue to scale, our focus remains on building infrastructure that compounds value across ventures while maintaining the quality and innovation that define our work.'
        ]
      }
    ]
  },
  direction: {
    title: 'Direction',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'vision',
        label: 'Vision',
        description: [
          'To become a leading force in technological innovation, creating solutions that transform industries and improve lives globally.',
          'We envision a future where technology seamlessly integrates with human needs, fostering sustainable growth and meaningful progress.',
          'Our vision extends beyond profit — we aim to build a legacy of impact, innovation, and integrity that inspires the next generation of creators and entrepreneurs.'
        ]
      },
      {
        key: 'mission',
        label: 'Mission',
        description: [
          'Our mission is to identify, develop, and scale ventures that solve real-world problems through innovative technology and strategic execution.',
          'We are committed to building sustainable businesses that create value for stakeholders while maintaining the highest standards of ethics and excellence.',
          'Through disciplined innovation and collaborative partnerships, we transform bold ideas into market-ready solutions that drive meaningful change.'
        ]
      },
      {
        key: 'focus',
        label: 'Focus',
        description: [
          'We focus on emerging technologies with transformative potential: artificial intelligence, blockchain, clean technology, and digital platforms.',
          'Our strategic focus areas include healthcare innovation, financial technology, sustainable solutions, and education technology — sectors where technology can create the most significant positive impact.',
          'We prioritize ventures that demonstrate strong product-market fit, scalable business models, and alignment with our core values of innovation, sustainability, and social responsibility.'
        ]
      }
    ]
  },
  teams: {
    title: 'Teams',
    buttonType: 'cards',
    subsections: [
      {
        key: 'core-executives',
        label: 'Core Executives',
        description: [
            'Meet the visionaries and operators driving Regalitica forward.'
        ]
      },
      {
        key: 'venture-teams',
        label: 'Venture Teams',
        description: [
          'Each venture is powered by dedicated teams of specialists — engineers, designers, product managers, and domain experts working in close collaboration.',
          'Our venture teams operate with autonomy while leveraging shared resources and infrastructure, enabling rapid iteration and efficient execution.',
          'We cultivate a culture of excellence, creativity, and accountability, attracting top talent passionate about building solutions that matter.'
        ]
      }
    ],
    executives: [
      {
        id: 'ceo',
        position: 'Chief Executive Officer',
        initials: 'CEO',
        name: '[Name]',
        department: 'Executive Leadership'
      },
      {
        id: 'cto',
        position: 'Chief Technology Officer',
        initials: 'CTO',
        name: '[Name]',
        department: 'Technology'
      },
      {
        id: 'cfo',
        position: 'Chief Financial Officer',
        initials: 'CFO',
        name: '[Name]',
        department: 'Finance'
      },
      {
        id: 'cao',
        position: 'Chief Administrative Officer',
        initials: 'CAO',
        name: '[Name]',
        department: 'Internal Administration'
      },
      {
        id: 'coo',
        position: 'Chief Operating Officer',
        initials: 'COO',
        name: '[Name]',
        department: 'Operations'
      },
      {
        id: 'cbo',
        position: 'Chief Brand Officer',
        initials: 'CBO',
        name: '[Name]',
        department: 'Brand'
      }
    ]
  },
  governance: {
    title: 'Governance',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'structure',
        label: 'Structure',
        description: [
          'Regalitica operates under a clear governance framework that balances centralized oversight with venture-level autonomy.',
          'Our organizational structure includes a board of advisors, executive leadership, and venture teams, each with defined roles and responsibilities.',
          'This structure ensures strategic alignment across all initiatives while enabling agility and innovation at the operational level.'
        ]
      },
      {
        key: 'principles',
        label: 'Principles',
        description: [
          'Our governance principles are built on transparency, accountability, and ethical conduct. We maintain rigorous standards for decision-making and resource allocation.',
          'We prioritize long-term value creation over short-term gains, ensuring that every decision aligns with our mission and benefits all stakeholders.',
          'Integrity, innovation, and impact guide our operations — from how we select ventures to how we measure success and distribute outcomes.'
        ]
      }
    ]
  },
  affiliations: {
    title: 'Affiliations',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'investors',
        label: 'Investors',
        description: [
          'Our partner ecosystem includes technology providers, research institutions, industry leaders, and strategic investors.'
        ],
        entries: [
          {
            id: 'inv-1',
            name: 'Venture Capital Fund A',
            dateJoined: 'Q1 2024'
          },
          {
            id: 'inv-2',
            name: 'Strategic Investment Group B',
            dateJoined: 'Q2 2024'
          },
          {
            id: 'inv-3',
            name: 'Angel Investor Network C',
            dateJoined: 'Q3 2024'
          },
          {
            id: 'inv-4',
            name: 'Corporate Venture Partner D',
            dateJoined: 'Q4 2024'
          }
        ]
      },
      {
        key: 'sponsors',
        label: 'Sponsors',
        description: [
          'We partner with leading organizations and institutions that share our commitment to innovation and excellence.'
        ],
        entries: [
          {
            id: 'spo-1',
            name: 'Technology Institute A',
            dateJoined: 'Jan 2024'
          },
          {
            id: 'spo-2',
            name: 'Innovation Foundation B',
            dateJoined: 'Mar 2024'
          },
          {
            id: 'spo-3',
            name: 'Research University C',
            dateJoined: 'Jun 2024'
          }
        ]
      },
      {
        key: 'partners',
        label: 'Partners',
        description: [
          'Our partner ecosystem includes technology providers, research institutions, industry leaders, and strategic investors.'
        ],
        entries: [
          {
            id: 'par-1',
            name: 'Cloud Services Provider A',
            dateJoined: 'Feb 2024'
          },
          {
            id: 'par-2',
            name: 'AI Research Lab B',
            dateJoined: 'Apr 2024'
          },
          {
            id: 'par-3',
            name: 'Industry Solutions Partner C',
            dateJoined: 'Jul 2024'
          },
          {
            id: 'par-4',
            name: 'Global Consultancy Firm D',
            dateJoined: 'Sep 2024'
          }
        ]
      }
    ]
  },
  reachout: {
    title: 'Reach Out',
    buttonType: 'tabs',
    subsections: [
      {
        key: 'inquiry',
        label: 'Inquiry',
        description: [
          'Have questions about our ventures or want to learn more about what we do? We\'re here to help.',
          'Whether you\'re interested in our technology, exploring collaboration opportunities, or simply curious about our work, we welcome your inquiries.',
          'Contact us at inquiry@regalitica.com and our team will respond promptly to your questions.'
        ]
      },
      {
        key: 'funding-support',
        label: 'Funding & Support',
        description: [
          'We\'re always interested in connecting with investors who share our vision for technology-driven innovation.',
          'If you\'re looking to support ventures that combine strong fundamentals with transformative potential, we\'d love to discuss opportunities.',
          'Reach out to funding@regalitica.com to explore investment opportunities and learn about our current portfolio.'
        ]
      },
      {
        key: 'partner-with-us',
        label: 'Partner With Us',
        description: [
          'We seek strategic partners who can contribute expertise, resources, or market access to our ventures.',
          'Partnership opportunities include technology integrations, research collaborations, go-to-market initiatives, and more.',
          'Contact partnerships@regalitica.com to discuss how we can create value together.'
        ]
      }
    ]
  }
};