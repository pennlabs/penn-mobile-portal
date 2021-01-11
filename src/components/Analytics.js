import React from 'react'
import AnalyticsCard from './AnalyticsCard'
import { Columns } from 'react-bulma-components'

const Analytics = ({ postsLive, postsPast }) => {
  return (
    <>
      <div style={{ margin: '20px 0px' }}>
        <b className="is-size-4">All Posts</b>
      </div>
      <Columns>
        <Columns.Column>
          <b>Published</b>
        </Columns.Column>
        <Columns.Column size={6}>
          <b>Post</b>
        </Columns.Column>
        <Columns.Column>
          <b>Views</b>
        </Columns.Column>
        <Columns.Column>
          <b>Interactions</b>
        </Columns.Column>
      </Columns>
      {postsLive.map((post) => (
        <AnalyticsCard post={post} live={true} key={post.id} />
      ))}
      {postsPast.map((post) => (
        <AnalyticsCard post={post} live={false} key={post.id} />
      ))}
    </>
  )
}

export default Analytics
