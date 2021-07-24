// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProvider(): any | undefined {
  const ethereum = window.ethereum
  const provider = window?.web3?.currentProvider
  return ethereum || provider || undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let provider: any

// eslint-disable-next-line
export default function () {
  if (!provider) {
    provider = getProvider()
  }
  return provider
}
