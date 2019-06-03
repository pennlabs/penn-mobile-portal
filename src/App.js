import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Home from './pages/Home.js'
import Post from './pages/Post.js'

import './App.sass';

import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';
//https://reacttraining.com/react-router/web/guides/basic-components

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/post" component={Post} />
        {/* when none of the above match, <NoMatch> will be rendered */}
        <Route component={Home} />
      </Switch>
    );
  }
}

export default App;
