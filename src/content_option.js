const logotext = "arsh";

const meta = {
    title: "Arsh Goyal",
    description: "Arsh Goyal — software engineer and product builder at IIT Jodhpur. Backend systems, AI tooling, and products that ship.",
};

const introdata = {
    name: "Arsh Goyal",
    role: "Software Engineer & Product Builder",
    status: "Software Dev & Product Intern at Intratrade",
    headline: "I design & build",
    rotating: ["backend systems", "AI agents", "developer tools", "products"],
    headlineEnd: "that ship.",
    lead: "I design backend systems, wire AI into real workflows, and increasingly own the product decisions around them — currently shipping at Intratrade and 24x7 SaralTech.",
    description: "EE undergrad at IIT Jodhpur. I design APIs and distributed systems, wire LLMs into real workflows, and increasingly own the product side too — PRDs, roadmaps, and the metrics that decide what gets built.",
    location: "Jodhpur, India",
    resume: "https://drive.google.com/file/d/1cKNlUD-u3qwowODphiLZSoYzU_S9l_mf/view?usp=sharing",
};

// Page sections, in order (used by the nav, section rail and command menu).
const sections = [
    { id: "top", label: "Home" },
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "work", label: "Work" },
    { id: "skills", label: "Skills" },
    { id: "highlights", label: "Highlights" },
    { id: "contact", label: "Contact" },
];

// Words wrapped in *asterisks* are highlighted as they light up.
const manifesto = "I'm an electrical engineering student at *IIT Jodhpur* who ended up living in software. I design *APIs*, *distributed systems* and *AI agents* — and lately, the *product decisions* around them. I care about the unglamorous parts: latency, data models, and the thing *actually shipping*.";

const stats = [
    { value: "8.50", label: "CGPA · IIT Jodhpur" },
    { value: "600+", label: "LeetCode problems" },
    { value: "4★", label: "CodeChef · 1800+" },
    { value: "29", label: "Merged open-source PRs" },
];

const dataabout = {
    title: "Engineer first, product-minded always.",
    aboutme: [
        "I'm a B.Tech Electrical Engineering student at IIT Jodhpur who fell hard for software. Most of my time goes into the layer beneath the interface — REST APIs, data pipelines, auth, caching, and the distributed plumbing that keeps products fast.",
        "Over the last year I've shipped production work across healthcare SaaS, AI market intelligence, and CMS-driven platforms. Lately I've been leaning into product: writing PRDs, mapping user journeys, and turning fuzzy problems into scoped, measurable features.",
    ],
    education: {
        school: "Indian Institute of Technology, Jodhpur",
        degree: "B.Tech in Electrical Engineering",
        date: "Aug 2024 – Present",
        grade: "CGPA 8.50 / 10",
    },
};

