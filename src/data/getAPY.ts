import { MASTER_CHEF_ADDRESS, USDT } from '@/common/ts/const'
import getNotAccountWeb3 from '@/common/ts/getNotAccountWeb3'
import { getContract } from '@/common/ts/utils'
import { PoolInfo } from '@/store/state-types'
import { parseUnits, formatUnits } from '@ethersproject/units'
import BigNumber from '../common/ts/bignumber'
import getLPTokenPrice from './getLPTokenPrice'
import { abi as MasterChefAbi } from '@/abi/MasterChef.json'
import getTokenPrice from './getTokenPrice'
import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'

export default async function (pool: PoolInfo, poolPoint: number): Promise<string> {
  if (pool.isLPToken) {
    return await getLPAPY(pool, poolPoint)
  } else {
    return await getTokenAPY(pool, poolPoint)
  }
}

export async function getYearOutAmount(poolPoint: number) {
  const contract = getContract(MasterChefAbi, MASTER_CHEF_ADDRESS, getNotAccountWeb3())

  const firstDayReward = new BigNumber(895800.7407828433)
  const curEpoch = await contract.methods.getCurrentEpoch().call()
  const curDeflation = (await contract.methods.deflationRate_(curEpoch).call()) as string
  const deflation = new BigNumber(curDeflation).div(1000000000000)
  return firstDayReward.multipliedBy(deflation).multipliedBy(365).multipliedBy(poolPoint)
}

const getLPAPY = async (pool: PoolInfo, poolPoint: number) => {
  const _totalFundAmount = await getLPTokenPrice(pool)
  if (!_totalFundAmount) {
    return '0'
  }
  const lpTokenPrice = new BigNumber(_totalFundAmount.raw.toString()).div(
    pool.poolStakedAmount.raw.toString()
  )
  const yearOutAmount = await getYearOutAmount(poolPoint)
  const miningTokenPrice = await getTokenPrice(
    [USDT, pool.miningToken],
    new TokenAmount(pool.miningToken, parseUnits(yearOutAmount.toString()).toString())
  )
  if (!miningTokenPrice) {
    return '0'
  }
  return _APY(
    lpTokenPrice,
    new BigNumber(formatUnits(miningTokenPrice?.raw.toString())),
    new BigNumber(formatUnits(pool.poolStakedAmount.raw.toString()))
  )
}

const getTokenAPY = async (pool: PoolInfo, poolPoint: number) => {
  const [_totalFundAmount, yearOutAmount] = await Promise.all([
    getTokenPrice([USDT, pool.token], pool.poolStakedAmount),
    getYearOutAmount(poolPoint),
  ])
  if (!_totalFundAmount) {
    return '0'
  }
  const tokenPrice = new BigNumber(_totalFundAmount.raw.toString()).div(
    pool.poolStakedAmount.raw.toString()
  )
  const miningTokenPrice = await getTokenPrice(
    [USDT, pool.miningToken],
    new TokenAmount(pool.miningToken, parseUnits(yearOutAmount.toString()).toString())
  )
  if (!miningTokenPrice) {
    return '0'
  }
  return _APY(
    tokenPrice,
    new BigNumber(formatUnits(miningTokenPrice?.raw.toString())),
    new BigNumber(formatUnits(pool.poolStakedAmount.raw.toString()))
  )
}

function _APY(
  stakingTokenPrice: BigNumber,
  totalRewardPricePerYear: BigNumber,
  totalStaked: BigNumber
): string {
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? '0' : apr.toFixed(2)
}
