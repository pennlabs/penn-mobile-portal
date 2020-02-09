import React from 'react'

class PostCard extends React.Component {
  render() {
    const props = this.props;
    var impressions = props.analytics ? props.analytics.impressions : 0
    var uniqueImpressions = props.analytics ? props.analytics.uniqueImpressions : 0
    var interactions = props.analytics ? props.analytics.interactions : 0
    var color = props.analytics ? "#4a4a4a" : "#d8d8d8"

    var styles = {
      smallPostText: {
        fontFamily: "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif"
      },
      largePostText: {
        fontFamily: "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif",
        fontSize: "40px",
        color: color
      }
    }

    return(
      <div className="card" style={{margin: "30px 0px", borderRadius: 5}}>
        <div className="columns is-vcentered is-mobile" style={{padding: "0px 0px"}}>
          <div className="column is-one-quarter">
            <div className="columns is-vcentered is-mobile" style={{padding: "0px 20px"}}>
              <div className="column is-flex" style={{alignItems: "center"}}>
                <img src={props.imageUrl} style={{width: "144px", height: "72px"}}/>
              </div>
              <div className="column has-text-centered">
                <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>{props.name}</p>
              </div>
            </div>
          </div>
          <div className="column has-text-centered">
            <p style={styles.largePostText}>{impressions}</p>
          </div>
          <div className="column has-text-centered">
            <p style={styles.largePostText}>{uniqueImpressions}</p>
          </div>
          <div className="column has-text-centered">
            <p style={styles.largePostText}>{interactions}</p>
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
  }
}

export default PostCard
