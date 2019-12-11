import React from 'react'
import ExternalHeader from '../components/ExternalHeader'
import Footer from '../components/Footer'

import '../App.sass';

const fetch = require("node-fetch");
const Cookies = require("js-cookie");
const URLSearchParams = require("url-search-params");
const Redirect = require("react-router-dom").Redirect;

class Login extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        newAccount: true,
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

    componentDidMount() {
        window.sessionStorage.removeItem('logout')
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
        if (!window.sessionStorage.getItem('logout') && (Cookies.get('accountID') || this.state.shouldRedirect)) {
            return (
                <Redirect to="/" />
            )
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '99vh'}}>
                <ExternalHeader />
                <div className="columns is-mobile" style={{display: 'flex', flex: 1}}>
                    <div className="column has-text-centered"></div>
                    <div className="column has-text-centered">
                        <div style={{flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingTop: '10%'}}>
                            <div className="column has-text-centered"></div>
                            <div className="card" style={{margin: "16px 0px 0px 16px", borderRadius: 5, width: '100%'}}>
                                <div className="columns is-mobile" style={{margin: "0px 0px 0px 0px"}}>
                                    <div className="column has-text-centered">
                                        <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left"}}>
                                            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "24px", margin: "16px 0px 2px 0px", display: "block"}}>{this.state.newAccount ? "Create your account" : "Log in to your account"}</b>
                                        </div>
                                        
                                        <div style={{margin: "20px 80px 0px 80px"}}>
                                            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "8px 0px 2px 0px", display: (this.state.newAccount ? "block" : "none")}}>Name</b>
                                            <input className="input is-small" type="text" name="name" value={this.state.name} onChange={this.updateInput} style={{display: (this.state.newAccount ? "block" : "none")}} />

                                            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "8px 0px 2px 0px"}}>Email Address</b>
                                            <input className="input is-small" type="text" name="email" value={this.state.email} onChange={this.updateInput} style={{display: "block"}} />

                                            <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "8px 0px 2px 0px"}}>Password</b>
                                            <input className="input is-small" type="password" name="password" value={this.state.password} onChange={this.updateInput} style={{display: "block"}} />
                                        </div>

                                        <div style={{margin: "20px 80px 20px 80px", float: "center", verticalAlign: "middle", clear: "left" }}>
                                            <button className="button" onClick={this.onSubmit} style={{
                                                margin: "16px 0px 0px 0px",
                                                width: 360,
                                                height: 35,
                                                boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                                                border: "solid 0 #979797",
                                                backgroundColor: "#2175cb",
                                                fontFamily: "HelveticaNeue-Bold",
                                                fontWeight: 500,
                                                fontSize: 17,
                                                color: "#ffffff"
                                            }}>
                                                {this.state.newAccount ? "Register" : "Login"}
                                            </button>
                                        </div>
                                        <span className="statusSwitch" onClick={this.swapMode}>
                                            {this.state.newAccount ? "Already have a Penn Mobile Portal account? " : "Don't have a Penn Mobile Portal account? "}
                                            <b><u><a href="#">{this.state.newAccount ? "Log in" : "Create one"}</a></u></b>
                                        </span>
                                    </div>
                                </div>
                            </div>
                                            
                        </div>
                    </div>
                    <div className="column has-text-centered"></div>
                </div>
                <Footer />
            </div>
        )
    }
  }

export default Login