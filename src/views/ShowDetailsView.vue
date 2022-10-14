<script setup lang="ts">
  import { useShowsStore } from '../stores/shows';
  import { pureString } from '../helpers';
</script>

<script lang="ts">
  type IEpisode = {
    show: {
      [key: string]: any;
    };
    airtime: string;
    id: string;
    name: string;
  };

  type IStore = {
    selectedEpisode: { [key: string]: any; };
    today: { [key: string]: any; };
  };

  export default {
    data() {
      const store: IStore = useShowsStore();
      return {
        store,
        _rotateX: 'rotateX(0)',
        _rotateY: 'rotateY(0)',
        _rotateZ: 'rotateZ(0)',
      };
    },
    methods: {
      onEnter (event: MouseEvent) {
        const element = (event.currentTarget || event.target) as Element;
        element.classList.add('active');
      },
      onLeave (event: MouseEvent){
        const element = (event.currentTarget || event.target) as Element;
        element.classList.remove('active');
      },
      tilt (event: MouseEvent) {
        const card = (event.currentTarget || event.target) as Element;
        const { width, height, top, bottom, left, right } = card.getBoundingClientRect();
        const halfWayX = (right - left) / 2;
        const halfWayY = (bottom - top) / 2;
        const clientX = event.clientX - left - halfWayX;
        const rotateX = (clientX / halfWayX) * 10;
        const clientY = event.clientY - top - halfWayY;
        const rotateY = (clientY / halfWayY) * 10;
        const rotateZ = (clientX / halfWayX) * 2;
        
        this._rotateX = `rotateX(${-rotateX}deg)`;
        this._rotateY = `rotateY(${rotateY}deg)`;
        this._rotateZ = `rotateZ(${rotateZ}deg)`;
      }
    },
    computed: {
      rotateX () {
        return this._rotateX!;
      },
      rotateY () {
        return this._rotateY;
      },
      rotateZ () {
        return this._rotateZ;
      },
      bgImage () {
        return `linear-gradient(0deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 1) 100%), url(${this.store?.selectedEpisode?.show?.image?.original})`;
      },
      genres () {
        /* This should normally live in a middleware/BFF service, but for this demo I am keeping it here to avoid going too overkill in terms of effort */
        const genres: { [key: string]: any; } = {};
        this.store.today?.forEach?.(({ show, airtime, id, name }: IEpisode) => {
          show.genres.forEach((genre: string) => {
            if (!genres[genre]) {
              genres[genre] = [];
            }
            genres[genre].push({ ...show, airtime, scheduleId: id, episodeName: name });
          })
        });
        
        for(const genre in genres) {
          const result  = [];
          const data = genres[genre];
          while(data.length > 0) {
            result.push(data.splice(Math.floor(Math.random() * data.length), 1)[0]);
          }
          genres[genre] = result;
        }

        return genres;
      },
    },
  }
</script>

  <template>
    <main class="main-content show">
      <h1>{{ store.selectedEpisode?.show?.name }}</h1>
      <section class="show__poster">
        <img class="show__image"  :src="store.selectedEpisode?.show?.image?.original || ''" />
      </section>
      <section class="show__details">
        <h2>{{ store.selectedEpisode?.name }}</h2>
        <p>{{ pureString(store.selectedEpisode?.show?.summary) }}</p>
        <a :href="store.selectedEpisode?.show?.officialSite" class="button" target="_blank">WATCH IT NOW</a>
      </section>
    </main>
  </template>
  
  <style lang="scss" scoped>
    .main-content {
      overflow-x: hidden;
      overflow-y: auto;
      perspective: 2px;
      width: 100vw;
      height: 100vh;
      padding: 0 50px;
      box-sizing: border-box;

      &::after {
        content: "";
        transform: translateY(-50%) translateZ(-1px) scale(1.5);
        transform-origin: center;
        background: no-repeat center;
        background-size: contain, cover;
        background-position: center, center;
        background-image: v-bind(bgImage);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        width: 100vw;
        height: 200vh;
      }

      section {
        transform-style: preserve-3d;
        height: auto;
      }
    }

    .show {
      display: grid;
      column-gap: 50px;
      grid-template-columns: auto 1fr;
      grid-template-rows: repeat(auto-fit, minmax(min-content, 0));

      &__image {
        position: relative;
        width: 300px;
        max-width: 50vw;
        height: auto;
        grid-column: 1 / span 1;
        grid-row: 2 / span 1;
      }

      h1 {
        margin-top: 0;
        grid-column: 1 / span 2;
        grid-row: 1 / span 1;
      }

      // &__details {
      //   padding: 0 50px;
      //   box-sizing: border-box;
      // }
    }

  
    .item {
      &__image {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }

      &__info {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        transition: all 0.2s;
        opacity: 0;
        color: rgba(243, 192, 0, 1);
        background-color: rgba(0, 0, 0, 0.5);
        padding: 10px;
        box-sizing: border-box;

        p {
          font-size: 12px;
        }
      }

      &__3dwrapper {
        overflow: hidden;
        width: 100%;
        height: 100%;
        display: block;
        position: relative;

        &.active {
          transform: v-bind(rotateX) v-bind(rotateY) v-bind(rotateZ);

          .item__info {
            opacity: 1;
          }
        }
     }
    }
  </style>
  