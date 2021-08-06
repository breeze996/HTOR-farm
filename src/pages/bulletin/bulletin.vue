<template>
  <m-page class="bulletin-page">
    <div class="title">{{ t('bulletin') }}</div>
    <div class="content">{{ t('bulletinContent') }}</div>
  </m-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import MPage from '../../components/m-page/m-page.vue'
export default defineComponent({
  components: {
    MPage,
  },
  setup() {
    const { t } = useI18n()
    return {
      t
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../scss/variable.scss';
.bulletin-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    height: 58px;
    font-size: 30px;
    font-weight: bold;
    line-height: 58px;
    text-align: center;
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
  }
}
</style>
