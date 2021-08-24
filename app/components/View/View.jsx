import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import ReactPaginate from "react-paginate";

import "./View.scss";

class View extends Component {
  // To be implemented by child
  getItemsPromise() {}
  query(items, query) {}
  getItemDivs(items) {}
  getChildComponent() {}
  getBackButton() {}

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      items: [],
      item: null,
      queryItems: [],
      pages: [],
      pageIndex: 0,
      pageSize: 50,
    };
    this.init = this.init.bind(this);
    this.query = this.query.bind(this);
    this.getItemDivs = this.getItemDivs.bind(this);
    this.getItemsPromise = this.getItemsPromise.bind(this);
    this.getChildComponent = this.getChildComponent.bind(this);
    this.setItem = this.setItem.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
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
      queryItems: queryItems,
      pages: pages,
      pageIndex: 0,
    });
  }

  handleQueryChange(event) {
    this.init(this.state.items, event.target.value);
  }

  handlePageChange(data) {
    this.setState({
      pageIndex: data.selected,
    });
  }

  setItem(item) {
    this.setState({
      item: item,
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className={`View${this.state.item ? " hidden" : ""}`}>
          {this.getBackButton()}

          <TextField
            onChange={this.handleQueryChange}
            id="filled-basic"
            label="Search"
            variant="filled"
          />

          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            forcePage={this.state.pageIndex}
            pageCount={this.state.pages.length}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageChange}
            containerClassName={"View-pagination"}
            activeClassName={"active"}
          />

          {this.state.items.length === 0 ? (
            <div className="View-loading">
              <img src={require("../../assets/loading.gif")} />
            </div>
          ) : (
            <div className="View-list">
              {this.getItemDivs(this.state.pages[this.state.pageIndex])}
            </div>
          )}
        </div>
        {this.state.item ? this.getChildComponent() : ""}
      </React.Fragment>
    );
  }
}

export default View;
