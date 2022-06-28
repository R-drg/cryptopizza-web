import './App.css';
import logo from './images/logo.png';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img alt="CryptoPizza Logo" src={logo} className="cryptopizza-logo" />
        <p>
          Welcome to CryptoPizza! <br />
          Please choose your order below and click "Order" to place your order.
        </p>
      </header>
    </div>
  );
}

export default App;
