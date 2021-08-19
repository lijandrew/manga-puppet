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
      mangas: [],
      chapters: [],
      selectedSourceName: "",
      selectedManga: null,
      selectedChapters: [],
      downloading: false,
    };
    this.getSourceNames = this.getSourceNames.bind(this);
    this.getMangas = this.getMangas.bind(this);
    this.getChapters = this.getChapters.bind(this);
    this.selectManga = this.selectManga.bind(this);
    this.selectChapters = this.selectChapters.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  // Remove Promise wrapper if you aren't going to use it
  getSourceNames() {
    return new Promise((resolve) => {
      ipcRenderer.invoke("getSourceNames").then((sourceNames) => {
        this.setState({ sourceNames: [...sourceNames] }, () => {
          resolve();
        });
      });
    });
  }

  // Remove Promise wrapper if you aren't going to use it
  getMangas() {
    return new Promise((resolve) => {
      ipcRenderer
        .invoke("getMangas", this.state.selectedSourceName)
        .then((mangas) => {
          this.setState({ mangas: [...mangas] }, () => {
            resolve();
          });
        });
    });
  }

  // Remove Promise wrapper if you aren't going to use it
  getChapters() {
    return new Promise((resolve) => {
      ipcRenderer
        .invoke(
          "getChapters",
          this.state.selectedSourceName,
          this.state.selectedManga
        )
        .then((chapters) => {
          this.setState({ chapters: [...chapters] }, () => {
            resolve();
          });
        });
    });
  }

  selectManga(manga) {
    // Change selectedManga, clear selectedChapters, get new chapters
    this.setState({ selectedManga: manga, selectedChapters: [] }, () => {
      this.getChapters();
    });
  }

  selectChapters(chapters) {
    this.setState({ selectedChapters: [...chapters] });
  }

  handleDownloadClick() {
    if (this.state.selectedSourceName === "") return;
    if (this.state.selectManga === null) return;
    if (this.state.selectedChapters.length === 0) return;
    this.setState(
      {
        downloading: true,
      },
      () => {
        ipcRenderer
          .invoke(
            "downloadChapters",
            this.state.selectedSourceName,
            this.state.selectedManga,
            this.state.selectedChapters
          )
          .then(() => {
            alert("Download complete.");
            this.setState({
              downloading: false,
            });
          });
      }
    );
  }

  componentDidMount() {
    // Get source names and select the first one.
    this.getSourceNames().then(() => {
      this.setState((state) => ({
        selectedSourceName: state.sourceNames[0],
      }));
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedSourceName !== prevState.selectedSourceName) {
      // Detect source name change and update manga.
      this.getMangas();
    }
  }

  render() {
    return (
      <div className="Downloader">
        <div className="Downloader-views">
          <MangaView
            mangas={this.state.mangas}
            selectManga={this.selectManga}
            selectedManga={this.state.selectedManga}
          />
          <ChapterView
            chapters={this.state.chapters}
            selectChapters={this.selectChapters}
            selectedChapters={this.state.selectedChapters}
          />
        </div>
        <div className="Downloader-download">
          <button
            disabled={
              this.state.selectedChapters.length === 0 || this.state.downloading
            }
            onClick={this.handleDownloadClick}
          >
            Download
          </button>
        </div>
      </div>
    );
  }
}

export default Downloader;
