<template>
  <m-page class="pool-detail-page">
    <div class="token">
      <token-avatar
        v-if="currentPool?.token"
        :token="currentPool?.token"
        :height="68"
        :width="currentPool?.isLPToken ? 78 : 68"
      />
      <div class="name">{{ currentPool?.tokenSymbol ?? '-' }}</div>
    </div>
    <div class="cells">
      <div class="cell">
        <div class="label">{{ t('APY') }}:</div>
        <div class="value">{{ APYS[currentPool?.poolId] ? APYS[currentPool.poolId] : '-' }}%</div>
      </div>
      <div class="cell">
        <div class="label">{{ t('totalStaked') }}:</div>
        <div class="value">
          <span> {{ currentPool?.poolStakedAmount.toSignificant(9) ?? '-' }}</span>
          <span class="symbol">{{ currentPool?.tokenSymbol }} </span>
        </div>
      </div>
      <div class="cell">
        <div class="label">{{ t('staked') }}:</div>
        <div class="value">
          <span> {{ !isConnected ? '-' : stakedAmount?.toSignificant(9) ?? '-' }}</span>
          <span class="symbol">{{ currentPool?.tokenSymbol }} </span>
        </div>
      </div>
      <div class="cell">
        <div class="label">{{ t('earned') }}:</div>
        <div class="value">
          <span>{{ !isConnected ? '-' : earningsAmount?.toSignificant(9) ?? '-' }}</span>
          <span class="symbol">{{ earningsAmount?.token.symbol }} </span>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button v-if="isApproved" :disabled="!isConnected" @click="showStakeModel = true">
        {{ t('stake') }}
      </button>
      <button v-else :disabled="isApproving || isLoading || !isConnected" @click="onApprove">
        <loading v-if="isApproving || isLoading" />
        <span>{{ t(isApproving ? 'approving' : 'approve') }}</span>
      </button>
      <button :disabled="!isApproved || !isConnected" @click="showUnStakeModel = true">
        {{ t('unstake') }}
      </button>
      <button :disabled="!isApproved || !isConnected" @click="showEarningsModel = true">
        {{ t('harvestEarned') }}
      </button>
    </div>
  </m-page>
  <div class="models">
    <model v-model="showStakeModel" :title="t('stake')">
      <div class="stake-model">
        <token-avatar
          v-if="currentPool?.token"
          class="token-avatar"
          :token="currentPool?.token ?? {}"
          :height="68"
          :width="currentPool?.isLPToken ? 78 : 68"
        />
        <div class="balance">
          <span>{{ t('balance') }}</span> :
          <span>{{ stakeTokenBalance?.toSignificant(9) ?? '-' }}</span>
          <span class="symbol">{{ currentPool?.tokenSymbol }}</span>
        </div>
        <div class="input-wrap">
          <numerical-input
            class="input"
            :placeholder="t('pleaseInputStakeAmount')"
            :modelValue="baseStakeAmount"
            @input="onStakeInput"
          />
          <span class="token-name">{{ currentPool?.tokenSymbol ?? '-' }}</span>
          <span class="max" @click="onStakeMax">Max</span>
        </div>
        <div class="buttons">
          <button :disabled="stakeButtonDisable" @click="onStake">
            {{
              t(
                !stakeAmount
                  ? 'pleaseInputStakeAmount'
                  : isInsufficientBalance
                  ? 'insufficientBalance'
                  : 'stake'
              )
            }}
          </button>
        </div>
      </div>
    </model>
    <model v-model="showUnStakeModel" :title="t('unstake')">
      <div class="unstake-model">
        <token-avatar
          v-if="currentPool?.token"
          class="token-avatar"
          :token="currentPool?.token ?? {}"
          :height="68"
          :width="currentPool?.isLPToken ? 78 : 68"
        />
        <div class="staked">
          <span>{{ t('staked') }}</span> :
          <span>{{ stakedAmount?.toSignificant(9) ?? '-' }}</span>
          <span class="symbol">{{ currentPool?.tokenSymbol }}</span>
        </div>
        <div class="input-wrap">
          <numerical-input
            class="input"
            :placeholder="t('pleaseInputUnstakeAmount')"
            :modelValue="baseUnstakeAmount"
            @input="onUnstakeInput"
          />
          <span class="token-name">{{ currentPool?.tokenSymbol ?? '-' }}</span>
          <span class="max" @click="onUnstakeMax">Max</span>
        </div>
        <div class="buttons">
          <button :disabled="unstakeButtonDisable" @click="onUnstake">
            {{
              t(
                !unstakeAmount
                  ? 'pleaseInputUnstakeAmount'
                  : isUnstakeInsufficient
                  ? 'unstakeAmountCannotGreaterThanStakeAmount'
                  : 'unstake'
              )
            }}
          </button>
        </div>
      </div>
    </model>
    <model v-model="showEarningsModel" :title="t('harvestEarned')">
      <div class="earnings-model">
        <token-avatar
          class="token-avatar"
          v-if="currentPool?.miningToken"
          :token="currentPool?.miningToken"
          :height="68"
          :width="68"
        />
        <div class="earnings">
          <span>{{ t('earned') }}</span> : <span>{{ earningsAmount?.toSignificant(9) }}</span>
          <span class="symbol">{{ earningsAmount?.token.symbol }}</span>
        </div>
        <div class="buttons">
          <button :disabled="harvestEarnedDisable" @click="onHarvestEarned">
            {{ t('harvestEarned') }}
          </button>
        </div>
      </div>
    </model>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import MPage from '../../components/m-page/m-page.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { PoolInfo, State } from '../../store/state-types'
