import { useState } from 'react';
import './App.css';
import { PizzaMenu } from './components/PizzaMenu/PizzaMenu';
import logo from './images/logo.png';


function App() {

  const [wallet, setWallet] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.info("Connected", accounts[0]);
      setWallet(accounts[0]);
      if (ethereum.networkVersion !== "4") {
        alert("Please connect to Rinkeby network");
        setWrongNetwork(true);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const MetamaskButton = () => {
    return <button onClick={connectWalletAction}>Connect metamask</button>;
  }

  return (
    <div className="App">
      <div className="App-header">
        <img alt="CryptoPizza Logo" src={logo} className="cryptopizza-logo" />
        <p>
          Welcome to CryptoPizza! <br />
          Please choose your order below and click "Order" to place your order.
        </p>
        {wallet ? (
          wrongNetwork ? (
            <h1>Oops! Please connect to rinkeby network</h1>
          ) : (
            <PizzaMenu wallet={wallet} />
          )
        ) : (
          <MetamaskButton />
        )}
      </div>
    </div>
  );
}

export default App;
