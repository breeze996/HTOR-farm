<template>
  <div class="global-wrapper">
    <popup></popup>
    <m-header />
    <img class="moon" src="./moon.png" />
    <img class="moon-m" src="./moon-m.png" />
    <div class="home">
      <router-view />
    </div>
    <div class="footers">
      <ul class="footer_nav">
        <li @click="footerTo1"><img src="./tt.png" alt="" /></li>
        <li @click="footerTo2"><img src="./db.png" alt="" /></li>
        <li @click="footerTo3"><img src="./youtube.png" alt="" /></li>
        <li @click="footerTo4"><img src="./m.png" alt="" /></li>
      </ul>
    </div>
    <div class="footers-m">
      <ul class="footer_nav-m">
        <li @click="footerTo1"><img src="./tt.png" alt="" /></li>
        <li @click="footerTo2"><img src="./db.png" alt="" /></li>
        <li @click="footerTo3"><img src="./youtube.png" alt="" /></li>
        <li @click="footerTo4"><img src="./m.png" alt="" /></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MHeader from '../../components/m-header/m-header.vue'
import popup from '../../components/popup/popup.vue'

export default defineComponent({
  name: 'Home',
  components: {
    MHeader,
    popup
  },
  setup () {
    const footerTo1 = () => {
      window.location.href = 'https://twitter.com/Thor_networkt'
    }
    const footerTo2 = () => {
      window.location.href = 'https://t.me/ThorCommunity'
    }
    const footerTo3 = () => {
      window.location.href = 'https://youtube.com/channel/UCuDQW0_oSsX0hmYYOfQ82tw'
    }
    const footerTo4 = () => {
      window.location.href = 'https://link.medium.com/biDxBetLcib'
    }
    return {
      footerTo1,
      footerTo2,
      footerTo3,
      footerTo4
    }
  }
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
  padding-bottom: 322px;
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
  .footers {
    width: 100%;
    height: 252px;
    background: url('./footer.png');
    background-size: 100% 100%;
    position: absolute;
    bottom: 0;
    .footer_nav {
      width: 800px;
      padding-top: 180px;
      list-style: none;
      display: flex;
      justify-content: space-between;
      margin: 0 auto;
      li {
        width: 50px;
        height: 50px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .footers-m {
    width: 100%;
    height: 93px;
    background: url('./footer-m.png');
    background-size: 100% 100%;
    position: absolute;
    bottom: 0;
    .footer_nav-m {
      // padding: 0 15px;
      width: 100%;
      padding-top: 58px;
      list-style: none;
      display: flex;
      justify-content: space-around;
      margin: 0 auto;
      li {
        width: 25px;
        height: 25px;
        cursor: pointer;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .footer-m,
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
  .footers-m {
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
    .footers {
      display: none;
    }
    .footers-m {
      display: block;
    }
  }
}
</style>
