import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import ListLabels from '../components/ListLabels'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

const fetch = require("node-fetch");

class Splash extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      posts: [],
    }

    this.onClick = this.onClick.bind(this)
  }

  componentWillMount() {
    var accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7'
    if (accountID) {
      fetch('https://api.pennlabs.org/portal/posts?account=' + accountID)
      .then((response) => response.json())
      .then((json) => {
        var jsonArray = json.posts
        var posts = []
        jsonArray.forEach(function (postJSON) {
          var id = postJSON.id
          var name = postJSON.title
          var url = postJSON.image_url
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
          var post = new Post(id, name, url, date, status, analytics)
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

  onClick(event) {
    const id = event.target.id
    console.log(id)

  }

  render() {
    var postCards = this.state.posts.map(function(post) {
      return (
        <a href={"post?id=" + post.id}>
          <PostCard
            id={post.id}
            name={post.name}
            imageUrl={post.imageUrl}
            analytics={post.analytics}
            publishDate={post.publishDate}
            status={post.status}
            />
        </a>
      )
    })
    return(
      <div>
        <Header />
        <div className="card" style={{ padding: 20, borderRadius: 5}}>
          <ListLabels/>
          {postCards}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Splash
