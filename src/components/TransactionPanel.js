import React, { Component } from "react";
import web3 from "../utils/meterifiedWeb3";
import { InputGroup, Form, Alert } from "react-bootstrap";
import LoadingButton from "./LoadingButton";

export default class TransactionPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddr: "",
      amount: 0,
      result: ""
    };
    this.sendTx = this.sendTx.bind(this);
    this.onAmountChange = this.onAmountChange.bind(this);
    this.onToAddressChange = this.onToAddressChange.bind(this);
  }

  sendTx() {
    const account = web3.eth.accounts.privateKeyToAccount(
      this.props.privateKey
    );
    const { address } = account;

    web3.eth.accounts.wallet.add(this.props.privateKey);

    console.log("Start to send transaction");
    return web3.eth
      .sendTransaction({
        from: address,
        to: this.state.toAddr,

        // actual meter = value * 10e-18
        value: this.state.amount, // 0.1 MTR

        // 0000000000 for MTR(meter token)
        // 0000000001 for MTRG(meter governance token)
        data: "0000000000" // meter token
      })
      .on("error", err => {
        console.log("Error: ", err);
        this.setState({
          error: "Error: " + err
        });
        return Promise.resolve("error");
      })
      .then(() => {
        console.log("Successfully sent transaction");
        this.setState({
          result: "Successfully sent transaction"
        });
        return Promise.resolve("success");
      });
  }

  onToAddressChange(event) {
    this.setState({ toAddr: event.target.value });
  }

  onAmountChange(event) {
    this.setState({
      amount: parseInt(parseFloat(event.target.value) * 1000000000000000000)
    });
  }

  render() {
    let resultAlert;
    if (this.state.result) {
      resultAlert = <Alert variant="success">{this.state.result}</Alert>;
    }
    if (this.state.error) {
      resultAlert = <Alert variant="danger">{this.state.error}</Alert>;
    }
    return (
      <div id="send-tx-control-panel" className="component">
        <div className="title"> Transaction</div>
        <Form>
          <Form.Group controlId="formToAddress">
            <Form.Label>To Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter to address"
              onChange={this.onToAddressChange}
            />
            <Form.Text className="text-muted" />
          </Form.Group>

          <Form.Group controlId="formAmount">
            <Form.Label>Amount</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Amount"
                onChange={this.onAmountChange}
              />
              <InputGroup.Append>
                <InputGroup.Text id="basic-addon2">MTR</InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </Form>

        <LoadingButton handleClick={this.sendTx} title="Send Transaction" />
        {resultAlert}
        <div />
      </div>
    );
  }
}
