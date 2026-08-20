import { Avatar } from './Avatar';
import './OrbitFrame.css';

const DOTS = [18, 132, 248];

export function OrbitFrame({ src = null, initials = 'NM' }) {
  return (
    <div className="orbit-frame">
      <span className="orbit-frame__ring orbit-frame__ring--outer" aria-hidden="true" />
      <span className="orbit-frame__ring orbit-frame__ring--inner" aria-hidden="true" />
      <span className="orbit-frame__orbit" aria-hidden="true">
        {DOTS.map((angle) => (
          <span
            key={angle}
            className="orbit-frame__dot"
            style={{ '--orbit-angle': `${angle}deg` }}
          />
        ))}
      </span>
      <Avatar src={src} size="about" initials={initials} />
    </div>
  );
}
