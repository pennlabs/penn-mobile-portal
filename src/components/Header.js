import React from 'react'

const Cookies = require("js-cookie");

class Header extends React.Component {
  render() {
    return (
      <div style={{position: "sticky", top: 0, zIndex: 10}}>
        <div className="hero is-flex" style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: "4.25rem",
          backgroundColor: "#ffffff",
          boxShadow: "0 0 6px 4px rgba(182, 182, 182, 0.5)"
        }}>
          <div className="hero is-flex" style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <img src="images/penn-mobile.svg" alt="Penn Mobile Logo" width="40" height="40" style={{margin: "0.75em"}}></img>
            <p style={{fontSize: "1.5em"}}>Penn Mobile Portal</p>
          </div>
          <div className="hero is-flex" style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <a className="navbar-item" href="/" style={{
              fontSize: "17px",
              color: "#4a4a4a",
            }}>
              Home
            </a>

            <a className="navbar-item" href="/admin" style={{
              display: this.props.isAdmin ? null : "none",
              fontSize: "17px",
              color: "#4a4a4a",
            }}>
              Admin
            </a>

            <a className="navbar-item" href="/post" style={{
              fontSize: "17px",
              color: "#4a4a4a",
            }}>
              New Post
            </a>
            
            <a className="navbar-item" href="/logout" onClick={() => {Cookies.remove('accountID')}} style={{
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
