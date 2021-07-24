<template>
  <div class="global-wrapper">
    <m-header />
    <img class="moon" src="./moon.png" />
    <img class="moon-m" src="./moon-m.png" />
    <div class="home">
      <router-view />
    </div>
    <img class="footer" src="./footer.png" />
    <img class="footer-m" src="./footer-m.png" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MHeader from '../../components/m-header/m-header.vue'

export default defineComponent({
  components: {
    MHeader,
  },
  name: 'Home',
})
</script>

<style lang="scss" scoped>
@import '../../scss/mixin';
.global-wrapper {
  position: relative;
  min-height: 100vh;
  background-image: url('./bg.png');
  background-repeat: no-repeat;
  background-size: 100%;
  padding-top: 100px;
  padding-bottom: 222px;
  box-sizing: border-box;
  .moon,
  .moon-m {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
  }
  .moon {
    width: 616px;
    height: 616px;
  }
  .moon-m {
    display: none;
    height: 150px;
    width: 150px;
  }
  .home {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .footer-m,
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
  .footer-m {
    display: none;
  }
  @include mobile {
    padding-top: 50px;
    padding-bottom: 70px;
    .moon {
      display: none;
    }
    .moon-m {
      display: block;
    }
    .footer {
      display: none;
    }
    .footer-m {
      display: block;
    }
  }
}
</style>
