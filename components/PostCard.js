import React from 'react'

// import css from '../styles/PostCard.css'

const styles = {
  smallPostText: {
    fontFamily: "HelveticaNeue-Medium",
  },
  largePostText: {
    fontFamily: "HelveticaNeue-Bold",
    fontSize: "40px",
  }
}

const PostCard = (props) => (
  <div className="card" style={{margin: "30px 0px", borderRadius: 5}}>
    <div className="columns is-vcentered is-mobile" style={{padding: "0px 0px"}}>
      <div className="column is-one-quarter">
        <div className="columns is-vcentered is-mobile" style={{padding: "0px 20px"}}>
          <div className="column is-flex" style={{alignItems: "center"}}>
            <img src={props.imageUrl} style={{width: "142px", height: "79px"}}/>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>{props.name}</p>
          </div>
        </div>
      </div>
      <div className="column has-text-centered">
        <p style={styles.largePostText}>{props.impressions}</p>
      </div>
      <div className="column has-text-centered">
        <p style={styles.largePostText}>{props.uniqueImpressions}</p>
      </div>
      <div className="column has-text-centered">
        <p style={styles.largePostText}>{props.interactions}</p>
      </div>
      <div className="column has-text-centered">
        <p style={styles.largePostText}>
          {(props.publishDate.getMonth() + 1) + "."
          + props.publishDate.getDate() + "."
          + (props.publishDate.getFullYear() % 2000)}
        </p>
      </div>
      <div className="column has-text-centered">
        <p style={styles.smallPostText}>{props.status}</p>
      </div>
    </div>
  </div>

)

export default PostCard
