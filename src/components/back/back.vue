<template>
  <div class="nav-bar" @click="back">
    <img src="./arrow-left.png" />
    <span>{{ t('back') }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  setup() {
    const router = useRouter()
    const { t } = useI18n()

    const back = () => {
      router.go(-1)
    }

    return {
      back,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../scss/variable.scss';
@import '../../scss/mixin.scss';
.nav-bar {
  display: flex;
  align-items: center;
  position: absolute;
  left: 50px;
  top: 33px;
  cursor: pointer;
  img {
    width: 24px;
    height: 23px;
    margin-right: 10px;
  }
  @include mobile {
    left: 20px;
    top: 22px;
    img {
      width: 12px;
      height: 11px;
      margin-right: 5px;
    }
  }
}
</style>
