import React from 'react'

const regularFont = "HelveticaNeue, Helvetica, sans-serif, serif";
const mediumFont = "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif";
const boldFont = "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif";

const ListLabels = () => (
  <div className="columns is-mobile">
    <div className="column is-one-quarter has-text-centered">
      <b style={{fontFamily: mediumFont, fontSize: "18px"}}>
      Post
      </b>
    </div>
    <div className="column has-text-centered">
      <b style={{fontFamily: mediumFont, fontSize: "18px"}}>
      Impressions
      </b>
    </div>
    <div className="column has-text-centered">
      <b style={{fontFamily: mediumFont, fontSize: "18px"}}>
      Unique Impressions
      </b>
    </div>
    <div className="column has-text-centered">
      <b style={{fontFamily: mediumFont, fontSize: "18px"}}>
      Interactions
      </b>
    </div>
    <div className="column has-text-centered">
      <b style={{fontFamily: mediumFont, fontSize: "18px"}}>
      Start Date
      </b>
    </div>
    <div className="column has-text-centered">
      <b style={{fontFamily: mediumFont, fontSize: "18px"}}>
      Status
      </b>
    </div>
  </div>
)

export default ListLabels
