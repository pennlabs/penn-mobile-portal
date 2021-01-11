import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import NoPostsMessage from '../components/NoPostsMessage'
import Analytics from '../components/Analytics'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

import Select from 'react-select'
import styled from 'styled-components'
import { WHITE, GRAY, RED, YELLOW, PURPLE, MEDIUM_BLUE } from '../colors.js'
import '../App.sass'

const fetch = require('node-fetch')
const Cookies = require('js-cookie')
const Redirect = require('react-router-dom').Redirect

const dev = false

const viewModeStyle = {
  container: (provided) => ({
    ...provided,
    width: 95,
  }),
  control: (provided) => ({
    ...provided,
    background: MEDIUM_BLUE,
    borderRadius: '100px',
    minHeight: '32px',
  }),
  singleValue: (base) => ({
    ...base,
    color: WHITE,
    marginLeft: 6,
    fontWeight: 600,
  }),
}

const viewModeOptions = [
  { value: 'Content', label: 'Content' },
  { value: 'Analytics', label: 'Analytics' },
]

const PostWrapper = styled.div`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  margin: 20px 0px 0px 0px;
`

const ColorKeyRect = styled.rect`
  fill: ${(props) => props.color};
  width: 15px;
  height: 15px;
  rx: 3px;
`

const ColorKeySpan = styled.span`
  font-weight: bold;
  font-size: 13px;
  color: ${GRAY};
  margin: 0 12px 0 6px;
`

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
      viewMode: 'Content',
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
          {this.state.finishedLoading && this.state.posts.length === 0 && (
            <NoPostsMessage />
          )}
          <div className="container is-fluid" style={{ margin: '48px 72px' }}>
            <div className="columns is-pulled-right is-vcentered">
              {this.state.viewMode === 'Analytics' &&
                this.state.posts.length !== 0 && (
                  <>
                    <svg width="15" height="15">
                      <ColorKeyRect color={YELLOW} />
                    </svg>
                    <ColorKeySpan> Views </ColorKeySpan>
                    <svg width="15" height="15">
                      <ColorKeyRect color={RED} />
                    </svg>
                    <ColorKeySpan> Unique Views </ColorKeySpan>
                    <svg width="15" height="15">
                      <ColorKeyRect color={PURPLE} />
                    </svg>
                    <ColorKeySpan> Clicks </ColorKeySpan>
                  </>
                )}
              <div className="column">
                <b>View Mode: </b>
              </div>
              <div className="column" style={{ padding: '12px 0' }}>
                <Select
                  components={{
                    DropdownIndicator: () => null,
                    IndicatorSeparator: () => null,
                  }}
                  styles={viewModeStyle}
                  options={viewModeOptions}
                  defaultValue={viewModeOptions[0]}
                  isSearchable={false}
                  onChange={(e) =>
                    this.setState({
                      viewMode: e.value,
                    })
                  }
                />
              </div>
              <span
                className="icon"
                style={{ color: MEDIUM_BLUE, fontSize: '1.5rem' }}
              >
                <i className="fas fa-angle-down"></i>
              </span>
            </div>
            {this.state.viewMode === 'Analytics' &&
              this.state.posts.length !== 0 && (
                <Analytics
                  postsLive={this.state.postsLive}
                  postsPast={this.state.postsPast}
                />
              )}
            {this.state.viewMode === 'Content' && (
              <>
                <div
                  className="column"
                  style={{
                    display: this.state.postsLive.length > 0 ? 'block' : 'none',
                  }}
                >
                  <b className="is-size-4">Live</b>
                  <PostWrapper className="columns is-mobile">
                    {this.postCardsLive}
                  </PostWrapper>
                </div>
                <div
                  className="column"
                  style={{
                    display:
                      this.state.postsSubmitted.length > 0 ? 'block' : 'none',
                    margin:
                      this.state.postsLive.length === 0
                        ? '5px 0px'
                        : '-10px 0px',
                  }}
                >
                  <b className="is-size-4">Submitted</b>

                  <PostWrapper className="columns is-mobile">
                    {this.postCardsSubmitted}
                  </PostWrapper>
                </div>

                <div
                  className="column"
                  style={{
                    display:
                      this.state.postsRejected.length > 0 ? 'block' : 'none',
                    margin:
                      this.state.postsLive.length === 0 &&
                      this.state.postsSubmitted.length === 0
                        ? '5px 0px'
                        : '-15px 0px',
                  }}
                >
                  <b className="is-size-4">Rejected</b>
                  <PostWrapper className="columns is-mobile">
                    {this.postCardsRejected}
                  </PostWrapper>
                </div>

                <div
                  className="column"
                  style={{
                    display:
                      this.state.postsDrafts.length > 0 ? 'block' : 'none',
                    margin:
                      this.state.postsLive.length === 0 &&
                      this.state.postsSubmitted.length === 0 &&
                      this.state.postsRejected.length === 0
                        ? '5px 0px'
                        : '-15px 0px',
                  }}
                >
                  <b className="is-size-4">Drafts</b>
                  <PostWrapper className="columns is-mobile">
                    {this.postCardsDrafts}
                  </PostWrapper>
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
                  <b className="is-size-4">Past Posts</b>
                  <PostWrapper className="columns is-mobile">
                    {this.postCardsPast}
                  </PostWrapper>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Home
