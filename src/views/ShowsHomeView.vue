<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import { useShowsStore } from '../stores/shows';
  import { useRoute } from 'vue-router';
  import { pureString } from '../helpers';
  import { reactive } from 'vue';
  import Image from '../components/Image/Image.vue';
  import Carousel from '../components/Carousel/Carousel.vue';
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
        genres: { ...store.genres },
      };
    },
    methods: {
      setKey (prefix: string, suffix: string | number) {
        return `${prefix}-${suffix.toString().replace(/\s/g, '-')}`
      },
    },
    computed: {
      bgImage () {
        return `linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 100%), url(${this.store.forYouToday.show?.image.original})`;
      },
    },
  }
</script>

  <template>
    <main class="main-content">
      <section class="hero">
        <Image cssClass="hero__image" :src="store.forYouToday.show?.image.original || ''" :lazy="false" />
        <h2 class="hero__info">{{ store.forYouToday.show?.name }}</h2>
        <p class="hero__info">{{ pureString(store.forYouToday.show?.summary) }}</p>
        <a target="_blank" :href="store.forYouToday.show?.officialSite" class="hero__info button" v-if="store.forYouToday.show?.officialSite">Discover</a>
      </section>
      <section class="recommendations">
        <h2>What's on Today?</h2>
        <article v-for="(genre, name) in $data.genres" class="gallery" :key="setKey('article', name)">
          <h3 class="gallery__title">{{ name }}</h3>
          <Carousel :carouselData="{ name, shows: genre }" />
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

      ::v-deep &__image {
        position: relative;
        width: 100px;
        height: auto;
        height: calc(100px * 3 / 2);
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

      &__title {
        padding-left: 26px;
      }

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
  