import React, { Component } from "react";

import "./MangaView.scss";

class MangaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
    };
    this.getMangaDivs = this.getMangaDivs.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(manga) {
    this.props.selectManga(manga);
  }

  getMangaDivs() {
    let i = 1;
    let mangaDivs = this.props.mangas.map((manga) => {
      return (
        <div
          onClick={() => {
            this.handleClick(manga);
          }}
          className={`MangaView-list-entry${
            this.props.selectedManga === manga ? " selected" : ""
          }`}
          key={`manga-${i++}`}
        >
          {manga.title}
        </div>
      );
    });
    return mangaDivs;
  }

  render() {
    return (
      <div className="MangaView">
        <div className="MangaView-list">{this.getMangaDivs()}</div>
      </div>
    );
  }
}

export default MangaView;
