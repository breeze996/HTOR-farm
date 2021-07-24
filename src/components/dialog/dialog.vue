<template>
  <div class="m-dialog">
    <m-popup
      v-model="visible"
      :hasMask="hasMask"
      :maskClosable="maskClosable"
      :transition="transition"
      :preventScroll="preventScroll"
      :preventScrollExclude="preventScrollExclude"
      @hide="onHide"
      position="center"
    >
      <div class="m-dialog-content">
        <slot name="header" v-if="$slots.header"></slot>
        <div class="m-dialog-header" v-else-if="title">
          {{ title }}
        </div>
        <div class="m-dialog-body">
          <slot>
            <div class="m-dialog-text" v-html="content"></div>
          </slot>
        </div>
        <slot name="actions" v-if="$slots.actions"></slot>
        <template v-else>
          <footer class="m-dialog-actions">
            <div class="m-dialog-cancel" v-if="cancel" @click="onCancel">
              {{ cancelText }}
            </div>
            <div class="m-dialog-confirm" v-if="confirm" @click="onConfirm">
              {{ confirmText }}
            </div>
          </footer>
        </template>
      </div>
    </m-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue'
import Popup from '../popup/popup.vue'
import props from './props'

export default defineComponent({
  name: 'm-dialog',
  components: {
    [Popup.name]: Popup,
  },
  props: { ...props },
  emits: ['update:show', 'cancel:click', 'confirm:click', 'closed'],
  setup(props, { emit }) {
    const {
      hasMask,
      show,
      maskClosable,
      transition,
      title,
      content,
      cancel,
      confirm,
      cancelText,
      confirmText,
      preventScroll,
      preventScrollExclude,
    } = toRefs(props)

    const visible = computed({
      get: () => show.value,
      set: (show) => {
        emit('update:show', show)
      },
    })

    const onConfirm = () => {
      visible.value = false
      emit('confirm:click')
    }
    const onCancel = () => {
      visible.value = false
      emit('cancel:click')
    }
    const onHide = () => {
      emit('closed')
    }

    return {
      visible,
      hasMask,
      maskClosable,
      transition,
      title,
      content,
      cancel,
      confirm,
      cancelText,
      confirmText,

      preventScroll,
      preventScrollExclude,

      onConfirm,
      onCancel,
      onHide,
    }
  },
})
</script>

<style lang="scss">
@import '../../scss/variable.scss';
@import '../../scss/mixin.scss';
.m-dialog-content {
  margin: 0 13px;
  background: #231b3e;
  overflow: hidden;
  min-width: 450px;
  background: #283864;
  box-shadow: -3px 3px 5px rgba(10, 20, 48, 0.5);
  border-radius: 20px;
  @include mobile {
    min-width: 270px;
  }
}
.m-dialog-header {
  height: 74px;
  line-height: 74px;
  text-align: center;
  font-size: 20px;
  font-weight: 500;
  color: $color-text;
}

.m-dialog-body {
  padding: 50px 20px;
  color: $color-text;
  font-size: $font-size-medium-x;
  text-align: left;
  min-width: 380px;
  @include mobile {
    padding: 35px 20px;
    min-width: 270px;
  }
}

.m-dialog-text {
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  color: $color-text;
  line-height: 28px;
  word-break: break-all;
}

.m-dialog-actions {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 35px;
  > div {
    width: 100px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    box-sizing: border-box;
    text-align: center;
    font-size: $font-size-medium-x;
    margin-left: 15px;
    cursor: pointer;
    box-shadow: 2px -2px 10px rgba(10, 20, 48, 0.51);
    border-radius: 10px;
    background: #283864;
    &:first-child {
      margin-left: 0;
    }
  }
  /* .m-dialog-cancel {
    border: 1px solid $color-theme;
    color: $color-theme;
  }
  .m-dialog-confirm {
  } */
}
</style>
