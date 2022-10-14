<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import { useShowsStore } from '../stores/shows';
  import { useRoute } from 'vue-router';
  import { pureString } from '../helpers';
  import { reactive } from 'vue';
</script>

<script lang="ts">
  type IStore = {
    forYouToday: { [key: string]: any; };
    today: { [key: string]: any; };
    genres: { [key: string]: any; };
  };

  export default {
    data() {
      const store: IStore = useShowsStore();

      return {
        store,
        _rotateX: 'rotateX(0)',
        _rotateY: 'rotateY(0)',
        _rotateZ: 'rotateZ(0)',
        genres: { ...store.genres },
      };
    },
    methods: {
      onEnter (event: MouseEvent) {
        const element = (event.currentTarget || event.target) as Element;
        element.classList.add('active');
      },
      onLeave (event: MouseEvent) {
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
      },
      setKey (prefix: string, suffix: string | number) {
        return `${prefix}-${suffix.toString().replace(/\s/g, '-')}`
      },
      galleryScroll (genreName: string|number, direction: string) {
        const genre = this.genres[genreName];
        const a: HTMLElement[] = this.$refs[`container_${genreName}`] as HTMLElement[];
        const container: HTMLElement = a[0];
        const child: HTMLElement = container.children[0] as HTMLElement;
        const count = Math.floor(container.offsetWidth / child.offsetWidth);

        if (count >= genre.length) {
          return;
        }
            
        const scrollDirection: any = {
          left: () => {
            let lastItem = genre.length;
            if (genre[0].scroll === 'left') {
              genre[0].scroll = '';
              genre.splice(lastItem - count, count);
              lastItem -= count;
            } else if (genre[0].scroll === 'right') {
              genre.splice(0, count);
              lastItem -= count;
            }

            setTimeout(() => {
              const args = new Array(count).fill(null).map((...[, index]) => {
                return ({ ...genre[lastItem - count + index] })
              });
              args[0].scroll = 'left';
              genre.unshift(...args);
            }, 0);
          },
          right: () => {
            let lastItem = genre.length;
            if (genre[0].scroll === 'right') {
              genre.splice(0, count);
              lastItem -= count;
            } else if (genre[0].scroll === 'left') {
              genre[0].scroll = '';
              genre.splice(lastItem - count, count);
              lastItem -= count;
            }

            setTimeout(() => {
              const args = new Array(count).fill(null).map((...[, index]) => {
                return ({ ...genre[index] })
              });
              genre.push(...args);
              genre[0].scroll = 'right';
            }, 0);
          },
        };

        scrollDirection[direction]();
      },
    },
    computed: {
      rotateX () {
        return this._rotateX;
      },
      rotateY () {
        return this._rotateY;
      },
      rotateZ () {
        return this._rotateZ;
      },
      bgImage () {
        return `linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 100%), url(${this.store.forYouToday.show?.image.original})`;
      },
      genres () {
      },
    },
  }
</script>

  <template>
    <main class="main-content">
      <section class="hero">
        <img class="hero__image"  :src="store.forYouToday.show?.image.original || ''" />
        <h2 class="hero__info">{{ store.forYouToday.show?.name }}</h2>
        <p class="hero__info">{{ pureString(store.forYouToday.show?.summary) }}</p>
        <a target="_blank" :href="store.forYouToday.show?.officialSite" class="hero__info button" v-if="store.forYouToday.show?.officialSite">Discover</a>
      </section>
      <section class="recommendations">
        <h2>What's on Today?</h2>
        <article v-for="(genre, name) in $data.genres" class="gallery" :key="setKey('article', name)">
          <h3 class="gallery__title">{{ name }}</h3>
          <div class="gallery__wrapper">
            <button class="carousel-arrow fa fa-angle-left" @click="galleryScroll(name, 'left')"></button>
            <ul class="gallery__itemlist" :ref="`container_${name}`">
              <li v-for="(show, index) in genre" :class="`gallery__item${show.scroll ? ` ${show.scroll}` : ''}`" :key="index">
                <RouterLink class="item__3dwrapper" @mousemove="tilt" @mouseenter="onEnter" @mouseleave="onLeave" :to="`/shows/${show.episodeId}`">
                  <img :src="show?.image?.original" class="item__image" />
                  <div class="item__info">
                    {{ show.name }}
                    <p>&quot;{{ show.episodeName }}&quot;</p>
                    <p>- Airs at {{ show.airtime }}</p>
                  </div>
                </RouterLink>
              </li>
            </ul>
            <button class="carousel-arrow fa fa-angle-right" @click="galleryScroll(name, 'right')"></button>
          </div>
        </article>
      </section>
    </main>
  </template>
  
  <style lang="scss" scoped>
    body {
      overflow: hidden;
    }

    .main-content {
      overflow-x: hidden;
      overflow-y: auto;
      perspective: 2px;
      width: 100vw;
      height: 100vh;

      section {
        transform-style: preserve-3d;
        height: auto;
      }
    }

    .hero {
      padding: 0 50px 150px;
      display: grid;
      grid-template-columns: 110px 1fr;
      grid-template-rows: repeat(auto-fit, minmax(min-content, 0));

      &::after {
        content: "";
        transform: translateY(-50%) translateZ(-1px) scale(1.5);
        transform-origin: center;
        background: no-repeat center;
        background-size: contain, cover;
        background-image: v-bind(bgImage);
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: -1;
        width: 100%;
        height: 100%
      }

      &__image {
        position: relative;
        width: 100px;
        height: auto;
        grid-column: 1 / span 1;
        grid-row: 1 / span 3;
      }

      &__info {
        grid-column: 2 / span 1;
        grid-row: inherit;
        max-width: 500px;
      }

      h2 {
        margin: 0;
        transform: translateY(-5px);
      }

      .button {
        text-decoration: none;
        width: fit-content;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: row;
      width: auto;
      overflow: visible;
      position: relative;
      max-width: calc(100% - 52px);

      li {
        width: 200px;
        min-width: 200px;;
        height: 200px;
        margin-right: 10px;
        overflow: hidden;
        transition: all 0.2s;

        &:hover {
          transform: scale(1.5);
          transform-origin: center;
          z-index: 10000;
        }
      }
    }

    .gallery {
      width: 100%;
      margin: 0 auto;
      overflow: visible;

      &__wrapper {
        height: 100%;
        overflow: visible;
        display: flex;
        flex-direction: row;
        
      }

      &__item {
        transition: all 0.2s;

        &.right {
          animation: scrollRight 0.3s ease-out 1;
          animation-fill-mode: forwards;
        }

        &.left {
          animation: scrollLeft 0.3s ease-out 1;
          animation-fill-mode: forwards;
        }
      }
    }

    .recommendations {
      width: calc(100vw - 100px);
      overflow: hidden;
      margin: 0 auto;
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

    .carousel-arrow {
      border: none;
      z-index: 12;
      font-size: 50px;
      overflow: hidden;
      position: relative;
      background-color: transparent;

      &:after {
        content: "";
        z-index: -1;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      &.fa-angle-left:before {
        transform: translateX(-7px);
        position: relative;
        display: block;
      }

      &.fa-angle-right:after {
        background-image: linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
      }

      &.fa-angle-left:after {
        background-image: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
      }
    }

    @keyframes scrollRight {
      0% {
        margin-left: 0%;
      }
      100% {
        margin-left: -100%;
      }
    }

    @keyframes scrollLeft {
      0% {
        margin-left: -100%;
      }
      100% {
        margin-left: 0%;
      }
    }
  </style>
  