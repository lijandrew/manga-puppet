import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      sourceNames: [],
      mangas: [],
      selectedSourceName: "",
    };
    this.getMangaList = this.getMangaList.bind(this);
  }

  componentDidMount() {
    ipcRenderer.send("getSourceNames");
    ipcRenderer.on("Engine:getSourceNames", (event, sourceNames) => {
      this.setState({
        sourceNames: [...sourceNames],
        selectedSourceName: [...sourceNames][0],
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Update manga if source name changed
    if (this.state.selectedSourceName !== prevState.selectedSourceName) {
      ipcRenderer.send("getMangasBySourceName", this.state.selectedSourceName);
      ipcRenderer.on("Engine:getMangasBySourceName", (event, mangas) => {
        this.setState({ mangas: [...mangas] });
      });
    }
  }

  getMangaList() {
    let i = 1;
    let mangaDivs = this.state.mangas.map((manga) => {
      return (
        <div key={`manga-${i++}`} className="Browse-list-entry">
          <div className="Browse-list-entry-title">{manga.title}</div>
        </div>
      );
    });
    return mangaDivs;
  }

  render() {
    return (
      <div className="Browse">
        <div className="Browse-bar">
          Source: {this.state.selectedSourceName}
        </div>
        <div className="Browse-list">{this.getMangaList()}</div>
      </div>
    );
  }
}

export default Browse;
