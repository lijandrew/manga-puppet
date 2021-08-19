// TODO: try not copying arrays when setting state

import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import MangaView from "../MangaView/MangaView.jsx";

import "./Downloader.scss";

class Downloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      sourceNames: [],
      activeSourceName: "",
      mangas: [],
      activeManga: null,
    };
    this.getSourceNames = this.getSourceNames.bind(this);
    this.getMangas = this.getMangas.bind(this);
    this.getMangaDivs = this.getMangaDivs.bind(this);
    this.handleMangaClick = this.handleMangaClick.bind(this);
  }

  getSourceNames() {
    ipcRenderer.send("getSourceNames");
    ipcRenderer.on("Engine:getSourceNames", (event, sourceNames) => {
      this.setState({
        sourceNames: [...sourceNames],
        activeSourceName: [...sourceNames][0],
      });
    });
  }

  getMangas() {
    if (this.state.activeSourceName === "") {
      return [];
    }
    ipcRenderer.send("getMangas", this.state.activeSourceName);
    ipcRenderer.on("Engine:getMangas", (event, mangas) => {
      this.setState({ mangas: [...mangas] });
    });
  }

  handleMangaClick(manga) {
    this.setState({ activeManga: manga });
  }

  getMangaDivs() {
    let i = 1;
    let mangaDivs = this.state.mangas.map((manga) => {
      return (
        <div
          onClick={() => {
            this.handleMangaClick(manga);
          }}
          key={`manga-${i++}`}
          className="Downloader-manga-list-entry"
        >
          <div className="Downloader-manga-list-entry-title">{manga.title}</div>
        </div>
      );
    });
    return mangaDivs;
  }

  componentDidMount() {
    this.getSourceNames();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeSourceName !== prevState.activeSourceName) {
      // Update manga if source name changed
      this.getMangas();
    }
  }

  render() {
    if (!this.props.active) {
      return "";
    }
    return (
      <div className="Downloader">
        <div className="Downloader-bar">
          Source: {this.state.activeSourceName}
        </div>
        <div className="Downloader-manga-list">{this.getMangaDivs()}</div>

        {this.state.activeManga ? (
          <MangaView
            sourceName={this.state.activeSourceName}
            manga={this.state.activeManga}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Downloader;
