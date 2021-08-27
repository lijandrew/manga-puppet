import React, { Component } from "react";
import ReactPaginate from "react-paginate";
import { LazyLoadImage } from "react-lazy-load-image-component";
const { ipcRenderer } = window.require("electron");

import ChapterView from "../ChapterView/ChapterView.jsx";
import "../View/View.scss";

class MangaView extends Component {
  getItemsPromise() {
    return ipcRenderer.invoke("get-mangas", this.props.sourceName);
  }

  query(mangas, query) {
    return mangas.filter((manga) =>
      manga.title.toLowerCase().includes(query.toLowerCase().trim())
    );
  }

  getTitleText() {
    return "Browsing: " + this.props.sourceName;
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
      <div
        className="View-back"
        onClick={() => {
          this.props.setSourceName(null);
        }}
      >
        <div className="View-back-button">
          <img src={require("../../assets/icons/corner-up-left.svg")} />
        </div>
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      items: [],
      item: null,
      queryItems: [],
      pages: [],
      pageIndex: 0,
      pageSize: 100,
      scrollTop: 0,
    };
    this.init = this.init.bind(this);
    this.query = this.query.bind(this);
    this.getItemDivs = this.getItemDivs.bind(this);
    this.getItemsPromise = this.getItemsPromise.bind(this);
    this.getChildComponent = this.getChildComponent.bind(this);
    this.getTitleText = this.getTitleText.bind(this);
    this.setItem = this.setItem.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.viewRef = React.createRef();
  }

  componentDidMount() {
    this.viewRef.current.onscroll = (event) => {
      this.setState({ scrollTop: event.target.scrollTop });
    };
    // Get items and select first one
    this.getItemsPromise().then((items) => {
      this.init(items, this.state.query);
    });
  }

  // (Re)calculates query results and pagination and resets pageIndex
  init(items, query) {
    let queryItems = this.query(items, query);
    let pages = [];
    for (let i = 0; i < queryItems.length; i += this.state.pageSize) {
      pages.push(queryItems.slice(i, i + this.state.pageSize));
    }
    this.setState({
      items: items,
      query: query,
      queryItems: queryItems,
      pages: pages,
      pageIndex: 0,
    });
  }

  handleQueryChange(query) {
    this.init(this.state.items, query);
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

  setItem(item) {
    this.setState({
      item: item,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div
          ref={this.viewRef}
          className={`View${this.state.item ? " hidden" : ""}`}
        >
          {this.getBackButton()}
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
            <div className="Viewer-title">{this.getTitleText()}</div>
            <div className="View-list">
              {this.state.items.length === 0 ? (
                <div className="View-loading">
                  <img src={require("../../assets/images/loading.gif")} />
                </div>
              ) : (
                this.getItemDivs(this.state.pages[this.state.pageIndex])
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
        {this.state.item ? this.getChildComponent() : ""}
      </React.Fragment>
    );
  }
}

export default MangaView;