const worktimeline = [{
        jobtitle: "Software Development cum Product Intern",
        where: "Intratrade Private Limited",
        date: "Sep 2026 – Present",
        points: [
            "Own the feature roadmap and PRDs for CIMBOXE, an AI market-intelligence platform, aligning engineering and content teams with business goals.",
            "Run SEO keyword research and content optimisation, feeding findings into feature prioritisation.",
            "Facilitate weekly milestone reviews with the Director to keep releases on spec and on time.",
        ],
        tags: ["Product", "PRDs", "SEO", "Roadmapping"],
    },
    {
        jobtitle: "Software Engineer Intern",
        where: "24x7 SaralTech",
        date: "Jun 2026 – Present",
        points: [
            "Migrated content delivery from hardcoded deployments to Strapi CMS-driven Next.js pages with SSR — cutting non-developer update time by 80%.",
            "Built REST integrations between Next.js and Strapi with validation, error handling, and Redis response caching.",
        ],
        tags: ["Next.js", "Strapi", "Redis", "SSR"],
    },
    {
        jobtitle: "Software Engineer Intern",
        where: "CareEase Homecare Services",
        date: "Apr 2026 – Jun 2026",
        points: [
            "Merged 45 PRs across three full-stack epics on a healthcare SaaS using FastAPI, Next.js 14, and Supabase PostgreSQL with Row-Level Security.",
            "Architected a Next.js BFF proxy forwarding Supabase JWT auth to FastAPI — 40% lower data-fetch latency via query optimisation and pooling.",
        ],
        tags: ["FastAPI", "Next.js", "PostgreSQL", "RLS"],
        certificate: "https://drive.google.com/file/d/11UaTt9Vbjh47fc7AjENAj9gKgNJvLzE8/view?usp=sharing",
    },
    {
        jobtitle: "Backend Engineer Intern",
        where: "Intratrade Private Limited",
        date: "Apr 2026 – May 2026",
        points: [
            "Designed REST APIs for CIMBOXE, ingesting live market feeds into a normalised PostgreSQL schema with sub-second queries.",
            "Wrote Python ETL pipelines that parse, validate, and store market data — eliminating manual preprocessing for analytics.",
        ],
        tags: ["Python", "ETL", "PostgreSQL", "REST"],
        certificate: "https://drive.google.com/file/d/1Z9A3hW-0ifY_6G23mwz2ku2FaTtzIzxt/view?usp=drive_link",
    },
    {
        jobtitle: "Freelance Web Developer",
        where: "Self-employed",
        date: "Jul 2025 – Present",
        points: [
            "Ship production websites and full-stack apps for clients end-to-end — from design systems to deployment.",
        ],
        tags: ["React", "Node.js", "Deployment"],
    },
];

const skills = [{
        group: "Languages",
        items: ["Python", "JavaScript", "TypeScript", "C / C++", "Java", "SQL"],
    },
    {
        group: "Backend",
        items: ["Node.js", "Express", "FastAPI", "GraphQL", "REST", "WebSockets"],
    },
    {
        group: "Frontend",
        items: ["React", "Next.js", "Tailwind CSS", "Strapi CMS"],
    },
    {
        group: "Data",
        items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "ChromaDB", "Neo4j"],
    },
    {
        group: "Infra & Cloud",
        items: ["Docker", "AWS (S3 · EC2 · Lambda)", "Kafka", "CI/CD", "Git"],
    },
    {
        group: "AI / ML",
        items: ["PyTorch", "TensorFlow", "LLMs", "RAG", "Transformers"],
    },
    {
        group: "Product",
        items: ["PRDs", "User story mapping", "Roadmaps & OKRs", "GTM", "Unit economics", "Figma", "Jira"],
    },
];

const marquee = [
    "Python", "TypeScript", "Node.js", "FastAPI", "Next.js", "React", "PostgreSQL",
    "Redis", "Kafka", "Neo4j", "Docker", "AWS", "PyTorch", "LLMs", "RAG", "C++",
];

const projects = [{
        name: "Nexus",
        tagline: "Distributed code-intelligence platform",
        description: "Seven independent Kafka-connected microservices — ingestion, parsing, embedding, graph, AI — each deployable in isolation. A RAG pipeline blends ChromaDB vector search with Neo4j dependency traversal to produce automated code reviews with structured risk scores for any Git repo.",
        tech: ["FastAPI", "Kafka", "Neo4j", "ChromaDB", "Docker"],
        date: "Aug 2025 – Apr 2026",
        links: { github: "https://github.com/Eternity0207/NeXus" },
        featured: true,
    },
    {
        name: "Reva",
        tagline: "Natural-language AI agent for your OS",
        description: "Turns plain English into OS actions using LLM inference and CLIP-based UI element detection. 90% task-completion accuracy across Linux, Windows, and macOS with sub-200 ms latency.",
        tech: ["FastAPI", "PyQt6", "LLMs", "Computer Vision"],
        date: "Dec 2024",
        links: { live: "https://reva.webhop.me/", github: "https://github.com/Eternity0207/REVA" },
    },
    {
        name: "Whispr",
        tagline: "P2P encrypted messaging in C",
        description: "AES-256 with Diffie-Hellman key exchange and forward secrecy over TCP. A POSIX thread pool handles 50+ concurrent sessions with salted-hash authentication.",
        tech: ["C", "OpenSSL", "Sockets", "pthreads"],
        date: "Nov 2024",
        links: { github: "https://github.com/Eternity0207/Whispr" },
    },
];

