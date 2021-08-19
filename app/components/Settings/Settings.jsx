import React, { Component } from "react";

class Settings extends Component {
  render() {
    if (!this.props.active) {
      return "";
    }
    return <div className="Settings">Settings</div>;
  }
}

export default Settings;
