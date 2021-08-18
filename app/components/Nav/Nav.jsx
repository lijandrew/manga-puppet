import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./Nav.scss";

class Nav extends Component {
  render() {
    return (
      <div className="Nav">
        {/* <div className="Nav-grid"> */}
          <NavLink to="/" exact className="Nav-link" activeClassName="Nav-link-active">
            <div>Home</div>
          </NavLink>
          <NavLink to="/library" className="Nav-link" activeClassName="Nav-link-active">
            <div>Library</div>
          </NavLink>
          <NavLink to="/browse" className="Nav-link" activeClassName="Nav-link-active">
            <div>Browse</div>
          </NavLink>
          <NavLink to="/settings" className="Nav-link" activeClassName="Nav-link-active">
            <div>Settings</div>
          </NavLink>
        {/* </div> */}
      </div>
    );
  }
}

export default Nav;
