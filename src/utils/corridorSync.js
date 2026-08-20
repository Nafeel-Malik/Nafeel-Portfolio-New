const SYNC = 'corridor:sync';

export function requestCorridorSync() {
  window.dispatchEvent(new Event(SYNC));
}

export function onCorridorSync(fn) {
  window.addEventListener(SYNC, fn);
  return () => window.removeEventListener(SYNC, fn);
}
