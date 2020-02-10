import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/AdminPostCardv2'

import Post from '../models/Postv2.js'
import PostAnalytics from '../models/PostAnalytics.js'

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
      postsSubmitted: [],
      postsChanges: [],
      postsRejected: [],
      postsApproved: [],
      postsLive: [],
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
          var post = new Post(id, title, subtitle, detail_label, url, url_cropped, date, endDate, status, analytics, org, approved)
          posts.push(post)
          var dateNow = new Date()

          if ((post.status.toUpperCase() == 'SUBMITTED' || post.status.toUpperCase() == 'UPDATED')
              && dateNow < endDate && !post.approved) {
            postsSubmitted.push(post)
          }
          if (post.status.toUpperCase() == 'CHANGES' && dateNow < endDate && !post.approved) {
            postsChanges.push(post)
          }
          if (post.status.toUpperCase() == 'REJECTED' && dateNow < endDate && !post.approved) {
            postsRejected.push(post)
          }
          if (post.status.toUpperCase() == 'APPROVED' && dateNow < date && post.approved) {
            postsApproved.push(post)
          }
          if (post.status.toUpperCase() == 'APPROVED' && dateNow > date && dateNow < endDate && post.approved) {
            postsLive.push(post)
          }
        })
        posts.sort((a, b) => (a.date > b.date) ? 1 : -1)
        postsSubmitted.sort((a, b) => (a.date > b.date) ? 1 : -1)
        postsChanges.sort((a, b) => (a.date > b.date) ? 1 : -1)
        postsRejected.sort((a, b) => (a.date > b.date) ? 1 : -1)
        postsApproved.sort((a, b) => (a.date > b.date) ? 1 : -1)
        postsLive.sort((a, b) => (a.date > b.date) ? 1 : -1)
        this.setState({posts: posts})
        this.setState({postsSubmitted: postsSubmitted})
        this.setState({postsChanges: postsChanges})
        this.setState({postsRejected: postsRejected})
        this.setState({postsApproved: postsApproved})
        this.setState({postsLive: postsLive})
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

    const regularFont = "HelveticaNeue, Helvetica, sans-serif, serif";
    const mediumFont = "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif";
    const boldFont = "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif";

    var postCardsSubmitted = this.state.postsSubmitted.map(function(post) {
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
          />
      )
    })
    var postCardsChanges = this.state.postsChanges.map(function(post) {
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
          />
      )
    })
    var postCardsRejected = this.state.postsRejected.map(function(post) {
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
          />
      )
    })
    var postCardsApproved = this.state.postsApproved.map(function(post) {
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
          />
      )
    })
    var postCardsLive = this.state.postsLive.map(function(post) {
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
          />
      )
    })

    return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '99vh'}}>
        <Header isAdmin={this.state.isAdmin}/>
        <div style={{flex: 1}}>
          <div className="card" style={{padding: 20, borderRadius: 5, minHeight: '72vh'}}>
            <div className="rows is-mobile">
              <div className="column" style={{display: this.state.postsSubmitted.length > 0 ? "block" : "none", margin: "-10px 0px"}}>
                <b style={{fontFamily: mediumFont, fontSize: "28px"}}>
                Awaiting Approval
                </b>
                <div className="columns is-mobile" style={{flex: 1, flexWrap: "wrap", flexDirection: "row", margin: "20px 0px 0px 0px"}}>
                  {postCardsSubmitted}
                </div>
              </div>
              <div className="column" style={{display: this.state.postsLive.length > 0 ? "block" : "none", margin: this.state.postsSubmitted.length == 0 ? "-10px 0px" : "-15px 0px"}}>
                <b style={{fontFamily: mediumFont, fontSize: "28px"}}>
                Live
                </b>
                <div className="columns is-mobile" style={{flex: 1, flexWrap: "wrap", flexDirection: "row", margin: "20px 0px 0px 0px"}}>
                  {postCardsLive}
                </div>
              </div>
              <div className="column" style={{display: this.state.postsApproved.length > 0 ? "block" : "none", margin: (this.state.postsSubmitted.length == 0 && this.state.postsLive.length == 0) ? "-10px 0px" : "-15px 0px"}}>
                <b style={{fontFamily: mediumFont, fontSize: "28px"}}>
                Approved
                </b>
                <div className="columns is-mobile" style={{flex: 1, flexWrap: "wrap", flexDirection: "row", margin: "20px 0px 0px 0px"}}>
                  {postCardsApproved}
                </div>
              </div>
              <div className="column" style={{display: this.state.postsChanges.length > 0 ? "block" : "none", margin: (this.state.postsSubmitted.length == 0 && this.state.postsLive.length == 0 && this.state.postsApproved.length == 0) ? "-10px 0px" : "-15px 0px"}}>
                <b style={{fontFamily: mediumFont, fontSize: "28px"}}>
                Changes Requested
                </b>
                <div className="columns is-mobile" style={{flex: 1, flexWrap: "wrap", flexDirection: "row", margin: "20px 0px 0px 0px"}}>
                  {postCardsChanges}
                </div>
              </div>
              <div className="column" style={{display: this.state.postsRejected.length > 0 ? "block" : "none", margin: (this.state.postsSubmitted.length == 0 && this.state.postsLive.length == 0 && this.state.postsApproved.length == 0 && this.state.postsChanges.length == 0) ? "-10px 0px" : "-15px 0px"}}>
                <b style={{fontFamily: mediumFont, fontSize: "28px"}}>
                Rejected
                </b>
                <div className="columns is-mobile" style={{flex: 1, flexWrap: "wrap", flexDirection: "row", margin: "20px 0px 0px 0px"}}>
                  {postCardsRejected}
                </div>
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
