import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

const greeterAddress = "0x5357C6422e9edb9800e9a0abB44E29e701aC2f95"; // contract address

function App() {

  const [greeting, setGreetingValue] = useState('');

  async function requestAccount() { // will make user navigate to metamast 
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // will prompt user to conect metamask

  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') { // checks if user has matamask installed or not
      const provider = new ethers.providers.Web3Provider(window.ethereum) // there are other providers as well, we are using Web3Provider
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider) // instance of the contract

      try {
        const data = await contract.greet() // calling greet() function from Greeter.sol
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return // greeting is none, then do not run the function (return nothing)

    if (typeof window.ethereum !== 'undefined') { // checks if user has matamask installed or not
      await requestAccount() // wait for users to connect metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner() // since we are making change in the blockchain we need to sign the transaction
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer) // instance of the contract

      const transaction = await contract.setGreeting(greeting) // calling setGreeting() from Greeter.sol
      await transaction.wait() // waiting for the transaction to be confirmed

      setGreetingValue(''); // change the input string in the input to null after execution of setGreeting

      fetchGreeting() // will log out the new value
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={event => setGreetingValue(event.target.value)}
          value={greeting}
          placeholder="Set Greeting" />
      </header>
    </div>
  );
}

export default App;
