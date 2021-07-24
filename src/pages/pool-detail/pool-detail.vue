<template>
  <m-page class="pool-detail-page">
    <div class="token">
      <!-- {{poolDetail.isSingleToken?68:78}} -->
      <token-avatar :token="token" :height="68" :width="68" />
      <div class="name">{{ token.symbol }}</div>
    </div>
    <div class="cells">
      <div class="cell">
        <div class="label">{{ t('APY') }}:</div>
        <div class="value">XXXXXXXX</div>
      </div>
      <div class="cell">
        <div class="label">{{ t('totalStaked') }}:</div>
        <div class="value">XXXXXXXX</div>
      </div>
      <div class="cell">
        <div class="label">{{ t('staked') }}:</div>
        <div class="value">XXXXXXXX</div>
      </div>
      <div class="cell">
        <div class="label">{{ t('earned') }}:</div>
        <div class="value">XXXXXXXX</div>
      </div>
    </div>
    <div class="buttons">
      <button v-if="isApproved">{{ t('stake') }}</button>
      <button v-else :disabled="isApproving">
        <loading v-if="isApproving" />
        <span>{{ t(isApproving ? 'approving' : 'approve') }}</span>
      </button>
      <button>{{ t('unstake') }}</button>
      <button>{{ t('harvestEarned') }}</button>
    </div>
  </m-page>
  <div class="models">
    <model v-model="showStakeModel" :title="t('stake')">
      <div class="stake-model">
        <!-- {{poolDetail.isSingleToken?68:78}} -->
        <token-avatar class="token-avatar" :token="token" :height="68" :width="68" />
        <div class="balance">
          <span>{{ t('balance') }}</span> : <span>11</span>
        </div>
        <div class="input-wrap">
          <numerical-input
            class="input"
            :placeholder="t('pleaseInputStakeAmount')"
            :modelValue="baseStakeAmount"
            @input="onStakeInput"
          />
          <span class="token-name">USDT</span>
          <span class="max">Max</span>
        </div>
        <div class="buttons">
          <button>{{ t('stake') }}</button>
        </div>
      </div>
    </model>
    <model v-model="showUnStakeModel" :title="t('unstake')">
      <div class="unstake-model">
        <!-- {{poolDetail.isSingleToken?68:78}} -->
        <token-avatar class="token-avatar" :token="token" :height="68" :width="68" />
        <div class="staked">
          <span>{{ t('staked') }}</span> : <span>11</span>
        </div>
        <div class="input-wrap">
          <numerical-input
            class="input"
            :placeholder="t('pleaseInputUnstakeAmount')"
            :modelValue="baseUnstakeAmount"
            @input="onUnstakeInput"
          />
          <span class="token-name">USDT</span>
          <span class="max">Max</span>
        </div>
        <div class="buttons">
          <button>{{ t('unstake') }}</button>
        </div>
      </div>
    </model>
    <model v-model="showEarningsModel" :title="t('harvestEarned')">
      <div class="earnings-model">
        <token-avatar class="token-avatar" :token="token" :height="68" :width="68" />
        <div class="earnings">
          <span>{{ t('earned') }}</span> : <span>11</span>
        </div>
        <div class="buttons">
          <button>{{ t('harvestEarned') }}</button>
        </div>
      </div>
    </model>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import MPage from '../../components/m-page/m-page.vue'
