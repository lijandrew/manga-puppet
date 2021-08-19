import React, { Component } from 'react';

class Library extends Component {
  render() {
    if (!this.props.active) {
      return "";
    }
    return (
      <div
        className="Library"
      >
        Library
      </div>
    );
  }
}

export default Library;