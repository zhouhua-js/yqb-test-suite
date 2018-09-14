import React, {Component} from 'react';

export default class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {
      str: 'hello1'
    };
    this.clicked = this.clicked.bind(this);
  }
  clicked() {
    this.setState({ str: 'world2' });
  }
  render() {
    return (
      <h1 onClick={this.clicked}>
        <span class="inner">{this.state.str}</span>
      </h1>
    );
  }
}
