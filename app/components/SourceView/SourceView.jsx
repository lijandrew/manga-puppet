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
      query: "",
      sourceNames: [],
      sourceName: null,
      querySourceNames: [],
      pages: [],
      pageIndex: 0,
      pageSize: 100,
      scrollTop: 0,
    };
    this.init = this.init.bind(this);
    this.query = this.query.bind(this);
    this.getSourceNameDivs = this.getSourceNameDivs.bind(this);
    this.getSourceNamesPromise = this.getSourceNamesPromise.bind(this);
    this.setSourceName = this.setSourceName.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.viewRef = React.createRef();
  }

  componentDidMount() {
    this.viewRef.current.onscroll = (event) => {
      this.setState({ scrollTop: event.target.scrollTop });
    };
    // Get sourceNames and select first one
    this.getSourceNamesPromise().then((sourceNames) => {
      this.init(sourceNames, this.state.query);
    });
  }

  // (Re)calculates query results and pagination and resets pageIndex
  init(sourceNames, query) {
    let querySourceNames = this.query(sourceNames, query);
    let pages = [];
    for (let i = 0; i < querySourceNames.length; i += this.state.pageSize) {
      pages.push(querySourceNames.slice(i, i + this.state.pageSize));
    }
    this.setState({
      sourceNames: sourceNames,
      query: query,
      querySourceNames: querySourceNames,
      pages: pages,
      pageIndex: 0,
    });
  }

  getSourceNamesPromise() {
    return ipcRenderer.invoke("get-source-names");
  }

  query(sourceNames, query) {
    return sourceNames.filter((sourceName) =>
      sourceName.toLowerCase().includes(query.toLowerCase().trim())
    );
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

  handleQueryChange(query) {
    this.init(this.state.sourceNames, query);
  }

  handlePageChange(data) {
    this.setState(
      {
        pageIndex: data.selected,
      },
      () => {
        this.viewRef.current.scrollTo(0, 0);
      }
    );
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
            <div className="View-input">
              <input
                type="text"
                value={this.state.query}
                placeholder="Search"
                onChange={(event) => {
                  this.handleQueryChange(event.target.value);
                }}
              />
              <img
                onClick={() => {
                  this.handleQueryChange("");
                }}
                src={require("../../assets/icons/x.svg")}
              />
            </div>

            {this.state.pages.length > 1 ? (
              <ReactPaginate
                previousLabel={
                  <div className="View-pagination-control">
                    <img src={require("../../assets/icons/chevron-left.svg")} />
                  </div>
                }
                nextLabel={
                  <div className="View-pagination-control">
                    <img
                      src={require("../../assets/icons/chevron-right.svg")}
                    />
                  </div>
                }
                breakLabel={"..."}
                forcePage={this.state.pageIndex}
                pageCount={this.state.pages.length}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={this.handlePageChange}
                containerClassName={"View-pagination top"}
                activeClassName={"pagination-active"}
              />
            ) : (
              ""
            )}
          </div>

          <React.Fragment>
            <div className="Viewer-title">Sources</div>
            <div className="View-list">
              {this.state.sourceNames.length === 0 ? (
                <div className="View-loading">
                  <img src={require("../../assets/images/loading.gif")} />
                </div>
              ) : (
                this.getSourceNameDivs(this.state.pages[this.state.pageIndex])
              )}
            </div>
          </React.Fragment>

          {this.state.pages.length > 1 ? (
            <ReactPaginate
              previousLabel={
                <div className="View-pagination-control">
                  <img src={require("../../assets/icons/chevron-left.svg")} />
                </div>
              }
              nextLabel={
                <div className="View-pagination-control">
                  <img src={require("../../assets/icons/chevron-right.svg")} />
                </div>
              }
              breakLabel={"..."}
              forcePage={this.state.pageIndex}
              pageCount={this.state.pages.length}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageChange}
              containerClassName={"View-pagination bottom"}
              activeClassName={"pagination-active"}
            />
          ) : (
            ""
          )}
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
