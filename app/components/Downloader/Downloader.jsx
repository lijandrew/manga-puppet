// TODO: try not copying arrays when setting state

import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import "./Downloader.scss";

class Downloader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      sourceNames: [],
      selectedSourceName: "",
      mangas: [],
      selectedManga: null,
      chapters: [],
    };
    this.getSourceNames = this.getSourceNames.bind(this);
    this.getMangas = this.getMangas.bind(this);
    this.getMangaDivs = this.getMangaDivs.bind(this);
    this.handleMangaClick = this.handleMangaClick.bind(this);
    this.getChapters = this.getChapters.bind(this);
    this.getChapterDivs = this.getChapterDivs.bind(this);
    this.handleChapterClick = this.handleChapterClick.bind(this);
  }

  getSourceNames() {
    ipcRenderer.send("getSourceNames");
    ipcRenderer.on("Engine:getSourceNames", (event, sourceNames) => {
      this.setState({
        sourceNames: [...sourceNames],
        selectedSourceName: [...sourceNames][0],
      });
    });
  }

  getMangas() {
    if (this.state.selectedSourceName === "") {
      return [];
    }
    ipcRenderer.send("getMangas", this.state.selectedSourceName);
    ipcRenderer.on("Engine:getMangas", (event, mangas) => {
      this.setState({ mangas: [...mangas] });
    });
  }

  getChapters() {
    if (
      this.state.selectedSourceName === "" ||
      this.state.selectedManga === null
    ) {
      return [];
    }
    ipcRenderer.send(
      "getChapters",
      this.state.selectedSourceName,
      this.state.selectedManga
    );
    ipcRenderer.on("Engine:getChapters", (event, chapters) => {
      this.setState({ chapters: [...chapters] });
    });
  }

  handleMangaClick(manga) {
    this.setState({ selectedManga: manga }, () => {
      this.getChapters();
    });
  }

  handleChapterClick(chapter) {
    ipcRenderer.send(
      "downloadChapter",
      this.state.selectedSourceName,
      this.state.selectedManga,
      chapter
    );
    ipcRenderer.on("Engine:downloadChapter", (event) => {
      console.log("Downloaded");
    });
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

  getChapterDivs() {
    let i = 1;
    let chapterDivs = this.state.chapters.map((chapter) => {
      return (
        <div
          key={`chapter-${i++}`}
          onClick={() => this.handleChapterClick(chapter)}
          className="Downloader-chapter-list-entry"
        >
          <div className="Downloader-chapter-list-entry-title">
            {chapter.title}
          </div>
        </div>
      );
    });
    return chapterDivs;
  }

  componentDidMount() {
    this.getSourceNames();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedSourceName !== prevState.selectedSourceName) {
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
          Source: {this.state.selectedSourceName}
        </div>
        <div className="Downloader-manga-list">{this.getMangaDivs()}</div>
        {this.state.selectedManga ? (
          <div className="Downloader-manga">
            <div>Manga view for {this.state.selectedManga.title}</div>
            <button
              onClick={() => {
                this.setState({ selectedManga: null });
              }}
            >
              Back
            </button>
            <div className="Downloader-chapter-list">
              {this.getChapterDivs()}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Downloader;
