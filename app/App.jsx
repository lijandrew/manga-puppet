import React, { Component } from "react";

import SourceView from "./components/SourceView/SourceView.jsx";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceName: null,
      manga: null,
    };
  }

  render() {
    return (
      <div className="App">
        <SourceView />
      </div>
    );
  }
}
export default App;
