import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import types from './mutation-types'
import { State, UserInfo, PoolInfo } from './state-types'

export const mutations = {
  [types.SET_USER_INFO](state: State, userInfo: UserInfo): void {
    state.userInfo = userInfo
  },
  [types.SET_POOLS](state: State, pools: PoolInfo[]): void {
    state.pools = pools
  },
  [types.SET_APYS](state: State, APYS: { [poolId: number]: string }): void {
    state.APYS = APYS
  },
  [types.SET_LOADING_POOLS](state: State, isLoadingPools: boolean): void {
    state.isLoadingPools = isLoadingPools
  },
  [types.SET_CURRENT_POOL](state: State, currentPool: PoolInfo): void {
    state.currentPool = currentPool
  },
  [types.SET_TOTAL_LOCKED_POSITION](state: State, totalLockedPosition: TokenAmount): void {
    state.totalLockedPosition = totalLockedPosition
  },
}
