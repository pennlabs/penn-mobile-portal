import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import AdminPostCard from '../components/AdminPostCard'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

import '../App.sass'

const fetch = require('node-fetch')
const Cookies = require('js-cookie')
const Redirect = require('react-router-dom').Redirect

const dev = false

class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      postsSubmitted: [],
      postsChanges: [],
      postsRejected: [],
      postsApproved: [],
      postsLive: [],
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

          if (!this.state.isAdmin) {
            return <Redirect to="/" />
          }
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
        ? 'http://localhost:5000/portal/posts/all?account='
        : 'https://api.pennlabs.org/portal/posts/all?account='
      fetch(url + accountID)
        .then((response) => response.json())
        .then((json) => {
          var jsonArray = json.posts
          var posts = []
          var postsSubmitted = []
          var postsApproved = []
          var postsChanges = []
          var postsRejected = []
          var postsLive = []
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
                post.status.toUpperCase() === 'UPDATED') &&
              dateNow < endDate &&
              !post.approved
            ) {
              postsSubmitted.push(post)
            }
            if (
              post.status.toUpperCase() === 'CHANGES' &&
              dateNow < endDate &&
              !post.approved
            ) {
              postsChanges.push(post)
            }
            if (
              post.status.toUpperCase() === 'REJECTED' &&
              dateNow < endDate &&
              !post.approved
            ) {
              postsRejected.push(post)
            }
            if (
              post.status.toUpperCase() === 'APPROVED' &&
              dateNow < date &&
              post.approved
            ) {
              postsApproved.push(post)
            }
            if (
              post.status.toUpperCase() === 'APPROVED' &&
              dateNow > date &&
              dateNow < endDate &&
              post.approved
            ) {
              postsLive.push(post)
            }
          })
          posts.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsSubmitted.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsChanges.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsRejected.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsApproved.sort((a, b) => (a.date > b.date ? 1 : -1))
          postsLive.sort((a, b) => (a.date > b.date ? 1 : -1))
          this.setState({
            posts: posts,
            postsSubmitted: postsSubmitted,
            postsChanges: postsChanges,
            postsRejected: postsRejected,
            postsApproved: postsApproved,
            postsLive: postsLive,
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

    const postTypes = ['Submitted', 'Changes', 'Rejected', 'Approved', 'Live']

    postTypes.forEach((iterator) => {
      this[`postCards${iterator}`] = this.state[`posts${iterator}`].map(
        function (post) {
          return (
            <AdminPostCard
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
          minHeight: '99vh',
          backgroundColor: '#f7f7f7',
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
              top: '46%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              style={{
                display: 'block',
                wordWrap: 'break-word',
                fontSize: '26px',
              }}
            >
              No posts found.
            </span>
          </div>

          <div className="rows is-mobile" style={{ margin: '0 30px 0 30px' }}>
            <div
              className="column"
              style={{
                display:
                  this.state.postsSubmitted.length > 0 ? 'block' : 'none',
                margin: '5px 0px',
              }}
            >
              <b style={{ fontSize: '28px' }}>Awaiting Approval</b>

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
                display: this.state.postsLive.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsSubmitted.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b style={{ fontSize: '28px' }}>Live</b>

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
                display: this.state.postsApproved.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsSubmitted.length === 0 &&
                  this.state.postsLive.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b style={{ fontSize: '28px' }}>Approved</b>

              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsApproved}
              </div>
            </div>

            <div
              className="column"
              style={{
                display: this.state.postsChanges.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsSubmitted.length === 0 &&
                  this.state.postsLive.length === 0 &&
                  this.state.postsApproved.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b style={{ fontSize: '28px' }}>Changes Requested</b>

              <div
                className="columns is-mobile"
                style={{
                  flex: 1,
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  margin: '20px 0px 0px 0px',
                }}
              >
                {this.postCardsChanges}
              </div>
            </div>

            <div
              className="column"
              style={{
                display: this.state.postsRejected.length > 0 ? 'block' : 'none',
                margin:
                  this.state.postsSubmitted.length === 0 &&
                  this.state.postsLive.length === 0 &&
                  this.state.postsApproved.length === 0 &&
                  this.state.postsChanges.length === 0
                    ? '5px 0px'
                    : '-15px 0px',
              }}
            >
              <b style={{ fontSize: '28px' }}>Rejected</b>

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
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Admin
