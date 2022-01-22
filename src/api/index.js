import { chainHex, chainId, contactAddress, http } from '../config/site.config'
import ABI from '../data/new.json'
import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';


const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        [chainId]: http
      },
      chainId: chainId
    }
  }
}

const web3_modal = new Web3Modal({
  network: "testnet", // optional
  cacheProvider: true, // optional,
  providerOptions,
  theme: 'light',
})

const detectEthereumNetwork = (callback) => {
  window.ethereum.request({ method: 'eth_chainId' }).then(async (cId) => {
    if (parseInt(cId) != chainId) { // bsc testnet
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainHex }], // chainId must be in hexadecimal numbers
      }).then(() => {
        return callback();
      })
    } else {
      return callback();
    }
  });
}

const getContractInstance = (web3) => {
  // const web3 = new Web3(new Web3.providers.HttpProvider(http));
  let res = new web3.eth.Contract(ABI, contactAddress);
  return res
}

// const getWeb3 = () => {
//   const web3 = new Web3(new Web3.providers.HttpProvider(http));
//   return web3
// }

const connectToWallet = () => {
  detectEthereumNetwork(async () => {
    const provider = await web3_modal.connect();
    provider.on('chainChanged', async (cid) => {
      if (parseInt(cid) !== chainId) {
        await web3_modal.off();
        return null;
      }
    })
    await web3_modal.toggleModal();
    // provider.
    // regular web3 provider methods
    const newWeb3 = new Web3(provider);
    console.log(newWeb3);
    return newWeb3;
    // const accounts = await newWeb3.eth.getAccounts();
    // const balance = await newWeb3.eth.getBalance(accounts[0])/Math.pow(10, 18);
    // this.setState({address: accounts[0], balance: balance});
    // dispatch({ type: actionTypes.SET_ACCOUNT, account: {...config.initAccount, address: accounts[0], balance: balance}});
    // dispatch({ type: actionTypes.SET_WEB3INST, web3Inst: newWeb3});
  });
};

const offWeb3Modal = () => {
  return Web3Modal.off();
}

export {
  getContractInstance,
  // getWeb3,
  // connectToWallet,
  offWeb3Modal,
  // detectEthereumNetwork
  web3_modal
};
