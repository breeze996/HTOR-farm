import { LOCALES, getCurrentLang } from '../i18n/utils'

import Home from '../pages/home/home.vue'
type importResult = Promise<typeof import('*.vue')>
const Index = (): importResult => import('../pages/index/index.vue')
const Bulletin = (): importResult => import('../pages/bulletin/bulletin.vue')
const PoolDetail = (): importResult => import('../pages/pool-detail/pool-detail.vue')

const routes = [
  {
    path: '',
    component: Index,
  },
  {
    path: 'bulletin',
    component: Bulletin,
  },
  {
    path: 'poolDetail',
    component: PoolDetail,
  },
]

export default [
  {
    path: '/',
    redirect: function (): string {
      const defaultLang = getCurrentLang()
      return `/${defaultLang}`
    },
  },
  { path: `/${LOCALES.ZH}`, component: Home, children: routes },
  { path: `/${LOCALES.EN}`, component: Home, children: routes },
]
