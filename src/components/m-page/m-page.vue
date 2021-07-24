<template>
  <div class="m-page">
    <back />
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Back from '../../components/back/back.vue'
export default defineComponent({
  components: {
    Back,
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss">
@import '../../scss/variable.scss';
@import '../../scss/mixin.scss';
.m-page {
  position: relative;
  width: 800px;
  height: 600px;
  background: #283864;
  box-shadow: -3px 3px 5px rgba(10, 20, 48, 0.5);
  border-radius: 20px;
  margin: 150px auto 0 auto;
  padding-top: 50px;
  @include mobile {
    width: 315px;
    height: 315px;
    border-radius: 10px;
    padding-top: 25px;
  }
  @include smallMobile {
    margin: 80px auto 0 auto;
  }
}
</style>
