<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { State } from './store/state-types'

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore<State>()

    // store.dispatch('getCrowdfundings')

    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('accountsChanged', ([address]: string[]) => {
        store.dispatch('handleAccountChange', address)
      })
    }
  },
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
