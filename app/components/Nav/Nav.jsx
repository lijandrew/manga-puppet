import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./Nav.scss";

class Nav extends Component {
  render() {
    return (
      <div class="Nav">
        <NavLink
          className="NavLink"
          activeClassName="NavLink-active"
          exact
          to="/"
        >
          Home
        </NavLink>
        <NavLink
          className="NavLink"
          activeClassName="NavLink-active"
          to="/browse"
        >
          Browse
        </NavLink>
        <NavLink
          className="NavLink"
          activeClassName="NavLink-active"
          to="/settings"
        >
          Settings
        </NavLink>
      </div>
    );
  }
}

export default Nav;
