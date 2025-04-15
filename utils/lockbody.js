import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks,
} from 'body-scroll-lock';

export function disableScroll(target) {
  return disableBodyScroll(target);
}

export function enableScroll(target) {
  return enableBodyScroll(target);
}

export function enableAllScroll() {
  return clearAllBodyScrollLocks();
}
