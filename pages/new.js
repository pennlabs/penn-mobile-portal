import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

import Post from '../models/Post.js'
import PostAnalytics from '../models/PostAnalytics.js'

import NewPostLabel from '../components/NewPostLabel'

const fetch = require("node-fetch");

class NewPost extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      title: null,
      subtitle: null,
      imageUrl: null,
      postUrl: null,
      detailLabel: null,
      comments: null,
      startDate: null,
      endDate: null,
      status: null,
      filters: null,
      filterOptions: null,
    }

    this.updateInput = this.updateInput.bind(this)
  }

  updateInput(event) {
    const name = event.target.name
    this.setState({[name] : event.target.value})
  }

  render() {
    return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '99vh'}}>
        <Header />
        <div className="columns is-mobile" style={{display: 'flex', flex: 1}}>

          <div className="column is-one-third has-text-centered">
            <div className="card" style={{ margin: "16px 0px 0px 16px", borderRadius: 5, height: '100%'}}>
              <div className="columns is-mobile" style={{ margin: "0px 0px 0px 0px"}}>

                <div className="column has-text-centered">
                  <NewPostLabel text="Current Status" single={true} />
                </div>

              </div>
            </div>
          </div>

          <div className="column has-text-centered">
            <div className="card" style={{ margin: "16px 16px 0px 0px", borderRadius: 5, height: '100%'}}>
              <div className="columns is-mobile" style={{ margin: "0px 0px 0px 0px"}}>

                <div className="column has-text-centered">
                  <NewPostLabel text="Edit Details" single={false} left={true} />

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Large Title</b>
                    <input className="input is-small" type="text" name="title" value={this.state.title} placeholder="Ex: Apply to Penn Labs!" onChange={this.updateInput} />
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Subtitle (optional)</b>
                    <textarea className="textarea is-small" type="text" name="subtitle" value={this.state.subtitle} placeholder="Ex: Apply to Penn Labs!" rows="2" onChange={this.updateInput}/>
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Detail Label (optional)</b>
                    <input className="input is-small" type="text" name="detailLabel" value={this.state.detailLabel} placeholder="Ex: Due Today" onChange={this.updateInput}/>
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Image Url</b>
                    <input className="input is-small" type="text" name="imageUrl" value={this.state.imageUrl} placeholder="Ex: https://i.imgur.com/CmhAG25.jpg" onChange={this.updateInput}/>
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Link (optional)</b>
                    <input className="input is-small" type="text" name="postUrl" value={this.state.postUrl} placeholder="Ex: https://pennlabs.org" onChange={this.updateInput}/>
                  </div>

                  <div style={{backgroundColor: "rgba(0,0,0,0.18)", height: 1, margin: "16px 6px 0px 12px"}}/>

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Any Notes for Portal Staff</b>
                    <textarea className="textarea is-small" type="text" name="comments" value={this.state.comments} placeholder="Please enter any notes here." rows="2" onChange={this.updateInput}/>
                  </div>

                  <button className="button" style={{
                    margin: "16px 0px 0px 0px",
                    width: 300,
                    height: 35,
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                    border: "solid 0 #979797",
                    backgroundColor: "#2175cb",
                    fontFamily: "HelveticaNeue-Bold",
                    fontWeight: 500,
                    fontSize: 18,
                    color: "#ffffff"
                  }}>
                    Submit for Review
                  </button>
                </div>

                <div className="column has-text-centered">
                  <NewPostLabel text="Preview" single={false} left={false} />
                </div>

              </div>
            </div>
          </div>

        </div>

        <div style={{height: '0px'}} />
      </div>
    )
  }
}

export default NewPost
