import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import ListLabels from '../components/ListLabels'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

import '../App.sass';

const fetch = require("node-fetch");
const Cookies = require("js-cookie");
const Redirect = require("react-router-dom").Redirect;

const dev = false;

class Home extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      posts: [],
    }
  }

  componentWillMount() {
    var accountID = Cookies.get('accountID')
    if (accountID) {
      var url = dev ? 'localhost:5000/portal/posts?account=' : 'https://api.pennlabs.org/portal/posts?account='
      fetch(url + accountID)
      .then((response) => response.json())
      .then((json) => {
        var jsonArray = json.posts
        var posts = []
        jsonArray.forEach(function (postJSON) {
          var id = postJSON.id
          var name = postJSON.title
          var url = postJSON.image_url
          var url_cropped = postJSON.image_url_cropped//
          var dateStr = postJSON.start_date
          var date = new Date(dateStr)
          var status = postJSON.status
          var impr = postJSON.impressions
          var uniqueImpr = postJSON.unique_impressions
          var interactions = postJSON.interactions
          var analytics = null
          if (impr && uniqueImpr && interactions) {
            analytics = new PostAnalytics(impr, uniqueImpr, interactions)
          }
          var post = new Post(id, name, url, url_cropped, date, status, analytics)//
          posts.push(post)
        })
        posts.sort((a, b) => (a.date > b.date) ? 1 : -1)
        this.setState({posts: posts})
      })
      .catch((error) => {
        console.log('Unable to fetch posts with error message:' + error.message)
      })
    }
  }


  render() {
    if (!Cookies.get('accountID')) {
      return (
        <Redirect to="/login" />
      )
    }

    if (this.state.posts.length === 0) {
      var postCards = 'No posts found'
    } else {
      var postCards = this.state.posts.map(function(post) {
        return (
          <a href={"post?id=" + post.id}>
            <PostCard
              id={post.id}
              name={post.name}
              imageUrl={post.imageUrlCropped}//
              analytics={post.analytics}
              publishDate={post.publishDate}
              status={post.status}
              />
          </a>
        )
      })
    }
    return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '99vh'}}>
        <Header />
        <div style={{flex: 1}}>
          <div className="card" style={{padding: 20, borderRadius: 5, minHeight: '72vh'}}>
            <ListLabels/>
            <div style={{margin: "25px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
              <center>{postCards}</center>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
