import { defineStore } from "pinia";

export const useRegisterPlaceStore = defineStore({
  id: "registerPlace",
  state: () => {
    return {
      placeId: null,
      stepId: 0
    };
  },

  getters: {
    getPlaceId() {
      return this.placeId;
    },
    getStepId() {
      return this.stepId;
    },
  },

  actions: {
    setPlaceId(placeId) {
      this.placeId = placeId;
    },
    setStepId(stepId) {
      this.stepId = stepId;
    },
  },
  persist: true,
});
