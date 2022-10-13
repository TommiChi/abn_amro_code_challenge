import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getShows, getByDay, getEpisode } from '../services/tvmaze';

type ForYouYoday = {
  show: {
    name: string;
    image: {
      original: string;
    };
    summary: string;
    officialSite: string;  
  };
};

export const useShowsStore = defineStore('shows', {
  state: () => {
    return { 
      _shows: [],
      _today: [],
      _forYouToday: {
        name: '',
        image: '',
        summary: '',
        officialSite: '',      
      },
      _genres: {},
      _selectedEpisode: {},
      _detailsPath: '',
    };
  },
  actions: {
    fetchShows () {
      if (this._shows) {
        return Promise.resolve(this._shows);
      }

      return new Promise((resolve, reject) => {
        getShows()
          .then((data) => {
            this._shows = data;
            resolve(data);
          })
          .catch((error) => {
            reject(error);
          });
      })
    },
    fetchToday () {
      const today = new Date();
      return getByDay(today.getFullYear(), today.getMonth(), today.getDate()).then((data) => {
        this._today = data;
      });
    },
    initUserHome () {
      this.fetchShows();
      this.fetchToday().then(() => {
        this._forYouToday = this._today && this._today?.[Math.floor(Math.random() * this._today.length)];
      });
    },
    selectEpisode (episode: string) {
      getEpisode(episode).then((data) => {
        this._selectedEpisode = data;
      });
    },
    setDetailsPath (id: string) {
      this._detailsPath = id;
    },
  },
  getters: {
    shows: state => state._shows,
    today: state => state._today,
    forYouToday: (state): ForYouYoday => state._forYouToday,
    selectedEpisode: state => state._selectedEpisode,
    detailsPath: state => state._detailsPath,
  },
})
