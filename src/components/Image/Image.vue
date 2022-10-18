<script setup lang="ts">
</script>

<script lang="ts">
  const observerOptions = {
    threshold: 0.01
  };

  function asyncImageLoad (src: string, data: { src: string; loading: boolean; }): void {
    const asyncLoaded: HTMLImageElement = new Image();
    asyncLoaded.onload = () => {
      data.src = src || '';
      data.loading = false;
    }
    asyncLoaded.src = src || '';
  }

  function observerCallback (src: string, entries: IntersectionObserverEntry[]) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      
      if (entry.isIntersecting) {
        asyncImageLoad(src,  this.$data);
        this.$data.observer.unobserve(entry.target);
      }
    });
  }
      
  export default {
    props: ['src', 'cssClass', 'lazy'],
    data() {
      return {
        src: this.$props.lazy === false ? this.$props.src : '',
        loading: !(this.$props.lazy === false),
        observer: this.$props.lazy === false ? null : new IntersectionObserver(observerCallback.bind(this, this.$props.src), observerOptions),
      };
    },
    computed: {
      mySrc () {
        if (this.src !== '' && this.$props.src !== this.src) {
          this.src = this.$props.src;
        }

        return this.src;
      }
    },
    methods: {
    },
    mounted() {
      if (this.observer) {
        this.observer.observe(this.$refs.img as Element);
      }
    },
    
  }
</script>

<template>
  <span :class="`img${loading ? ' loading' : ''} ${$props.cssClass}`" ref="img">
    <img :src="mySrc"  />
  </span>
</template>

<style lang="scss" scoped>
  .img {
    display: inline-block;
    overflow: hidden;

    &.loading {
      background: no-repeat center;
      background-image: url("data:image/svg+xml;charset=utf8,%3C!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL --%3E%3Csvg width='40' height='40' viewBox='0 0 38 38' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='8.042%25' y1='0%25' x2='65.682%25' y2='23.865%25' id='a'%3E%3Cstop stop-color='%23F3C000' stop-opacity='0' offset='0%25'/%3E%3Cstop stop-color='%23F3C000' stop-opacity='.631' offset='63.146%25'/%3E%3Cstop stop-color='%23F3C000' offset='100%25'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg transform='translate(1 1)'%3E%3Cpath d='M36 18c0-9.94-8.06-18-18-18' id='Oval-2' stroke='url(%23a)' stroke-width='2'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 18 18' to='360 18 18' dur='0.9s' repeatCount='indefinite' /%3E%3C/path%3E%3Ccircle fill='%23F3C000' cx='36' cy='18' r='1'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 18 18' to='360 18 18' dur='0.9s' repeatCount='indefinite' /%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E");

      img {
        opacity: 0;
      }
    }
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s;
    opacity: 1;
  }
</style>
