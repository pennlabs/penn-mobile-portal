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
