import React, { Component } from 'react';

import PostSummary from './PostSummary';

class PostListings extends React.Component {
  render() {
    return (
      <div className="Post-Listings">
        <PostSummary />
        <PostSummary />
        <PostSummary />
        <PostSummary />
      </div>
    );
  }
}

export default PostListings;
