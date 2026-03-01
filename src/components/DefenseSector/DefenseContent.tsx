"use client";
import { DEFENSE_NAV_ITEMS } from './nav-data';

/* ═══════════════════════════════════════════════
   PLACEHOLDER content per tab+subtab
   ═══════════════════════════════════════════════ */

function getPlaceholderContent(tabId: string, subtabId: string): { title: string; desc: string; items: { title: string; desc: string; icon: string }[] } {
  const systemName = tabId === 'megiddo' ? 'Megiddo' : tabId === 'argos' ? 'Argos' : '';

  const contentMap: Record<string, { title: string; desc: string; items: { title: string; desc: string; icon: string }[] }> = {
    // Home
    'home:overview': {
      title: 'Defense Systems Division — Overview',
      desc: 'The Defense Systems Division operates at the frontier of sovereign-grade technology, developing platforms that redefine operational security, intelligence processing, and strategic deterrence.',
      items: [
        { title: 'Mission Statement', desc: 'Deliver asymmetric technological advantage through vertically integrated defense platforms designed for multi-domain operational superiority.', icon: 'bi-bullseye' },
        { title: 'Operational Domain', desc: 'Spanning signal intelligence, autonomous systems, predictive analytics, and hardened communications across land, sea, air, space, and cyber domains.', icon: 'bi-globe2' },
        { title: 'Strategic Posture', desc: 'Defensive by doctrine, decisive by capability — our systems are built to deter, detect, and respond with precision proportionality.', icon: 'bi-shield-check' },
      ],
    },
    'home:features': {
      title: 'Core Features & Capabilities',
      desc: 'A structured overview of the primary feature sets and technological differentiators across the defense systems portfolio.',
      items: [
        { title: 'Real-Time Intelligence Fusion', desc: 'Multi-source data aggregation with sub-second latency, fusing signals intelligence, satellite imagery, and ground sensor networks into unified operational awareness.', icon: 'bi-cpu' },
        { title: 'Autonomous Decision Support', desc: 'AI-assisted decision frameworks that augment human operators with predictive scenario modeling and optimized response recommendations.', icon: 'bi-lightning-charge' },
        { title: 'Hardened Communications', desc: 'Quantum-resistant encrypted communications architecture ensuring operational integrity under adversarial electronic warfare conditions.', icon: 'bi-lock' },
        { title: 'Modular Architecture', desc: 'Plug-and-play system design enabling rapid configuration for theater-specific requirements without compromising core platform integrity.', icon: 'bi-grid-3x3' },
      ],
    },
    'home:systems-portfolio': {
      title: 'Systems Portfolio',
      desc: 'The defense division maintains two primary operational platforms, each addressing distinct but complementary domains of modern defense technology.',
      items: [
        { title: 'MEGIDDO', desc: 'Multi-Environment Ground Intelligence and Dynamic Defense Operations — a comprehensive ground-to-space defense coordination platform.', icon: 'bi-crosshair' },
        { title: 'ARGOS', desc: 'Advanced Reconnaissance and Global Observation System — a persistent wide-area surveillance and intelligence processing platform.', icon: 'bi-eye' },
      ],
    },

    // Megiddo subtabs
    'megiddo:strategic-overview': {
      title: `${systemName} — Strategic Overview`,
      desc: `${systemName} represents a sovereign-grade defense coordination platform designed for multi-environment operational superiority.`,
      items: [
        { title: 'Platform Classification', desc: 'Tier-1 strategic defense platform with multi-domain integration capabilities spanning ground, maritime, aerial, and cyber operational theaters.', icon: 'bi-diagram-3' },
        { title: 'Operational Status', desc: 'Active development with modular subsystems in various stages of testing, integration, and operational deployment readiness.', icon: 'bi-activity' },
        { title: 'Integration Scope', desc: 'Designed for seamless integration with allied defense networks, NATO-standard data links, and proprietary secure communication channels.', icon: 'bi-link-45deg' },
      ],
    },
    'megiddo:operational-role': {
      title: `${systemName} — Operational Role`,
      desc: `The operational doctrine governing ${systemName} deployment, engagement parameters, and strategic positioning within the broader defense architecture.`,
      items: [
        { title: 'Primary Mission', desc: 'Theater-level coordination of defense assets with real-time situational awareness fusion and automated threat response orchestration.', icon: 'bi-bullseye' },
        { title: 'Secondary Capabilities', desc: 'Humanitarian operation support, disaster response coordination, and allied force interoperability in joint operational environments.', icon: 'bi-people' },
      ],
    },
    'megiddo:capabilities': {
      title: `${systemName} — Capabilities`,
      desc: 'Technical capability matrix detailing the operational parameters, performance envelopes, and system specifications.',
      items: [
        { title: 'Signal Processing', desc: 'Multi-spectrum signal intelligence processing with real-time classification, attribution, and geolocation capabilities.', icon: 'bi-broadcast' },
        { title: 'Autonomous Operations', desc: 'Semi-autonomous subsystem management with human-in-the-loop oversight for critical decision points.', icon: 'bi-robot' },
        { title: 'Environmental Resilience', desc: 'Operational certification across extreme temperature, electromagnetic, and kinetic threat environments.', icon: 'bi-shield-lock' },
      ],
    },
    'megiddo:architecture': {
      title: `${systemName} — Architecture`,
      desc: 'System architecture documentation covering hardware topology, software stack, and integration interfaces.',
      items: [
        { title: 'Core Architecture', desc: 'Distributed microservices architecture with edge computing nodes, central processing clusters, and redundant communication backbones.', icon: 'bi-hdd-stack' },
        { title: 'Data Pipeline', desc: 'Real-time data ingestion, processing, and distribution pipeline with guaranteed delivery and sub-100ms end-to-end latency.', icon: 'bi-arrow-repeat' },
      ],
    },
    'megiddo:framework': {
      title: `${systemName} — Framework`,
      desc: `Operational and development frameworks governing ${systemName} lifecycle management, upgrade protocols, and compliance verification.`,
      items: [
        { title: 'Development Framework', desc: 'Agile-hybrid development methodology with security-first design principles and continuous integration/deployment pipelines.', icon: 'bi-gear' },
        { title: 'Testing Framework', desc: 'Multi-stage verification including simulation, hardware-in-the-loop testing, and live operational evaluation protocols.', icon: 'bi-check2-all' },
      ],
    },
    'megiddo:documentations': {
      title: `${systemName} — Documentation`,
      desc: `Structured documentation library for ${systemName} system specifications, operational procedures, and maintenance protocols.`,
      items: [
        { title: 'Technical Specifications', desc: 'Detailed system specification documents covering all subsystems, interfaces, and performance parameters.', icon: 'bi-file-earmark-text' },
        { title: 'Operator Manuals', desc: 'Comprehensive operator training materials, standard operating procedures, and emergency response protocols.', icon: 'bi-journal-text' },
        { title: 'Integration Guides', desc: 'Technical integration documentation for allied system interoperability and third-party subsystem incorporation.', icon: 'bi-book' },
      ],
    },

    // Argos subtabs
    'argos:strategic-overview': {
      title: `${systemName} — Strategic Overview`,
      desc: `${systemName} is an advanced persistent surveillance and intelligence platform designed for continuous wide-area monitoring and threat detection.`,
      items: [
        { title: 'Platform Classification', desc: 'Tier-1 intelligence, surveillance, and reconnaissance (ISR) platform with global coverage capability and real-time processing.', icon: 'bi-diagram-3' },
        { title: 'Operational Status', desc: 'Active development with core surveillance subsystems in advanced testing and initial deployment qualification.', icon: 'bi-activity' },
        { title: 'Coverage Scope', desc: 'Multi-altitude, multi-spectrum observation capability from ground level to orbital assets with seamless handoff protocols.', icon: 'bi-binoculars' },
      ],
    },
    'argos:operational-role': {
      title: `${systemName} — Operational Role`,
      desc: `${systemName}'s operational role within the intelligence community and defense architecture — from strategic early warning to tactical support.`,
      items: [
        { title: 'Strategic Surveillance', desc: 'Continuous monitoring of areas of interest with automated change detection, anomaly flagging, and pattern recognition.', icon: 'bi-eye' },
        { title: 'Tactical Support', desc: 'Real-time intelligence feed to operational units with target identification, tracking, and engagement support capabilities.', icon: 'bi-crosshair' },
      ],
    },
    'argos:capabilities': {
      title: `${systemName} — Capabilities`,
      desc: `Technical capability specifications for the ${systemName} surveillance and reconnaissance platform.`,
      items: [
        { title: 'Multi-Spectrum Imaging', desc: 'Visible, infrared, synthetic aperture radar, and hyperspectral imaging with automated target recognition.', icon: 'bi-camera' },
        { title: 'Persistent Coverage', desc: '24/7 uninterrupted surveillance with automated asset handoff between orbital, aerial, and ground-based sensor platforms.', icon: 'bi-clock-history' },
        { title: 'AI-Driven Analysis', desc: 'Machine learning-powered image and signal analysis with automated reporting and human analyst augmentation.', icon: 'bi-cpu' },
      ],
    },
    'argos:architecture': {
      title: `${systemName} — Architecture`,
      desc: `System architecture and technical topology of the ${systemName} intelligence platform.`,
      items: [
        { title: 'Sensor Network', desc: 'Distributed sensor constellation with edge processing, secure data links, and centralized fusion architecture.', icon: 'bi-broadcast-pin' },
        { title: 'Processing Pipeline', desc: 'Scalable cloud-edge hybrid processing with automated triage, classification, and priority queuing for human review.', icon: 'bi-hdd-network' },
      ],
    },
    'argos:framework': {
      title: `${systemName} — Framework`,
      desc: `Development and operational frameworks for ${systemName} lifecycle management and continuous improvement.`,
      items: [
        { title: 'Collection Framework', desc: 'Structured intelligence collection protocols with automated tasking, scheduling, and quality assurance mechanisms.', icon: 'bi-collection' },
        { title: 'Dissemination Framework', desc: 'Tiered access intelligence distribution system with automated classification, redaction, and audience-appropriate formatting.', icon: 'bi-share' },
      ],
    },
    'argos:documentations': {
      title: `${systemName} — Documentation`,
      desc: `Documentation library for ${systemName} covering system specifications, analyst procedures, and data handling protocols.`,
      items: [
        { title: 'System Specifications', desc: 'Complete technical documentation of all Argos subsystems, sensor packages, and processing capabilities.', icon: 'bi-file-earmark-text' },
        { title: 'Analyst Procedures', desc: 'Standard operating procedures for intelligence analysts operating within the Argos ecosystem.', icon: 'bi-journal-text' },
        { title: 'Data Governance', desc: 'Data handling, retention, classification, and sharing policies governing all intelligence products.', icon: 'bi-shield-lock' },
      ],
    },

    // Request Demo
    'megiddo:request-demo': {
      title: 'Megiddo — Request Demo',
      desc: 'Schedule a classified demonstration of the Megiddo platform. Demonstrations are available to verified defense and government agencies upon clearance approval.',
      items: [
        { title: 'Demo Eligibility', desc: 'Demonstrations are restricted to verified government agencies, defense contractors with active clearances, and allied nation defense personnel.', icon: 'bi-person-badge' },
        { title: 'Demo Scope', desc: 'Live system walkthroughs of command interfaces, sensor fusion pipelines, and threat response simulations in a sandboxed operational environment.', icon: 'bi-display' },
        { title: 'Request Process', desc: 'Submit a formal inquiry through your designated defense liaison or via the secure contact portal. Typical processing time: 10–15 business days.', icon: 'bi-envelope-check' },
      ],
    },
    'argos:request-demo': {
      title: 'Argos — Request Demo',
      desc: 'Request a demonstration of the Argos intelligence platform. Access is granted on a need-to-know basis with appropriate security clearance verification.',
      items: [
        { title: 'Demo Eligibility', desc: 'Available to intelligence community stakeholders, allied defense organizations, and authorized government entities with verified credentials.', icon: 'bi-person-badge' },
        { title: 'Demo Scope', desc: 'Guided demonstration of persistent surveillance capabilities, AI-driven analysis pipelines, and real-time intelligence dissemination workflows.', icon: 'bi-display' },
        { title: 'Request Process', desc: 'Contact your designated intelligence liaison or submit a request through the secure inquiry channel. Standard processing time: 10–15 business days.', icon: 'bi-envelope-check' },
      ],
    },

    // Research & Development
    'rnd:rnd-overview': {
      title: 'Research & Development — Overview',
      desc: 'The R&D division drives breakthrough innovation across defense technology domains, from fundamental research to rapid prototyping and field-ready deployment.',
      items: [
        { title: 'Research Mission', desc: 'Advance the state of the art in autonomous systems, signal intelligence, quantum computing applications, and resilient network architectures.', icon: 'bi-lightbulb' },
        { title: 'Innovation Pipeline', desc: 'Structured technology readiness level (TRL) progression from conceptual research through prototype development to operational integration.', icon: 'bi-funnel' },
        { title: 'Collaboration Network', desc: 'Strategic partnerships with academic institutions, national labs, and allied defense research organizations to accelerate capability development.', icon: 'bi-diagram-3' },
      ],
    },
    'rnd:rnd-programs': {
      title: 'Research & Development — Programs',
      desc: 'Active R&D programs spanning multiple technology domains, each addressing critical gaps in current defense capabilities.',
      items: [
        { title: 'Project AXIOM', desc: 'Next-generation autonomous decision support system leveraging large-scale foundation models for real-time strategic analysis.', icon: 'bi-cpu' },
        { title: 'Project LATTICE', desc: 'Quantum-resistant communication protocol development for hardened command-and-control networks operating in contested electromagnetic environments.', icon: 'bi-lock' },
        { title: 'Project MERIDIAN', desc: 'Advanced geospatial intelligence platform combining synthetic aperture radar, multi-spectral imaging, and predictive terrain analysis.', icon: 'bi-geo-alt' },
        { title: 'Project SENTINEL', desc: 'Edge-deployed AI inference engines for real-time threat detection and classification at the tactical level with minimal latency.', icon: 'bi-shield-check' },
      ],
    },
    'rnd:rnd-publications': {
      title: 'Research & Development — Publications',
      desc: 'Selected publications, technical reports, and white papers from the defense R&D division, subject to classification and distribution restrictions.',
      items: [
        { title: 'Technical Reports', desc: 'Peer-reviewed technical reports on system architecture, performance benchmarks, and operational evaluation results.', icon: 'bi-file-earmark-text' },
        { title: 'White Papers', desc: 'Strategic analysis papers on emerging defense technology trends, threat landscape evolution, and capability gap assessments.', icon: 'bi-journal-richtext' },
        { title: 'Conference Proceedings', desc: 'Contributions to classified and unclassified defense technology conferences, symposiums, and working groups.', icon: 'bi-mortarboard' },
      ],
    },
  };

  return contentMap[`${tabId}:${subtabId}`] || {
    title: 'Section Under Development',
    desc: 'This section is currently being prepared.',
    items: [],
  };
}


