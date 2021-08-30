import React, { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
const { ipcRenderer } = window.require("electron");

const Settings = window.require("../engine/Settings.js");
import "./Reader.scss";

class Reader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: [],
    };
    this.updatePages = this.updatePages.bind(this);
    this.getPageDivs = this.getPageDivs.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.updatePages();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.chapter !== prevProps.chapter) {
      this.setState(
        {
          pages: [],
        },
        () => {
          this.updatePages();
        }
      );
    }
  }

  updatePages() {
    ipcRenderer
      .invoke("get-pages", this.props.sourceName, this.props.chapter)
      .then((pages) => {
        this.setState({ pages: pages });
      });
  }

  update() {
    this.forceUpdate();
  }

  getPageDivs() {
    let i = 1;
    return this.state.pages.map((page) => (
      <div
        key={`page-${i++}`}
        className="Reader-list-entry"
        style={{ margin: Settings.readerSettings.margin + "px 0" }}
      >
        <LazyLoadImage src={page.url} />
      </div>
    ));
  }

  render() {
    return (
      <div className="Reader">
        <div
          className="View-back"
          onClick={() => {
            this.props.setChapter(null);
          }}
        >
          <div className="View-back-button">
            <img src={require("../../assets/icons/corner-up-left.svg")} />
          </div>
        </div>

        <div className="Reader-header">
          <IncreaseMargin update={this.update} />
          <DecreaseMargin update={this.update} />
          <PreviousChapter {...this.props} pages={this.state.pages} />
          <div className="Reader-header-chapter">
            {this.props.chapter.title}
          </div>
          <NextChapter {...this.props} pages={this.state.pages} />
          <ZoomIn update={this.update} />
          <ZoomOut update={this.update} />
        </div>

        {this.state.pages.length > 0 ? (
          <div
            className="Reader-list"
            style={{ width: Settings.readerSettings.zoom + "%" }}
          >
            {this.getPageDivs()}
          </div>
        ) : (
          <div className="Reader-loading">
            <img src={require("../../assets/images/loading.gif")} />
          </div>
        )}
      </div>
    );
  }
}

function ZoomIn(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.zoom += Settings.readerSettings.zoomConstant;
        props.update();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/zoom-in.svg")} />
    </div>
  );
}

function ZoomOut(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.zoom -= Settings.readerSettings.zoomConstant;
        props.update();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/zoom-out.svg")} />
    </div>
  );
}

function IncreaseMargin(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.margin +=
          Settings.readerSettings.marginConstant;
        props.update();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/increase-margin.svg")} />
    </div>
  );
}

function DecreaseMargin(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.margin -=
          Settings.readerSettings.marginConstant;
        props.update();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/decrease-margin.svg")} />
    </div>
  );
}

function PreviousChapter(props) {
  const chapters = [...props.chapters].reverse();
  return (
    <div
      onClick={() => {
        props.setChapter(
          chapters[Math.max(chapters.indexOf(props.chapter) - 1, 0)]
        );
      }}
      className={`Reader-header-button${
        props.pages.length === 0 || chapters.indexOf(props.chapter) === 0
          ? " disabled"
          : ""
      }`}
    >
      <img src={require("../../assets/icons/chevron-left.svg")} />
    </div>
  );
}

function NextChapter(props) {
  const chapters = [...props.chapters].reverse();
  return (
    <div
      onClick={() => {
        props.setChapter(
          chapters[
            Math.min(chapters.indexOf(props.chapter) + 1, chapters.length - 1)
          ]
        );
      }}
      className={`Reader-header-button${
        props.pages.length === 0 ||
        chapters.indexOf(props.chapter) === chapters.length - 1
          ? " disabled"
          : ""
      }`}
    >
      <img src={require("../../assets/icons/chevron-right.svg")} />
    </div>
  );
}

export default Reader;
