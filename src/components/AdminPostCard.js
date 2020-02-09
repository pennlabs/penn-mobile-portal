import React from 'react'

class AdminPostCard extends React.Component {
  render() {
    const props = this.props;

    var styles = {
      smallPostText: {
        fontFamily: "HelveticaNeue-Medium"
      },
      largePostText: {
        fontFamily: "HelveticaNeue-Bold",
        fontSize: "40px",
        color: "#4a4a4a"
      }
    }

    return (
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
            <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>{props.organization}</p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>
              {(props.publishDate.getMonth() + 1) + "."
              + props.publishDate.getDate() + "."
              + (props.publishDate.getFullYear() % 2000)}
            </p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>
              {(props.endDate.getMonth() + 1) + "."
              + props.endDate.getDate() + "."
              + (props.endDate.getFullYear() % 2000)}
            </p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>{props.organization}</p>
          </div>
          <div className="column has-text-centered">
            <p className="is-size-5-desktop is-size-7-mobile" style={styles.smallPostText}>{props.status}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default AdminPostCard
