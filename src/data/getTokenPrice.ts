import { isUSDT } from '@/common/ts/utils'
import { Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import getLPTokenAndPairByCurrencys from './getLPTokenAndPairByCurrencys'

export default async function getTokenPrice(
  tokens: [Token, Token],
  amount: TokenAmount
): Promise<TokenAmount | undefined> {
  if (isUSDT(tokens[0]) && isUSDT(tokens[1])) {
    return amount
  }
  try {
    const [pair] = await getLPTokenAndPairByCurrencys(tokens)
    if (pair === undefined) {
      return undefined
    }
    const [outputAmount] = pair.getOutputAmount(amount)
    return outputAmount
  } catch (error) {
    return undefined
  }
}
