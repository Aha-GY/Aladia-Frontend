import { type App } from 'vue';

import { breakpoints as breakpointsInNumber } from '@/assets/style/tailwind/screens';

const breakpoints = useBreakpoints(breakpointsInNumber);

export default {
  install: (app: App) => {
    const html = document.documentElement;
    const $current = breakpoints.current();

    function removeClassNames(ClassNames: string[]) {
      html.classList.remove(...ClassNames);
    }
    function addClassNames(ClassNames: string[]) {
      html.classList.add(...ClassNames);
    }

    watch($current, (newValue, oldValue) => {
      // console.log('$current changed:', newValue, oldValue)
      removeClassNames(oldValue);
      addClassNames(newValue);
    });

    // init DOM
    addClassNames($current.value);

    // export globally
    app.config.globalProperties.$breakpoints = breakpoints;

  },
};

export function getBreakpoints() {
  return breakpoints;
}
