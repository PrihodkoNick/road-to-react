import axios from "axios";

export default class HackerNewsService {
  DEFAULT_QUERY = "redux";
  DEFAULT_HPP = "10";

  _url = `https://hn.algolia.com/api/v1/search/
      query=${this.props.query}&page=${this.props.page}&hitsPerPage=${this.DEFAULT_HPP}`;

  fetchData = () => {
    const res = axios(this._url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${this._url}, received ${res.status}`);
    }

    return res;
  };
}
