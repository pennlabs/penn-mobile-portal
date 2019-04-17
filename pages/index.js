import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import ListLabels from '../components/ListLabels'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

class Splash extends React.Component {
  render() {
    var name = "My Application"
    var url = "http://www.dolphin.upenn.edu/pennraas/images/slide1.jpg"
    var date = new Date()
    var status = "Live"
    var analytics = new PostAnalytics(60, 50, 20)
    var post = new Post(name, url, date, status, analytics)
    var posts = []
    for (var i = 0; i < 8; i++) {
      posts[i] = post
    }
    var postCards = posts.map(function(post) {
      return <PostCard
        name={post.name}
        imageUrl={post.imageUrl}
        impressions={post.analytics.impressions}
        uniqueImpressions={post.analytics.uniqueImpressions}
        interactions={post.analytics.interactions}
        publishDate={post.publishDate}
        status={post.status} />
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
