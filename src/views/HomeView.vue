<script setup lang="ts">
  import { RouterLink } from 'vue-router';
  import { useShowsStore } from '../stores/shows';
  import { useRoute } from 'vue-router';
</script>

<script lang="ts">
  type IShow = {
    image: {
      original: string;
    };
    [key: string]: any;
  };

  export default {
    data() {
      const store = useShowsStore();
      return {
        store,
        bgImage: ''
      };
    },
    methods: {
      initialise() {
        this.store.fetchShows().then(() => {
          const randomShow: IShow = this.store.shows[Math.floor(Math.random() * this.store.shows.length)];
          this.bgImage = `linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.2) 100%), url(/svg/ABN-AMRO_Logo_new_colors.svg), linear-gradient(45deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.5) 100%), url(${randomShow.image.original})`;
        })
      },
    },
    beforeMount(){
      this.initialise();
    },
  }
</script>

  <template>
    <main class="main-content">
      <div class="above-logo">
        <h1>Welcome to ab<span class="color__primary">N</span><span class="color__secondary">e</span>tflix!</h1>
        <p>We are the ultimate guide to your favourite TV shows</p>
        <p>Log in to get your personalised information on every show that ever was and ever will be</p>
      </div>
    </main>
  </template>
  
  <style lang="scss" scoped>
    .main-content {
      font-family: Roboto, Arial, Helvetica, sans-serif;
      background: no-repeat center;
      background-size: contain, 30%, contain, cover;
      background-image: v-bind(bgImage);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 100vw;
      min-height: 100vh;
      position: relative;
      top: 0;
      left: 0;

      h1 {
        text-align: center;
        span {
          font-weight: bold;
          text-shadow: 0px 0px 2px rgba(0,0,0,0.5)
        }
      }
    }

    .above-logo {
      transform: translateY(-100%);
    }
  </style>
  