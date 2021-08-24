import React, { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
const { ipcRenderer } = window.require("electron");

import "./MangaView.scss";

class MangaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      mangas: [],
      queryMangas: [],
    };
    this.init = this.init.bind(this);
    this.getMangasPromise = this.getMangasPromise.bind(this);
    this.handleChangeQuery = this.handleChangeQuery.bind(this);
    this.getMangaDivs = this.getMangaDivs.bind(this);
    this.handleClickManga = this.handleClickManga.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.sourceName !== prevProps.sourceName) {
      this.init();
    }
  }

  init() {
    // Get manga list
    this.getMangasPromise().then((mangas) => {
      // Query results
      let queryMangas = mangas.filter((manga) =>
        manga.title.includes(this.state.query)
      );

      this.setState({
        mangas: mangas,
        queryMangas: queryMangas,
      });
    });
  }

  getMangasPromise() {
    return ipcRenderer.invoke("getMangas", this.props.sourceName);
  }

  getMangaDivs() {
    let i = 1;
    return this.state.queryMangas.map((manga) => (
      <div
        onClick={() => {
          this.handleClickManga(manga);
        }}
        key={`manga-${i++}`}
        className="MangaView-list-item"
      >
        <div className="MangaView-list-item-title">{manga.title}</div>
        <div className="MangaView-list-item-cover">
          <LazyLoadImage className="MangaView-list-item-cover-image" src={manga.coverImageUrl} />
          {/* <img src={manga.coverImageUrl} /> */}
        </div>
      </div>
    ));
  }

  handleClickManga(manga) {
    this.props.setManga(manga);
  }

  handleChangeQuery(event) {
    let query = event.target.value;
    let queryMangas = this.state.mangas.filter((manga) =>
      manga.title.includes(query)
    );
    this.setState({
      query: query,
      queryMangas: queryMangas,
    });
  }

  render() {
    return (
      <div className="MangaView">
        <input type="text" onChange={this.handleChangeQuery} />
        {this.state.mangas.length === 0 ? (
          <div className="MangaView-loading">Loading...</div>
        ) : (
          <div className="MangaView-list">{this.getMangaDivs()}</div>
        )}
      </div>
    );
  }
}

export default MangaView;
