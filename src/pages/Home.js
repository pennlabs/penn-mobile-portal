import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

import '../App.sass'

const fetch = require('node-fetch')
const Cookies = require('js-cookie')
const Redirect = require('react-router-dom').Redirect

const dev = false

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      postsSubmitted: [],
      postsRejected: [],
      postsDrafts: [],
      postsLive: [],
      postsPast: [],
      isAdmin: false,
      finishedLoading: false,
    }
  }

  componentDidMount() {
    var accountID = Cookies.get('accountID')
    if (accountID) {
      var url = dev
        ? 'http://localhost:5000/portal/account?account_id='
        : 'https://api.pennlabs.org/portal/account?account_id='
      fetch(url + accountID)
        .then((response) => response.json())
        .then((json) => {
          this.setState({ isAdmin: json.account.is_admin })
        })
        .catch((error) => {
          console.log(
            'Unable to fetch account inforation with error message:' +
              error.message
          )
        })
    }

    if (accountID) {
      url = dev
        ? 'http://localhost:5000/portal/posts?account='
        : 'https://api.pennlabs.org/portal/posts?account='
      fetch(url + accountID)
        .then((response) => response.json())
        .then((json) => {
          var jsonArray = json.posts
          var posts = []
          var postsSubmitted = []
          var postsRejected = []
          var postsDrafts = []
          var postsLive = []
          var postsPast = []
          jsonArray.forEach(function (postJSON) {
            var id = postJSON.id
            var title = postJSON.title
            var subtitle = postJSON.subtitle
            var detail_label = postJSON.time_label
            var org = postJSON.organization
            var url = postJSON.image_url
            var url_cropped = postJSON.image_url_cropped
            var dateStr = postJSON.start_date
            var date = new Date(dateStr)
            var endDateStr = postJSON.end_date
            var endDate = new Date(endDateStr)
            var status = postJSON.status
            var approved = postJSON.approved
            var impr = postJSON.impressions
            var uniqueImpr = postJSON.unique_impressions
            var interactions = postJSON.interactions
            var analytics = null
            if (impr && uniqueImpr && interactions) {
              analytics = new PostAnalytics(impr, uniqueImpr, interactions)
            }
            var post = new Post(
              id,
              title,
              subtitle,
              detail_label,
              url,
              url_cropped,
              date,
              endDate,
              status,
              analytics,
              org,
              approved
            )
            posts.push(post)
            var dateNow = new Date()

            if (
              (post.status.toUpperCase() === 'SUBMITTED' ||
                post.status.toUpperCase() === 'UPDATED' ||
                post.status.toUpperCase() === 'CHANGES' ||
                post.status.toUpperCase() === 'APPROVED') &&
              dateNow < endDate
            ) {
              postsSubmitted.push(post)
            }
            if (
              post.status.toUpperCase() === 'REJECTED' &&
              dateNow < endDate &&
              !post.approved
            ) {
              postsRejected.push(post)
            }
            if (post.status.toUpperCase() === 'DRAFT') {
              postsDrafts.push(post)
            }
            if (
              post.status.toUpperCase() === 'APPROVED' &&
              dateNow > date &&
              dateNow < endDate &&
              post.approved
            ) {
              postsLive.push(post)
            }
            if (post.status.toUpperCase() !== 'DRAFT' && dateNow > endDate) {
              postsPast.push(post)
            }
          })
          posts.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsSubmitted.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsRejected.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsDrafts.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsLive.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsPast.sort((a, b) => (a.endDate < b.endDate ? 1 : -1))
          this.setState({
            posts: posts,
            postsSubmitted: postsSubmitted,
            postsRejected: postsRejected,
            postsDrafts: postsDrafts,
            postsLive: postsLive,
            postsPast: postsPast,
            finishedLoading: true,
          })
        })
        .catch((error) => {
          console.log(
            'Unable to fetch posts with error message:' + error.message
          )
        })
    }
  }

  render() {
    if (!Cookies.get('accountID')) {
      return <Redirect to="/login" />
    }

    const postTypes = ['Submitted', 'Rejected', 'Drafts', 'Live', 'Past']

    postTypes.forEach((iterator) => {
      this[`postCards${iterator}`] = this.state[`posts${iterator}`].map(
        function (post) {
          return (
            <PostCard
              id={post.id}
              title={post.title}
              subtitle={post.subtitle}
              detailLabel={post.detailLabel}
              source={post.organization}
              imageUrl={post.imageUrlCropped}
              analytics={post.analytics}
              publishDate={post.publishDate}
              endDate={post.endDate}
              status={post.status}
              approved={post.approved}
              key={post.id}
            />
          )
        }
      )
    })

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          minHeight: '100vh',
        }}
      >
        <Header isAdmin={this.state.isAdmin} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display:
                this.state.finishedLoading && this.state.posts.length === 0
                  ? 'block'
                  : 'none',
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="columns is-mobile">
              <div className="row">
                <img
                  src="images/desk.svg"
                  alt="Penn Mobile Logo"
                  width="366"
                  height="321"
                ></img>
              </div>

              <div className="row" style={{ margin: '0 0 0 50px' }}>
                <h2 className="title is-2">Oh, hello there.</h2>
                <span
                  style={{
                    display: 'block',
                    wordWrap: 'break-word',
                    fontSize: '20px',
                    margin: '10px 0 5px 0',
                  }}
                >
                  Looks like you're new here.
                </span>

                <span
                  style={{
                    display: 'block',
                    wordWrap: 'break-word',
                    fontSize: '20px',
                    maxWidth: '500px',
                  }}
                >
                  Penn Mobile Portal allows organizations to connect and engage
                  with students on the Penn Mobile app. Make posts for
                  recruiting, events, or campaigns and watch in real time as
                  users see and interact with your content.
                </span>

                <span
                  style={{
                    display: 'block',
                    wordWrap: 'break-word',
                    fontSize: '20px',
                    margin: '15px 0 5px 0',
                  }}
                >
                  Ready to get started?{' '}
                  <a href="/post">
                    Create a new post{' '}
                    <i
                      className="fas fa-arrow-circle-right"
                      style={{
                        fontSize: '17px',
                        paddingBottom: 3,
                        verticalAlign: 'middle',
                      }}
                    ></i>
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="rows is-mobile" style={{ margin: '0 30px 0 30px' }}>
            <div
              className="column"
              style={{
                display: this.state.postsLive.length > 0 ? 'block' : 'none',
                margin: '5px 0px',
              }}
            >
              <b className="is-size-3">Live</b>
              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsLive}
              </div>
            </div>
            <div
              className="column"
              style={{
                display:
                  this.state.postsSubmitted.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsLive.length === 0 ? '5px 0px' : '-15px 0px',
              }}
            >
              <b className="is-size-3">Submitted</b>

              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsSubmitted}
              </div>
            </div>

            <div
              className="column"
              style={{
                display: this.state.postsRejected.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsLive.length === 0 &&
                  this.state.postsSubmitted.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b className="is-size-3">Rejected</b>

              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsRejected}
              </div>
            </div>

            <div
              className="column"
              style={{
                display: this.state.postsDrafts.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsLive.length === 0 &&
                  this.state.postsSubmitted.length === 0 &&
                  this.state.postsRejected.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b className="is-size-3">Drafts</b>

              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsDrafts}
              </div>
            </div>

            <div
              className="column"
              style={{
                display: this.state.postsPast.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsLive.length === 0 &&
                  this.state.postsSubmitted.length === 0 &&
                  this.state.postsRejected.length === 0 &&
                  this.state.postsDrafts.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b className="is-size-3">Past Posts</b>

              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsPast}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
