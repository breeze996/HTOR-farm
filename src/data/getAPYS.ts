import getAPY from '@/data/getAPY'
import { PoolInfo } from '../store/state-types'

export default async function getAPYS(pools: PoolInfo[]): Promise<string[]> {
  const allPoolPoint = pools.reduce((t, { allocPoint }) => (t += allocPoint), 0)

  return await Promise.all(pools.map((item) => getAPY(item.token, allPoolPoint / item.allocPoint)))
}