const caseStudies = [{
        name: "D2C Foundry",
        tagline: "Dropshipping ideation platform",
        description: "Scoped end-to-end: validated product ideas with supplier data, margin calculators, and trend signals — cutting ideation from weeks to hours. Launched with trend filtering + margin calc as the wedge.",
        date: "Sep 2026",
        links: {
            live: "https://d2c-foundry.vercel.app/",
            study: "https://drive.google.com/file/d/1T9Obtub9Vf_f3QDSHSJckKLKdry8Xc2D/view?usp=sharing",
        },
    },
    {
        name: "ForgeOS",
        tagline: "AI-native manufacturing platform",
        description: "A 7-agent product architecture on a shared knowledge graph, a 3-tier graduated-autonomy trust model, and unit economics modelled to an 8.2× LTV:CAC with engineer-led GTM.",
        date: "Aug 2026",
        links: { study: "https://drive.google.com/file/d/1NyQJMHhCacLSpNQ7ucrI75CTxnzTkObF/view?usp=sharing" },
    },
    {
        name: "Micro1",
        tagline: "From AI recruiting to data infrastructure",
        description: "Analysed the pivot from a $7M ARR recruiting tool to a $500M gross run-rate human-data platform; benchmarked Mercor & Surge and built a 6-priority roadmap around expert supply.",
        date: "Jul 2026",
        links: { study: "https://drive.google.com/file/d/1viqtwH-I7SLWyw4tfZTKdvVE3ZzCfYoR/view?usp=sharing" },
    },
];

const openSource = [{
        title: "jaegertracing/jaeger",
        status: "Open PR",
        detail: "PR #8525 — deterministic critical-path sanitisation (+9.6k lines)",
        link: "https://github.com/jaegertracing/jaeger/pull/8525",
    },
    {
        title: "stdlib-js/stdlib",
        status: "5 merged",
        detail: "5 merged PRs — C & JavaScript lint fixes",
        link: "https://github.com/stdlib-js/stdlib/pulls?q=author%3AEternity0207",
    },
    {
        title: "pgRouting",
        status: "GSoC",
        detail: "GSoC applicant — C++ clang-tidy PRs",
        link: "https://github.com/pgRouting/pgrouting/pulls?q=author%3AEternity0207",
    },
    {
        title: "Hacktoberfest 2025",
        status: "24 merged",
        detail: "24 merged PRs — A* in C++, LCS in Python, voice AI, Pac-Man",
        link: "https://github.com/Eternity0207",
    },
];

const achievements = [{
        title: "DevQuest Hackathon — 3rd Place",
        detail: "IIT Jodhpur, 200+ participants. Built an AI healthcare diagnosis tool combining computer vision and NLP.",
        date: "Jan 2025",
    },
    {
        title: "LeetCode — 600+ solved",
        detail: "Including 100+ hard problems.",
        link: "https://leetcode.com/u/eternity_ele/",
    },
    {
        title: "CodeChef — 4★",
        detail: "Peak rating 1800+.",
        link: "https://www.codechef.com/users/eternity_",
    },
];

const contactConfig = {
    YOUR_EMAIL: "iamarsh0207@gmail.com",
    description: "Open to internships, freelance builds, and interesting problems — backend, AI, or product. The fastest way to reach me is email; I usually reply within a day.",
};

const socialprofils = {
    github: "https://github.com/Eternity0207",
    linkedin: "https://www.linkedin.com/in/arshgoyal0607/",
    twitter: "https://x.com/H4CK5R1",
    instagram: "https://www.instagram.com/iamarsh.02/",
    leetcode: "https://leetcode.com/u/eternity_ele/",
};

export {
    sections,
    manifesto,
    meta,
    dataabout,
    worktimeline,
    skills,
    marquee,
    stats,
    projects,
    caseStudies,
    openSource,
    achievements,
    introdata,
    contactConfig,
    socialprofils,
    logotext,
};
