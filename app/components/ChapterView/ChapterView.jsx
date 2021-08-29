// TODO: keep loading gif until ALL information loaded, including chapter list, details, and cover image.
// Maybe just use a "loading" boolean state variable?

// TODO: limit cover image height to save space for chapter list

import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import Reader from "../Reader/Reader.jsx";
import "./ChapterView.scss";

class ChapterView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
      chapter: null,
      downloadingChapterFilenames: [],
      downloadedChapterFilenames: [],
      errorChapterFilenames: [],
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
    this.setChapter = this.setChapter.bind(this);
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

    ipcRenderer.on("error-chapter-filename", (event, filename) => {
      // Update error list upon error message
      this.setState((state) => ({
        errorChapterFilenames: [...state.errorChapterFilenames, filename],
      }));
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

  setChapter(chapter) {
    this.setState({
      chapter: chapter,
    });
  }

  handleDownloadClick(chapter) {
    // Remove error status if present, then request download
    this.setState(
      (state) => {
        const errorChapterFilenames = [...state.errorChapterFilenames];
        const index = errorChapterFilenames.indexOf(chapter.filename);
        if (index > -1) {
          errorChapterFilenames.splice(index, 1);
        }
        return {
          errorChapterFilenames: errorChapterFilenames,
        };
      },
      () => {
        this.getDownloadChapterPromise(chapter).then(
          (downloadingChapterFilenames) => {
            this.setState({
              downloadingChapterFilenames: downloadingChapterFilenames,
            });
          }
        );
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
    if (this.state.errorChapterFilenames.includes(chapter.filename)) {
      return (
        <StatusError
          onClick={() => {
            this.handleDownloadClick(chapter);
          }}
        />
      );
    } else if (
      this.state.downloadedChapterFilenames.includes(chapter.filename)
    ) {
      return <StatusDownloaded onClick={this.handleFolderClick} />;
    } else if (
      this.state.downloadingChapterFilenames.includes(chapter.filename)
    ) {
      return <StatusDownloading />;
    }
    return (
      <StatusDownload
        onClick={() => {
          this.handleDownloadClick(chapter);
        }}
      />
    );
  }

  getChapterDivs() {
    let i = 1;
    let chapterDivs = this.state.chapters.map((chapter) => {
      return (
        <div className="ChapterView-list-entry" key={`chapter-${i++}`}>
          <div className="ChapterView-list-entry-status">
            {this.getChapterStatus(chapter)}
            <div
              onClick={() => {
                this.setChapter(chapter);
              }}
              className="ChapterView-list-entry-status-read"
              title={`Read ${chapter.title}`}
            >
              <img src={require("../../assets/icons/book-open.svg")} />
            </div>
          </div>
          <div className="ChapterView-list-entry-title">{chapter.title}</div>
        </div>
      );
    });
    return chapterDivs;
  }

  render() {
    return (
      <React.Fragment>
        <div className={`ChapterView${this.state.chapter ? " hidden" : ""}`}>
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
          <div className="ChapterView-header">
            <div className="ChapterView-cover">
              <img src={this.props.manga.coverImageUrl} alt="Cover image" />
            </div>
            <div className="ChapterView-details">
              <div className="ChapterView-title">{this.props.manga.title}</div>
              <div className="ChapterView-details-authors">
                <span>Author(s): </span>
                {this.state.details.authors}
              </div>
              <div className="ChapterView-details-genres">
                <span>Genres(s): </span>
                {this.state.details.genres}
              </div>
              <div className="ChapterView-details-releasedate">
                <span>Released: </span>
                {this.state.details.releasedate}
              </div>
              <div className="ChapterView-details-status">
                <span>Status: </span>
                {this.state.details.status}
              </div>
              <div className="ChapterView-details-description">
                <span>Description: </span>
                {this.state.details.description}
              </div>
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
        {this.state.chapter ? (
          <Reader
            sourceName={this.props.sourceName}
            chapter={this.state.chapter}
            chapters={this.state.chapters}
            setChapter={this.setChapter}
          />
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

function StatusError(props) {
  return (
    <div
      onClick={props.onClick}
      className="ChapterView-list-entry-status-error"
      title="Click to retry"
    >
      <img src={require("../../assets/icons/alert-circle.svg")} />
      <img src={require("../../assets/icons/rotate-cw.svg")} />
    </div>
  );
}

function StatusDownloaded(props) {
  return (
    <div
      onClick={props.onClick}
      className="ChapterView-list-entry-status-downloaded"
      title="Show in folder"
    >
      <img src={require("../../assets/icons/folder.svg")} />
    </div>
  );
}

function StatusDownloading(props) {
  return (
    <div
      title="Download in progress"
      className="ChapterView-list-entry-status-downloading"
    >
      <img src={require("../../assets/icons/loader.svg")} />
    </div>
  );
}

function StatusDownload(props) {
  return (
    <div
      onClick={props.onClick}
      className="ChapterView-list-entry-status-download"
      title={`Download chapter`}
    >
      <img src={require("../../assets/icons/download.svg")} />
    </div>
  );
}

export default ChapterView;
