import { Token, ChainId } from '@cointribute/pancakeswap-sdk-v2'
import JSBI from 'jsbi'

export const CHAIN_ID = process.env.VUE_APP_CHAIN_ID

export const CHAIN_ID_LIST = [CHAIN_ID]

export const BSCSCAN_PRC_URL = process.env.VUE_APP_BSCSCAN_PRC_URL

export const MASTER_CHEF_ADDRESS = '0xe62bb7F26588628229b7f184C4eb84C2baff299D'

export const MINING_TOKEN = new Token(
  ChainId.MAINNET,
  '0xE3894CB9E92ca78524Fb6a30Ff072FA5E533c162',
  18,
  'ELP'
)

export const USDT = new Token(
  ChainId.MAINNET,
  '0x55d398326f99059ff775485246999027b3197955',
  18,
  'USDT'
)

export const WRAPPED_BNB = new Token(
  ChainId.MAINNET,
  '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  18,
  'WBNB'
)

export const ZERO = JSBI.BigInt('0')
