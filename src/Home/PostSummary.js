import React, { Component } from 'react';
import './PostSummary.css';

const divStyle = {
  display: 'flex',
  alignItems: 'center'
};

class PostSummary extends React.Component {
  render() {
    return (
      <div className="Post-Summary" style={divStyle}>
        <h1>My first post</h1>
        <h1>23 impressions</h1>
        <h1>10 unique impressions</h1>
        <h1>8 interactions</h1>
      </div>
    );
  }
}

export default PostSummary;
