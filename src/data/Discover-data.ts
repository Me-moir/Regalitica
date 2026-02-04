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

export interface WorldContent {
  title: string;
  description: string;
}

export interface WorldGridItem {
  key: 'enterprise' | 'direction' | 'teams' | 'governance' | 'affiliations' | 'reachout';
  title: string;
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
    icon: 'bi-bounding-box',
    title: 'Systems-First Governance',
    description:
      'We prioritize repeatable operating systems for ideation, validation, execution, and scale over isolated experimentation.'
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
  },
  {
    icon: 'bi-stars',
    title: 'Shared Infrastructure',
    description:
      'Ventures leverage centralized technical, operational, and strategic infrastructure designed to compound execution efficiency.'
  },
  {
    icon: 'bi-share',
    title: 'Selective External Alignment',
    description:
      'We engage selectively with external partners and institutions where alignment supports long-term structural objectives.'
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
  { key: 'enterprise', title: 'Enterprise' },
  { key: 'direction', title: 'Direction' },
  { key: 'teams', title: 'Teams' },
  { key: 'governance', title: 'Governance' },
  { key: 'affiliations', title: 'Affiliations' },
  { key: 'reachout', title: 'Reach Out' }
];

export const WORLD_CONTENT_DATA: Record<'enterprise' | 'direction' | 'teams' | 'governance' | 'affiliations' | 'reachout', WorldContent> = {
  enterprise: {
    title: 'Enterprise',
    description: 'We build and scale ventures that drive meaningful innovation across industries. Our enterprise-focused approach combines strategic vision with operational excellence to create sustainable, high-impact businesses that transform markets and deliver lasting value.'
  },
  direction: {
    title: 'Direction',
    description: 'Our strategic direction is guided by a commitment to innovation, sustainability, and long-term value creation. We identify emerging opportunities, leverage cutting-edge technologies, and forge strategic partnerships to stay ahead in an ever-evolving business landscape.'
  },
  teams: {
    title: 'Teams',
    description: 'At the heart of Regalitica are talented, passionate teams dedicated to excellence. We bring together diverse expertise in technology, business strategy, design, and operations to build ventures that make a difference. Our collaborative culture fosters creativity and drives results.'
  },
  governance: {
    title: 'Governance',
    description: 'Our governance structure ensures transparency, accountability, and strategic alignment across all ventures. We operate with a clear framework that balances innovation with responsible management, maintaining the highest standards of ethical conduct and stakeholder value.'
  },
  affiliations: {
    title: 'Affiliations',
    description: 'We foster strategic partnerships and collaborations with leading organizations, academic institutions, and industry innovators. Our network of affiliations enables us to access cutting-edge research, share best practices, and create synergies that amplify our impact across all ventures.'
  },
  reachout: {
    title: 'Reach Out',
    description: 'Connect with us to explore collaboration opportunities, learn more about our ventures, or discuss how we can work together. Our team is always open to engaging with visionaries, entrepreneurs, and organizations that share our commitment to innovation and excellence.'
  }
};

export const WORLD_TITLE = 'Inside our World';