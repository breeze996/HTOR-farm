import { ZERO } from '@/common/ts/const'
import { Pair, Token } from '@cointribute/pancakeswap-sdk-v2'
import getPair from './getPair'
import JSBI from 'jsbi'

export default async function getLPTokenAndPairByCurrencys(
  tokens: [Token, Token]
): Promise<[Pair | undefined, string | undefined]> {
  const [tokenA, tokenB] = tokens
  const LPAddress = !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
  if (LPAddress === undefined) {
    return [undefined, undefined]
  }
  const pair = await getPair(tokenA, tokenB, LPAddress)
  if (
    pair &&
    JSBI.greaterThan(pair.reserve0.raw, ZERO) &&
    JSBI.greaterThan(pair.reserve1.raw, ZERO)
  ) {
    return [pair, LPAddress]
  } else {
    return [undefined, undefined]
  }
}
