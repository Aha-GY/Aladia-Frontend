export function useElementClass(
  target: HTMLElement | string | null,
  classes: string | string[],
) {
  const classList = Array.isArray(classes) ? classes : [classes];

  const applyClasses = () => {
    if (!import.meta.client || !target) {
      return;
    }
    const element =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
      classList.forEach((className) => element.classList.add(className));
    }
  };

  const removeClasses = () => {
    if (!import.meta.client || !target) {
      return;
    }
    const element =
      typeof target === 'string' ? document.querySelector(target) : target;
    if (element) {
      classList.forEach((className) => element.classList.remove(className));
    }
  };

  onMounted(() => {
    applyClasses();
  });

  onBeforeUnmount(() => {
    removeClasses();
  });
}
