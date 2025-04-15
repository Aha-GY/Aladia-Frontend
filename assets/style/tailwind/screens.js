/*
Two different formats:

VueUse
{
  sm: 640,
  md: 768,
  ...
}

Tailwind CSS
{
  sm: '640px',
  md: '768px',
  ...
}
*/

// breakpoint format for VueUse
// to be used in `useBreakpoints()`
export const breakpoints = {
  // Customized breakpoint for this project
  xs: 475,
  // Tailwind's default breakpoints
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// convert to Tailwind's breakpoint format
// to be used in `tailwind.config.js`
export const screens = Object.fromEntries(
  Object.entries(breakpoints).map(([key, value]) => [key, `${value}px`]),
)
