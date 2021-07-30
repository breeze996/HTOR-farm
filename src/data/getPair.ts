import getNotAccountWeb3 from '@/common/ts/getNotAccountWeb3'
import { getContract } from '@/common/ts/utils'
import { Pair, Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import { abi as IUniswapV2PairABI } from '@/abi/IUniswapV2Pair.json'

export default async function getPair(currencyA: Token, currencyB: Token, LPTokenAddress: string) {
  const web3 = getNotAccountWeb3()
  const contract = getContract(IUniswapV2PairABI, LPTokenAddress, web3)
  try {
    const reserves = await contract.methods.getReserves().call()
    const pair = new Pair(
      new TokenAmount(currencyA, reserves.reserve0),
      new TokenAmount(currencyB, reserves.reserve1)
    )
    return pair
  } catch (error) {
    return undefined
  }
}
