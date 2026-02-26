export interface Statement {
  id: string;
  title: string;
  date: string;
  tags: Array<'Public Disclosure' | 'Compliance' |  'Recruitment' | 'Governance' | 'Venture' | 'Capital' | 'Research & Development' | 'Partnerships' | 'Operations'>;
  content: string;
  pdfUrl?: string;
  linkUrl?: string;
}

export type InfoContentType = 
  | 'statements' 
  | 'news' 
  | 'attributions' 
  | 'licenses' 
  | 'terms' 
  | 'policies' 
  | 'documents'
  | 'investor-relations'
  | 'report';

export interface ContentData {
  title: string;
  icon: string;
  sections: {
    heading?: string;
    content: string[];
  }[];
}

export interface InformationGrid {
  id: InfoContentType;
  icon: string;
  title: string;
  description: string;
}

// Information Grid Items
export const informationGrids: InformationGrid[] = [
  {
    id: 'statements',
    icon: 'bi-bell',
    title: 'Releases',
    description: 'Statements, announcements, and important notices'
  },
  {
    id: 'news',
    icon: 'bi-images',
    title: 'Media',
    description: 'Latest news and media coverage'
  },
  {
    id: 'attributions',
    icon: 'bi-award',
    title: 'Attributions',
    description: 'Acknowledgments and credits'
  },
  {
    id: 'licenses',
    icon: 'bi-patch-check',
    title: 'Licenses',
    description: 'Software and content licensing information'
  },
  {
    id: 'terms',
    icon: 'bi-unlock2',
    title: 'Terms',
    description: 'Terms of service and usage agreements'
  },
  {
    id: 'policies',
    icon: 'bi-shield-check',
    title: 'Policies',
    description: 'Privacy, cookie, and acceptable use policies'
  },
  {
    id: 'documents',
    icon: 'bi-folder',
    title: 'Documents',
    description: 'Official legal documents and filings'
  },
  {
    id: 'investor-relations',
    icon: 'bi-graph-up-arrow',
    title: 'Investor Relations',
    description: 'Financial disclosures, reports, and investor resources'
  },
  {
    id: 'report',
    icon: 'bi-flag',
    title: 'Report',
    description: 'Report problems and contact our legal team'
  }
];

