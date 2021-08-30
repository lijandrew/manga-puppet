import React, { Component } from "react";

import "../View/View.scss";
import "./Favorites.scss";

class Favorites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
    };
  }

  getMangaDivs(mangas) {
    if (!mangas) {
      return [];
    }
    let i = 1;
    return mangas.map((manga) => (
      <div
        onClick={() => {
          this.setManga(manga);
        }}
        key={`manga-${i++}`}
        className="View-list-item"
      >
        <div className="View-list-item-cover">
          <LazyLoadImage
            className="View-list-item-cover-image"
            src={manga.coverImageUrl}
          />
          <div className="View-list-item-title">{manga.title}</div>
        </div>
      </div>
    ));
  }
  render() {
    return <div className="Favorites"></div>;
  }
}

export default Favorites;
