<template>
  <img
    class="token-avatar"
    :src="src ?? require('./default.png')"
    :width="width"
    :height="height"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs } from 'vue'
import { Token } from '@cointribute/pancakeswap-sdk-v2'
import avatars from '@/token-avatars/index'

export default defineComponent({
  props: {
    token: {
      type: Object as PropType<Token>,
      required: true,
    },
    height: {
      type: Number,
    },
    width: {
      type: Number,
    },
  },
  setup(props) {
    const { token } = toRefs(props)
    const src = avatars[token.value?.address?.toLocaleLowerCase()]

    return {
      src: src,
    }
  },
})
</script>

<style lang="scss" scoped>
.token-avatar {
  display: block;
  border-radius: 50%;
}
</style>
