import React from 'react'

class PostStatusVisibility extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isLive: false,
    }

    this.setOffline = this.setOffline.bind(this)
    this.setOnline = this.setOnline.bind(this)
  }

  setOffline() {
    this.setState({isLive: false})
    this.props.notifyChange({isLive: false})
  }

  setOnline() {
    this.setState({isLive: true})
    this.props.notifyChange({isLive: true})
  }

  render() {
    var buttons;
    if (this.props.isApproved) {
      buttons = (
        <div className="column has-text-centered">
          <a className="button" disabled={this.state.isLive} onClick={this.setOnline} style={{marginRight: 8, width: 80}}>Live</a>
          <a className="button" disabled={!this.state.isLive} onClick={this.setOffline} style={{marginLeft: 8, width: 80}}>Offline</a>
        </div>
      )
    } else {
      buttons = (
        <div className="column has-text-centered">
          <a className="button" style={{width: 80}} disabled>Offline</a>
        </div>
      )
    }
    return(
      <div>
        <div className="columns is-mobile is-vcentered" style={{margin: "10px 12px 0px 12px", height: 50}}>
          <div className="column is-one-third">
            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "20px"}}>Status:</b>
          </div>
          <div className="column has-text-centered">
            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "16px", textAlign: "center", color: "rgba(0, 0, 0, 0.4)"}}>
              Not<span style={{display: "block"}}>Submitted</span>
            </b>
          </div>
        </div>
        <div className="columns is-mobile is-vcentered" style={{margin: "10px 12px 0px 12px", height: 50}}>
          <div className="column is-one-third">
            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "20px"}}>Visibility:</b>
          </div>
          {buttons}
        </div>
      </div>
    )
  }
}

export default PostStatusVisibility;
