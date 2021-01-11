import React from 'react'
import AnalyticsCard from './AnalyticsCard'
import { Columns } from 'react-bulma-components'

const Analytics = ({ postsLive, postsPast }) => {
  return (
    <>
      <Columns vCentered={true}>
        <Columns.Column>
          <b className="is-size-4">All Posts</b>
        </Columns.Column>
      </Columns>
      <Columns>
        <Columns.Column>
          <b style={{marginLeft: '0.75rem'}}>Published</b>
        </Columns.Column>
        <Columns.Column size={6}>
          <b>Post</b>
        </Columns.Column>
        <Columns.Column>
          <b>Views</b>
        </Columns.Column>
        <Columns.Column>
          <b>Clicks</b>
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
