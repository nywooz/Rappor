import { library } from "@fortawesome/fontawesome-svg-core";
// Importing these specific icons:
import {
  faSearch,
  faThumbtack,
  faHeart as fasHeart
} from "@fortawesome/free-solid-svg-icons";

// Add all icons to the library so you can use it in your page
library.add(fasHeart,  faSearch, faThumbtack);