// Statements Data
export const statements: Statement[] = [
  {
    id: 'statement-001',
    title: 'Notus Regalia Holdings Announces Formation and Stealth Operating Framework',
    date: 'January 15, 2025',
    tags: ['Public Disclosure', 'Recruitment'],
    content: 'Notus Regalia Holdings has been formally established as a holding and venture-building entity focused on developing, stewarding, and scaling early-stage systems across multiple industries. Operating in a pre-seed, stealth phase, the entity will pursue capital-efficient experimentation and validation through a centralized platform designed for long-term value creation, prioritizing repeatable operating systems, shared infrastructure, and disciplined governance over isolated project execution.',
    pdfUrl: '/documents/formation-announcement.pdf',
    linkUrl: 'https://Notus Regalia.com/announcements/formation'
  },
  {
    id: 'statement-002',
    title: 'Portfolio Development Update: Healthcare and FinTech Ventures Progress to Beta',
    date: 'December 8, 2024',
    tags: ['Venture', 'Research & Development', 'Operations'],
    content: 'Two ventures under the Notus Regalia umbrella—AI Telemedicine Platform and Micro-Lending Blockchain—have successfully transitioned to private beta and beta testing phases respectively. The AI Telemedicine Platform is currently undergoing controlled deployment with select healthcare partners in underserved regions, demonstrating offline diagnostic capabilities and real-time synchronization protocols, while the blockchain-based microfinancing platform has completed smart contract audits and is conducting pilot programs with small business borrowers in three emerging markets.',
    pdfUrl: '/documents/q4-2024-venture-update.pdf'
  },
  {
    id: 'statement-003',
    title: 'Governance Framework and Operational Principles Published',
    date: 'November 22, 2024',
    tags: ['Governance', 'Compliance', 'Public Disclosure'],
    content: 'Notus Regalia has formalized its governance framework outlining decision-making protocols, resource allocation methodologies, and venture oversight mechanisms. The framework establishes clear delineation between holding entity responsibilities and individual venture operations, ensuring institutional discipline while maintaining operational flexibility through systems-first thinking, capital efficiency, asymmetric opportunity prioritization, and founder-operator alignment with long-term ownership structures, including standardized processes for venture validation, stage-gate advancement criteria, and risk management protocols across the portfolio.',
    linkUrl: 'https://Notus Regalia.com/governance/framework'
  },
  {
    id: 'statement-004',
    title: 'CleanTech Initiative Reaches Pilot Stage with Industrial Partners',
    date: 'October 30, 2024',
    tags: ['Venture', 'Research & Development', 'Partnerships'],
    content: 'The Smart Carbon Capture system has advanced to pilot deployment following successful prototype validation and environmental impact assessment, with three industrial facilities across manufacturing and energy sectors selected as initial pilot sites for IoT-enabled carbon monitoring and capture technology. Preliminary data indicates potential emissions reductions of 40-50% with real-time analytics capabilities significantly exceeding baseline projections, while strategic partnerships with carbon credit verification agencies are in advanced discussions to establish tradeable credit generation protocols.',
    pdfUrl: '/documents/cleantech-pilot-report.pdf',
    linkUrl: 'https://Notus Regalia.com/ventures/cleantech'
  },
  {
    id: 'statement-005',
    title: 'Strategic Infrastructure Investment: Shared Technical Platform Operational',
    date: 'September 18, 2024',
    tags: ['Operations', 'Capital', 'Research & Development'],
    content: 'Notus Regalia has completed development and deployment of centralized technical infrastructure designed to support multiple ventures simultaneously, including shared development environments, API frameworks, data analytics pipelines, and security protocols that compound execution efficiency across the portfolio. This infrastructure investment enables ventures to achieve production readiness 35-40% faster than traditional standalone development approaches, with modular architecture supporting integration that allows new ventures to leverage existing systems while maintaining operational independence where strategically appropriate.'
  },
  {
    id: 'statement-006',
    title: 'EdTech Platform Enters Testing Phase with Education Partners',
    date: 'August 12, 2024',
    tags: ['Venture', 'Partnerships', 'Research & Development'],
    content: 'The Adaptive STEM Learning platform has commenced testing phase in partnership with educational institutions across three developing regions, with initial cohorts of 500+ students engaging with AI-powered personalized learning paths showing promising engagement and comprehension improvements. Teacher feedback sessions have informed iterative refinements to interface design, content delivery mechanisms, and progress tracking analytics, while platform architecture supports both online and offline learning modes to address connectivity challenges prevalent in target deployment regions.',
    pdfUrl: '/documents/edtech-testing-report.pdf'
  },
  {
    id: 'statement-007',
    title: 'Notus Regalia Establishes Advisory Board for Long-Term Strategic Guidance',
    date: 'July 5, 2024',
    tags: ['Governance', 'Partnerships', 'Operations'],
    content: 'An advisory board comprising industry veterans, academic researchers, and operational experts has been established to provide strategic oversight and domain-specific guidance across healthcare technology, financial systems, sustainable infrastructure, and educational innovation. The advisory structure is designed to complement founder-operator decision-making with external perspective while maintaining operational autonomy, with quarterly strategic reviews assessing portfolio performance, validating market assumptions, and informing resource allocation decisions.',
    linkUrl: 'https://Notus Regalia.com/about/advisory-board'
  },
  {
    id: 'statement-008',
    title: 'Compliance and Regulatory Framework Certification Achieved',
    date: 'June 20, 2024',
    tags: ['Compliance', 'Governance', 'Operations'],
    content: 'Notus Regalia has completed comprehensive compliance assessments across all active ventures, achieving necessary certifications and regulatory approvals including HIPAA compliance certification for healthcare venture operations ensuring patient data protection and privacy standards, KYC/AML framework implementation for FinTech platform with preliminary regulatory approval in initial deployment markets, and ongoing compliance monitoring systems established to maintain adherence to evolving regulatory requirements across all sectors.',
    pdfUrl: '/documents/compliance-certification.pdf'
  }
];

