import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
const { ipcRenderer } = window.require("electron");

import View from "../View/View.jsx";
import ChapterView from "../ChapterView/ChapterView.jsx";

class MangaView extends View {
  getItemsPromise() {
    return ipcRenderer.invoke("getMangas", this.props.sourceName);
  }

  query(mangas, query) {
    return mangas.filter((manga) =>
      manga.title.toLowerCase().includes(query.toLowerCase().trim())
    );
  }

  getItemDivs(mangas) {
    if (!mangas) {
      return [];
    }
    let i = 1;
    return mangas.map((manga) => (
      <div
        onClick={() => {
          this.setItem(manga);
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

  getChildComponent() {
    return (
      <ChapterView
        sourceName={this.props.sourceName}
        manga={this.state.item}
        setManga={this.setItem}
      />
    );
  }

  getBackButton() {
    return (
      <button
        onClick={() => {
          this.props.setSourceName(null);
        }}
      >
        Back
      </button>
    );
  }
}

export default MangaView;
