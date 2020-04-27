import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import Button from "./button";
import Search from "./search";
import Table from "./table";
import Spinner from "./spinner";

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
    loading: true,
  };

  setSearchTopStories = (result) => {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];

    const newHits = [...oldHits, ...hits];

    this.setState({
      loading: false,
      results: { ...results, [searchKey]: { hits: newHits, page } },
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
    axios(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(
        (result) => this._isMounted && this.setSearchTopStories(result.data)
      )
      .catch(
        (error) => this._isMounted && this.setState({ error, loading: false })
      );
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
    const { results, searchTerm, searchKey, error, loading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];

    const spinner = loading ? <Spinner /> : null;
    console.log("loading:", loading);

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
          {spinner}
          {results && <Table list={list} onDismiss={this.onDismiss} />}
          <div className="interactions">
            <Button onClick={() => this.fetchData(searchKey, page + 1)}>
              Больше историй
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