// Content Data for each Information Hub section
export const contentData: Record<string, ContentData> = {
  'statements': {
    title: 'Statements & Notices',
    icon: 'bi-bell',
    sections: [
      {
        heading: 'Official Announcements',
        content: [
          'Welcome to our official statements and notices section. Here you will find important announcements, policy updates, and official communications from Notus Regalia.',
          'We are committed to transparency and keeping our stakeholders informed about significant developments, changes, and initiatives within our organization.'
        ]
      },
      {
        heading: 'Recent Updates',
        content: [
          'All statements are reviewed and approved by our communications team to ensure accuracy and clarity.',
          'For media inquiries or questions regarding any statement, please contact our press office.'
        ]
      }
    ]
  },
  'news': {
    title: 'News & Media',
    icon: 'bi-images',
    sections: [
      {
        heading: 'Latest News',
        content: [
          'Stay up to date with the latest news, press releases, and media coverage about Notus Regalia and our ventures.',
          'Our media section features company announcements, partnership news, product launches, and industry insights.'
        ]
      },
      {
        heading: 'Media Resources',
        content: [
          'Members of the press can access our media kit, high-resolution images, executive bios, and press contact information.',
          'For interview requests or media inquiries, please reach out to our communications team.'
        ]
      }
    ]
  },
  'attributions': {
    title: 'Attributions',
    icon: 'bi-award',
    sections: [
      {
        heading: 'Acknowledgments',
        content: [
          'We acknowledge and extend our gratitude to the creators and organizations behind the resources that made our projects possible.'
        ]
      }
    ]
  },
  'licenses': {
    title: 'Licenses',
    icon: 'bi-patch-check',
    sections: [
      {
        heading: 'Software Licenses',
        content: [
          'All software developed by Notus Regalia is subject to specific licensing terms. Please review the applicable license for each product or service.',
          'We respect intellectual property rights and comply with all relevant open-source licenses for third-party components used in our projects.'
        ]
      },
      {
        heading: 'Content Licensing',
        content: [
          'Original content, including text, graphics, and multimedia elements, is protected by copyright and may not be reproduced without permission.',
          'For licensing inquiries or permission requests, please contact our legal department.'
        ]
      }
    ]
  },
  'terms': {
    title: 'Terms & Conditions',
    icon: 'bi-unlock2',
    sections: [
      {
        heading: 'General Terms',
        content: [
          'By accessing and using our services, you agree to be bound by these Terms and Conditions. Please read them carefully.',
          'These terms govern your use of our website, products, and services. We reserve the right to modify these terms at any time with notice.'
        ]
      },
      {
        heading: 'User Responsibilities',
        content: [
          'Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.',
          'You agree to use our services in compliance with all applicable laws and regulations and to respect the rights of other users.'
        ]
      },
      {
        heading: 'Limitation of Liability',
        content: [
          'Our services are provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages.',
          'The maximum liability shall not exceed the amount paid by you for the specific service giving rise to the claim.'
        ]
      }
    ]
  },
  'privacy': {
    title: 'Privacy & Cookie Policy',
    icon: 'bi-shield-check',
    sections: [
      {
        heading: 'Data Collection',
        content: [
          'We collect information to provide better services to our users. This includes personal information you provide and data collected automatically.',
          'We are committed to protecting your privacy and handling your data with care and respect in accordance with applicable data protection laws.'
        ]
      },
      {
        heading: 'Cookie Usage',
        content: [
          'Our website uses cookies to enhance user experience, analyze site traffic, and personalize content. You can control cookie settings through your browser.',
          'Essential cookies are necessary for the website to function properly, while optional cookies help us improve our services.'
        ]
      },
      {
        heading: 'Data Protection',
        content: [
          'We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.',
          'You have rights regarding your personal data, including the right to access, correct, delete, or restrict processing of your information.'
        ]
      }
    ]
  },
  'acceptable-use': {
    title: 'Acceptable Use Policy',
    icon: 'bi-check-circle',
    sections: [
      {
        heading: 'Permitted Use',
        content: [
          'Our services are intended for lawful purposes only. You may use our platform to access information, engage with content, and utilize provided features.',
          'We encourage responsible and ethical use of our services that respects the rights and dignity of all users and stakeholders.'
        ]
      },
      {
        heading: 'Prohibited Activities',
        content: [
          'Users must not engage in activities that could harm, disable, or impair our services or interfere with other users\' access.',
          'Prohibited activities include: distributing malware, attempting unauthorized access, harassing other users, violating intellectual property rights, or using our services for illegal purposes.'
        ]
      },
      {
        heading: 'Enforcement',
        content: [
          'Violations of this policy may result in immediate termination of access, removal of content, and legal action if necessary.',
          'We reserve the right to investigate suspected violations and cooperate with law enforcement authorities when appropriate.'
        ]
      }
    ]
  },
  'investor-relations': {
    title: 'Investor Relations',
    icon: 'bi-graph-up-arrow',
    sections: [
      {
        heading: 'Overview',
        content: [
          'Notus Regalia is committed to maintaining transparent and open communication with its investor community. This section provides access to financial disclosures, performance updates, and investor resources.',
          'As a pre-seed, stealth-phase holding entity, our investor relations materials reflect our current stage of development and long-term value creation strategy.'
        ]
      },
      {
        heading: 'Financial Disclosures',
        content: [
          'Periodic financial updates and capital allocation summaries are made available to accredited investors and stakeholders in accordance with applicable securities regulations.',
          'For access to confidential financial materials, please contact our investor relations team to verify your accreditation status.'
        ]
      },
      {
        heading: 'Investor Resources',
        content: [
          'Registered investors may access pitch decks, due diligence materials, cap table summaries, and venture performance reports through our secure investor portal.',
          'Quarterly updates are distributed to all active investors detailing portfolio progress, key milestones achieved, and forward-looking operational priorities.'
        ]
      },
      {
        heading: 'Contact Investor Relations',
        content: [
          'For inquiries related to investment opportunities, existing positions, or shareholder matters, please contact our investor relations team at ir@notusregalia.com.',
          'All investor communications are handled in strict confidence and in compliance with applicable financial regulations and non-disclosure obligations.'
        ]
      }
    ]
  },
  'report': {
    title: 'Report a Problem',
    icon: 'bi-flag',
    sections: [
      {
        heading: 'Report an Issue',
        content: [
          'If you have encountered a problem with our website, services, or content, please let us know. We take all reports seriously and will investigate promptly.',
          'When submitting a report, please include as much detail as possible, including the nature of the issue, any relevant URLs, screenshots, and the date and time the issue occurred.'
        ]
      },
      {
        heading: 'Contact Our Legal Team',
        content: [
          'For legal inquiries, intellectual property concerns, DMCA takedown requests, or regulatory matters, please contact our legal department at legal@Notus Regalia.com.',
          'Our legal team is available to address concerns related to compliance, data protection, contractual disputes, and any other legal matters pertaining to Notus Regalia and its ventures.'
        ]
      },
      {
        heading: 'Report Categories',
        content: [
          'Security Vulnerabilities — If you have identified a security vulnerability, please report it responsibly. Do not disclose the vulnerability publicly before it has been addressed.',
          'Content Issues — Report inaccurate, misleading, or inappropriate content found on our platform. Include the specific URL and a description of the concern.',
          'Abuse & Misconduct — Report any suspected misuse of our services, harassment, fraud, or violations of our Terms of Service or Acceptable Use Policy.'
        ]
      },
      {
        heading: 'What Happens After You Report',
        content: [
          'All reports are reviewed by our team within 48 business hours. You will receive an acknowledgment of your report along with a reference number for tracking purposes.',
          'We may follow up with you for additional information. Reports are handled confidentially and in accordance with applicable laws and our privacy policies.'
        ]
      }
    ]
  }
};