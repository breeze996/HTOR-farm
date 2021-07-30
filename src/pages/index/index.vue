<template>
  <div class="index">
    <div class="cards">
      <div class="desc">
        <img class="img" src="./dollar.png" />
        <div class="remark">
          <div class="title">{{ t('desc') }}</div>
          <div class="label">{{ t('remark') }}</div>
        </div>
        <div class="cells">
          <div class="cell">
            <div class="label">{{ t('totalLockedPosition') }}:</div>
            <div class="value">
              <span>{{ totalLockedPosition?.toSignificant() ?? '-' }}</span>
              <span class="symbol" v-if="totalLockedPosition">
                {{ totalLockedPosition?.token.symbol }}
              </span>
            </div>
          </div>
          <div class="cell">
            <div class="label">{{ t('totalUserRevenueToday') }}:</div>
            <div class="value">
              <span>{{ totalUserRevenueToday ?? '-' }}</span>
              <span class="symbol" v-if="totalUserRevenueToday">{{ MINING_TOKEN.symbol }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="bulletin" @click="toBulletin">
        <div class="left">
          <img src="./speaker.png" />
          <span>{{ t('bulletin') }}</span>
        </div>
        <div class="right">
          <span>{{ t('more') }}</span>
          <img src="./arrow-right.png" />
        </div>
      </div>
    </div>
    <div class="bar" id="singleTokenMining">
      <img src="./arrow-down.png" />
      <span>{{ t('singleTokenMiningArea') }}</span>
    </div>
    <div class="pools">
      <div class="pool" v-for="(pool, index) in singleTokenPools" :key="index">
        <div class="token">
          <div class="name">{{ pool.tokenSymbol }}</div>
          <token-avatar :token="pool.token" :height="55" :width="55" />
        </div>
        <div class="cells">
          <div class="cell">
            <div class="label">{{ t('APY') }}:</div>
            <div class="value">{{ APYS[pool.poolId] ?? '-' }}%</div>
          </div>
          <div class="cell">
            <div class="label">{{ t('totalStaked') }}:</div>
            <div class="value">
              <span> {{ pool.poolStakedAmount.toSignificant(8) }}</span>
              <span class="symbol">{{ pool.tokenSymbol }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="label">{{ t('staked') }}:</div>
            <div class="value">
              <span> {{ !isConnected ? '-' : pool.stakedAmount?.toSignificant(8) ?? '-' }}</span>
              <span class="symbol">{{ pool.tokenSymbol }}</span>
            </div>
          </div>
        </div>
        <button class="button" @click="toPoolDetail(pool)">{{ t('viewDetail') }}</button>
      </div>
      <div class="loading" v-if="isLoadingPools">
        <loading />
        <span>Loading...</span>
      </div>
    </div>
    <div class="bar" id="LPTokenMining">
      <img src="./arrow-down.png" />
      <span>{{ t('LPTokenMiningArea') }}</span>
    </div>
    <div class="pools">
      <div class="pool" v-for="(pool, index) in LPTokenPools" :key="index">
        <div class="token">
          <div class="name">{{ pool.tokenSymbol }}</div>
          <token-avatar :token="pool.token" :height="55" :width="65" />
        </div>
        <div class="cells">
          <div class="cell">
            <div class="label">{{ t('APY') }}:</div>
            <div class="value">{{ APYS[pool.poolId] ?? '-' }}%</div>
          </div>
          <div class="cell">
            <div class="label">{{ t('totalStaked') }}:</div>
            <div class="value">
              <span> {{ pool.poolStakedAmount.toSignificant(6) }}</span>
              <span class="symbol">{{ pool.tokenSymbol }}</span>
            </div>
          </div>
          <div class="cell">
            <div class="label">{{ t('staked') }}:</div>
            <div class="value">
              <span> {{ !isConnected ? '-' : pool.stakedAmount?.toSignificant(6) ?? '-' }}</span>
              <span class="symbol">{{ pool.tokenSymbol }}</span>
            </div>
          </div>
        </div>
        <button class="button" @click="toPoolDetail(pool)">{{ t('viewDetail') }}</button>
      </div>
      <div class="loading" v-if="isLoadingPools">
        <loading />
        <span>Loading...</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import useProxyRouter from '../../common/use/useProxyRouter'
import { PoolInfo, State } from '../../store/state-types'
import TokenAvatar from '../../components/token-avatar/token-avatar.vue'
import Loading from '../../components/loading/index.vue'
import { JSBI, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import { formatAmount, amountToDecimal } from '@/common/ts/utils'
import { MINING_TOKEN } from '@/common/ts/const'

export default defineComponent({
  components: {
    TokenAvatar,
    Loading,
  },
  setup() {
    const store = useStore<State>()
    const { t } = useI18n()
    const router = useProxyRouter()

    const pools = computed(() => store.state.pools)
    const APYS = computed(() => store.state.APYS)
    const isConnected = computed<boolean>(() => store.getters.isConnected)
    const singleTokenPools = computed(() => {
      return pools.value.filter((item) => !item.isLPToken)
    })
    const LPTokenPools = computed(() => {
      return pools.value.filter((item) => item.isLPToken)
    })
    const isLoadingPools = computed(() => store.state.isLoadingPools)
    const totalLockedPosition = computed(() => store.state.totalLockedPosition)
    const totalUserRevenueToday = computed(() => {
      if (!pools.value.length || !isConnected.value || !pools.value[0].earningsAmount) {
        return undefined
      }
      const totalUserRevenueToday = pools.value.reduce(
        (totalUserRevenueToday, item) =>
          JSBI.add(
            totalUserRevenueToday,
            JSBI.BigInt((item?.earningsAmount as TokenAmount).raw.toString())
          ),
        JSBI.BigInt(0)
      )
      const foumardTotalUserRevenueToday = amountToDecimal(
        formatAmount(totalUserRevenueToday?.toString()).toString()
      )
      return foumardTotalUserRevenueToday
    })

    const toPoolDetail = (pool: PoolInfo) => {
      store.dispatch('setCurrentPool', pool)
      router.push({ path: '/poolDetail', query: { poolId: pool.poolId } })
    }
    const toBulletin = () => {
      router.push({ path: '/bulletin' })
    }

    return {
      singleTokenPools,
      LPTokenPools,
      isLoadingPools,
      isConnected,
      totalLockedPosition,
      totalUserRevenueToday,
      APYS,
      MINING_TOKEN,

      toPoolDetail,
      toBulletin,
      t,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../scss/mixin';
@import '../../scss/variable';
.index {
  max-width: 1200px;
  margin: 0 auto;
  .cards {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 100px 0;
    .desc {
      position: relative;
      width: 562px;
      background: #283864;
      box-shadow: -3px 3px 5px rgba(10, 20, 48, 0.5);
      border-radius: 31px;
      padding: 35px 30px;
      box-sizing: border-box;
      img {
        position: absolute;
        right: 30px;
        top: 30px;
        height: 105px;
        width: 105px;
      }
      .remark {
        .title {
          height: 56px;
          font-size: 40px;
          font-weight: 400;
          line-height: 56px;
          color: #8fffcf;
        }
        .label {
          font-size: 20px;
          font-weight: 400;
          line-height: 28px;
          color: #8fffcf;
          margin-top: 30px;
        }
      }
      .cells {
        .cell {
          display: flex;
          justify-content: space-between;
          margin: 30px 0;
          font-size: 20px;
          &:last-child {
            margin-bottom: 0;
          }
          .symbol {
            margin-left: 5px;
          }
        }
      }
    }
    .bulletin {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 200px;
      padding: 0 35px;
      height: 117px;
      background: #283864;
      box-shadow: -3px 3px 5px #0a1430;
      border-radius: 31px;
      cursor: pointer;
      > div {
        display: flex;
        align-items: center;
      }
      .left {
        font-size: 20px;
        font-weight: bold;
        img {
          height: 42px;
          width: 42px;
          margin-right: 10px;
        }
      }
      .right {
        font-size: 16px;
        font-weight: 400;
        img {
          height: 18px;
          width: 10px;
          margin-left: 10px;
        }
      }
    }
  }
  .bar {
    display: flex;
    align-items: center;
    height: 62px;
    padding: 0 30px;
    background: #283864;
    box-shadow: 3px -3px 5px rgba(255, 255, 255, 0.3);
    border-radius: 31px;
    img {
      width: 14px;
      height: 9px;
      margin-right: 10px;
    }
  }
  .pools {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 50px;
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 200px;
      img {
        height: 50px;
        width: 50px;
      }
      span {
        margin-top: 10px;
      }
    }
    .pool {
      position: relative;
      flex: 0 0 calc(33.33% - 50px);
      margin: 50px 75px 0 0;
      background: #283864;
      box-shadow: -3px 3px 5px rgba(10, 20, 48, 0.5);
      border-radius: 20px;
      padding: 30px 30px 100px 30px;
      box-sizing: border-box;
      &:nth-child(3n + 3) {
        margin-right: 0;
      }
      .token {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: bold;
      }
      .cells {
        .cell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 30px 0;
          font-size: 16px;
          .label {
            flex: 1;
          }
          .value {
            display: flex;
            justify-content: flex-end;
            flex-wrap: wrap;
            flex: 2;
            font-weight: bold;
            .symbol {
              margin-left: 5px;
            }
          }
        }
      }
      .button {
        display: block;
        position: absolute;
        left: 30px;
        bottom: 30px;
        height: 40px;
        width: calc(100% - 60px);
        background: #283864;
        box-shadow: 1px -1px 4px rgba(255, 255, 255, 0.34);
        border-radius: 20px;
        border: 0;
        outline: none;
        font-size: 16px;
        color: #ffffff;
        cursor: pointer;
      }
    }
  }
  @include mobile {
    .cards {
      margin: 25px 15px;
      .desc {
        flex: 2;
        padding: 15px 10px;
        border-radius: 15px;
        img {
          height: 40px;
          width: 40px;
          top: 25px;
          right: 10px;
          z-index: 0;
        }
        .remark {
          .title {
            height: 22px;
            line-height: 22px;
            font-size: 15px;
            font-weight: 400;
          }
          .label {
            line-height: 10px;
            margin-top: 15px;
            font-size: 10px;
          }
        }
        .cells {
          .cell {
            margin: 15px 0;
            font-size: 10px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
      .bulletin {
        border-radius: 15px;
        flex: 1;
        margin-left: 15px;
        padding: 0 17px;
        height: 58px;
        .left {
          font-size: 12px;
          img {
            height: 21px;
            width: 21px;
            margin-right: 5px;
          }
        }
        .right {
          font-size: 10px;
          img {
            height: 9px;
            width: 5px;
            margin-left: 5px;
          }
        }
      }
    }
    .bar {
      height: 33px;
      padding: 0 15px;
      margin: 0 15px;
      border-radius: 15px;
      font-size: 10px;
      img {
        width: 7px;
        height: 5px;
        margin-right: 5px;
      }
    }
    .pools {
      margin-bottom: 25px;
      padding: 0 15px;
      .pool {
        flex: 0 0 calc(50% - 8px);
        margin: 15px 0 0 0;
        border-radius: 10px;
        padding: 15px 15px 65px 15px;
        &:nth-child(3n + 3) {
          margin-right: 0;
        }
        &:nth-child(2n + 2) {
          margin-left: 15px;
        }
        .token {
          margin-bottom: 5px;
          font-size: 12px;
          font-weight: bold;
          img {
            zoom: 0.5;
          }
        }
        .cells {
          .cell {
            margin: 15px 0;
            font-size: 10px;
          }
        }
        .button {
          left: 15px;
          bottom: 15px;
          height: 30px;
          width: calc(100% - 30px);
          border-radius: 15px;
          font-size: 10px;
        }
      }
    }
  }
}
</style>
