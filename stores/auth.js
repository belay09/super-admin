import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => {
    return {
      hasuraUserId: null,
      user: null,
      hasuraAccessToken: null,
      xHasuraRole: null,
    };
  },

  getters: {
    isLoggedIn() {
      return !!this.hasuraAccessToken;
    },
    getUser() {
      return this.user;
    },
    getUserID() {
      return this.hasuraUserId;
    },
  },

  actions: {
    setXHasuraRole(xHasuraRole) {
      this.xHasuraRole = xHasuraRole;
    },
    logout() {
      // deleting token from cookie
      this.hasuraAccessToken = null;
      this.user = null;
      this.hasuraUserId = null;
      this.xHasuraRole = null;
    },
    setUser(user) {
      this.user = user;
    },
    setUserId(hasuraUserId) {
      this.hasuraUserId = hasuraUserId;
    },
    setProfilePicture(profilePicture) {
      this.user.picture = profilePicture;
    },
    sethasuraAccessToken(hasuraAccessToken) {
      this.hasuraAccessToken = hasuraAccessToken;
    },
  },
  persist: true,
});
