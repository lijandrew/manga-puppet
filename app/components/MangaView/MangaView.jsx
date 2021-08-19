import React, { Component } from "react";
const { ipcRenderer } = window.require("electron");

import "./MangaView.scss";

class MangaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chapters: [],
    };
    this.getChapters = this.getChapters.bind(this);
    this.getChapterDivs = this.getChapterDivs.bind(this);
  }

  getChapters() {
    ipcRenderer.send("getChapters", this.props.sourceName, this.props.manga);
    ipcRenderer.on("Engine:getChapters", (event, chapters) => {
      this.setState({ chapters: [...chapters] });
    });
  }

  getChapterDivs() {
    let i = 1;
    let chapterDivs = this.state.chapters.map((chapter) => {
      return (
        <div
          key={`chapter-${i++}`}
          onClick={() => this.handleChapterClick(chapter)}
          className="MangaView-chapter-list-entry"
        >
          <div className="MangaView-chapter-list-entry-title">
            {chapter.title}
          </div>
        </div>
      );
    });
    return chapterDivs;
  }

  handleChapterClick(chapter) {
    ipcRenderer.send(
      "downloadChapter",
      this.props.sourceName,
      this.props.manga,
      chapter
    );
    ipcRenderer.on("Engine:downloadChapter", (event) => {
      console.log("Downloaded");
    });
  }

  componentDidMount() {
    console.log("MangaView:mount");
    this.getChapters();
  }

  render() {
    return (
      <div className="MangaView">
        <div className="MangaView-header">
          <div className="MangaView-cover">
            <img
              src={require("../../assets/cover.jpg")}
              alt="Cover image placeholder"
            />
          </div>
          <div className="MangaView-details">
            <div className="MangaView-details-title">
              {this.props.manga.title}
            </div>
            <hr />
            <div className="MangaView-details-author">
              <span>Author(s): </span> Author
            </div>
            <div className="MangaView-details-genres">
              <span>Genre(s): </span>
              Action, Fantasy, Romance
            </div>
            <div className="MangaView-details-releasedate">
              <span>Released: </span>
              2021
            </div>
            <div className="MangaView-details-status">
              <span>Status: </span>
              Ongoing
            </div>
          </div>
        </div>
        <div className="MangaView-chapter-list">{this.getChapterDivs()}</div>
      </div>
    );
  }
}

export default MangaView;
