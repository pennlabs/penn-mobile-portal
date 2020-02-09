import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import Post from './pages/Post.js'
import Admin from './pages/Admin.js'

import Homev2 from './pages/Homev2.js' // Temporary for new homepage development
import Adminv2 from './pages/Adminv2.js' // Temporary for new admin page development

import './App.sass';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/post" component={Post} />
        <Route path="/admin" component={Admin} />
        <Route path="/homev2" component={Homev2} /> {/* Temporary for new homepage development */} 
        <Route path="/adminv2" component={Adminv2} /> {/* Temporary for new admin page development */} 
        {/* when none of the above match, <NoMatch> will be rendered */}
        <Route component={Home} />
      </Switch>
    );
  }
}

export default App;
