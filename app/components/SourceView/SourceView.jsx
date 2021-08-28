import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { LazyLoadImage } from "react-lazy-load-image-component";
const { ipcRenderer } = window.require("electron");

import MangaView from "../MangaView/MangaView.jsx";
import "../View/View.scss";

class SourceView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceNames: [],
      sourceName: null,
      scrollTop: 0,
    };
    this.getSourceNameDivs = this.getSourceNameDivs.bind(this);
    this.getSourceNamesPromise = this.getSourceNamesPromise.bind(this);
    this.setSourceName = this.setSourceName.bind(this);

    this.viewRef = React.createRef();
  }

  componentDidMount() {
    this.viewRef.current.onscroll = (event) => {
      this.setState({ scrollTop: event.target.scrollTop });
    };
    // Get sourceNames and select first one
    this.getSourceNamesPromise().then((sourceNames) => {
      this.setState({
        sourceNames: sourceNames,
      });
    });
  }

  getSourceNamesPromise() {
    return ipcRenderer.invoke("get-source-names");
  }

  getSourceNameDivs(sourceNames) {
    if (!sourceNames) {
      return [];
    }
    let i = 1;
    return sourceNames.map((sourceName) => (
      <div
        onClick={() => {
          this.setSourceName(sourceName);
        }}
        className="View-list-item"
        key={`source-${i++}`}
      >
        <div className="View-list-item-cover">
          <LazyLoadImage
            className="View-list-item-cover-image"
            src={require(`../../assets/sources/${sourceName}.jpg`)}
          />
          <div className="View-list-item-title">{sourceName}</div>
        </div>
      </div>
    ));
  }

  setSourceName(sourceName) {
    this.setState({
      sourceName: sourceName,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div
          ref={this.viewRef}
          className={`View${this.state.sourceName ? " hidden" : ""}`}
        >
          <div
            onClick={() => {
              this.viewRef.current.scrollTo(0, 0);
            }}
            className={`View-scrollTop${
              this.state.scrollTop > 0 ? " visible" : ""
            }`}
          >
            <div className="View-scrollTop-button">
              <img src={require("../../assets/icons/arrow-up.svg")} />
            </div>
          </div>

          <div className="View-header">
            <div className="View-header-title">Welcome to Manga Puppet!</div>
            <div className="View-header-subtitle">
              Pick a source to get started
            </div>
          </div>

          <div className="View-list">
            {this.state.sourceNames.length === 0 ? (
              <div className="View-loading">
                <img src={require("../../assets/images/loading.gif")} />
              </div>
            ) : (
              this.getSourceNameDivs(this.state.sourceNames)
            )}
          </div>
        </div>

        {this.state.sourceName ? (
          <MangaView
            sourceName={this.state.sourceName}
            setSourceName={this.setSourceName}
          />
        ) : (
          ""
        )}
      </React.Fragment>
    );
  }
}

export default SourceView;
