<template>
  <header class="header">
    <div class="content">
      <div class="avatar">
        <img src="./logo.png" />
      </div>
      <div class="navs">
        <div class="nav" @click="scrollToControl('singleTokenMining')">
          {{ t('singleTokenMining') }}
        </div>
        <div class="nav" @click="scrollToControl('LPTokenMining')">{{ t('LPTokenMining') }}</div>
        <div class="nav" @click="exchange">{{ t('exchange') }}</div>
        <div class="nav" @click="addFluidity">{{ t('addFluidity') }}</div>
        <div class="nav">{{ t('operatingTutorial') }}</div>
        <div class="nav">{{ t('auditReport') }}</div>
      </div>
      <div class="connector">
        <div class="connect" v-if="!isConnected" @click="connect">{{ t('connect') }}</div>
        <div class="address" v-else @click="onAddressClick">{{ shortenAddress(account) }}</div>
      </div>
      <div class="langs-wrapper">
        <Langs />
      </div>
      <img @click="open" class="menuIcon" src="./menuIcon.png" alt="" />
    </div>
  </header>
  <el-drawer v-model="drawer" :direction="direction" :with-header="false" destroy-on-close>
    <div class="na">
      <div class="nav" @click="scrollToControl('singleTokenMining')">
        {{ t('singleTokenMining') }}
      </div>
      <div class="nav" @click="scrollToControl('LPTokenMining')">{{ t('LPTokenMining') }}</div>
      <div class="nav" @click="exchange">{{ t('exchange') }}</div>
      <div class="nav" @click="addFluidity">{{ t('addFluidity') }}</div>
      <div class="nav">{{ t('operatingTutorial') }}</div>
      <div class="nav">{{ t('auditReport') }}</div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Langs from '../langs/langs.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { State } from '../../store/state-types'
import { shortenAddress, getElementPosition } from '../../common/ts/utils'
import { Dialog } from '../dialog/index'

export default defineComponent({
  components: {
    Langs
  },
  data () {
    return {
      drawer: false,
      direction: 'rtl'
    }
  },
  methods: {
    open () {
      this.drawer = true
    }
  },
  setup () {
    const store = useStore<State>()
    const { t, locale } = useI18n()
    const connect = () => {
      store.dispatch('handleConnect')
    }

    const onAddressClick = () => {
      Dialog({
        content: t('confirmDisconnect'),
        confirmText: t('confirm'),
        cancelText: t('cancel'),
        cancel: true,
        confirm: true,
        onConfirm () {
          store.dispatch('handleDisconnect')
        }
      })
    }
    const scrollToControl = async (id: string) => {
      const { y } = getElementPosition(id)
      document.body.scrollTop = y ? y : 0
    }
    const exchange = async () => {
      window.location.href = 'https://pancakeswap.finance/swap'
      console.log('exchange')
    }
    const addFluidity = async () => {
      window.location.href = 'https://pancakeswap.finance/add'
      console.log('exchange')
    }
    return {
      account: computed(() => store.state.userInfo.account),
      isConnected: computed(() => store.getters.isConnected),
      locale,
      t,
      connect,
      shortenAddress,
      onAddressClick,
      scrollToControl,
      exchange,
      addFluidity
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../scss/variable.scss';
@import '../../scss/mixin.scss';

.na {
  height: 100%;
  background-color: #203761;
  padding-top: 30px;
  // padding-left: 10px;
  .nav {
    color: #fff;
    line-height: 30px;
    margin-bottom: 10px;
    text-align: center;
  }
}
.header {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  height: 100px;
  background: rgba($color: #15223b, $alpha: 0.52);
  /deep/ .el-drawer {
  }
  .content {
    display: flex;
    align-items: center;
    height: 100px;
    max-width: 1250px;
    margin: 0 auto;
    .avatar {
      display: flex;
      // justify-content: center;
      // flex: 1;
      img {
        width: 220px;
        height: 49px;
      }
    }
    .navs {
      display: flex;
      flex: 1;
      margin-left: 50px;
      margin-right: 50px;
      justify-content: space-between;
      cursor: pointer;
      .nav {
        display: flex;
      }
    }
    .connector {
      display: flex;
      align-items: center;
      flex: 0 0 144px;
      height: 38px;
      border: 1px solid #8fffcf;
      box-shadow: -3px 3px 5px #0a1430;
      border-radius: 5px;
      padding: 0 10px;
      font-size: 18px;
      color: #fff;
      cursor: pointer;
      .connect,
      .address {
        flex: 1;
        padding-left: 7px;
        text-align: center;
      }
    }
    .langs-wrapper {
      display: flex;
      justify-content: center;
      padding: 0 20px 0 50px;
    }
  }
  .menuIcon {
    display: none;
  }
}
@include mobile {
  .header {
    position: flex;
    height: 50px;
    background: rgba($color: #2b364a, $alpha: 0.52);
    .content {
      height: 50px;
      .avatar {
        img {
          width: 110px;
          height: 25px;
        }
        margin-left: 15px;
        margin-right: 24px;
      }
      .navs {
        display: none;
      }
      .connector {
        flex: 0 0 100px;
        height: 23px;
        font-size: 12px;
      }
      .langs-wrapper {
        display: flex;
        justify-content: center;
        padding: 0 15px 0 20px;
        font-size: 12px;
        // font-weight: bold;
      }
      .menuIcon {
        width: 22px;
        height: 15.5px;
        margin-left: 5px;
        display: block;
      }
    }
  }
}
</style>
