import React, { Component } from 'react'
import Widget from './Widget';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route path="/" exact component={Widget} />
          </Switch>
        </Router>
      </div>
    )
  }
}
