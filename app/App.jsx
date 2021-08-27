import React, { Component } from "react";

import Titlebar from "./components/Titlebar/Titlebar.jsx";
import SourceView from "./components/SourceView/SourceView.jsx";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Titlebar />
        <SourceView />
      </div>
    );
  }
}
export default App;
