import React from 'react'

const PostCard = (props) => (
  <div className="card" style={{margin: "20px 0px", borderRadius: 5}}>
    <div className="columns" style={{padding: "20px 0px"}}>
      <div className="column has-text-centered">
        <p>{props.prop}</p>
      </div>
      <div className="column has-text-centered">
        <p> Thing!</p>
      </div>
      <div className="column has-text-centered">
        <p> Word!</p>
      </div>
      <div className="column has-text-centered">
        <p> Button!</p>
      </div>
      <div className="column has-text-centered">
        <p> Yay!</p>
      </div>
    </div>
  </div>

)

export default PostCard
