import React, { Component } from "react";

export default class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { searchTerm, onChange, onSubmit, children } = this.props;

    return (
      <form onSubmit={onSubmit}>
        {`${children}: `}
        <input
          type="text"
          value={searchTerm}
          onChange={onChange}
          ref={(node) => {
            this.input = node;
          }}
        />
        <button type="submit">{children}</button>
      </form>
    );
  }
}
