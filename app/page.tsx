import Experience from "./components/Experience";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Projects from "./components/Projects";
import Pulse from "./components/Pulse";
import Reveal from "./components/Reveal";
import Statement from "./components/Statement";
import { StoryProvider } from "./components/Story";
import { education, experience, profile, projects, skills } from "./content";

function contactLinks() {
  const links: { label: string; href: string; primary?: boolean }[] = [];
  if (profile.email) links.push({ label: "Email me", href: `mailto:${profile.email}`, primary: true });
  if (profile.linkedin) links.push({ label: "LinkedIn", href: profile.linkedin });
  links.push({ label: "GitHub", href: profile.github });
  if (profile.resume) links.push({ label: "Resume", href: profile.resume });
  return links;
}

const sections = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Home() {
  const links = contactLinks();

  return (
    <StoryProvider>
      <div id="page">
        <Nav name={profile.name} sections={sections} resume={profile.resume || undefined} />

        <main>
          <Hero />
          <Statement text={profile.intro} highlights={profile.introHighlights} />

          <section id="experience" className="section">
            <Reveal blur>
              <h2 className="section-title">Experience.</h2>
            </Reveal>
            <Experience items={experience} />
          </section>

          <section id="projects" className="section">
            <Reveal blur>
              <h2 className="section-title">Projects.</h2>
            </Reveal>
            <Projects items={projects} />
          </section>

          <section id="education" className="section">
            <Reveal blur>
              <h2 className="section-title">Education & skills.</h2>
            </Reveal>
            <div className="about">
              <Reveal className="panel">
                <p className="panel-kicker">{education.school}</p>
                <h3 className="panel-title">{education.degree}</h3>
                <p className="panel-note">{education.graduation}</p>
                <p className="stat">
                  <span className="stat-num">{education.gpa}</span>
                  <span className="stat-label">GPA</span>
                </p>
                <ul className="panel-list">
                  {education.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Reveal>
              <Reveal className="panel" delay={0.08}>
                <dl className="skills">
                  {skills.map((s) => (
                    <div key={s.group}>
                      <dt>{s.group}</dt>
                      <dd>
                        <ul className="chips">
                          {s.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </section>
        </main>

        <footer id="contact" className="contact">
          <Pulse />
          <Reveal blur>
            <h2 className="contact-title">Get in touch.</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="contact-text">
              I&apos;m looking for a software engineering co-op. The best way to reach me is below.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className="contact-links">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    className={l.primary ? "button button-primary" : "button"}
                    href={l.href}
                    target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noreferrer"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
          <p className="colophon">Built with Next.js and Motion. Deployed on Vercel.</p>
        </footer>
      </div>
    </StoryProvider>
  );
}
