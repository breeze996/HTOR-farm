import getNotAccountWeb3 from '../common/ts/getNotAccountWeb3'
import JSBI from 'jsbi'
import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import { getContract } from '../common/ts/utils'
import { PoolInfo, POOL_TYPE } from '../store/state-types'
import { MASTER_CHEF_ADDRESS, ZERO, MINING_TOKEN } from '../common/ts/const'
import { abi as MasterChefAbi } from '../abi/MasterChef.json'
import getToken from './getToken'
import getAPY from '@/common/ts/getAPY'

export default async function getPools(): Promise<PoolInfo[]> {
  const web3 = getNotAccountWeb3()
  const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
  const length = await contract.methods.poolLength().call()
  const poolIdList = [...new Array(Number(length)).keys()]
  const pools = (await Promise.all(poolIdList.map((id) => getPoolInfo(id)))) as PoolInfo[]

  return pools
}

export async function updateAPYS(pools: PoolInfo[]): Promise<string[]> {
  const allPoolPoint = pools.reduce((t, { allocPoint }) => (t += allocPoint), 0)

  return await Promise.all(
    pools.map(async (item) => await getAPY(item.token, allPoolPoint / item.allocPoint))
  )
}

export async function updatePools(pools: PoolInfo[], account?: string): Promise<PoolInfo[]> {
  if (account === undefined) {
    return pools
  }
  const updatedPools = await Promise.all(pools.map((item) => updatePool(item, account)))
  return updatedPools
}

export async function updatePool(pool: PoolInfo, account: string): Promise<PoolInfo> {
  if (account === undefined) {
    return pool
  }
  const web3 = getNotAccountWeb3()
  const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
  const userInfo = await contract.methods.userInfo(pool.poolId, account).call()
  return Object.assign({}, pool, { stakedAmount: new TokenAmount(pool.token, userInfo.amount) })
}

export async function getPoolInfo(poolId: number): Promise<PoolInfo | undefined> {
  const web3 = getNotAccountWeb3()
  const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
  const {
    lpToken: LPtoken,
    allocPoint,
    pledgeTotalAmount,
    poolType,
  } = (await contract.methods.poolInfo(poolId).call()) as {
    poolType: POOL_TYPE
    lpToken: string
    allocPoint: string
    pledgeTotalAmount: string
  }
  if (JSBI.equal(JSBI.BigInt(allocPoint), ZERO)) {
    return undefined
  }
  const [token] = await Promise.all([getToken(LPtoken)])
  return {
    poolId,
    token,
    poolType,
    isLPToken: poolType === POOL_TYPE.LP_TOKEN,
    allocPoint: Number(allocPoint),
    miningToken: MINING_TOKEN,
    poolStakedAmount: new TokenAmount(token, pledgeTotalAmount),
  }
}
