// TODO: keep loading gif until ALL information loaded, including chapter list, details, and cover image.
// Maybe just use a "loading" boolean state variable?

// TODO: limit cover image height to save space for chapter list

import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import "./ChapterView.scss";

class ChapterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
      downloadingChapterFilenames: [],
      downloadedChapterFilenames: [],
      coverImageUrl: "",
      details: {
        authors: "",
        genres: "",
        releasedate: "",
        status: "",
        description: "",
      },
    };
    this.getDetailsPromise = this.getDetailsPromise.bind(this);
    this.getChaptersPromise = this.getChaptersPromise.bind(this);
    this.getChapterDivs = this.getChapterDivs.bind(this);
    this.getChapterStatus = this.getChapterStatus.bind(this);
    this.getDownloadChapterPromise = this.getDownloadChapterPromise.bind(this);
    this.getDownloadedChapterFilenamesPromise =
      this.getDownloadedChapterFilenamesPromise.bind(this);
    this.getDownloadingChapterFilenamesPromise =
      this.getDownloadingChapterFilenamesPromise.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.handleFolderClick = this.handleFolderClick.bind(this);
  }

  componentDidMount() {
    Promise.all([
      this.getDetailsPromise(),
      this.getChaptersPromise(),
      this.getDownloadingChapterFilenamesPromise(),
      this.getDownloadedChapterFilenamesPromise(),
    ]).then((data) => {
      const details = data[0];
      const chapters = data[1];
      const downloadingChapterFilenames = data[2];
      const downloadedChapterFilenames = data[3];
      this.setState({
        details: details,
        chapters: chapters,
        downloadingChapterFilenames: downloadingChapterFilenames,
        downloadedChapterFilenames: downloadedChapterFilenames,
      });
    });

    ipcRenderer.on("downloaded-chapter-filenames", (event, filenames) => {
      // Update downloaded list upon download completion message
      this.setState({
        downloadedChapterFilenames: filenames,
      });
    });
  }

  getDetailsPromise() {
    return ipcRenderer.invoke(
      "get-details",
      this.props.sourceName,
      this.props.manga
    );
  }

  getChaptersPromise() {
    return ipcRenderer.invoke(
      "get-chapters",
      this.props.sourceName,
      this.props.manga
    );
  }

  // Returns Promise that resolves to Chapter[] of currently downloading Chapters
  getDownloadChapterPromise(chapter) {
    return ipcRenderer.invoke(
      "download-chapter",
      this.props.sourceName,
      this.props.manga,
      chapter
    );
  }

  // Returns Promise that resolves to String[] of currently downloading chapters' filenames
  getDownloadingChapterFilenamesPromise() {
    return ipcRenderer.invoke(
      "get-downloading-chapter-filenames",
      this.props.sourceName,
      this.props.manga
    );
  }

  // Promise resolves to String[] of downloaded chapter filenames for this source + manga
  getDownloadedChapterFilenamesPromise() {
    return ipcRenderer.invoke(
      "get-downloaded-chapter-filenames",
      this.props.sourceName,
      this.props.manga
    );
  }

  handleDownloadClick(chapter) {
    this.getDownloadChapterPromise(chapter).then(
      (downloadingChapterFilenames) => {
        this.setState({
          downloadingChapterFilenames: downloadingChapterFilenames,
        });
      }
    );
  }

  handleFolderClick() {
    ipcRenderer.invoke(
      "open-manga-folder",
      this.props.sourceName,
      this.props.manga
    );
  }

  getChapterStatus(chapter) {
    if (this.state.downloadedChapterFilenames.includes(chapter.filename)) {
      return (
        <div
          onClick={this.handleFolderClick}
          className="ChapterView-list-entry-status-downloaded"
          title="Show in folder"
        >
          <img src={require("../../assets/icons/folder.svg")} />
        </div>
      );
    } else if (
      this.state.downloadingChapterFilenames.includes(chapter.filename)
    ) {
      return (
        <div className="ChapterView-list-entry-status-downloading">
          <img src={require("../../assets/icons/loader.svg")} />
        </div>
      );
    }
    return (
      <div
        onClick={() => {
          this.handleDownloadClick(chapter);
        }}
        className="ChapterView-list-entry-status-download"
        title={`Download ${chapter.title}`}
      >
        <img src={require("../../assets/icons/download.svg")} />
      </div>
    );
  }

  getChapterDivs() {
    let i = 1;
    let chapterDivs = this.state.chapters.map((chapter) => {
      return (
        <div className="ChapterView-list-entry" key={`chapter-${i++}`}>
          <div className="ChapterView-list-entry-title">{chapter.title}</div>
          <div className="ChapterView-list-entry-status">
            {this.getChapterStatus(chapter)}
          </div>
        </div>
      );
    });
    return chapterDivs;
  }

  render() {
    return (
      <div className="ChapterView">
        <div
          className="View-back"
          onClick={() => {
            this.props.setManga(null);
          }}
        >
          <div className="View-back-button">
            <img src={require("../../assets/icons/corner-up-left.svg")} />
          </div>
        </div>
        <div className="ChapterView-title">{this.props.manga.title}</div>
        <div className="ChapterView-cover">
          <img src={this.props.manga.coverImageUrl} alt="Cover image" />
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

        {this.state.chapters.length === 0 ? (
          <div className="ChapterView-loading">
            <img src={require("../../assets/images/loading.gif")} />
          </div>
        ) : (
          <div className="ChapterView-list">{this.getChapterDivs()}</div>
        )}
      </div>
    );
  }
}

export default ChapterView;
