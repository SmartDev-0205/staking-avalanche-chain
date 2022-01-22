import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { getTotalReward, getUserReward, getPendingReward, claim } from "./api/reward";
// import { connectToWallet, offWeb3Modal } from "./api";
import { chainHex, chainId } from "./config/site.config";
import { offWeb3Modal, web3_modal } from "./api";

const detectEthereumNetwork = (callback) => {
  window.ethereum.request({ method: 'eth_chainId' }).then(async (cId) => {
      if (parseInt(cId) != chainId) { // bsc testnet
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainHex }], // chainId must be in hexadecimal numbers
        }).then(()=>{
            return callback();
        })
      }else{
          return callback();
      }
  });
}


function App() {
  const [myWeb3, setMyWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [total, setTotal] = useState(0);
  const [userReward, setUserReward] = useState(0)
  const [pendingReward, setPendingReward] = useState(0)

  const connect = async () => {
    if (account !== '') {
      setAccount('');
      setMyWeb3(null);
      web3_modal.clearCachedProvider();
      setTimeout(() => {
        window.location.reload();
      }, 1);
    }
    else {
      detectEthereumNetwork(async () => {
        const provider = await web3_modal.connect();
        
        if (!provider.on) {
          return;
        }
        
        provider.on('accountsChanged', async () => setTimeout(() => window.location.reload(), 1));

        provider.on('chainChanged', async (cid) => {
          if (parseInt(cid) !== chainId) {
            await web3_modal.off();
            return null;
          }
        })


        await web3_modal.toggleModal();
        // provider.
        // regular web3 provider methods
        const web3 = new Web3(provider);
        if(web3){
          setMyWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        }
      });
    }
  }

  const disconnect = async () => {
    offWeb3Modal();    
  }

  useEffect(() => {
    (async () => {
      if(myWeb3){
        const _total = await getTotalReward(myWeb3)
        console.log('total', total);
        setTotal(_total)
        if (account !== '') {
          const _userReward = await getUserReward(myWeb3, account)
          console.log('user reward', _userReward);
          if(_userReward){
            setUserReward(_userReward)
            setPendingReward(_userReward);
          }
        }
        // const _pendingReward = await getPendingReward(myWeb3, account)
        // console.log('pending reward', _pendingReward);
        // setPendingReward(_pendingReward)
      }else{
        setTotal(0);
        setUserReward(0);
        setPendingReward(0);
      }
    })()
  }, [account, myWeb3])
  return (
    <div className="main">
      <button className="my-btn connect-btn" onClick={() => connect()}>
        <div className="connect-btn-text">
          {account === '' ? 'Connect to metamask' : account}
        </div>
      </button>
      <div className="header">Dashboard</div>
      <div className="row board">
        <div className="col-lg-6 col-sm-12">
          <div className="item">
            <div className="item-header">Total $USDC Rewards</div>
            <div className="item-body">
              <div className="item-name">$USDC</div>
              <div className="item-value">{ eval(parseInt(total)/1e15).toFixed(3)  }</div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-sm-12">
          <div className="item">
            <div className="item-header">Your Total $USDC Rewards</div>
            <div className="item-body">
              <div className="item-name">$USDC</div>
              <div className="item-value">$ { userReward }</div>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-sm-12">
          <div className="item">
            <div className="item-header">Pending $USDC Rewards</div>
            <div className="item-body">
              <div className="item-name">$USDC</div>
              <div className="item-value">$ { pendingReward }</div>
              <div className="d-flex justify-content-center">
                <button className="my-btn" onClick={() => claim(myWeb3, account)}>Claim Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
