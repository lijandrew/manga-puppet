import React, { Component } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ReactPaginate from "react-paginate";
const { ipcRenderer } = window.require("electron");
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@material-ui/core";

import ChapterView from "../ChapterView/ChapterView.jsx";
import "./MangaView.scss";

class MangaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceNames: [],
      sourceName: "",
      query: "",
      manga: null,
      mangas: [],
      queryMangas: [],
      pages: [],
      pageIndex: 0,
      pageSize: 50,
    };
    this.init = this.init.bind(this);
    this.getMangasPromise = this.getMangasPromise.bind(this);
    this.getSourceNamesPromise = this.getSourceNamesPromise.bind(this);
    this.getMangaDivs = this.getMangaDivs.bind(this);
    this.setManga = this.setManga.bind(this);
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);

    this.listRef = React.createRef();
  }

  componentDidMount() {
    this.getSourceNamesPromise().then((sourceNames) => {
      this.setState(
        {
          sourceNames: sourceNames,
          sourceName: sourceNames[0],
        },
        () => {
          this.getMangasPromise().then((mangas) => {
            this.init(mangas, this.state.query);
          });
        }
      );
    });
  }

  // (Re)calculate query results and pagination and resets pageIndex
  init(mangas, query) {
    let queryMangas = mangas.filter((manga) =>
      manga.title.toLowerCase().includes(query.toLowerCase().trim())
    );
    let pages = [];
    for (let i = 0; i < queryMangas.length; i += this.state.pageSize) {
      pages.push(queryMangas.slice(i, i + this.state.pageSize));
    }
    this.setState({
      mangas: mangas,
      queryMangas: queryMangas,
      pages: pages,
      pageIndex: 0,
    });
  }

  getSourceNamesPromise() {
    return ipcRenderer.invoke("getSourceNames");
  }

  getMangasPromise() {
    return ipcRenderer.invoke("getMangas", this.state.sourceName);
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
        className="MangaView-list-item"
      >
        <div className="MangaView-list-item-cover">
          <LazyLoadImage
            className="MangaView-list-item-cover-image"
            src={manga.coverImageUrl}
          />
          <div className="MangaView-list-item-title">{manga.title}</div>
        </div>
      </div>
    ));
  }

  setManga(manga) {
    this.setState({
      manga: manga,
    });
  }

  handleQueryChange(event) {
    this.init(this.state.mangas, event.target.value);
  }

  handlePageChange(data) {
    this.setState(
      {
        pageIndex: data.selected,
      },
      () => {
        // Scroll back to top on page change
        this.listRef.current.scrollTop = 0;
      }
    );
  }

  // Needs more testing once I get another source
  handleSourceChange(event) {
    this.setState(
      {
        sourceName: event.target.value,
      },
      () => {
        this.getMangasPromise().then((mangas) => {
          this.init(mangas, this.state.query);
        });
      }
    );
  }

  render() {
    return (
      <div className="MangaView">
        <div className="MangaView-header">
          <FormControl variant="filled">
            <InputLabel htmlFor="source-select">Source</InputLabel>
            <Select
              labelId="source-select"
              value={this.state.sourceName}
              onChange={this.handleSourceChange}
              className="MangaView-Select"
            >
              {(() => {
                let i = 1;
                let divs = this.state.sourceNames.map((sourceName) => {
                  return (
                    <MenuItem key={`MenuItem-${i++}`} value={sourceName}>
                      {sourceName}
                    </MenuItem>
                  );
                });
                divs.unshift(
                  <MenuItem key="MenuItem-0" value="">
                    None
                  </MenuItem>
                );
                return divs;
              })()}
            </Select>
          </FormControl>

          <TextField
            onChange={this.handleQueryChange}
            id="filled-basic"
            label="Search"
            variant="filled"
            className="MangaView-TextField"
          />
        </div>

        {this.state.mangas.length === 0 ? (
          <div className="MangaView-loading">
            <img src={require("../../assets/loading.gif")} />
          </div>
        ) : (
          <React.Fragment>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              breakLabel={"..."}
              forcePage={this.state.pageIndex}
              pageCount={this.state.pages.length}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageChange}
              containerClassName={"MangaView-pagination"}
              activeClassName={"active"}
            />

            <div ref={this.listRef} className="MangaView-list">
              {this.getMangaDivs(this.state.pages[this.state.pageIndex])}
            </div>
          </React.Fragment>
        )}

        {this.state.manga ? (
          <ChapterView
            sourceName={this.state.sourceName}
            manga={this.state.manga}
            setManga={this.setManga}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default MangaView;
