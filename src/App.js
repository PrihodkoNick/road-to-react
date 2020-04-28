import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import Button from "./button";
import Search from "./search";
import Table from "./table";
import Loading from "./loading";

const DEFAULT_QUERY = "redux";
const DEFAULT_HPP = "10";

const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

// APP
export default class App extends Component {
  _isMounted = false;

  state = {
    searchTerm: DEFAULT_QUERY,
    results: null,
    searchKey: "",
    error: null,
    isLoading: false,
  };

  setSearchTopStories = (result) => {
    const { hits, page } = result;

    this.setState((prevState) => {
      const { searchKey, results } = prevState;

      const oldHits =
        results && results[searchKey] ? results[searchKey].hits : [];

      const newHits = [...oldHits, ...hits];

      return {
        results: {
          ...results,
          [searchKey]: { hits: newHits, page },
          isLoading: false,
        },
      };
    });
  };

  needsToSearchTopStories = (searchTerm) => {
    return !this.state.results[searchTerm];
  };

  onDismiss = (id) => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = (item) => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page },
      },
    });
  };

  onSearchChange = (evt) => {
    this.setState({ searchTerm: evt.target.value });
  };

  onSearchSubmit = (evt) => {
    console.log(this.state);
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchData(searchTerm);
    }

    evt.preventDefault();
  };

  fetchData = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(
        (result) => this._isMounted && this.setSearchTopStories(result.data)
      )
      .catch((error) => this._isMounted && this.setState({ error }));
  };

  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchData(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // APP RENDER
  render() {
    const { results, searchTerm, searchKey, error, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    if (error) {
      return <p>Something went wrong!</p>;
    }

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Поиск
          </Search>
          {results && <Table list={list} onDismiss={this.onDismiss} />}
          <div className="interactions">
            {isLoading ? (
              <Loading />
            ) : (
              <Button onClick={() => this.fetchData(searchKey, page + 1)}>
                Больше историй
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
