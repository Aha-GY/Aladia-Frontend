export default defineNuxtRouteMiddleware((to) => {
  const user = useCookie('user').value;

  // redirection for shareable post links
  // /posts/:id -> /user/hub/12345/feed?postId=:id
  if (to.fullPath.includes('/posts/')) {
    const postId = to.fullPath.split('/posts/').pop();
    return navigateTo({
      path: `/user/hub/${user?.id}/feed`,
      query: { ...to.query, postId },
    });
  }
});
