<template>
  <header class="header">
    <div class="content">
      <div class="avatar">
        <img src="./logo.png" />
      </div>
      <div class="navs">
        <div class="nav">{{ t('singleTokenMining') }}</div>
        <div class="nav">{{ t('LPTokenMining') }}</div>
      </div>
      <div class="connector">
        <div class="connect" v-if="!isConnected" @click="connect">{{ t('connect') }}</div>
        <div class="address" v-else @click="onAddressClick">{{ shortenAddress(account) }}</div>
      </div>
      <div class="langs-wrapper">
        <langs />
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Langs from '../langs/langs.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { State } from '../../store/state-types'
import { shortenAddress } from '../../common/ts/utils'
import { Dialog } from '../dialog/index'

export default defineComponent({
  components: {
    Langs,
  },
  setup() {
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
        onConfirm() {
          store.dispatch('handleDisconnect')
        },
      })
    }

    return {
      account: computed(() => store.state.userInfo.account),
      isConnected: computed(() => store.getters.isConnected),
      locale,

      t,
      connect,
      shortenAddress,
      onAddressClick,
    }
  },
})
</script>

<style lang="scss">
@import '../../scss/variable.scss';
@import '../../scss/mixin.scss';
.header {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  height: 100px;
  background: rgba($color: #15223b, $alpha: 0.52);
  .content {
    display: flex;
    align-items: center;
    height: 100px;
    max-width: 1200px;
    margin: 0 auto;
    .avatar {
      display: flex;
      justify-content: center;
      flex: 1;
      img {
        width: 220px;
        height: 49px;
      }
    }
    .navs {
      display: flex;
      flex: 1;
      margin-left: 50px;
      .nav {
        display: flex;
        flex: 1;
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
      padding: 0 20px 0 100px;
    }
  }
}
@include mobile {
  .header {
    height: 50px;
    background: rgba($color: #2b364a, $alpha: 0.52);
    .content {
      height: 50px;
      .avatar {
        justify-content: flex-start;
        padding-left: 15px;
        img {
          width: 110px;
          height: 25px;
        }
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
        padding: 0 15px 0 25px;
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}
</style>
