import React, { Component } from "react";
import ReactPaginate from "react-paginate";

import "./View.scss";

class View extends Component {
  // To be implemented by child
  getItemsPromise() {}
  query(items, query) {}
  getItemDivs(items) {}
  getChildComponent() {}
  getBackButton() {}
  getTitleText() {}

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
        console.log(this.viewRef.current.scrollTop);
        this.viewRef.current.scrollTop = 0;
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
          <div className="View-header">
            {this.getBackButton()}

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
                draggable="false"
                src={require("../../assets/x.svg")}
              />
            </div>

            {this.state.pages.length > 1 ? (
              <ReactPaginate
                previousLabel={
                  <div className="View-pagination-control">
                    <img
                      draggable="false"
                      src={require("../../assets/chevron-left.svg")}
                    />
                  </div>
                }
                nextLabel={
                  <div className="View-pagination-control">
                    <img
                      draggable="false"
                      src={require("../../assets/chevron-right.svg")}
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
                activeClassName={"active"}
              />
            ) : (
              ""
            )}
          </div>

          {this.state.items.length === 0 ? (
            <div className="View-loading">
              <img
                draggable="false"
                src={require("../../assets/loading.gif")}
              />
            </div>
          ) : (
            <React.Fragment>
              <div className="Viewer-title">{this.getTitleText()}</div>
              <div className="View-list">
                {this.getItemDivs(this.state.pages[this.state.pageIndex])}
              </div>
            </React.Fragment>
          )}

          {this.state.pages.length > 1 ? (
            <ReactPaginate
              previousLabel={
                <div className="View-pagination-control">
                  <img src={require("../../assets/chevron-left.svg")} />
                </div>
              }
              nextLabel={
                <div className="View-pagination-control">
                  <img src={require("../../assets/chevron-right.svg")} />
                </div>
              }
              breakLabel={"..."}
              forcePage={this.state.pageIndex}
              pageCount={this.state.pages.length}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageChange}
              containerClassName={"View-pagination bottom"}
              activeClassName={"active"}
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

export default View;
