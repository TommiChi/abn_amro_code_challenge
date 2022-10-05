import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    return { 
      _isLoggedIn: false
    };
  },
  actions: {
    setLoginState(value: boolean) {
      this._isLoggedIn = value;
    },
    async fetchLoginState() {
      const isLoggedIn: boolean = await Promise.resolve(this._isLoggedIn);

      this._isLoggedIn = isLoggedIn;

      return this._isLoggedIn;
    },
  },
  getters: {
    isLoggedIn: state => state._isLoggedIn,
  },
})
