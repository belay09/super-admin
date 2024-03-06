import { useAuthStore } from "@/stores/auth";

export default defineNuxtRouteMiddleware((to, from) => {
	const { isLoggedIn } = useAuthStore();
	console.log(isLoggedIn, to.path);
	// Allow access to the /password route for password reset
	if (to.path.startsWith("/password")) {
		return;
	}
	if (to.path === "/") {
		return;
	}
	// Redirect to the login page if not logged in and not accessing the /password route
	if (isLoggedIn === false && to.path !== "/") {
		return navigateTo("/");
	}
});
