import React, { Component } from "react";

// get our fontawesome imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../../css/searchInput.css";

export default class SearchInput extends Component {
  render() {
    return (
      <div className="search-box">
        <input
          type="text"
          name=""
          className="search-txt"
          placeholder="Type to search..."
        />
        <a className="search-btn">
          <FontAwesomeIcon icon={["fa", "search"]} />
        </a>
      </div>
    );
  }
}
