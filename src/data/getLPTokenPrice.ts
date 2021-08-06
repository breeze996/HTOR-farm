import { USDT } from '@/common/ts/const'
import { isUSDT } from '@/common/ts/utils'
import { PoolInfo } from '@/store/state-types'
import { Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import getPair from './getPair'
import getTokenPrice from './getTokenPrice'
import getTotalSupply from './getTotalSupply'

export default async function getLPTokenPrice(pool: PoolInfo) {
  if (!pool.currencys) {
    return undefined
  }
  const [tokenA, tokenB] = pool.currencys
  if (isUSDT(tokenA) || isUSDT(tokenB)) {
    return await _getUSDTPrice(tokenA, tokenB, pool.token, pool.poolStakedAmount)
  } else {
    return await _getLPTokenPriceForUSDT(tokenA, tokenB, pool.token, pool.poolStakedAmount)
  }
}

const _getLPTokenPriceForUSDT = async (
  tokenA: Token,
  tokenB: Token,
  LPToken: Token,
  poolStakedAmount: TokenAmount
) => {
  const [amountA, amountB] = await _getLiquidityValue(tokenA, tokenB, LPToken, poolStakedAmount)
  let priceA: TokenAmount | undefined
  let priceB: TokenAmount | undefined
  if (amountA) {
    priceA = await getTokenPrice([USDT, amountA.token], amountA)
  }
  if (amountB) {
    priceB = await getTokenPrice([USDT, amountB.token], amountB)
  }
  return priceA && priceB ? priceA.add(priceB) : priceA ? priceA : priceB ? priceB : undefined
}

const _getUSDTPrice = async (tokenA: Token, tokenB: Token, LPToken: Token, amount: TokenAmount) => {
  const [liquidityAValue, liquidityBValue] = await _getLiquidityValue(
    tokenA,
    tokenB,
    LPToken,
    amount
  )
  if (!liquidityAValue || !liquidityBValue) {
    return undefined
  }
  const usdtAmount = isUSDT(tokenA) ? liquidityAValue : liquidityBValue

  const price = await getTokenPrice(
    [USDT, isUSDT(tokenA) ? tokenB : tokenA],
    isUSDT(tokenA) ? liquidityBValue : liquidityAValue
  )
  return price ? usdtAmount.add(price) : usdtAmount
}

const _getLiquidityValue = async (
  tokenA: Token,
  tokenB: Token,
  LPToken: Token,
  amount: TokenAmount
) => {
  const ret: TokenAmount[] = []
  try {
    const [totalSupply, pair] = await Promise.all([
      getTotalSupply(LPToken),
      getPair(tokenA, tokenB, LPToken.address),
    ])
    if (pair === undefined) {
      return ret
    }
    ret[0] = pair.getLiquidityValue(tokenA, totalSupply, amount, false)
    ret[1] = pair.getLiquidityValue(tokenB, totalSupply, amount, false)
  } catch (error) {
    console.log(error)
  }
  return ret
}
