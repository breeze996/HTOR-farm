import getNotAccountWeb3 from '../common/ts/getNotAccountWeb3'
import JSBI from 'jsbi'
import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import { getContract, isWrappedBNB } from '../common/ts/utils'
import { PoolInfo, POOL_TYPE } from '../store/state-types'
import { MASTER_CHEF_ADDRESS, ZERO, MINING_TOKEN } from '../common/ts/const'
// import { abi as MasterChefAbi } from '../abi/MasterChef.json'
import MasterChefAbi from '../abi/ELPDOTPOOL.json'
import getToken from './getToken'
import getCurrencysByLPToken from './getCurrencysByLPToken'

export default async function getPools(): Promise<PoolInfo[]> {
  const web3 = getNotAccountWeb3()
  const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
  const length = await contract.methods.poolLength().call()
  const poolIdList = [...new Array(Number(length)).keys()]
  console.log(length)
  const pools = await Promise.all(poolIdList.map((id) => getPoolInfo(id)))

  return pools.filter((item) => item !== undefined) as PoolInfo[]
}

export async function updatePools(pools: PoolInfo[], account?: string): Promise<PoolInfo[]> {
  if (account === undefined) {
    return pools
  }
  const updatedPools = await Promise.all(pools.map((item) => updatePool(item, account)))
  return updatedPools
}

export async function updatePool(pool: PoolInfo, account: string): Promise<PoolInfo> {
  const web3 = getNotAccountWeb3()
  const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, web3)
  const [userInfo, earnings] = await Promise.all([
    contract.methods.userInfo(pool.poolId, account).call(),
    contract.methods.pendingSushi(pool.poolId, account).call(),
  ])
  return Object.assign({}, pool, {
    earningsAmount: new TokenAmount(pool.miningToken, earnings),
    stakedAmount: new TokenAmount(pool.token, userInfo.amount),
  })
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
  console.log(pledgeTotalAmount)
  if (JSBI.equal(JSBI.BigInt(allocPoint), ZERO)) {
    return undefined
  }
  //const isLPToken= poolType === POOL_TYPE.LP_TOKEN
  const isLPToken = true
  const token = await getToken(LPtoken)
  const currencys = await getCurrencysByLPToken(token)

  const tokenSymbol =
    isLPToken && currencys
      ? `${isWrappedBNB(currencys[0]) ? 'BNB' : currencys[0].symbol}/${
          isWrappedBNB(currencys[1]) ? 'BNB' : currencys[1].symbol
        }-LP`
      : token.symbol
      ? token.symbol
      : '-'

  return {
    poolId,
    token,
    currencys,
    poolType,
    isLPToken,
    tokenSymbol,
    allocPoint: Number(allocPoint),
    miningToken: MINING_TOKEN,
    poolStakedAmount: new TokenAmount(token, '100000000000000000000'),
    // poolStakedAmount: new TokenAmount(token, pledgeTotalAmount),
  }
}
