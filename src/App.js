import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Home from './pages/Home.js'
import Post from './pages/Post.js'

import './App.sass';

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
