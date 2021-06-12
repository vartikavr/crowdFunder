import Web3 from 'web3';

//window is a global variable which is available only inside the browser
//it is NOT available on node.js
//whenever, next.js loads our code in order to render our application on the server, the window variable won't be defined 

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    //we are in the browser and metamask is running (earlier case)
    web3 = new Web3(window.ethereum);
    //window.ethereum.request({ method: "eth_requestAccounts" });
}
else {
    //we are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/82b43460faec40b1be4b30ae21fa59d0');
    web3 = new Web3(provider);
}

export default web3;