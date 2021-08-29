import React, { useState, useEffect } from "react";
const { ipcRenderer } = window.require("electron");
// const Settings = window.require("../../../engine/Settings.js");
const Settings = window.require("../engine/Settings.js");

import "./Reader.scss";

function Reader(props) {
  const [pages, setPages] = useState([]);
  const [readerSettings, setReaderSettings] = useState({});
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    ipcRenderer
      .invoke("get-pages", props.sourceName, props.chapter)
      .then((pages) => {
        setPages(pages);
      });
  }, []);

  function getPageDivs() {
    let i = 1;
    return pages.map((page) => (
      <div
        key={`page-${i++}`}
        className="Reader-list-entry"
        style={{ margin: Settings.readerSettings.margin + "px" }}
      >
        <img src={page.url} />
      </div>
    ));
  }

  return (
    <div className="Reader">
      <div
        className="View-back"
        onClick={() => {
          props.setChapter(null);
        }}
      >
        <div className="View-back-button">
          <img src={require("../../assets/icons/corner-up-left.svg")} />
        </div>
      </div>

      <div className="Reader-header">
        <ZoomIn forceUpdate={forceUpdate} />
        <ZoomOut forceUpdate={forceUpdate} />
        <IncreaseMargin forceUpdate={forceUpdate} />
        <DecreaseMargin forceUpdate={forceUpdate} />
      </div>

      {pages.length > 0 ? (
        <div
          className="Reader-list"
          style={{ width: Settings.readerSettings.zoom + "%" }}
        >
          {getPageDivs()}
        </div>
      ) : (
        <div className="Reader-loading">
          <img src={require("../../assets/images/loading.gif")} />
        </div>
      )}
    </div>
  );
}

function ZoomIn(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.zoom += Settings.readerSettings.zoomConstant;
        props.forceUpdate();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/zoom-in.svg")} />
    </div>
  );
}

function ZoomOut(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.zoom -= Settings.readerSettings.zoomConstant;
        props.forceUpdate();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/zoom-out.svg")} />
    </div>
  );
}

function IncreaseMargin(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.margin +=
          Settings.readerSettings.marginConstant;
        props.forceUpdate();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/increase-margin.svg")} />
    </div>
  );
}

function DecreaseMargin(props) {
  return (
    <div
      onClick={() => {
        Settings.readerSettings.margin -=
          Settings.readerSettings.marginConstant;
        props.forceUpdate();
      }}
      className="Reader-header-button"
    >
      <img src={require("../../assets/icons/decrease-margin.svg")} />
    </div>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(1);
  return () => setValue((value) => -1 * value);
}

export default Reader;
