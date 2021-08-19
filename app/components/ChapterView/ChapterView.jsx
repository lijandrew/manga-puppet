import React, { Component } from "react";

import "./ChapterView.scss";

class ChapterView extends Component {
  constructor(props) {
    super(props);
    this.getChapterDivs = this.getChapterDivs.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.lastSelectIndex = 0;
  }

  getChapterDivs() {
    let i = 1;
    let chapterDivs = this.props.chapters.map((chapter) => {
      return (
        <div
          onClick={(event) => this.handleClick(event, chapter)}
          className={`ChapterView-list-entry${
            this.props.selectedChapters.includes(chapter) ? " selected" : ""
          }`}
          key={`chapter-${i++}`}
        >
          {chapter.title}
        </div>
      );
    });
    return chapterDivs;
  }

  handleClick(event, chapter) {
    // Toggles selected chapters.
    let selectedChapters = [...this.props.selectedChapters];
    const index = selectedChapters.indexOf(chapter);
    if (index === -1) {
      selectedChapters.push(chapter);
    } else {
      selectedChapters.splice(index, 1);
    }
    this.props.selectChapters(selectedChapters);
  }

  componentDidUpdate(prevProps) {
    if (this.props.chapters !== prevProps.chapters) {
      console.log("update chapters");
      this.forceUpdate();
    }
    if (this.props.selectedChapters !== prevProps.selectedChapters) {
    }
  }

  render() {
    return (
      <div className="ChapterView">
        <div className="ChapterView-list">{this.getChapterDivs()}</div>
      </div>
    );
  }
}

export default ChapterView;
