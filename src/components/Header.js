import React from 'react'

const Cookies = require("js-cookie");

class Header extends React.Component {
  render() {
    return (
      <div style={{position: "sticky", top: 0, zIndex: 10}}>
        <head>
          <title>Penn Mobile Portal</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="devices.min.css" type="text/css"></link>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css"/>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.2.0/css/all.css" />
          <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
          <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossOrigin="anonymous" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossOrigin="anonymous" />
          <script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js" />
        </head>

        <div className="hero is-flex" style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: 93,
          padding: 20,
          backgroundColor: "#ffffff",
          boxShadow: "0 0 6px 4px rgba(182, 182, 182, 0.5)"
        }}>
          <div className="hero is-flex" style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <img src="images/penn-mobile.svg" alt="Penn Mobile Logo" width="44" height="44" style={{margin: "5px 0 4px 7px"}}></img>
            <div style={{padding: 20}}>
              <p style={{ fontSize: "30px", color: "#4a4a4a" }}>Penn Mobile Portal</p>
            </div>
          </div>
          <div className="hero is-flex" style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 6
          }}>
            <a href="/" className="button" style={{
              padding: 10,
              fontSize: "17px",
              color: "#4a4a4a",
              marginRight: "0.5em",
            }}>
              Home
            </a>

            <a href="/admin" className="button" style={{
              display: this.props.isAdmin ? null : "none",
              padding: 10,
              fontSize: "17px",
              color: "#4a4a4a",
              marginRight: "0.5em",
            }}>
              Admin
            </a>

            <a href="/post" className="button" style={{
              padding: 10,
              fontSize: "17px",
              color: "#4a4a4a",
              marginRight: "0.5em",
            }}>
              New Post +
            </a>
            
            <a href="/logout" className="button" onClick={() => {Cookies.remove('accountID')}} style={{
              padding: 10,
              fontSize: "17px",
              color: "#4a4a4a"
            }}>
              Log Out
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default Header