import { useI18n } from 'vue-i18n'
import { Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import TokenAvatar from '../../components/token-avatar/token-avatar.vue'
import Loading from '../../components/loading/loading.vue'
import Model from '../../components/model/model.vue'
import NumericalInput from '../../components/numerical-input/numerical-input.vue'
import { tryParseAmount } from '../../common/ts/utils'
export default defineComponent({
  components: {
    TokenAvatar,
    MPage,
    Loading,
    Model,
    NumericalInput,
  },
  setup() {
    const token = new Token(56, '0x55d398326f99059ff775485246999027b3197955', 18, 'hhh', 'test')

    const { t } = useI18n()
    const isApproved = ref(false)
    const isApproving = ref(true)
    const showStakeModel = ref(false)
    const showUnStakeModel = ref(false)
    const showEarningsModel = ref(true)

    const baseStakeAmount = ref<string>()
    const stakeAmount = computed({
      get() {
        return tryParseAmount(baseStakeAmount.value, token)
      },
      set(v: TokenAmount | undefined) {
        baseStakeAmount.value = v?.toExact() ?? ''
      },
    })
    const onStakeInput = (v: string) => {
      baseStakeAmount.value = v
    }

    const baseUnstakeAmount = ref<string>()
    const unstakeAmount = computed({
      get() {
        return tryParseAmount(baseUnstakeAmount.value, token)
      },
      set(v: TokenAmount | undefined) {
        baseUnstakeAmount.value = v?.toExact() ?? ''
      },
    })
    const onUnstakeInput = (v: string) => {
      baseUnstakeAmount.value = v
    }

    return {
      isApproved,
      isApproving,

      baseStakeAmount,
      baseUnstakeAmount,

      showStakeModel,
      showUnStakeModel,
      showEarningsModel,

      token,

      t,

      onStakeInput,
      onUnstakeInput,
    }
  },
})
</script>

<style lang="scss">
@import '../../scss/variable.scss';
@import '../../scss/mixin';
.pool-detail-page {
  .token {
    display: flex;
    align-items: center;
    flex-direction: column;
    .name {
      margin-top: 20px;
      font-size: 30px;
      font-weight: bold;
      line-height: 36px;
    }
  }
  .cells {
    .cell {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 50px 0;
      font-size: 24px;
      padding: 0 50px;
      line-height: 29px;
      .value {
        font-weight: bold;
      }
    }
  }
  .buttons {
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 194px;
      height: 40px;
      background: #283864;
      box-shadow: 1px -1px 4px rgba(255, 255, 255, 0.34);
      border-radius: 10px;
      border: 0;
      font-size: 16px;
      color: #fff;
      outline: none;
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
        box-shadow: 2px -2px 10px rgba(10, 20, 48, 0.51);
      }
      .loading {
        img {
          height: 15px;
          width: 15px;
          margin-right: 5px;
        }
      }
    }
  }
  @include mobile {
    .token {
      .name {
        margin-top: 5px;
        font-size: 15px;
        line-height: 18px;
      }
      img {
        zoom: 0.3;
      }
    }
    .cells {
      .cell {
        margin: 25px 0;
        font-size: 12px;
        padding: 0 20px;
        line-height: 18px;
      }
    }
    .buttons {
      padding: 0 20px;
      button {
        width: 80px;
        height: 30px;
        border-radius: 5px;
        font-size: 10px;
        .loading {
          img {
            height: 10px;
            width: 10px;
            margin-right: 3px;
          }
        }
      }
    }
  }
}
.models {
  .earnings-model,
  .unstake-model,
  .stake-model {
    .token-avatar {
      margin: 0 auto;
    }
    .earnings,
    .staked,
    .balance {
      margin: 20px 0 50px 0;
      text-align: center;
      font-size: 24px;
      line-height: 33px;
    }
    .input-wrap {
      display: flex;
      align-items: center;
      margin: 50px;
      height: 63px;
      padding: 0 30px;
      border: 1px solid #707070;
      border-radius: 32px;
      .input {
        flex: 1;
        font-size: 20px;
      }
      .token-name {
        height: 63px;
        line-height: 63px;
        margin: 0 20px;
        font-size: 20px;
      }
      .max {
        position: relative;
        height: 63px;
        line-height: 63px;
        padding-left: 20px;
        font-size: 20px;
        color: #2d89ff;
        cursor: pointer;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 1px;
          height: 30px;
          background: #0c2d57;
        }
      }
    }
    .buttons {
      display: flex;
      margin: 50px;
      padding: 0 58px;
      button {
        flex: 1;
        height: 63px;
        background: #283864;
        box-shadow: 1px -1px 4px rgba(255, 255, 255, 0.34);
        border-radius: 32px;
        font-size: 20px;
        font-weight: 400;
        color: #fff;
        border: 0;
        outline: none;
        cursor: pointer;
      }
    }
  }
  @include mobile {
    .earnings-model,
    .unstake-model,
    .stake-model {
      .token-avatar {
        zoom: 0.5;
      }
      .earnings,
      .staked,
      .balance {
        margin: 10px 0 25px 0;
        font-size: 12px;
        line-height: 17px;
      }
      .input-wrap {
        margin: 25px;
        height: 32px;
        padding: 0 15px;
        border-radius: 16px;
        .input {
          flex: 1;
          font-size: 10px;
        }
        .token-name {
          height: 32px;
          line-height: 32px;
          margin: 0 10px;
          font-size: 10px;
        }
        .max {
          height: 32px;
          line-height: 32px;
          padding-left: 10px;
          font-size: 10px;
          &::after {
            transform: translateY(-50%);
            height: 15px;
          }
        }
      }
      .buttons {
        margin: 25px;
        padding: 0 30px;
        button {
          height: 32px;
          border-radius: 16px;
          font-size: 10px;
        }
      }
    }
  }
}
</style>
