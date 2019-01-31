import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Dashboard from "./materialUI/dashboard/Dashboard";
import Index from "./materialUI/MaterialUITest";
import SignIn from "./materialUI/SignIn";
import RGL from "./Dynamic-add-remove";
import PaperBase from "./paperbase/PaperBase";
import Blank from "./pages/Blank";

const Router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route path="/signIn" component={SignIn} />
      <Route path="/dashboard" component={RGL} />
      <Route path="/paperbase" component={PaperBase} />
      <Route path="/blank" component={Blank} />
      <Route path="/materialui" component={Index} />

      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default Router;
