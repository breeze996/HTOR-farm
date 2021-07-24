const tokens = [
  '0xe3894cb9e92ca78524fb6a30ff072fa5e533c162',
  '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
  '0x55d398326f99059ff775485246999027b3197955',
]

const tokenAvatars = tokens.map((token) => ({ [token]: require(`./imgs/${token}.png`) }))

export default tokenAvatars.reduce((logos, logo) => Object.assign({}, logos, logo), {})
