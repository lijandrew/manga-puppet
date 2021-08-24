import React, { Component } from "react";

import MangaView from "./components/MangaView/MangaView.jsx";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <MangaView />
      </div>
    );
  }
}

export default App;