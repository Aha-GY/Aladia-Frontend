export default defineNuxtRouteMiddleware((to) => {
  const urlProfileId = to.params.name;
  const myOrganizationList = useCookie('myOrganizationList').value;
  const user = useCookie('user').value;

  if (
    to.fullPath.includes('organization/hub') &&
    !myOrganizationList?.some((id) => id === urlProfileId)
  ) {
    return navigateTo(`/organization/${urlProfileId}`);
  }
  if (to.fullPath.includes('user/hub') && user?.id !== urlProfileId) {
    return navigateTo(`/profile/${urlProfileId}`);
  }
});
