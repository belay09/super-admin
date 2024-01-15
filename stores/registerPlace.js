import { defineStore } from "pinia";

export const useRegisterPlaceStore = defineStore({
  id: "registerPlace",
  state: () => {
    return {
      placeId: null,
    };
  },

  getters: {
    getPlaceId() {
      return this.placeId;
    },
  },

  actions: {
    setPlaceId(placeId) {
      this.placeId = placeId;
    },
  },
  persist: true,
});
