import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Mail,
  Menu,
  X,
  Code2,
  Database,
  Layers3,
  Terminal,
  ExternalLink,
} from "lucide-react";
import "./App.css";
import {getProjects} from "./api/projects";

const projects = [
  {
    number: "01",
    category: "E-COMMERCE · FULL STACK",
    title: "HIMORA LIFESTYLE",
    description:
      "A premium lifestyle e-commerce experience inspired by the Himalayas, with product discovery, customer accounts, cart management, and order workflows.",
    stack: ["React", "FastAPI", "PostgreSQL", "Docker"],
    className: "project-visual-himora",
    visual: "H",
    status: "IN DEVELOPMENT",
  },
  {
    number: "02",
    category: "CLEAN TECHNOLOGY · FULL STACK",
    title: "EV CHARGING STATION",
    description:
      "A platform for discovering electric vehicle charging stations, managing user accounts, and coordinating charging bookings.",
    stack: ["React", "FastAPI", "PostgreSQL"],
    className: "project-visual-ev",
    visual: "EV",
    status: "IN DEVELOPMENT",
  },
  {
    number: "03",
    category: "FINANCIAL TECHNOLOGY · AI",
    title: "NEPSE AI",
    description:
      "A stock-market research and prediction platform designed to help beginners explore market trends, indicators, news sentiment, and watchlists.",
    stack: ["React", "FastAPI", "PostgreSQL", "ML"],
    className: "project-visual-nepse",
    visual: "N",
    status: "ACADEMIC PROJECT",
  },
];

const capabilities = [
  {
    number: "01",
    icon: Code2,
    title: "Frontend engineering",
    description:
      "Responsive interfaces, thoughtful interactions, accessible components, and maintainable React applications.",
    tools: "REACT · JAVASCRIPT · CSS",
  },
  {
    number: "02",
    icon: Database,
    title: "Backend engineering",
    description:
      "API design, authentication, business logic, data validation, and relational database integration.",
    tools: "PYTHON · FASTAPI · POSTGRESQL",
  },
  {
    number: "03",
    icon: Layers3,
    title: "Full-stack development",
    description:
      "Connecting interfaces, APIs, and databases into cohesive applications with real-world workflows.",
    tools: "REST API · SQL · INTEGRATION",
  },
  {
    number: "04",
    icon: Terminal,
    title: "Development workflow",
    description:
      "Version control, containerized environments, debugging, and repeatable development setups.",
    tools: "GIT · GITHUB · DOCKER",
  },
];

const technologies = [
  "JavaScript",
  "React",
  "HTML5",
  "CSS3",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "SQLAlchemy",
  "Git",
  "GitHub",
  "Docker",
  "REST APIs",
];

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ["Work", "#work"],
    ["About", "#about"],
    ["Expertise", "#expertise"],
    ["Contact", "#contact"],
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <a
          className="brand"
          href="#home"
          aria-label="Portfolio homepage"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-symbol">P.</span>
          <span className="brand-label">
            DEVELOPER
            <span>PORTFOLIO / 2026</span>
          </span>
        </a>

        <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          {links.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <a
            className="nav-contact"
            href="#contact"
            onClick={() => setMenuOpen(false)}
          >
            Let's talk <ArrowUpRight size={14} />
          </a>
        </nav>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero container" id="home">
      <div className="hero-copy">
        <Reveal>
          <div className="hero-status">
            <span className="status-dot" />
            SOFTWARE ENGINEERING STUDENT
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1>
            Building digital
            <br />
            experiences with
            <br />
            <span className="hero-highlight">purpose.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="hero-description">
            I'm a software engineering student passionate about building
            thoughtful interfaces and practical full-stack applications.
            I turn ideas into products, one considered detail at a time.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="hero-actions">
            <a href="#work" className="button-primary">
              Explore my work <ArrowDownRight size={17} />
            </a>
            <a href="#contact" className="button-secondary">
              Get in touch <ArrowUpRight size={16} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <div className="hero-footnote">
            <span>BASED IN NEPAL</span>
            <span className="footnote-divider" />
            <span>AVAILABLE FOR LEARNING & COLLABORATION</span>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.18} className="hero-art-wrap">
        <div className="hero-art">
          <div className="art-orbit art-orbit-one" />
          <div className="art-orbit art-orbit-two" />
          <div className="art-orbit art-orbit-three" />

          <div className="art-coordinate coordinate-top">
            <span>27° 42′ N</span>
            <span>NEPAL / NP</span>
          </div>

          <div className="art-core">
            <div className="core-ring">
              <div className="core-inner">
                <span className="core-bracket">{"<"}</span>
                <span className="core-letter">P</span>
                <span className="core-bracket">{"/>"}</span>
              </div>
            </div>
          </div>

          <div className="art-cross cross-one">+</div>
          <div className="art-cross cross-two">+</div>
          <div className="art-cross cross-three">+</div>

          <div className="art-coordinate coordinate-bottom">
            <span>DESIGN × ENGINEERING</span>
            <span>EST. 2026</span>
          </div>

          <div className="art-index">FIG. 001 — DIGITAL CRAFT</div>
        </div>
      </Reveal>

      <a href="#work" className="hero-scroll" aria-label="Scroll to selected work">
        <span>SCROLL TO EXPLORE</span>
        <ArrowDownRight size={15} />
      </a>
    </section>
  );
}