import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import TokenAvatar from '../../components/token-avatar/token-avatar.vue'
import Loading from '../../components/loading/index.vue'
import Model from '../../components/model/model.vue'
import NumericalInput from '../../components/numerical-input/numerical-input.vue'
import { tryParseAmount, getContract } from '../../common/ts/utils'
import getNotAccountWeb3 from '../../common/ts/getNotAccountWeb3'
import getWeb3 from '../../common/ts/getWeb3'
import { MASTER_CHEF_ADDRESS } from '../../common/ts/const'
import { abi as MasterChefAbi } from '../../abi/MasterChef.json'
import getApproved from '@/data/getApproved'
import getBalance from '@/data/getBalance'
import { getPoolInfo } from '../../data/getPoos'
import approve from '@/common/ts/approve'
import { Toast } from '@/components/toast'

export default defineComponent({
  components: {
    TokenAvatar,
    MPage,
    Loading,
    Model,
    NumericalInput,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore<State>()
    const route = useRoute()

    const account = computed(() => store.state.userInfo.account)
    const APYS = computed(() => store.state.APYS)
    const currentPool = computed(() => store.state.currentPool)
    const isConnected = computed<boolean>(() => store.getters.isConnected)

    const isInsufficientBalance = computed(() => {
      if (!stakeAmount.value || !stakeTokenBalance.value) {
        return false
      }
      return stakeAmount.value.greaterThan(stakeTokenBalance.value)
    })
    const stakeButtonDisable = computed(() => {
      if (!stakeAmount.value || !stakeTokenBalance.value || isInsufficientBalance.value) {
        return true
      }
      return false
    })
    const isUnstakeInsufficient = computed(() => {
      if (!unstakeAmount.value || !currentPool.value || !stakedAmount.value) {
        return false
      }
      return unstakeAmount.value.greaterThan(stakedAmount.value)
    })
    const unstakeButtonDisable = computed(() => {
      if (
        !unstakeAmount.value ||
        !currentPool.value ||
        !stakedAmount.value ||
        isUnstakeInsufficient.value
      ) {
        return true
      }
      return false
    })
    const harvestEarnedDisable = computed(() => {
      if (!earningsAmount.value) {
        return true
      }
      const Zore = new TokenAmount(earningsAmount.value.token, '0')
      return !earningsAmount.value.greaterThan(Zore)
    })
    const isApproved = ref(false)
    const isApproving = ref(false)
    const isLoading = ref(false)
    const earningsAmount = ref<TokenAmount>()
    const stakeTokenBalance = ref<TokenAmount>()
    const stakedAmount = ref<TokenAmount>()
    const showStakeModel = ref(false)
    const showUnStakeModel = ref(false)
    const showEarningsModel = ref(false)

    const baseStakeAmount = ref<string>()
    const stakeAmount = computed({
      get() {
        if (!currentPool.value) {
          return undefined
        }
        return tryParseAmount(baseStakeAmount.value, currentPool.value.token)
      },
      set(v: TokenAmount | undefined) {
        baseStakeAmount.value = v?.toExact() ?? ''
      },
    })

    const baseUnstakeAmount = ref<string>()
    const unstakeAmount = computed({
      get() {
        if (!currentPool.value) {
          return undefined
        }
        return tryParseAmount(baseUnstakeAmount.value, currentPool.value.token)
      },
      set(v: TokenAmount | undefined) {
        baseUnstakeAmount.value = v?.toExact() ?? ''
      },
    })

    const _getStakeTokenBalance = async (pool: PoolInfo, account: string) => {
      stakeTokenBalance.value = await getBalance(pool.token, account)
    }
    const _getApproved = async (pool: PoolInfo, account: string) => {
      isApproved.value = await getApproved(pool.token, MASTER_CHEF_ADDRESS, account)
    }
    const _getStakedAmount = async (pool: PoolInfo, account: string) => {
      const web3 = getNotAccountWeb3()
      const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
      const userInfo = await contract.methods.userInfo(pool.poolId, account).call()
      stakedAmount.value = new TokenAmount(pool.token, userInfo.amount)
    }
    const _getEarningsAmount = async (pool: PoolInfo, account: string) => {
      const web3 = getNotAccountWeb3()
      const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
      const earnings = (await contract.methods.pendingSushi(pool.poolId, account).call()) as string
      earningsAmount.value = new TokenAmount(pool.miningToken, earnings)
    }
    const _getUserInfo = async (pool: PoolInfo, account: string) => {
      isLoading.value = true
      await Promise.all([
        _getEarningsAmount(pool, account),
        _getApproved(pool, account),
        _getStakeTokenBalance(pool, account),
        _getStakedAmount(pool, account),
      ])
      isLoading.value = false
    }

    const onApprove = async () => {
      if (!account.value || !currentPool.value) {
        return
      }
      isApproving.value = true
      const hasApproved = await approve(currentPool.value.token, MASTER_CHEF_ADDRESS, account.value)
      isApproving.value = false
      isApproved.value = hasApproved
      Toast[hasApproved ? 'success' : 'info'](t(hasApproved ? 'approveSuccess' : 'approveFailed'))
    }
    const onStake = async () => {
      const web3 = getWeb3()
      if (!web3 || !account.value || !currentPool.value || !stakeAmount.value) {
        return
      }
      Toast.loading('loading...')
      const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
      try {
        const deposit = contract.methods.deposit(
          currentPool.value.poolId,
          stakeAmount.value.raw.toString()
        )
        await deposit.send({ from: account.value })
        Toast.clear()
        Toast.success(t('stakeSuccess'))
        stakeAmount.value = undefined
        _getUserInfo(currentPool.value, account.value)
        store.dispatch('updatePool', currentPool.value.poolId)
      } catch (error) {
        Toast.clear()
        if (error?.code !== 4001) {
          console.log(error)
          Toast.info(t('stakeFailed'))
        }
      }
    }
    const onUnstake = async () => {
      const web3 = getWeb3()
      if (!web3 || !account.value || !currentPool?.value || !unstakeAmount.value) {
        return
      }

      Toast.loading('loading...')
      const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
      try {
        const withdraw = contract.methods.withdraw(
          currentPool.value.poolId,
          unstakeAmount.value.raw.toString()
        )
        await withdraw.send({ from: account.value })
        Toast.clear()
        Toast.success(t('unstakeSuccess'))
        _getUserInfo(currentPool.value, account.value)
        store.dispatch('updatePool', currentPool.value.poolId)
        unstakeAmount.value = undefined
      } catch (error) {
        Toast.clear()
        if (error?.code !== 4001) {
          console.log(error)
          Toast.info(t('unstakeFailed'))
        }
      }
    }
    const onHarvestEarned = async () => {
      const web3 = getWeb3()
      if (!web3 || !account.value || !currentPool?.value) {
        return
      }
      Toast.loading('loading...')
      const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
      try {
        const withdraw = contract.methods.withdraw(currentPool.value.poolId, 0)
        await withdraw.send({ from: account.value })
        Toast.clear()
        Toast.success(t('harvestEarnedSuccess'))
        _getUserInfo(currentPool.value, account.value)
      } catch (error) {
        Toast.clear()
        if (error?.code !== 4001) {
          Toast.info(t('harvestEarnedFailed'))
          console.log(error)
        }
      }
    }
    const onStakeMax = () => {
      stakeAmount.value = stakeTokenBalance.value
    }
    const onUnstakeMax = () => {
      unstakeAmount.value = stakedAmount.value
    }
    const onUnstakeInput = (v: string) => {
      baseUnstakeAmount.value = v
    }
    const onStakeInput = (v: string) => {
      baseStakeAmount.value = v
    }

    onMounted(async () => {
      const { query } = route
      if (!currentPool.value && query.poolId) {
        const pool = await getPoolInfo(Number(query.poolId))
        store.dispatch('setCurrentPool', pool)
      }
      if (account.value && currentPool.value) {
        _getUserInfo(currentPool.value, account.value)
      }
    })
    watch([account], async () => {
      if (!account.value || !currentPool.value) {
        return
      }
      _getUserInfo(currentPool.value, account.value)
      store.dispatch('updatePool', currentPool.value.poolId)
    })

    return {
      APYS,
      currentPool,

      isConnected,
      isApproved,
      isApproving,
      isLoading,
      earningsAmount,
      stakeTokenBalance,
      stakedAmount,
      stakeAmount,
      unstakeAmount,
      baseStakeAmount,
      baseUnstakeAmount,
      stakeButtonDisable,
      unstakeButtonDisable,
      harvestEarnedDisable,
      isUnstakeInsufficient,
      isInsufficientBalance,

      showStakeModel,
      showUnStakeModel,
      showEarningsModel,

      t,
      onStakeInput,
      onUnstakeInput,
      onApprove,
      onStake,
      onUnstake,
      onHarvestEarned,
      onStakeMax,
      onUnstakeMax,
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
        .symbol {
          margin-left: 5px;
        }
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
      img {
        height: 12px;
        width: 12px;
        margin: 0 3px 0 0;
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
      .symbol {
        margin-left: 5px;
      }
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
        &:disabled {
          cursor: not-allowed;
          box-shadow: 2px -2px 10px rgba(10, 20, 48, 0.51);
        }
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
