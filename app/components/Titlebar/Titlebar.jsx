import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import "./Titlebar.scss";

class Titlebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maximized: false,
    };
  }

  componentDidMount() {
    ipcRenderer.on("isMaximized", () => {
      this.setState({ maximized: true });
    });
    ipcRenderer.on("isRestored", () => {
      this.setState({ maximized: false });
    });
  }

  render() {
    return (
      <div className="Titlebar">
        <div className="Titlebar-logo">
          <div className="Titlebar-maximize">
            <img draggable="false" src={require("../../assets/maximize.svg")} />
          </div>
        </div>

        <div className="Titlebar-group">
          <div
            onClick={() => {
              ipcRenderer.invoke("minimize-app");
            }}
            className="Titlebar-minimize"
          >
            <img draggable="false" src={require("../../assets/minimize.svg")} />
          </div>

          <div
            onClick={() => {
              this.state.maximized
                ? ipcRenderer.invoke("restore-app")
                : ipcRenderer.invoke("maximize-app");
            }}
            className="Titlebar-maximize"
            title={this.state.maximized ? "Restore" : "Maximize"}
          >
            <img
              draggable="false"
              src={
                this.state.maximized
                  ? require("../../assets/restore.svg")
                  : require("../../assets/maximize.svg")
              }
            />
          </div>

          <div
            onClick={() => {
              ipcRenderer.invoke("close-app");
            }}
            className="Titlebar-close"
          >
            <img draggable="false" src={require("../../assets/x.svg")} />
          </div>
        </div>
      </div>
    );
  }
}

export default Titlebar;
