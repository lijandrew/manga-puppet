import React, { Component } from "react";

class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      source: "",
      query: "",
      mangas: [],
    };
  }

  componentDidMount() {
    window.api.send("Browse:getMangas", this.state.source);
    window.api.receive("main:getMangas", mangas => {
      this.setState({ mangas: mangas });
    });
  }

  render() {
    return (
      <div className="Browse">
        <div className="Browse-bar"></div>
        <div className="Browse-grid">
          <div className="Browse-grid-cell"></div>
        </div>
      </div>
    );
  }
}

export default Browse;
