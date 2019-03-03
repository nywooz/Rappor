import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./materialUI/dashboard/Dashboard";

import MuiBtns from "./materialUI/MaterialUITest";
import cards from "./materialUI/MaterialUICards";


import SignIn from "./materialUI/SignIn";
import RGL from "./Dynamic-add-remove";
import PaperBase from "./paperbase/PaperBase";
import Blank from "./pages/Blank";
import SearchInput from "./components/SearchInput";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/signIn" component={SignIn} />
      <Route path="/dashboard" component={RGL} />
      <Route path="/paperbase" component={PaperBase} />
      <Route path="/blank" component={Blank} />
      <Route path="/searchInput" component={SearchInput} />
      <Route path="/materialui" component={MuiBtns} />
      <Route path="/materialui1" component={cards} />
      <Route path="/materialui2" component={MuiBtns} />
      <Route path="/materialui3" component={MuiBtns} />
      <Route path="/materialui4" component={MuiBtns} />
      <Route path="/materialui5" component={MuiBtns} />

      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
