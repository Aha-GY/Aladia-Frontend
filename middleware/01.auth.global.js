const authNotRequired = [];

const authRequired = [
  'meet',
  'admin',
  'social',
  'personal',
  'user-hub',
  'become-teacher',
  'organization-hub',
];

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  if (authStore.logged) {
    if (authNotRequired.some((route) => to.name?.startsWith(route))) {
      return navigateTo('/');
    }
  } else {
    if (
      authRequired.some((route) => to.name?.startsWith(route)) &&
      !to.name?.startsWith('meet-name-preview')
    ) {
      const redirectUrl = '/';
      const encodedPath = encodeURIComponent(to.fullPath);
      const redirectWithQuery = `${redirectUrl}?redirect=${encodedPath}&login=true`;
      return navigateTo(redirectWithQuery);
    }
  }
});
