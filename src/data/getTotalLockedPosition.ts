import { USDT } from '@/common/ts/const'
import { PoolInfo } from '@/store/state-types'
import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import getLPTokenPrice from './getLPTokenPrice'
import getTokenPrice from './getTokenPrice'

export default async function getTotalLockedPosition(pools: PoolInfo[]): Promise<TokenAmount> {
  const amounts = await Promise.all(
    pools.map((pool) =>
      pool.isLPToken ? getLPTokenPrice(pool) : _getSingleTokenPriceForUSDT(pool)
    )
  )
  return (amounts.filter((amount) => amount !== undefined) as TokenAmount[]).reduce(
    (t, amount) => t.add(amount),
    new TokenAmount(USDT, '0')
  )
}

const _getSingleTokenPriceForUSDT = async (pool: PoolInfo) => {
  const price = await getTokenPrice([USDT, pool.token], pool.poolStakedAmount)
  return price ?? undefined
}
