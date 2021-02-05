import React from 'react'

const mediumFont = "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif";

const NewPostLabel = (props) => (
  <div>
    <b style={{fontFamily: mediumFont, fontSize: "26px"}}>
      {props.text}
    </b>
    <div style={{
      backgroundColor: "rgba(0,0,0,0.18)",
      height: 1,
      margin: "4px " + ((props.single || !props.left) ? "12px" : "6px") + " 0px " + ((props.single || props.left) ? "12px" : "6px")
    }}/>
  </div>
);

export default NewPostLabel
