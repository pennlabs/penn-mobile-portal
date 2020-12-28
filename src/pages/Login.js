import React from 'react'
import '../App.sass';

const fetch = require("node-fetch");
const Cookies = require("js-cookie");
const URLSearchParams = require("url-search-params");
const Redirect = require("react-router-dom").Redirect;

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newAccount: false,
      name: null,
      email: null,
      password: null,
      accountId: null,
      shouldRedirect: false
    }

    this.updateInput = this.updateInput.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.swapMode = this.swapMode.bind(this)
  }

  updateInput(event) {
    const name = event.target.name
    this.setState({[name] : event.target.value})
  }

  onSubmit() {
    if (!this.state.name && this.state.newAccount) {
      alert("Name is required.")
      return
    } else if (!this.state.email) {
      alert("Email is required.")
      return
    } else if (!this.state.password) {
      alert("Password is required.")
      return
    }

    var formBody = new URLSearchParams();
    if (this.state.newAccount) {
      formBody.append('name', this.state.name);
    }
    formBody.append('email', this.state.email);
    formBody.append('password', this.state.password);

    var url = (this.state.newAccount ? "https://api.pennlabs.org/portal/account/new" : "https://api.pennlabs.org/portal/account/login")
    fetch((url), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
    .then((response) => response.json())
    .then((json) => {
      if (json.error) {
        alert(json.error)
      } else if (json.msg) {
        alert(json.msg)
      } else if (json.account_id) {
        this.setState({accountId: json.account_id})
        Cookies.set('accountID', json.account_id)
        var message = (this.state.newAccount ? "Registration successful." : "Login successful.")
        alert(message)
        this.setState({shouldRedirect: true})
      }
    })
    .catch((error) => {
      alert(`Something went wrong. Please try again. ${error}`)
    })
  }

  swapMode() {
    this.setState(prevState => ({ 
      newAccount: !prevState.newAccount
    }))
  }

  render() {
    if (Cookies.get('accountID') || this.state.shouldRedirect) {
      return (
        <Redirect to="/" />
      )
    }

    const mediumFont = "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif";
    const boldFont = "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif";

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '99vh',
        backgroundColor: "#f2f2f2"
      }}>
        <div className="columns is-mobile" style={{
          display: 'flex',
          flex: 1
        }}>
          <div className="column has-text-centered">
            <div style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              left: "50%",
              top: "45%",
              transform: "translate(-50%, -50%)"
            }}>
              <div className="card" style={{
                borderRadius: 10,
                boxShadow: '0 0 8px 3px rgba(217, 217, 217, 0.5)',
                width: "488px"
              }}>
                <div className="columns is-mobile">
                  <div className="column has-text-centered" style={{margin: "5% 0 7% 0"}}>
                    <div style={{
                      margin: "20px 14% 0px 14%",
                      float: "center",
                      verticalAlign: "middle",
                      clear: "left"
                    }}>
                      <img src="images/penn-mobile.svg" alt="Penn Mobile Logo" width="96" height="96"></img>
                      <b style={{
                        fontSize: "40px",
                        margin: "0% 0% 2px 0%",
                        display: "block"
                      }}>
                        Welcome.
                      </b>
                      
                      <span style={{
                        fontSize: "20px",
                        display: "block"
                      }}>
                        {this.state.newAccount ? "Create your Penn Mobile Portal account" : "Log in to continue to Penn Mobile Portal"}
                      </span>
                    </div>
                    
                    <div style={{margin: "16px 16% 0px 16%"}}>
                      <span style={{
                        fontFamily: mediumFont,
                        fontSize: "12px",
                        float: "left",
                        margin: "6px 0% 2px 0%",
                        display: (this.state.newAccount ? "block" : "none"),
                        color: "#757575"
                      }}>
                        Organization Name
                      </span>
                      <input className="input is-small" type="text" name="name" value={this.state.name ? this.state.name : ""} onChange={this.updateInput} style={{
                        display: (this.state.newAccount ? "block" : "none"),
                        backgroundColor: "#f7f7f7",
                        height: 35,
                        border: "solid 1px #e6e6e6",
                        borderRadius: 5
                      }} placeholder="Ex: Penn Labs" maxLength="30" />

                      <span style={{
                        fontFamily: mediumFont,
                        fontSize: "12px",
                        float: "left",
                        margin: (this.state.newAccount ? "15px 0% 2px 0%" : "6px 0% 2px 0%"),
                        color: "#757575"
                      }}>
                        {this.state.newAccount ? "Contact Email" : "Email"}
                      </span>
                      <input className="input is-small" type="text" name="email" value={this.state.email ? this.state.email : ""} onChange={this.updateInput} style={{
                        display: "block",
                        backgroundColor: "#f7f7f7",
                        height: 35,
                        border: "solid 1px #e6e6e6",
                        borderRadius: 5
                      }} placeholder={this.state.newAccount ? "Ex: contact@pennlabs.org" : ""} />

                      <span style={{
                        fontFamily: mediumFont,
                        fontSize: "12px",
                        float: "left",
                        margin: "15px 0% 2px 0%",
                        color: "#757575"
                      }}>
                        Password
                      </span>
                      <input className="input is-small" type="password" name="password" value={this.state.password ? this.state.password : ""} onChange={this.updateInput} style={{
                        display: "block",
                        backgroundColor: "#f7f7f7",
                        height: 35,
                        border: "solid 1px #e6e6e6",
                        borderRadius: 5
                      }} />
                    </div>

                    <div style={{margin: "32px 0% 0 0%"}}>
                      <button className="button" onClick={this.onSubmit} style={{
                        width: "68%",
                        height: 35,
                        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
                        border: "solid 0 #979797",
                        borderRadius: 5,
                        backgroundColor: "#2175cb",
                        fontFamily: boldFont,
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#ffffff"
                      }}>
                        {this.state.newAccount ? "Register" : "Log in"}
                      </button>
                    </div>

                    <div style={{margin: "8px 0% 0px 0%"}}>
                      <span className="statusSwitch" onClick={this.swapMode} style={{
                        fontSize: "12px",
                        color: "#757575",
                        cursor: "pointer",
                      }}>
                        {this.state.newAccount ? "Already have a Penn Mobile Portal account? " : "Don't have a Penn Mobile Portal account? "}
                        <span className="has-text-link"><strong><u>{this.state.newAccount ? "Log in" : "Create one"}</u></strong></span>
                        {/* <b><u><a href="#">{this.state.newAccount ? "Log in" : "Create one"}</a></u></b> */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login