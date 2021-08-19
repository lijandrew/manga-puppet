import React, { Component } from "react";

import "./Nav.scss";

class Nav extends Component {
  render() {
    return (
      <div className="Nav">
        <div
          onClick={() => {
            this.props.setActiveIndex(0);
          }}
          className="Nav-link"
        >
          Home
        </div>
        <div
          onClick={() => {
            this.props.setActiveIndex(1);
          }}
          className="Nav-link"
        >
          Library
        </div>
        <div
          onClick={() => {
            this.props.setActiveIndex(2);
          }}
          className="Nav-link"
        >
          Browse
        </div>
        <div
          onClick={() => {
            this.props.setActiveIndex(3);
          }}
          className="Nav-link"
        >
          Settings
        </div>
      </div>
    );
  }
}

export default Nav;
