import React from 'react'
import '../App.sass';
import styled from 'styled-components';

const fetch = require("node-fetch");
const Cookies = require("js-cookie");
const URLSearchParams = require("url-search-params");
const Redirect = require("react-router-dom").Redirect;

const InputLabel = styled.span`
  font-size: 0.75em;
  float: left;
  margin: 0.75em 0 0.25em 0;
  color: #757575;
  display: ${props => props.show ? "block" : "none"};
`
class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      newAccount: false,
      name: '',
      email: '',
      password: '',
      accountId: '',
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

    return (
      <div style={{
        display: 'flex',
        minHeight: '99vh',
      }}>
        <div className="columns is-vcentered is-mobile is-centered" style={{margin: 'auto'}}>
          <div className="column has-text-centered" style={{width: '488px'}}>
            <div className="card" style={{
              borderRadius: 10,
              boxShadow: '0 0 8px 3px rgba(217, 217, 217, 0.5)',
              padding: '3.5em',
            }}>
              <img src="images/penn-mobile.svg" alt="Penn Mobile Logo" width="96" height="96"></img>
              <h2 class="title is-2">Welcome.</h2>                      
              <h5 class="subtitle is-5">
                {this.state.newAccount ? "Create your Penn Mobile Portal account" : "Log in to continue to Penn Mobile Portal"}
              </h5>

              <InputLabel show={this.state.newAccount}>Organization Name</InputLabel>
              <input className="input is-small" type="text" name="name" value={this.state.name} onChange={this.updateInput} style={{
                display: (this.state.newAccount ? "block" : "none"),
                height: "2.75em",
                border: "solid 1px #e6e6e6",
              }} placeholder="Ex: Penn Labs" />

              <InputLabel show={true}>{this.state.newAccount ? "Contact Email" : "Email"}</InputLabel>
              <input className="input is-small" type="text" name="email" value={this.state.email} onChange={this.updateInput} style={{
                height: "2.75em",
                border: "solid 1px #e6e6e6",
              }} placeholder={this.state.newAccount ? "Ex: contact@pennlabs.org" : ""} />
                
              <InputLabel show={true}>Password</InputLabel>
              <input className="input is-small" type="password" name="password" value={this.state.password} onChange={this.updateInput} style={{
                height: "2.75em",
                border: "solid 1px #e6e6e6",
              }} />
              
              <div>
                <button className="button" onClick={this.onSubmit} style={{
                  width: "100%",
                  height: 35,
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.5)",
                  border: "solid 0 #979797",
                  borderRadius: 5,
                  backgroundColor: "#2175cb",
                  fontWeight: 500,
                  fontSize: 16,
                  color: "#ffffff",
                  margin: "32px 0% 0 0%",
                }}>
                  {this.state.newAccount ? "Register" : "Log in"}
                </button>
              </div>

              <span className="statusSwitch" onClick={this.swapMode} style={{
                fontSize: "0.75em",
                color: "#757575",
                cursor: "pointer",
              }}>
                {this.state.newAccount ? "Already have a Penn Mobile Portal account? " : "Don't have a Penn Mobile Portal account? "}
                <span className="has-text-link"><b><u>{this.state.newAccount ? "Log in" : "Create one"}</u></b></span>
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login