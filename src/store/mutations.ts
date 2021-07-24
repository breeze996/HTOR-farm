import types from './mutation-types'
import { State, UserInfo } from './state-types'

export const mutations = {
  [types.SET_USER_INFO](state: State, userInfo: UserInfo): void {
    state.userInfo = userInfo
  },
}
