import { JSBI, Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import getNotAccountWeb3 from '../common/ts/getNotAccountWeb3'
import ERC20 from '../abi/ERC20.json'
import { getContract } from '@/common/ts/utils'

export default async function getTotalSupply(token: Token): Promise<TokenAmount> {
  const web3 = getNotAccountWeb3()

  const contract = getContract(ERC20, token.address, web3)
  const totalSupply = (await contract.methods.totalSupply().call()) as string

  return new TokenAmount(token, totalSupply)
}
