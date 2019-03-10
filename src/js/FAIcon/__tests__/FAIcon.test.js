import React from "react";
import ReactDOM from "react-dom";
import App from "../index";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronRight,
  faChevronLeft,
  faHeart as fasHeart
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";

library.add(fasHeart, farHeart, faChevronRight, faChevronLeft);

it("Font Awesome Icons renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App icon="chevron-right" />, div);
  ReactDOM.render(<App icon={["fas", "heart"]} />, div);
  ReactDOM.render(<App icon={["far", "heart"]} />, div);
});
