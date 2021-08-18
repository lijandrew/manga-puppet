import React from "react";
import { HashRouter, Route, Switch, Link } from "react-router-dom";

import Nav from "./components/Nav/Nav.jsx";
import Home from "./components/Home/Home.jsx";
import Library from "./components/Library/Library.jsx";
import Browse from "./components/Browse/Browse.jsx";
import Settings from "./components/Settings/Settings.jsx";

import "./App.scss";

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <HashRouter>
          <Nav />
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/library">
              <Library />
            </Route>
            <Route path="/browse">
              <Browse />
            </Route>
            <Route path="/settings">
              <Settings />
            </Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}
