import React, { Component } from "react";
import { Button } from "react-bootstrap";

export default class LoadingButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.setState({ loading: true });
    this.props.handleClick().then(() => this.setState({ loading: false }));
  }
  render() {
    const { loading } = this.state;
    return (
      <Button
        variant="primary"
        disabled={loading}
        onClick={!loading ? this.handleClick : null}
      >
        {loading ? "Loading…" : this.props.title}
      </Button>
    );
  }
}
