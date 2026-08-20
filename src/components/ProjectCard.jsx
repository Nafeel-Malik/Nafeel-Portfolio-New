function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.68 7.68 0 0 1 8 4.07c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.5 7h-.5V5a4 4 0 0 0-8 0v2h-.5A1.5 1.5 0 0 0 2 8.5v5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 12.5 7ZM6 5a2 2 0 1 1 4 0v2H6V5Z"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.5 3.5A.75.75 0 0 0 6.5 5H4.75A.75.75 0 0 0 4 5.75v5.5c0 .41.34.75.75.75h5.5c.41 0 .75-.34.75-.75V9.5a.75.75 0 0 1 1.5 0v1.75A2.25 2.25 0 0 1 10.25 13.5h-5.5A2.25 2.25 0 0 1 2.5 11.25v-5.5A2.25 2.25 0 0 1 4.75 3.5H6.5Zm3-1.5h4A.75.75 0 0 1 14.25 3v4a.75.75 0 0 1-1.5 0V4.81L8.28 9.28a.75.75 0 0 1-1.06-1.06l4.47-4.47H9.5a.75.75 0 0 1 0-1.5Z"
      />
    </svg>
  );
}

function CardMedia({ project }) {
  if (project.image) {
    return (
      <div className="project-card__media">
        <img src={project.image} alt={`${project.title} screenshot`} />
      </div>
    );
  }

  return (
    <div className="project-card__media project-card__media--placeholder" aria-hidden="true">
      <span className="project-card__glyph">&lt;/&gt;</span>
    </div>
  );
}

export function ProjectCard({ project, pose, featured = false }) {
  const interactive = pose.lit > 0.85;

  return (
    <div
      className={`project-card ${featured ? 'project-card--featured' : ''}`}
      style={{
        transform: `perspective(1100px) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) scale(${pose.scale})`,
        filter: pose.blur > 0.15 ? `blur(${pose.blur}px)` : 'none',
        opacity: pose.opacity,
        pointerEvents: interactive ? 'auto' : 'none',
      }}
    >
      <article className="project-card__inner">
        <CardMedia project={project} />

        <div className="project-card__body">
          <p className="project-card__category">{project.category}</p>
          <h3 className="project-card__title">{project.title}</h3>
          <p className="project-card__copy">{project.description}</p>

          <ul className="project-card__tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>

          <div className="project-card__links">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link"
              >
                <GitHubIcon />
                GitHub
              </a>
            ) : (
              <span className="project-card__private">
                <LockIcon />
                Not public yet
              </span>
            )}

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-card__link"
              >
                <ExternalIcon />
                Live demo
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}
