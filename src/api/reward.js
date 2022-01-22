import { getContractInstance,   getWeb3 } from './index'

async function getTotalReward(myweb3) {
  try {
    const contractInstance = getContractInstance(myweb3)
    console.log('contract instance', contractInstance);

    // let decimals = await contractInstance.methods.decimals().call();
    let res = await contractInstance.methods.totalDistributed().call();
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getUserReward(myweb3, account) {
  try {
    const contractInstance = getContractInstance(myweb3);
    // let res = await contractInstance.methods.getUnpaidEarnings(account).call();

    // return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getPendingReward(myweb3, account) {
  try {
    const contractInstance = getContractInstance(myweb3);
    // let res = await contractInstance.methods.shares(account).call();

    // return Promise.resolve(res);
  } catch (error) {
    // return Promise.reject(error);
  }
}

async function claim(myweb3, address) {
  try {
    console.log('claim', address);
    let from = address;
    let gasPrice = await myweb3.eth.getGasPrice();

    const contractInstance = getContractInstance(myweb3);
    // let param = {
    //   from: from,
    //   to: '0x12896bf73bc456aabcad48d0c5662199def840f8',
    //   gasPrice: gasPrice,
    //   gas: '9000000'
    //   // value: 10000000000000
    // }
    let res = await contractInstance.methods.claimDividend().send({from:address});
    console.log(res);
    return Promise.resolve(res);
  } catch (error) {
    return Promise.reject(error);
  }
}

export {
  getTotalReward,
  getUserReward,
  getPendingReward,
  claim,
};
