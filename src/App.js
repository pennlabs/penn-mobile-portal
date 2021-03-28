import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from './pages/Login.js'
import Home from './pages/Home.js'
import Post from './pages/Post.js'
import Admin from './pages/Admin.js'
import Poll from './pages/Poll.js'

import './App.sass'

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/post" component={Post} />
        <Route path="/admin" component={Admin} />
        <Route path="/polls" component={Poll} />
        {/* when none of the above match, <NoMatch> will be rendered */}
        <Route component={Home} />
      </Switch>
    )
  }
}

export default App
