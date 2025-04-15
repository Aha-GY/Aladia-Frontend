export function useLockScroll(element = document.body) {
  const isLocked = useScrollLock(element);
  const lock = () => {
    isLocked.value = true;
  };
  const unlock = () => {
    isLocked.value = false;
  };
  const toggle = () => {
    isLocked.value = !isLocked.value;
  };
  return {
    lock,
    unlock,
    toggle,
  };
}
