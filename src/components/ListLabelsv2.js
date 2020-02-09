import React from 'react'

const regularFont = "HelveticaNeue, Helvetica, sans-serif, serif";
const mediumFont = "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif";
const boldFont = "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif";

const ListLabels = () => (
  <div className="rows is-mobile">
    <div className="column">
      <b style={{fontFamily: mediumFont, fontSize: "24px"}}>
      Submitted
      </b>
    </div>
    <div className="column">
      <b style={{fontFamily: mediumFont, fontSize: "24px"}}>
      Drafts
      </b>
    </div>
    <div className="column">
      <b style={{fontFamily: mediumFont, fontSize: "24px"}}>
      Live
      </b>
    </div>
  </div>
)

export default ListLabels
