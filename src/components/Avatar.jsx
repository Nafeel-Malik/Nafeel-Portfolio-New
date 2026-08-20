import './Avatar.css';

export function Avatar({
  src = null,
  initials = 'NM',
  alt = 'Muhammad Nafeel',
  size = 'hero',
}) {
  return (
    <div className={`avatar avatar--${size}`}>
      <span className="avatar__glow" aria-hidden="true" />
      <span className="avatar__ring" aria-hidden="true" />
      <div className="avatar__frame">
        {src ? (
          <img src={src} alt={alt} />
        ) : (
          <span className="avatar__initials" aria-hidden="true">
            {initials}
          </span>
        )}
      </div>
    </div>
  );
}
