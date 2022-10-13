import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { initialize, login, logout } from '../services/user';

export const useUserStore = defineStore('user', {
  state: () => {
    return { 
      _isLoggedIn: false,
      _name: '',
    };
  },
  actions: {
    initialize() {
      const _this = this;
      initialize((user: unknown) => {
        _this._isLoggedIn = !!user;
        if (user) {
          _this._name = user.displayName.match(/\S+/g)?.[0] || _this.name;
        }
      });
    },
    login() {
      const _this = this;
      return login().then((user) => {
        _this._isLoggedIn = !!user;
        _this._name = user.displayName.match(/\S+/g)?.[0] || _this.name;
      });
    },
    logout() {
      logout().then(() => {
        this._isLoggedIn = false;
      });
    },
  },
  getters: {
    isLoggedIn: state => state._isLoggedIn,
    name: state => state._name,
  },
})
