import { About } from './components/About';
import { Contact } from './components/Contact';
import { CursorGlow } from './components/CursorGlow';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { PinnedSection } from './components/PinnedSection';
import { Projects } from './components/Projects';

function App() {
  return (
    <>
      <CursorGlow />
      <a className="skip-link" href="#hero">
        Skip to content
      </a>
      <Nav />
      <main>
        <PinnedSection id="hero" height="200vh">
          {({ progress }) => <Hero progress={progress} />}
        </PinnedSection>
        <PinnedSection
          id="about"
          className="pinned-section--about"
          height="210vh"
          overlap="110vh"
        >
          {({ progress }) => <About progress={progress} />}
        </PinnedSection>
        <PinnedSection
          id="projects"
          className="pinned-section--projects"
          height="230vh"
          overlap="100vh"
        >
          {({ progress }) => <Projects progress={progress} />}
        </PinnedSection>
        <Contact />
      </main>
    </>
  );
}

export default App;
