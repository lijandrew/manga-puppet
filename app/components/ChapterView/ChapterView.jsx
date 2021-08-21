import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import "./ChapterView.scss";

class ChapterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
      localChapterFilenames: [],
      coverImageUrl: require("../../assets/placeholder.jpg"),
      details: {
        authors: "",
        genres: "",
        releasedate: "",
        status: "",
        description: "",
      },
    };
    this.init = this.init.bind(this);
    this.getCoverImageUrlPromise = this.getCoverImageUrlPromise.bind(this);
    this.getDetailsPromise = this.getDetailsPromise.bind(this);
    this.getChaptersPromise = this.getChaptersPromise.bind(this);
    this.getChapterDivs = this.getChapterDivs.bind(this);
    this.getDownloadPromise = this.getDownloadPromise.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.getLocalChapterFilenamesPromise =
      this.getLocalChapterFilenamesPromise.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    let promises = Promise.all([
      this.getCoverImageUrlPromise(),
      this.getDetailsPromise(),
      this.getChaptersPromise(),
      this.getLocalChapterFilenamesPromise(),
    ]);
    promises.then((results) => {
      const coverImageUrl = results[0];
      const details = results[1];
      const chapters = results[2];
      const localChapterFilenames = results[3];
      this.setState({
        coverImageUrl: coverImageUrl,
        details: details,
        chapters: chapters,
        localChapterFilenames: localChapterFilenames,
      });
    });
  }

  getCoverImageUrlPromise() {
    return ipcRenderer.invoke(
      "getCoverImageUrl",
      this.props.sourceName,
      this.props.manga
    );
  }

  getDetailsPromise() {
    return ipcRenderer.invoke(
      "getDetails",
      this.props.sourceName,
      this.props.manga
    );
  }

  getChaptersPromise() {
    return ipcRenderer.invoke(
      "getChapters",
      this.props.sourceName,
      this.props.manga
    );
  }

  getLocalChapterFilenamesPromise() {
    return ipcRenderer.invoke(
      "getLocalChapterFilenames",
      this.props.sourceName,
      this.props.manga
    );
  }

  getChapterDivs() {
    let i = 1;
    let chapterDivs = this.state.chapters.map((chapter) => {
      return (
        <div
          // onClick={(event) => this.handleChapterClick(event, chapter)}
          className="ChapterView-list-entry"
          key={`chapter-${i++}`}
        >
          {chapter.title}
          <button
            onClick={() => {
              this.handleDownloadClick(chapter);
            }}
            disabled={this.state.localChapterFilenames.includes(chapter.filename)}
          >
            Download
          </button>
        </div>
      );
    });
    return chapterDivs;
  }

  getDownloadPromise(chapter) {
    return ipcRenderer.invoke(
      "downloadChapter",
      this.props.sourceName,
      this.props.manga,
      chapter
    );
  }

  handleDownloadClick(chapter) {
    this.getDownloadPromise(chapter).then(() => {
      // Runs after chapter download finishes
      this.getLocalChapterFilenamesPromise().then((filenames) => {
        this.setState({
          localChapterFilenames: filenames,
        });
      });
    });
  }

  render() {
    return (
      <div className="ChapterView">
        <button
          onClick={() => {
            this.props.setManga();
          }}
        >
          Back
        </button>
        <div className="ChapterView-title">{this.props.manga.title}</div>
        <div className="ChapterView-cover">
          <img src={this.state.coverImageUrl} alt="Cover image" />
        </div>
        <div className="ChapterView-details">
          <div className="ChapterView-details-authors">
            {this.state.details.authors}
          </div>
          <div className="ChapterView-details-genres">
            {this.state.details.genres}
          </div>
          <div className="ChapterView-details-releasedate">
            {this.state.details.releasedate}
          </div>
          <div className="ChapterView-details-status">
            {this.state.details.status}
          </div>
          <div className="ChapterView-details-description">
            {this.state.details.description}
          </div>
        </div>

        {this.props.manga && this.state.chapters.length === 0 ? (
          <div className="ChapterView-loading">Loading...</div>
        ) : (
          <div className="ChapterView-list">{this.getChapterDivs()}</div>
        )}
      </div>
    );
  }
}

export default ChapterView;
