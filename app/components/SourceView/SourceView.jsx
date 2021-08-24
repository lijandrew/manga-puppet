import React from "react";
const { ipcRenderer } = window.require("electron");
import { LazyLoadImage } from "react-lazy-load-image-component";

import MangaView from "../MangaView/MangaView.jsx";
import View from "../View/View.jsx";

class SourceView extends View {
  getItemsPromise() {
    return ipcRenderer.invoke("getSourceNames");
  }

  query(sourceNames, query) {
    return sourceNames.filter((sourceName) =>
      sourceName.toLowerCase().includes(query.toLowerCase().trim())
    );
  }

  getItemDivs(sourceNames) {
    if (!sourceNames) {
      return [];
    }
    let i = 1;
    return sourceNames.map((sourceName) => (
      <div
        onClick={() => {
          this.setItem(sourceName);
        }}
        key={`source-${i++}`}
        className="View-list-item"
      >
        <div className="View-list-item-cover">
          <LazyLoadImage
            className="View-list-item-cover-image"
            src={require(`../../assets/${sourceName}.jpg`)} // TODO: source cover image
          />
          <div className="View-list-item-title">{sourceName}</div>
        </div>
      </div>
    ));
  }

  getChildComponent() {
    return (
      <MangaView sourceName={this.state.item} setSourceName={this.setItem} />
    );
  }

  getBackButton() {
    return "";
  }
}

export default SourceView;
