export default defineNuxtRouteMiddleware((to, from) => {
  const cookie = useCookie("hasuraAccessToken");
  const isLoggedin = !!cookie.value;

  if (isLoggedin) {
  } else if (to.fullPath.includes("app")) {
    return navigateTo("/");
  }
  return;
});
