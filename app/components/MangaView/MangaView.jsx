import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import "./MangaView.scss";

class MangaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mangas: [],
      query: "",
    };
    this.init = this.init.bind(this);
    this.getMangasPromise = this.getMangasPromise.bind(this);
    this.getMangaDivs = this.getMangaDivs.bind(this);
    this.handleMangaClick = this.handleMangaClick.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    // Necessary?
    if (this.props.sourceName !== prevProps.sourceName) {
      this.init();
    }
  }

  init() {
    this.getMangasPromise().then((mangas) => {
      this.setState({ mangas: mangas });
    });
  }

  getMangasPromise() {
    return ipcRenderer.invoke("getMangas", this.props.sourceName);
  }

  getMangaDivs() {
    let i = 1;
    let mangaDivs = this.state.mangas.map((manga) => {
      return (
        <div
          onClick={() => {
            this.handleMangaClick(manga);
          }}
          className={`MangaView-list-entry${
            manga === this.props.manga ? " selected" : ""
          }`}
          key={`manga-${i++}`}
        >
          {manga.title}
        </div>
      );
    });
    return mangaDivs;
  }

  handleMangaClick(manga) {
    this.props.setManga(manga);
  }

  render() {
    return (
      <div className="MangaView">
        {this.props.sourceName !== "" && this.state.mangas.length === 0 ? (
          <div className="MangaView-loading">Loading...</div>
        ) : (
          <div className="MangaView-list">{this.getMangaDivs()}</div>
        )}
      </div>
    );
  }
}

export default MangaView;
