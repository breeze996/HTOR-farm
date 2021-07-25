import { Token, ChainId } from '@cointribute/pancakeswap-sdk-v2'
import JSBI from 'jsbi'

export const CHAIN_ID = process.env.VUE_APP_CHAIN_ID

export const CHAIN_ID_LIST = [CHAIN_ID]

export const BSCSCAN_PRC_URL = process.env.VUE_APP_BSCSCAN_PRC_URL

export const MASTER_CHEF_ADDRESS = '0x7910cce8C7918b6AFe57080b75c500EA9Cc5277C'

export const MINING_TOKEN = new Token(
  ChainId.MAINNET,
  '0x46446469f099817c19769878dcc89a812e187446',
  18,
  'THOR'
)

export const ZERO = JSBI.BigInt('0')
