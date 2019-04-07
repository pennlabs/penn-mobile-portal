import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

class NewPage extends React.Component {
  render() {
    return(
      <div>
        <Header />
        <h1 className="title" style={{margin: '3rem'}}> This is a new page! </h1>
        <Footer />
      </div>
    )
  }
}

export default NewPage
