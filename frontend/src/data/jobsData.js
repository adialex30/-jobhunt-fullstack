export const JOB_CATEGORIES = [
  'All Sectors',
  'Engineering',
  'AI & Research',
  'Design & Creative',
  'Executive & Product'
];

export const WORK_TYPES = [
  'All Types',
  'Remote',
  'Hybrid',
  'On-site'
];

export const POPULAR_TAGS = [
  'WebGL',
  'Three.js',
  'AI Agents',
  'PyTorch',
  'Design Systems',
  'Rust',
  'React',
  'Spatial Computing',
  'Generative Audio'
];

export const JOBS_DATABASE = [
  {
    id: 'FM-ROLE-101',
    title: 'Lead Creative Technologist',
    company: 'FORCE MAJEURE ATELIER',
    logoInitials: 'FM',
    location: 'Paris, France',
    workType: 'Hybrid',
    category: 'Engineering',
    salaryFormatted: '€130,000 – €160,000 / YR',
    salaryMin: 130000,
    salaryMax: 160000,
    currency: 'EUR',
    postedTime: '2 hours ago',
    featured: true,
    verifiedStudio: true,
    tags: ['WebGL', 'Three.js', 'React', 'GLSL', 'Creative Direction'],
    overview: 'Force Majeure Atelier is seeking a Lead Creative Technologist to spearhead the intersection of high luxury digital craftsmanship, bespoke WebGL rendering, and fluid interaction architecture.',
    responsibilities: [
      'Architect and develop custom 3D web experiences using WebGL, Three.js, and custom shaders (GLSL).',
      'Collaborate closely with Paris-based art directors and typographers to translate avant-garde identities into responsive digital artifacts.',
      'Establish core performance benchmarks maintaining smooth 60fps rendering across desktop and mobile devices.',
      'Mentor and elevate junior technologists across computational aesthetics and browser rendering pipelines.'
    ],
    requirements: [
      '6+ years experience building bespoke interactive web applications and award-winning experiences.',
      'Exceptional mastery of modern JavaScript, React, WebGL, GLSL, and performance optimization.',
      'Refined eye for typography, spatial composition, kinetic motion, and micro-interactions.',
      'Comfortable communicating in English and collaborating in an international design studio.'
    ],
    perks: [
      'Bespoke studio space in central Paris with hybrid flexibility (2 days remote/week).',
      'Annual luxury retreat and international creative conference allowance (€4,000).',
      'Comprehensive European health insurance, wellness stipend, and hardware budget.'
    ],
    studio: {
      headquarters: 'Paris, 3e Arrondissement',
      size: '35 - 50 members',
      founded: '2021',
      ethos: 'Radical aesthetic precision applied to future-proof technical platforms.'
    }
  },
  {
    id: 'FM-ROLE-102',
    title: 'Staff AI Research Scientist',
    company: 'SYNTHESIS NEURAL LABS',
    logoInitials: 'SN',
    location: 'Tokyo, Japan',
    workType: 'Hybrid',
    category: 'AI & Research',
    salaryFormatted: '¥22,000,000 – ¥28,000,000 / YR',
    salaryMin: 145000,
    salaryMax: 185000,
    currency: 'JPY',
    postedTime: '4 hours ago',
    featured: true,
    verifiedStudio: true,
    tags: ['AI Agents', 'PyTorch', 'Diffusion', 'Transformer', 'C++'],
    overview: 'Synthesis Neural Labs conducts fundamental research in continuous multimodal foundation models and interactive reasoning agents operating with microsecond latency.',
    responsibilities: [
      'Lead empirical research on sparse attention architectures and real-time diffusion models.',
      'Publish novel findings in top-tier research venues (NeurIPS, ICML, CVPR).',
      'Collaborate with systems engineers to compress and quantize models for edge deployments.',
      'Formulate research agendas for autonomous cognitive tool-use and multi-agent interaction.'
    ],
    requirements: [
      'Ph.D. in Computer Science, Machine Learning, Applied Mathematics, or equivalent track record.',
      'First-author publications at primary ML conferences within the past 3 years.',
      'Fluency with PyTorch, distributed training infrastructure (DeepSpeed, Megatron), and CUDA kernels.',
      'Passion for advancing human-machine co-intelligence.'
    ],
    perks: [
      'Direct compute access to dedicated H100 clusters.',
      'Relocation assistance to Tokyo and housing subsidy in Roppongi/Shibuya.',
      'Flexible intellectual property allowances for open-source academic contributions.'
    ],
    studio: {
      headquarters: 'Tokyo, Minato City',
      size: '60 - 80 researchers',
      founded: '2022',
      ethos: 'Pioneering mathematical clarity in neuro-symbolic reasoning systems.'
    }
  },
  {
    id: 'FM-ROLE-103',
    title: 'Principal Design Systems Architect',
    company: 'KINETIX PLATFORM',
    logoInitials: 'KP',
    location: 'London, United Kingdom',
    workType: 'Remote',
    category: 'Design & Creative',
    salaryFormatted: '£115,000 – £145,000 / YR',
    salaryMin: 135000,
    salaryMax: 170000,
    currency: 'GBP',
    postedTime: '6 hours ago',
    featured: false,
    verifiedStudio: true,
    tags: ['Design Systems', 'Figma Tokens', 'React', 'Accessibility', 'Typography'],
    overview: 'Kinetix is standardizing user interface architectures for financial engineering institutions. We need a Principal Design Systems Architect to curate unified multi-platform primitives.',
    responsibilities: [
      'Design, govern, and maintain universal design token pipelines connecting Figma to React and native clients.',
      'Champion WCAG 2.2 AAA accessibility standards across complex data visualization components.',
      'Partner with enterprise engineering squads to achieve seamless design-to-code velocity.',
      'Author rigorous documentation, component guidelines, and interactive documentation.'
    ],
    requirements: [
      '7+ years experience leading enterprise or multi-brand design system initiatives.',
      'Deep fluency with CSS custom properties, headless UI patterns, and TypeScript component authoring.',
      'Exceptional design sensibility paired with systematic software architecture rigor.'
    ],
    perks: [
      '100% remote working contract across UK & EU timezones.',
      'Home studio setup grant (£3,000) and annual hardware refresh.',
      'Generous pension matching up to 9%.'
    ],
    studio: {
      headquarters: 'London, Shoreditch',
      size: '120 - 150 members',
      founded: '2019',
      ethos: 'Quiet utility, geometric precision, and mathematical consistency.'
    }
  },
  {
    id: 'FM-ROLE-104',
    title: 'Vice President of Product Experience',
    company: 'AETHER DIGITAL HOLDINGS',
    logoInitials: 'AD',
    location: 'New York, United States',
    workType: 'On-site',
    category: 'Executive & Product',
    salaryFormatted: '$260,000 – $320,000 / YR',
    salaryMin: 260000,
    salaryMax: 320000,
    currency: 'USD',
    postedTime: '12 hours ago',
    featured: true,
    verifiedStudio: true,
    tags: ['Executive', 'Product Strategy', 'Fintech', 'Roadmap', 'Design Vision'],
    overview: 'Aether Digital is curating high-trust wealth management infrastructure for global creative founders. Seeking an executive VP of Product Experience to unite product strategy and customer experience.',
    responsibilities: [
      'Define multi-year product roadmap spanning web, mobile, and executive private dashboards.',
      'Manage and expand an elite team of 25+ product managers, designers, and user researchers.',
      'Deliver institutional-grade security with the refinement of a bespoke private client portal.',
      'Report directly to the CEO and Board of Directors on key adoption, retention, and growth metrics.'
    ],
    requirements: [
      '10+ years executive product leadership experience in high-growth technology or fintech.',
      'Proven track record scaling digital products from zero-to-one and ten-to-one hundred.',
      'Exceptional narrative communication, executive poise, and strategic financial acumen.'
    ],
    perks: [
      'Significant executive equity grant with accelerated vesting milestones.',
      'Private Manhattan office overlooking Madison Square Park.',
      'Full family healthcare coverage and executive coaching allowance.'
    ],
    studio: {
      headquarters: 'New York, Flatiron District',
      size: '200+ members',
      founded: '2018',
      ethos: 'Where institutional capital meets sovereign creative identity.'
    }
  },
  {
    id: 'FM-ROLE-105',
    title: 'Senior Rust Infrastructure Engineer',
    company: 'CHRONOS PROTOCOL',
    logoInitials: 'CP',
    location: 'Berlin, Germany',
    workType: 'Hybrid',
    category: 'Engineering',
    salaryFormatted: '€110,000 – €140,000 / YR',
    salaryMin: 110000,
    salaryMax: 140000,
    currency: 'EUR',
    postedTime: '1 day ago',
    featured: false,
    verifiedStudio: true,
    tags: ['Rust', 'Async IO', 'Distributed Systems', 'Linux', 'Tokio'],
    overview: 'Chronos Protocol is engineering ultra-low-latency distributed consensus engines. We are looking for an experienced Rust engineer with passion for zero-cost abstractions and lock-free concurrency.',
    responsibilities: [
      'Build deterministic consensus state machines in idiomatic, memory-safe Rust.',
      'Benchmark and optimize memory allocations, cache locality, and asynchronous I/O with Tokio.',
      'Write fuzzing suites and property-based tests to verify distributed fault tolerance.',
      'Participate in open architectural peer reviews and RFC specifications.'
    ],
    requirements: [
      '4+ years commercial experience writing production systems in Rust.',
      'Solid intuition for network protocols (TCP, QUIC, gRPC) and Linux kernel tracing (eBPF).',
      'Strong foundations in concurrent algorithms and formal verification.'
    ],
    perks: [
      'Spacious Mitte loft with open rooftop and barista-grade coffee atelier.',
      'German public transit pass and subsidized BVG ticket.',
      'Flexible 32 or 40-hour work week options.'
    ],
    studio: {
      headquarters: 'Berlin, Mitte',
      size: '40 - 60 engineers',
      founded: '2020',
      ethos: 'Deterministic performance without runtime overhead.'
    }
  },
  {
    id: 'FM-ROLE-106',
    title: 'Head of Spatial Computing & Vision',
    company: 'MONOLITH XR STUDIOS',
    logoInitials: 'MX',
    location: 'Zurich, Switzerland',
    workType: 'Hybrid',
    category: 'AI & Research',
    salaryFormatted: 'CHF 175,000 – 210,000 / YR',
    salaryMin: 185000,
    salaryMax: 220000,
    currency: 'CHF',
    postedTime: '1 day ago',
    featured: true,
    verifiedStudio: true,
    tags: ['Spatial Computing', 'Vision OS', 'Metal', 'SLAM', 'SwiftUI'],
    overview: 'Monolith XR develops spatial operating environments and real-time volumetric telepresence software for architects, surgeons, and industrial designers.',
    responsibilities: [
      'Lead our spatial engineering lab developing real-time SLAM tracking and neural radiance rendering.',
      'Collaborate with optics specialists and hardware designers on vision-guided interaction models.',
      'Define spatial interface guidelines for Apple Vision Pro, Meta Quest Pro, and custom headsets.',
      'Scale the spatial runtime engineering team across Switzerland and Germany.'
    ],
    requirements: [
      'Proven expertise in spatial computing, 3D computer vision, point-cloud processing, or robotics.',
      'Proficiency in C++, Metal/Vulkan, and modern spatial frameworks (visionOS, RealityKit).',
      'Degree in Computer Vision, Applied Physics, or equivalent industrial mastery.'
    ],
    perks: [
      'Zurich lakeside laboratory with state-of-the-art optical capture equipment.',
      'Swiss pension plan contribution with premium private insurance package.',
      'Winter ski studio pass and alpine retreat weeks.'
    ],
    studio: {
      headquarters: 'Zurich, Enge',
      size: '30 - 45 specialists',
      founded: '2023',
      ethos: 'Transcending flat screens into perceptually continuous spatial reality.'
    }
  },
  {
    id: 'FM-ROLE-107',
    title: 'Director of Interactive Brand Experience',
    company: 'STUDIO HYPERBOLA',
    logoInitials: 'SH',
    location: 'Amsterdam, Netherlands',
    workType: 'Remote',
    category: 'Design & Creative',
    salaryFormatted: '€105,000 – €135,000 / YR',
    salaryMin: 105000,
    salaryMax: 135000,
    currency: 'EUR',
    postedTime: '2 days ago',
    featured: false,
    verifiedStudio: true,
    tags: ['Creative Direction', 'Typography', 'Interactive Design', 'Branding', 'Figma'],
    overview: 'Studio Hyperbola crafts digital identity systems and brand universes for progressive cultural foundations, luxury watchmakers, and high-growth technology pioneers.',
    responsibilities: [
      'Direct multidisciplinary design squads through concept exploration, identity design, and web execution.',
      'Present strategic creative narratives to international brand stakeholders and founders.',
      'Cultivate custom editorial typefaces and kinetic animation styles across digital campaigns.',
      'Maintain aesthetic integrity from initial pitch decks to code release.'
    ],
    requirements: [
      '8+ years in progressive design studios or creative agency leadership roles.',
      'An exceptional portfolio showcasing avant-garde typography and digital storytelling.',
      'Articulate verbal presenter and empathetic design team mentor.'
    ],
    perks: [
      'Remote-first Dutch contract with optional canal-side studio workspace in Amsterdam.',
      'Generous holiday allowance (32 paid days annually).',
      'Dedicated annual personal creative project budget (€5,000).'
    ],
    studio: {
      headquarters: 'Amsterdam, Jordaan',
      size: '25 - 35 creators',
      founded: '2019',
      ethos: 'Sensory storytelling anchored in enduring typographic tradition.'
    }
  },
  {
    id: 'FM-ROLE-108',
    title: 'Staff Frontend Architect (Canvas & WebGPU)',
    company: 'NEXUS DATA ARCHITECTURE',
    logoInitials: 'ND',
    location: 'Stockholm, Sweden',
    workType: 'Remote',
    category: 'Engineering',
    salaryFormatted: 'SEK 1,200,000 – 1,500,000 / YR',
    salaryMin: 115000,
    salaryMax: 145000,
    currency: 'SEK',
    postedTime: '3 days ago',
    featured: false,
    verifiedStudio: false,
    tags: ['WebGPU', 'Canvas', 'TypeScript', 'Data Viz', 'React'],
    overview: 'Nexus is building real-time data exploration platforms rendering millions of telemetry nodes with zero frame drops using WebGPU and off-screen workers.',
    responsibilities: [
      'Architect our next-generation browser visualization engine utilizing WebGPU compute pipelines.',
      'Design modular component libraries supporting complex node graphs and temporal query scrubbers.',
      'Optimize memory allocation using WebAssembly buffers and parallel web workers.',
      'Write exhaustive end-to-end integration test suites ensuring cross-browser reliability.'
    ],
    requirements: [
      'Strong background in browser graphics (HTML5 Canvas, WebGL, or early WebGPU exploration).',
      'Mastery of modern TypeScript, functional data structures, and profiling memory leaks.',
      'Clear documentation habits and dedication to clean, modular codebases.'
    ],
    perks: [
      'Flexible remote schedule with core collaboration hours (10:00 – 15:00 CET).',
      'Nordic wellness benefits and parental leave policies.',
      'Annual studio gatherings in Stockholm archipelago.'
    ],
    studio: {
      headquarters: 'Stockholm, Södermalm',
      size: '50 - 75 members',
      founded: '2021',
      ethos: 'Revealing order and aesthetic clarity from planetary-scale data streams.'
    }
  }
];
