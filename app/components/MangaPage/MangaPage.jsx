import React, { Component } from "react";
import LazyLoad from 'react-lazyload';
const { ipcRenderer } = window.require("electron");

import "./MangaPage.scss";

class MangaPage extends Component {
  constructor(props) {
    super(props);
    /*
    this.state = {
      idCoverMap: {},
    };
    this.init = this.init.bind(this);
    this.getCoverImageUrlMapPromise =
      this.getCoverImageUrlMapPromise.bind(this);
      */
  }

  /*
  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    if (this.props.mangas !== prevProps.mangas) {
      this.init();
    }
  }

  init() {
    // Get cover image urls
    this.getCoverImageUrlMapPromise().then((map) => {
      this.setState({
        idCoverMap: map,
      }, () => {
        console.log(this.state.idCoverMap)
      });
    });
  }

  async getCoverImageUrlMapPromise() {
    const pairs = await Promise.all(
      this.props.mangas.map((manga) =>
        ipcRenderer
          .invoke("getCoverImageUrl", this.props.sourceName, manga)
          .then((url) => [manga.id, url])
      )
    );
    let map = {};
    pairs.forEach((pair) => {
      map[pair[0]] = pair[1];
    });
    return map;
  }
  */


  render() {
    return <div className="MangaPage">{this.getMangaDivs()}</div>;
  }
}

export default MangaPage;
