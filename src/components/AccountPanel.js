import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class AccountPanel extends Component {
  render() {
    let content;
    if (this.props.address) {
      content = <div>{this.props.address}</div>;
    } else {
      content = (
        <Button variant="primary" onClick={this.props.onCreateAccount}>
          Create Account
        </Button>
      );
    }

    return (
      <div className="component">
        <div className="title">Account</div>
        {content}
      </div>
    );
  }
}
