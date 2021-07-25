import { Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'

export interface State {
  userInfo: UserInfo
  pools: PoolInfo[]
  APYS: { [poolId: number]: string }
  isLoadingPools: boolean
  currentPool?: PoolInfo
}

export interface UserInfo {
  account?: string
}

export interface PoolInfo {
  poolId: number
  allocPoint: number
  token: Token
  miningToken: Token
  isLPToken: boolean
  poolType: POOL_TYPE
  poolStakedAmount: TokenAmount
  stakedAmount?: TokenAmount
}

export enum POOL_TYPE {
  LP_TOKEN = '1',
  SINGLE_TOKEN = '2',
  THOR_TOKEN = '3',
}
