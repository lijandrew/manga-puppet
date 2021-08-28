import React, { Component } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";

import Home from "./components/Home/Home.jsx";
import SourceView from "./components/SourceView/SourceView.jsx";
import Settings from "./components/Settings/Settings.jsx";
import "./App.scss";
import Nav from "./components/Nav/Nav.jsx";

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
        {/* <HashRouter>
          <Nav />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/browse"> */}
        <SourceView />
        {/* </Route>
            <Route path="/settings">
              <Settings />
            </Route>
          </Switch>
        </HashRouter> */}
      </div>
    );
  }
}
export default App;
