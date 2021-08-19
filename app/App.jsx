import React from "react";

import Nav from "./components/Nav/Nav.jsx";
import Home from "./components/Home/Home.jsx";
import Library from "./components/Library/Library.jsx";
import Downloader from "./components/Downloader/Downloader.jsx";
import Settings from "./components/Settings/Settings.jsx";

import "./App.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 2,
    };
    this.setActiveIndex = this.setActiveIndex.bind(this);
  }

  setActiveIndex(index) {
    this.setState({
      activeIndex: index,
    });
  }

  render() {
    return (
      <div className="App">
        {/* <Nav setActiveIndex={this.setActiveIndex} /> */}
        {/* <Home active={this.state.activeIndex === 0} /> */}
        {/* <Library active={this.state.activeIndex === 1} /> */}
        <Downloader active={this.state.activeIndex === 2} />
        {/* <Settings active={this.state.activeIndex === 3} /> */}
      </div>
    );
  }
}
