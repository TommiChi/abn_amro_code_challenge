<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import Image from '../Image/Image.vue';
</script>

<script lang="ts">
  const observerOptions = {
    threshold: 0.01
  };

  function observerCallback (src: string, entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      
      if (entry.isIntersecting) {
        const asyncLoaded: HTMLImageElement = new Image();
        asyncLoaded.onload = () => {
          this.$data.src = src || '';
          this.$data.loading = false;
        }
        asyncLoaded.src = src || '';

        this.$data.observer.unobserve(entry.target);
      }
    });
  }
      
  export default {
    props: ['carouselData'],
    data() {
      return {
        name: this.$props.carouselData.name,
        shows: [...this.$props.carouselData.shows],
        _rotateX: 'rotateX(0)',
        _rotateY: 'rotateY(0)',
        _rotateZ: 'rotateZ(0)',
        shouldBeVisible: '0',
      };
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
      galleryScroll (genreName: string|number, direction: string) {
        const genre = this.shows;
        const container = this.$refs[`container_${genreName}`] as HTMLElement;
        const child: HTMLElement = container.children[0] as HTMLElement;
        const count = Math.floor(container.offsetWidth / child.offsetWidth);

        if (count >= this.shows.length) {
          return;
        }
            
        const scrollDirection: any = {
          left: () => {
            let lastItem = this.shows.length;
            if (this.shows[0].scroll === 'left') {
              this.shows[0].scroll = '';
              this.shows.splice(lastItem - count, count);
              lastItem -= count;
            } else if (this.shows[0].scroll === 'right') {
              this.shows.splice(0, count);
              lastItem -= count;
            }

            setTimeout(() => {
              const args = new Array(count).fill(null).map((...[, index]) => {
                return ({ ...this.shows[lastItem - count + index] })
              });
              args[0].scroll = 'left';
              this.shows.unshift(...args);
            }, 0);
          },
          right: () => {
            let lastItem = this.shows.length;
            if (this.shows[0].scroll === 'right') {
              this.shows.splice(0, count);
              lastItem -= count;
            } else if (this.shows[0].scroll === 'left') {
              this.shows[0].scroll = '';
              this.shows.splice(lastItem - count, count);
              lastItem -= count;
            }

            const args = new Array(count).fill(null).map((...[, index]) => {
              return ({ ...this.shows[index] })
            });

            setTimeout(() => {
              this.shows.push(...args);
              this.shows[0].scroll = 'right';
            }, 0);
          },
        };

        scrollDirection[direction]();
      },
    },
    mounted () {
      const container = this.$refs[`container_${this.name}`];
      const containerRight = container.getBoundingClientRect().right;
      const lastItemRight = [...container.children].slice(-1)[0].getBoundingClientRect().right;
      this.$data.shouldBeVisible = containerRight < lastItemRight ? '1' : '0';
    },    
  }
</script>

<template>
  <div class="gallery__wrapper">
    <button class="carousel-arrow fa fa-angle-left" @click="galleryScroll(name, 'left')"></button>
    <ul class="gallery__itemlist" :ref="`container_${name}`">
      <li v-for="(show, index) in shows" :class="`gallery__item${show.scroll ? ` ${show.scroll}` : ''}`" :key="`${name}_${index}`">
        <RouterLink class="item__3dwrapper" @mousemove="tilt" @mouseenter="onEnter" @mouseleave="onLeave" :to="`/shows/${show.episodeId}`">
          <Image cssClass="item__image" :src="show?.image?.original || ''" />
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

</template>

<style lang="scss" scoped>
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

  .carousel-arrow {
    border: none;
    z-index: 12;
    font-size: 50px;
    overflow: hidden;
    position: relative;
    background-color: transparent;
    opacity: v-bind(shouldBeVisible);

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
      background-image: linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0) 100%);
    }

    &.fa-angle-left:after {
      background-image: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
    }
  }

  .item {
    ::v-deep &__image {
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
        