import { Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import getLPTokenAndPairByCurrencys from './getLPTokenAndPairByCurrencys'

export default async function getTokenPrice(
  tokens: [Token, Token],
  amount: TokenAmount
): Promise<TokenAmount | undefined> {
  const [pair] = await getLPTokenAndPairByCurrencys(tokens)
  if (pair === undefined) {
    return undefined
  }
  const [outputAmount] = pair.getOutputAmount(amount)
  return outputAmount
}
