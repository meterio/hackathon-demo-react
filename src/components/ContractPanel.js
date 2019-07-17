import React, { Component } from "react";
import web3 from "../utils/meterifiedWeb3";
// import solc from "solc";
import bytecodeUrl from "../contract.bytecode";
import abiUrl from "../contract.abi";
import { Alert } from "react-bootstrap";
import LoadingButton from "./LoadingButton";

export default class ContractPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bytecode: "",
      abi: "",

      deployResult: ""
    };
    this.deployContract = this.deployContract.bind(this);
    this.callMint = this.callMint.bind(this);
    this.callBalance = this.callBalance.bind(this);
    this.callTransfer = this.callTransfer.bind(this);
  }

  componentDidMount() {
    fetch(bytecodeUrl)
      .then(response => response.text())
      .then(data => {
        this.setState({ bytecode: data });
      });
    fetch(abiUrl)
      .then(response => response.text())
      .then(data => this.setState({ abi: JSON.parse(data) }));
  }

  deployContract() {
    web3.eth.accounts.wallet.add(this.props.privateKey);

    const { address } = this.props;

    const token_abiDefinition = this.state.abi;
    const token_byteCode = this.state.bytecode;

    const contractInstance = new web3.eth.Contract(token_abiDefinition);
    contractInstance.options.data = token_byteCode;
    this.setState({ contractInstance });

    console.log("Start to deploy contract");
    return contractInstance
      .deploy({
        arguments: [address, "1000000000", "Sample Token", "3", "SAMPLE_TOKEN"]
      })
      .send({ from: address, gas: 4700000 })
      .then(newContractInstance => {
        const contractAddr = newContractInstance.options.address;
        console.log(`Successfully deployed contract to: ${contractAddr}`);
        this.setState({
          deployResult: `Successfully deployed contract to: ${contractAddr}`,
          contractAddr
        });
        return Promise.resolve("success");
      })
      .catch(err => {
        return Promise.resolve("error");
      });
  }

  callMint() {
    const { contractInstance, contractAddr } = this.state;
    contractInstance.options.address = contractAddr;

    return contractInstance.methods
      .mintToken(this.props.address, "99999999999999999999999")
      .send({ from: this.props.address, gas: 4700000 })
      .then(data => {
        console.log("mintToken result:", data);
        //FIXME: we can't use this.setState here for some reason
        Promise.resolve("success");
      })
      .catch(err => {
        console.log("mintToken error:", err);
        Promise.resolve("error");
      });
  }

  callBalance() {
    const { address } = this.props;
    const { contractInstance, contractAddr } = this.state;
    contractInstance.options.address = contractAddr;

    return contractInstance.methods
      .getAccountBalanceOf(address)
      .send({ from: address, gas: 4700000 })
      .then(function(data) {
        console.log("getAccountBalanceOf result:", data);
        //FIXME: we can't use this.setState here for some reason
        return Promise.resolve("success");
      })
      .catch(function(err) {
        console.log("getAccountBalanceOf error:", err);
        return Promise.resolve("error");
      });
  }

  callTransfer() {
    const { address } = this.props;
    const { contractInstance, contractAddr } = this.state;
    contractInstance.options.address = contractAddr;

    return contractInstance.methods
      ._transferFrom(
        address,
        "0x6db04d51beb19b644df783b458db7633b9f90d8b",
        "9999"
      )
      .send({ from: address, gas: 4700000 })
      .then(data => {
        console.log("_transferFrom result:", data);
        //FIXME: we can't use this.setState here for some reason
        return Promise.resolve("success");
      })
      .catch(err => {
        console.log("_transferFrom error:", err);
        return Promise.resolve("error");
      });
  }

  render() {
    let deployResultAlert;
    if (this.state.deployResult)
      deployResultAlert = (
        <Alert variant="secondary">{this.state.deployResult}</Alert>
      );

    let mintResultAlert;
    if (this.state.mintResult) {
      mintResultAlert = (
        <Alert variant="secondary">{this.state.mintResult}</Alert>
      );
    }
    let content;
    if (this.state.contractAddr) {
      content = (
        <div>
          <div>Contract deployed at: {this.state.contractAddr}</div>
          <div className="section">
            <LoadingButton
              handleClick={this.callMint}
              title="Call Mint Method"
            />
            {mintResultAlert}
          </div>
          <div className="section">
            <LoadingButton
              handleClick={this.callBalance}
              title="Call Balance Method"
            />
          </div>
          <div className="section">
            <LoadingButton
              handleClick={this.callTransfer}
              title="Call Transfer Method"
            />
          </div>
        </div>
      );
    }
    return (
      <div id="deply-contract" className="component">
        <div className="title">Contract</div>
        <div className="section">
          <LoadingButton
            handleClick={this.deployContract}
            title="Deploy Contract"
          />
          {deployResultAlert}
        </div>
        {content}
      </div>
    );
  }
}
