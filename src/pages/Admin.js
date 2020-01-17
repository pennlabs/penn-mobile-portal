import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdminPostCard from '../components/AdminPostCard'
import AdminListLabels from '../components/AdminListLabels'

import Post from '../models/Post.js'

import '../App.sass';

const fetch = require("node-fetch");
const Cookies = require("js-cookie");
const Redirect = require("react-router-dom").Redirect;

const dev = false;

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      isAdmin: false
    }
  }

  componentWillMount() {
    var accountID = Cookies.get('accountID')
    if (accountID) {
      var url = dev ? 'http://localhost:5000/portal/account?account_id=' : 'https://api.pennlabs.org/portal/account?account_id='
      fetch(url + accountID)
      .then((response) => response.json())
      .then((json) => {
        this.setState({isAdmin: json.account.is_admin})

        if (!this.state.isAdmin) {
          return (
            <Redirect to="/" />
          )
        }
      })
      .catch((error) => {
        console.log('Unable to fetch account inforation with error message:' + error.message)
      })
    }

    if (accountID) {
      var url = dev ? 'http://localhost:5000/portal/posts/all?account=' : 'https://api.pennlabs.org/portal/posts/all?account='
      fetch(url + accountID)
      .then((response) => response.json())
      .then((json) => {
        var jsonArray = json.posts
        var posts = []
        jsonArray.forEach(function (postJSON) {
          var id = postJSON.id
          var name = postJSON.title
          var org = postJSON.organization
          var url = postJSON.image_url
          var url_cropped = postJSON.image_url_cropped
          var dateStr = postJSON.start_date
          var date = new Date(dateStr)
          var status = postJSON.status
          var analytics = null
          var post = new Post(id, name, url, url_cropped, date, status, analytics, org)
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
      var postCards = 'Loading posts...'
    } else {
      var postCards = this.state.posts.map(function(post) {
        return (
          <a href={"post?id=" + post.id}>
            <AdminPostCard
              id={post.id}
              name={post.name}
              imageUrl={post.imageUrlCropped}
              organization={post.organization}
              publishDate={post.publishDate}
              status={post.status}
              />
          </a>
        )
      })
    }

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '99vh'}}>
        <Header isAdmin={this.state.isAdmin}/>
        <div style={{flex: 1}}>
          <div className="card" style={{padding: 20, borderRadius: 5, minHeight: '72vh'}}>
            <AdminListLabels />
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

export default Admin
