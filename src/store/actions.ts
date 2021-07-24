import { ActionContext } from 'vuex'
import { State, UserInfo } from './state-types'
import i18n from '../i18n/index'
import types from './mutation-types'
import getProvider from '../common/ts/getProvider'
import { Toast } from '../components/toast/index'
import { Dialog } from '../components/dialog/index'
import { CHAIN_ID_LIST } from '../common/ts/const'

export default {
  async handleConnect({ commit }: ActionContext<State, State>): Promise<void> {
    const provider = getProvider()
    if (provider === undefined) {
      Toast.info('Failed to find wallet.')
      return
    }
    if (
      !CHAIN_ID_LIST.includes(
        provider.networkVersion
          ? provider.networkVersion
          : provider.chainId
          ? provider.chainId.toString()
          : undefined
      )
    ) {
      Dialog({
        title: 'tip',
        content: i18n.global.t('netSupportChain'),
        confirmText: i18n.global.t('confirm'),
        confirm: true,
      })
      return
    }
    try {
      const [address] = await provider.enable()
      commit(types.SET_USER_INFO, { account: address } as UserInfo)
    } catch (error) {
      Toast.info('Failed to connect to wallet.')
      console.log(`Enable account error ${error}`)
    }
  },
  handleDisconnect({ commit }: ActionContext<State, State>): void {
    commit(types.SET_USER_INFO, {})
  },
  async handleAccountChange(
    { commit }: ActionContext<State, State>,
    address: string
  ): Promise<void> {
    commit(types.SET_USER_INFO, { account: address })
  },
}
