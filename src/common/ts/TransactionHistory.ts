import { TokenAmount } from '@cointribute/pancakeswap-sdk-v2'

export default class TransactionHistory {
  readonly transactionType?: TRANSACTION_TYPE
  readonly date: Date
  readonly status: TRANSACTION_STATUS
  readonly tokenAmount: TokenAmount
  readonly symbol: SYMBOLS

  constructor(
    tokenAmount: TokenAmount,
    status: TRANSACTION_STATUS,
    symbol: SYMBOLS,
    transactionType?: TRANSACTION_TYPE
  ) {
    const date = new Date()

    this.transactionType = transactionType
    this.date = date
    this.status = status
    this.tokenAmount = tokenAmount
    this.symbol = symbol
  }
}

export enum TRANSACTION_TYPE {
  INVEST_CROWDFUND = 'Invest crowdfund',
  CANCEL_SCHEDULE = 'Cancel schedule',
  EXTRACT_ANT_END = 'extract and end',
  WITHDRAW_PLATFROM_TOKEN = 'Withdraw platfrom token',
}

export enum TRANSACTION_STATUS {
  SUCCESS,
  FAILED,
}

export enum SYMBOLS {
  PLUS,
  MINUS,
}
