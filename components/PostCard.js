import React from 'react'
import '../styles/PostCard.css';

const PostCard = (props) => (
  <div className="card" style={{margin: "20px 0px", borderRadius: 5}}>
    <div className="columns is-vcentered" style={{padding: "0px 0px"}}>
      <div className="column is-one-quarter">
        <div className="columns is-vcentered" style={{padding: "0px 20px"}}>
          <div className="column has-text-centered">
            <img src={props.imageUrl} style={{width: "142px", height: "79px"}}/>
          </div>
          <div className="column has-text-centered">
            <p className="PostText"> {props.name} </p>
          </div>
        </div>
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
