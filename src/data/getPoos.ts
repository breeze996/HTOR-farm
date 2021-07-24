import getNotAccountWeb3 from '../common/ts/getNotAccountWeb3'
import getBalance from './getBalance'
import { Token, TokenAmount } from '@cointribute/pancakeswap-sdk-v2'
import { getContract } from '../common/ts/utils'
// import { PoolInfo } from '../store/modules/stake'
import { PLEDGE_DIVIDEND_POOLS_ADDRESS_V2 } from '../common/ts/const'
// import { abi } from '../abi/PledgeDividendPools_V2.json'
import getToken from './getToken'

export default async function getPools(): Promise<void> {
  const web3 = getNotAccountWeb3()
  // const contract = getContract(abi, PLEDGE_DIVIDEND_POOLS_ADDRESS_V2, web3)
}