function SectionIntro({ eyebrow, title, description, number }) {
  return (
    <div className="section-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="section-heading">{title}</h2>
      </div>
      <div className="section-intro-aside">
        <span className="section-number">{number}</span>
        {description && <p className="section-description">{description}</p>}
      </div>
    </div>
  );
}


function ProjectCard({ project, index }) {
  const projectName = project.title.toLowerCase();
  const isHimora = projectName.includes("himora");
  const isEV =
    projectName.includes("ev") ||
    projectName.includes("charging");
  const isNepse =
    projectName.includes("nepse") ||
    project.category.toLowerCase().includes("financial");

  return (
    <Reveal delay={index * 0.08} className="project-card">
      <a
        className={`project-visual ${
          isHimora
            ? "project-visual-himora"
            : isEV
              ? "project-visual-ev"
              : isNepse
                ? "project-visual-nepse"
                : ""
        }`}
        href={project.live_url || project.repository_url || "#contact"}
        target={
          project.live_url || project.repository_url
            ? "_blank"
            : undefined
        }
        rel={
          project.live_url || project.repository_url
            ? "noreferrer"
            : undefined
        }
        aria-label={`View ${project.title}`}
      >
        <div className="visual-topline">
          <span>SELECTED PROJECT / {project.number}</span>
          <ArrowUpRight size={18} />
        </div>

        <div className="visual-artwork">
          {isHimora ? (
            <>
              <div className="himora-orbit" />
              <div className="himora-product">
                <span className="product-temple" />
                <span className="product-lens product-lens-left" />
                <span className="product-bridge" />
                <span className="product-lens product-lens-right" />
                <span className="product-temple product-temple-right" />
              </div>
              <span className="visual-caption">H / COLLECTION 001</span>
            </>
          ) : isEV ? (
            <>
              <div className="ev-grid" />
              <div className="ev-orbit ev-orbit-outer" />
              <div className="ev-orbit ev-orbit-inner" />
              <div className="ev-core">
                <span>EV</span>
                <span className="ev-core-line" />
                <span className="ev-core-caption">
                  CHARGING NETWORK
                </span>
              </div>
              <span className="visual-caption">
                ENERGY / CONNECTED
              </span>
            </>
          ) : isNepse ? (
            <>
              <div className="market-grid" />
              <svg
                className="market-chart"
                viewBox="0 0 360 190"
                role="img"
                aria-label="Abstract stock-market trend illustration"
              >
                <defs>
                  <linearGradient
                    id={`chartFill-${project.id}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#b8f36b"
                      stopOpacity=".26"
                    />
                    <stop
                      offset="100%"
                      stopColor="#b8f36b"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0 152 L32 132 L61 143 L95 95 L121 112 L157 69 L186 88 L220 45 L251 67 L286 27 L320 43 L360 8 L360 190 L0 190 Z"
                  fill={`url(#chartFill-${project.id})`}
                />
                <path
                  d="M0 152 L32 132 L61 143 L95 95 L121 112 L157 69 L186 88 L220 45 L251 67 L286 27 L320 43 L360 8"
                  fill="none"
                  stroke="#b8f36b"
                  strokeWidth="2"
                />
                <circle cx="360" cy="8" r="4" fill="#b8f36b" />
              </svg>
              <span className="visual-caption">
                MARKET INSIGHT / 001
              </span>
            </>
          ) : (
            <div className="generic-project-visual">
              <span>{project.number}</span>
              <Code2 size={44} strokeWidth={1} />
              <small>DESIGNED & ENGINEERED</small>
            </div>
          )}
        </div>

        <div className="visual-bottomline">
          <span>{project.status}</span>
          <span>
            VIEW PROJECT <ArrowUpRight size={12} />
          </span>
        </div>
      </a>

      <div className="project-info">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.number}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-stack">
          {project.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}


function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      try {
        const data = await getProjects();

        if (!cancelled) {
          setProjects(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "Unable to load projects right now. Please try again later."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="section work-section" id="work">
      <div className="container">
        <Reveal>
          <SectionIntro
            eyebrow="A selection of my work"
            title={
              <>
                Ideas turned into <span>applications.</span>
              </>
            }
            description="A selection of academic and personal projects exploring full-stack development, user experience, and practical problem-solving."
            number="01 / WORK"
          />
        </Reveal>

        {loading ? (
          <p role="status" className="section-description">
            Loading projects…
          </p>
        ) : error ? (
          <p role="alert" className="section-description">
            {error}
          </p>
        ) : projects.length === 0 ? (
          <p className="section-description">
            Projects are being prepared. Please check back soon.
          </p>
        ) : (
          <div className="project-grid">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={{
                  ...project,
                  number: String(index + 1).padStart(2, "0"),
                  category: (project.category || "PROJECT").toUpperCase(),
                  title: project.title,
                  description: project.short_description,
                  stack: project.technologies || [],
                  className: "",
                  status: project.featured
                    ? "FEATURED PROJECT"
                    : "SELECTED PROJECT",
                }}
                index={index}
              />
            ))}
          </div>
        )}

        <div className="work-footer">
          <span>MORE PROJECTS WILL BE ADDED OVER TIME.</span>
          <a
            href="https://github.com/prem231631"
            target="_blank"
            rel="noreferrer"
          >
            Explore GitHub <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}


function About() {
  return (
    <section className="section about-section" id="about">
      <div className="container about-layout">
        <Reveal className="about-left">
          <span className="eyebrow">A little about me</span>
          <h2 className="section-heading">
            Curious by nature.
            <br />
            <span>Built through practice.</span>
          </h2>

          <div className="about-monogram">
            <span className="monogram-main">P.</span>
            <span className="monogram-caption">LEARNING IN PUBLIC.</span>
            <span className="monogram-coordinate">NEPAL · 2026</span>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="about-right">
          <p className="about-lead">
            I enjoy understanding how things work—and then building something
            useful with that knowledge.
          </p>

          <p className="about-copy">
            I'm pursuing a Bachelor's degree in Software Engineering and
            developing my skills through hands-on projects. My work spans
            frontend interfaces, backend APIs, databases, and the integration
            that brings them together.
          </p>

          <p className="about-copy">
            I care about more than getting something to run. I want to
            understand the decisions behind it, write maintainable code, and
            create experiences that feel intentional.
          </p>

          <div className="education-card">
            <div className="education-icon">
              <Layers3 size={20} />
            </div>
            <div>
              <span className="education-label">EDUCATION</span>
              <h3>Bachelor's in Software Engineering</h3>
              <p>NCIT · Pokhara University</p>
              <span className="education-period">EXPECTED GRADUATION · 2027</span>
            </div>
          </div>

          <a className="text-link about-link" href="#contact">
            Let's connect <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Expertise() {
  return (
    <section className="section expertise-section" id="expertise">
      <div className="container">
        <Reveal>
          <SectionIntro
            eyebrow="What I'm developing"
            title={<>My approach to <span>building.</span></>}
            description="A growing toolkit shaped by practical development, experimentation, and a willingness to learn."
            number="02 / EXPERTISE"
          />
        </Reveal>

        <div className="capability-list">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;

            return (
              <Reveal key={capability.number} delay={index * 0.05}>
                <article className="capability-row">
                 <span className="capability-number">{capability.number}</span>
                  <div className="capability-icon">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                  <div className="capability-main">
                    <h3>{capability.title}</h3>
                    <p>{capability.description}</p>
                    <span className="capability-tools">{capability.tools}</span>
                  </div>
                  <ArrowUpRight className="capability-arrow" size={20} />
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="technology-panel">
          <div className="technology-heading">
            <span className="eyebrow">Tools in my workflow</span>
            <span className="technology-count">12 TECHNOLOGIES</span>
          </div>
          <div className="technology-list">
            {technologies.map((technology) => (
              <span className="technology-chip" key={technology}>
                <span />
                {technology}
              </span>
            ))}
          </div>
          <p className="technology-note">
            A growing toolkit—not a claim of mastery in every technology.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-layout">
        <Reveal className="contact-copy">
          <span className="eyebrow">Have something in mind?</span>
          <h2>
            Good things
            <br />
            start with a
            <br />
            <span>conversation.</span>
          </h2>
          <p>
            Have an idea, a project to discuss, or an opportunity to learn
            together? I'd be happy to hear from you.
          </p>
          <a className="button-primary contact-button" href="mailto:hello@example.com">
            <Mail size={17} /> Say hello <ArrowUpRight size={16} />
          </a>
        </Reveal>

        <Reveal delay={0.12} className="contact-card">
          <span className="contact-card-label">OPEN CHANNELS</span>
          <a href="mailto:hello@example.com" className="contact-link">
            <span className="contact-link-icon"><Mail size={19} /></span>
            <span>
              <small>EMAIL</small>
              <strong>hello@example.com</strong>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <span className="contact-link-icon"><Code2 size={19} /></span>
            <span>
              <small>CODE & PROJECTS</small>
              <strong>GitHub</strong>
            </span>
            <ArrowUpRight size={17} />
          </a>
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="contact-link"
          >
            <span className="contact-link-icon"><ExternalLink size={19} /></span>
            <span>
              <small>PROFESSIONAL NETWORK</small>
              <strong>LinkedIn</strong>
            </span>
            <ArrowUpRight size={17} />
          </a>

          <div className="contact-availability">
            <span className="status-dot" />
            OPEN TO LEARNING & COLLABORATION
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a className="footer-brand" href="#home">P.</a>
        <span>DESIGNED WITH INTENTION. BUILT WITH CURIOSITY.</span>
        <a href="#home" className="back-to-top">
          BACK TO TOP <ArrowUpRight size={13} />
        </a>
        <span className="footer-copyright">© 2026</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <Work />
        <About />
        <Expertise />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}