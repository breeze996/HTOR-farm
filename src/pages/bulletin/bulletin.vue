<template>
  <m-page class="bulletin-page">
    <div class="title">公告</div>
    <div class="content">哈哈哈哈哈哈哈哈哈哈哈哈</div>
  </m-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MPage from '../../components/m-page/m-page.vue'
export default defineComponent({
  components: {
    MPage,
  },
  setup() {
    return {}
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