/* ═══════════════════════════════════════════════
   DEFENSE CONTENT RENDERER
   ═══════════════════════════════════════════════ */

export default function DefenseContent({ tabId, subtabId }: { tabId: string; subtabId: string }) {
  const content = getPlaceholderContent(tabId, subtabId);
  const currentTab = DEFENSE_NAV_ITEMS.find(t => t.id === tabId)!;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 24px 6rem' }}>
      {/* Content header */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'ui-monospace, Menlo, monospace',
          fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
          fontWeight: 700, color: '#E31B54', marginBottom: '1.25rem',
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: '50%', background: '#E31B54',
            boxShadow: '0 0 0 0 rgba(227,27,84,.5)',
            animation: 'dfEyepulse 2s ease-in-out infinite',
          }} />
          {currentTab.label} {subtabId !== 'overview' ? `· ${currentTab.subtabs.find(s => s.id === subtabId)?.label}` : ''}
        </div>

        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700,
          letterSpacing: '-0.03em', lineHeight: 1.1,
          background: 'var(--text-gradient)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '1rem',
        }}>
          {content.title}
        </h1>

        <p style={{
          fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--content-muted)',
          maxWidth: 700,
        }}>
          {content.desc}
        </p>

        <div style={{
          width: 48, height: 2, background: '#E31B54', borderRadius: 999,
          boxShadow: '0 0 8px rgba(227,27,84,0.5)', marginTop: '1.5rem',
        }} />
      </div>

      {/* Content cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: content.items.length <= 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {content.items.map((item, i) => (
          <div key={i} style={{
            padding: '2rem', borderRadius: '0.75rem',
            border: '1px solid var(--border-color)', background: 'var(--gradient-card)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 2, background: 'linear-gradient(90deg, #E31B54, transparent)', opacity: 0.6 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 40, background: 'linear-gradient(to bottom, #E31B54, transparent)', opacity: 0.6 }} />

            <div style={{
              width: 44, height: 44, borderRadius: '10px',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-secondary)', marginBottom: '1rem',
            }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.1rem', color: 'var(--content-faint)' }} />
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.75, color: 'var(--content-tertiary)' }}>{item.desc}</p>

            <span style={{
              position: 'absolute', bottom: '0.75rem', right: '1rem',
              fontFamily: 'ui-monospace, Menlo, monospace',
              fontSize: '0.5rem', letterSpacing: '0.12em',
              color: 'var(--content-faint)', opacity: 0.4,
            }}>
              {String(i + 1).padStart(2, '0')}
            </span>
          </div>
        ))}
      </div>

      {/* Placeholder notice */}
      <div style={{
        marginTop: '3rem', padding: '3rem', borderRadius: '0.75rem',
        border: '1px dashed var(--border-dashed)', textAlign: 'center',
      }}>
        <i className="bi bi-hourglass-split" style={{ fontSize: '2rem', color: '#E31B54', marginBottom: '1rem', display: 'block' }} />
        <h3 style={{
          fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem',
          background: 'var(--text-gradient)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Section Under Active Development
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--content-muted)', maxWidth: 480, margin: '0 auto' }}>
          Detailed documentation, interactive system diagrams, and operational specifications are being compiled for this section.
        </p>
      </div>
    </div>
  );
}
