import { projects } from '../data/projects';
import { useMotionFlags } from '../hooks/useMotionFlags';
import { getCardEntrance, getProjectsCamera } from '../utils/corridorCamera';
import { ProjectCard } from './ProjectCard';
import { SectionHeader } from './SectionHeader';
import './Projects.css';

export function Projects({ progress = 0 }) {
  const { skipBlur, reducedMotion } = useMotionFlags();
  const camera = getProjectsCamera(progress, { skipBlur, reducedMotion });
  const headerOpacity = reducedMotion ? 1 : Math.min(1, camera.focus / 0.65);

  return (
    <div
      className={`projects${camera.hidden ? ' is-exited' : ''}`}
      aria-hidden={camera.hidden || undefined}
    >
      <div
        className="projects__veil"
        aria-hidden="true"
        style={{ opacity: camera.veil }}
      />
      <div className="projects__glow" aria-hidden="true" />

      <div
        className="projects__stage"
        style={
          camera.hidden
            ? {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                transform: 'none',
                filter: 'none',
              }
            : {
                transform: `translate3d(0, ${camera.translateY ?? 0}vh, 0) scale(${camera.scale})`,
                filter: camera.blur > 0.2 ? `blur(${camera.blur}px)` : 'none',
                opacity: camera.opacity,
                pointerEvents: camera.opacity < 0.4 ? 'none' : 'auto',
              }
        }
      >
        <header className="projects__intro" style={{ opacity: headerOpacity }}>
          <SectionHeader index={2} eyebrow="Projects" title="Selected Work" />
          <p className="projects__subtitle">
            A collection of academic and personal projects highlighting software
            design, data structures, and web technologies.
          </p>
        </header>

        <div className="projects__grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={Boolean(project.featured)}
              pose={getCardEntrance(progress, index, projects.length, {
                skipBlur,
                reducedMotion,
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
