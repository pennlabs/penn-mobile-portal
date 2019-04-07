import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'
import ListLabels from '../components/ListLabels'

class Splash extends React.Component {
  render() {
    return(
      <div>
        <Header />
        <h1 className="title" style={{margin: '3rem'}}> Penn Mobile Portal </h1>
        <div className="card" style={{margin: '2rem 6rem', padding: 20, borderRadius: 5}}>
          <ListLabels/>
          <PostCard
            prop={"this is a prop"} />
          <PostCard
            prop={"doop di doo"} />
          <PostCard
            prop={"anotha one"}
          />
        </div>
        <Footer />
      </div>
    )
  }
}

export default Splash
