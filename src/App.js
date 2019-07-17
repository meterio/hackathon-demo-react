import React from "react";
import logo from "./logo.png";
import "./App.css";
import { Button } from "react-bootstrap";
import web3 from "./utils/meterifiedWeb3";
import AccountPanel from "./components/AccountPanel";
import TrasactionPanel from "./components/TransactionPanel";
import ContractPanel from "./components/ContractPanel";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: localStorage.getItem("private.key"),
      address: localStorage.getItem("public.address")
    };
    this.onCreateAccount = this.onCreateAccount.bind(this);
  }

  onCreateAccount() {
    const account = web3.eth.accounts.create();
    const { privateKey, address } = account;
    this.setState({ privateKey, address });
    localStorage.setItem("private.key", privateKey);
    localStorage.setItem("public.address", address);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="container">
          <AccountPanel
            address={this.state.address}
            onCreateAccount={this.onCreateAccount}
          />

          <TrasactionPanel
            address={this.state.address}
            privateKey={this.state.privateKey}
          />

          <ContractPanel
            address={this.state.address}
            privateKey={this.state.privateKey}
          />
        </div>
      </div>
    );
  }
}

export default App;
