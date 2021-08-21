import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import MangaView from "../MangaView/MangaView.jsx";
import ChapterView from "../ChapterView/ChapterView.jsx";

import "./Downloader.scss";

class Downloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceNames: [],
      sourceName: "",
      manga: undefined,
    };
    this.init = this.init.bind(this);
    this.getSourceNamesPromise = this.getSourceNamesPromise.bind(this);
    this.setManga = this.setManga.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.getSourceNamesPromise().then((sourceNames) => {
      this.setState({
        sourceNames: sourceNames,
        sourceName: sourceNames[0],
      });
    });
  }

  getSourceNamesPromise() {
    return ipcRenderer.invoke("getSourceNames");
  }

  setManga(manga) {
    this.setState({ manga: manga });
  }

  render() {
    return (
      <div className="Downloader">
        <MangaView
          sourceName={this.state.sourceName}
          manga={this.state.manga}
          setManga={this.setManga}
        />

        {this.state.manga ? (
          <ChapterView
            sourceName={this.state.sourceName}
            manga={this.state.manga}
            setManga={this.setManga}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Downloader;
