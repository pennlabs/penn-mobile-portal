import React from 'react'
import Header from '../components/Header'
import NewPostLabel from '../components/NewPostLabel'
import PostStatusVisibility from '../components/PostStatusVisibility'

import '../App.sass';

import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';

const fetch = require("node-fetch");
const queryString = require('query-string');

class PostPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: null,
      title: null,
      subtitle: null,
      imageFile: null,
      imageUrl: null,
      postUrl: null,
      detailLabel: null,
      comments: null,
      startDate: null,
      endDate: null,
      status: null,
      filters: null,
      filterOptions: null,
      isLive: false,
      isApproved: false,
    }

    this.updateInput = this.updateInput.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setState = this.setState.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.setupDatePicker = this.setupDatePicker.bind(this)
    this.updateDateRange = this.updateDateRange.bind(this)
  }

  componentWillMount() {
    var accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7'
    const query = queryString.parse(this.props.location.search);
    if ('id' in query) {
      const id = query.id
      fetch('https://api.pennlabs.org/portal/post/' + id + '?account=' + accountID)
      .then((response) => response.json())
      .then((json) => {
        var d = new Date();
        var n = parseInt(d.getTimezoneOffset() / 60);
        var startDateStr = json.start_date + "-0" + n + ":00";
        var endDateStr = json.end_date + "-0" + n + ":00";

        this.setState({
          id: id,
          title: json.title,
          subtitle: json.subtitle,
          imageUrl: json.image_url,
          postUrl: json.post_url,
          detailLabel: json.time_label,
          comments: json.comments,
          startDate: new Date(startDateStr),
          endDate: new Date(endDateStr),
        })
        this.setupDatePicker()
      })
      .catch((error) => {
        this.setupDatePicker()
        alert('Unable to fetch post with error message:' + error.message)
      })
    }
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);
    if (!('id' in query)) {
      this.setupDatePicker()
    }
  }

  updateInput(event) {
    const name = event.target.name
    this.setState({[name] : event.target.value})
  }

  saveFile(event) {
    const file = event.target.files[0];
    this.setState({imageFile: file})
  }

  onSubmit() {
    if (!this.state.title) {
      alert("Please include a title.")
      return
    } else if (!this.state.imageUrl) {
      alert("Please select an image.")
      return
    } else if (!this.state.startDate || !this.state.endDate) {
      alert("Please select a start and end date.")
      return
    }

    function formatDate(date) {
      function paddedString(amt) {
        return amt < 10 ? '0' + amt : amt;
      }

      var month = paddedString(date.getMonth()+1)
      var day = paddedString(date.getDate())
      var hours = paddedString(date.getHours());
      var minutes = paddedString(date.getMinutes());

      var strTime = hours + ':' + minutes + ':00'
      return date.getFullYear() + "-" + month + "-" + day + "T" + strTime;
    }

    var accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7'
    fetch('https://api.pennlabs.org/portal/post' + (this.state.id ? '/update' : '/new'), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: this.state.id,
        account_id: accountID,
        image_url: this.state.imageUrl,
        post_url: this.state.postUrl,
        source: "Penn Labs",
        title: this.state.title,
        subtitle: this.state.subtitle,
        time_label: this.state.detailLabel,
        start_date: formatDate(this.state.startDate),
        end_date: formatDate(this.state.endDate),
        filters: [
          {
            'type': 'email-only',
            'filter': 'none',
          }
        ],
        emails: [],
        testers: ["joshdo@wharton.upenn.edu"],
      })
    })
    .then((response) => {
      if (response.status !== 200) {
        alert('Something went wrong. Please try again.')
      }
    })
    .catch((error) => {
      alert('Something went wrong. Please try again.')
    })
  }

  setupDatePicker() {
    console.log(this.state.startDate)
    const options = {
      startDate: this.state.startDate, // Date selected by default
      endDate: this.state.endDate,
      dateFormat: 'M/D', // the date format `field` value
      timeFormat: 'h:mma', // the time format `field` value
      lang: 'en', // internationalization
      overlay: false,
      isRange: true,
      labelFrom: 'Start Time',
      labelTo: 'End Time',
      closeOnOverlayClick: true,
      closeOnSelect: true,
      showHeader: false,
      showTodayButton: false,
      validateLabel: "Save",
    }

    const calendars = bulmaCalendar.attach(this.dateInput, options);

  	// Loop on each calendar initialized
  	calendars.forEach(calendar => {
    	// Add listener to date:selected event
      calendar.on('select:start', datetime => {
    	  this.updateDateRange(datetime.data)
    	});
    	calendar.on('select', datetime => {
    	  this.updateDateRange(datetime.data)
    	});
      calendar.on('clear', datetime => {
    	  this.setState({
          startDate: null,
          endDate: null,
        })
    	});
  	});
  }

  updateDateRange(data) {
    var startDate = data.datePicker._date.start
    var endDate = data.datePicker._date.end
    const startTime = data.timePicker._time.start
    const endTime = data.timePicker._time.end

    startDate.setHours(startTime.getHours())
    startDate.setMinutes(startTime.getMinutes())

    if (endDate) {
      endDate.setHours(endTime.getHours())
      endDate.setMinutes(endTime.getMinutes())
    }

    this.setState({
      startDate: startDate,
      endDate: endDate
    })
  }

  render() {
    return(
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '99vh'}}>
        <Header />
        <div className="columns is-mobile" style={{display: 'flex', flex: 1}}>

          <div className="column is-one-third has-text-centered">
            <div className="card" style={{ margin: "16px 0px 0px 16px", borderRadius: 5, height: '100%'}}>
              <div className="columns is-mobile" style={{ margin: "0px 0px 0px 0px"}}>

                <div className="column has-text-centered">
                  <NewPostLabel text="Current Status" single={true} />
                  <PostStatusVisibility isApproved={this.state.isApproved} notifyChange={this.setState}/>
                  <div style={{height: 20}} />

                  <div style={{margin: "0px 40px 0px 40px"}}>
                    <input
                      className="input is-small"
                      type="datetime"
                      ref={e => this.dateInput = e}
                    />
                  </div>

                  <div style={{height: 20}} />

                  <NewPostLabel text="Add Filters" single={true} />

                  <div style={{margin: "12px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Class Year</b>
                    <input className="input is-small" type="text" name="yearFilter" value={this.state.yearFilter} placeholder="None" onChange={this.updateInput}/>
                  </div>

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>School</b>
                    <input className="input is-small" type="text" name="schoolFilter" value={this.state.schoolFilter} placeholder="None" onChange={this.updateInput} />
                  </div>

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Major</b>
                    <input className="input is-small" type="text" name="majorFilter" value={this.state.majorFilter} placeholder="None" onChange={this.updateInput} />
                  </div>

                </div>

              </div>
            </div>
          </div>

          <div className="column has-text-centered">
            <div className="card" style={{ margin: "16px 16px 0px 0px", borderRadius: 5, height: '100%'}}>
              <div className="columns is-mobile" style={{ margin: "0px 0px 0px 0px"}}>

                <div className="column has-text-centered">
                  <NewPostLabel text="Edit Details" single={false} left={true} />

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Large Title</b>
                    <input className="input is-small" type="text" name="title" value={this.state.title} placeholder="Ex: Apply to Penn Labs!" onChange={this.updateInput} />
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Subtitle (optional)</b>
                    <textarea
                      className="textarea is-small"
                      type="text"
                      name="subtitle"
                      value={this.state.subtitle}
                      placeholder="Ex: Interested in developing new features for Penn Mobile or Penn Course Review? Come out and meet the team!"
                      rows="2"
                      onChange={this.updateInput}
                      />
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Detail Label (optional)</b>
                    <input className="input is-small" type="text" name="detailLabel" value={this.state.detailLabel} placeholder="Ex: Due Today" onChange={this.updateInput}/>
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Image Url</b>
                    <div style={{height: '10px'}} />
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <div class="file has-name is-small">
                      <label class="file-label" >
                        <input class="file-input" type="file" accept="image/*" onChange={this.saveFile}/>
                        <span class="file-cta">
                          <span class="file-icon">
                            <i class="fas fa-upload"></i>
                          </span>
                          <span class="file-label">
                            Choose a file…
                          </span>
                        </span>
                        <span class="file-name" style={{visibility: (this.state.imageFile ? "visible" : "hidden")}}>
                          {this.state.imageFile ? this.state.imageFile.name : null}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Link (optional)</b>
                    <input className="input is-small" type="text" name="postUrl" value={this.state.postUrl} placeholder="Ex: https://pennlabs.org" onChange={this.updateInput}/>
                  </div>

                  <div style={{backgroundColor: "rgba(0,0,0,0.18)", height: 1, margin: "16px 6px 0px 12px"}}/>

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Any Notes for Portal Staff</b>
                    <textarea className="textarea is-small" type="text" name="comments" value={this.state.comments} placeholder="Enter any comments here." rows="2" onChange={this.updateInput}/>
                  </div>

                  <button className="button" onClick={this.onSubmit} style={{
                    margin: "16px 0px 0px 0px",
                    width: 300,
                    height: 35,
                    boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                    border: "solid 0 #979797",
                    backgroundColor: "#2175cb",
                    fontFamily: "HelveticaNeue-Bold",
                    fontWeight: 500,
                    fontSize: 18,
                    color: "#ffffff"
                  }}>
                    Submit for Review
                  </button>
                </div>

                <div className="column has-text-centered">
                  <NewPostLabel text="Live Preview" single={false} left={false} />
                </div>

              </div>
            </div>
          </div>

        </div>

        <div style={{height: '0px'}} />
      </div>
    )
  }
}

export default PostPage
