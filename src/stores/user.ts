import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

import { initialize, login, logout } from '../services/user';

interface IUser {
  displayName: string;
  [key: string]: any;
};

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
      initialize((user: IUser) => {
        _this._isLoggedIn = !!user;
        if (user) {
          _this._name = user.displayName.match(/\S+/g)?.[0] || _this.name;
        }
      });
    },
    login() {
      return login().then((user: any) => {
        this._isLoggedIn = !!user;
        this._name = user.displayName.match(/\S+/g)?.[0] || this.name;
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
