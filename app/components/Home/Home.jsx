import React, { Component } from "react";

class Home extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (!this.props.active) {
      return "";
    }
    return (
      <div
        className="Home"
      >
        Home
      </div>
    );
  }
}

export default Home;
