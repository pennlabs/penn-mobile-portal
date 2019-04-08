import React from 'react'

const PostCard = (props) => (
  <div className="card" style={{margin: "20px 0px", borderRadius: 5}}>
    <div className="columns" style={{padding: "20px 0px"}}>
      <div className="column has-text-centered">
        <p>{props.name}</p>
      </div>
      <div className="column has-text-centered">
        <p>{props.impressions}</p>
      </div>
      <div className="column has-text-centered">
        <p>{props.uniqueImpressions}</p>
      </div>
      <div className="column has-text-centered">
        <p>{props.interactions}</p>
      </div>
      <div className="column has-text-centered">
        <p>{props.publishDate.toLocaleDateString("en-US")}</p>
      </div>
      <div className="column has-text-centered">
        <p>{props.status}</p>
      </div>
    </div>
  </div>

)

export default PostCard
