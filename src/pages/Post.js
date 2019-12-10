import React from 'react'
import Header from '../components/Header'
import NewPostLabel from '../components/NewPostLabel'
import PostStatusVisibility from '../components/PostStatusVisibility'
import Preview from '../components/Preview'

import '../App.sass';

import 'bulma-calendar/dist/css/bulma-calendar.min.css';
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';

import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';

import 'bulma-tagsinput/dist/css/bulma-tagsinput.min.css';
import bulmaTagsInput from 'bulma-tagsinput/dist/js/bulma-tagsinput.min.js';

import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

import Modal from 'react-modal';

const fetch = require("node-fetch");
const FormData = require("form-data");
const queryString = require('query-string');

const dev = false;

class PostPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: null,
      title: null,
      subtitle: null,
      imageFileName: null,
      imageCroppedFileName: null,
      imageUrl: null,
      imageUrlCropped: null,
      src: null,
      crop: {
        unit: "%",
        width: 30,
        aspect: 18 / 9 // This is the aspect ratio that was previously being used
      },
      postUrl: null,
      detailLabel: null,
      comments: null,
      startDate: null,
      endDate: null,
      status: null,
      seniorClassYear: 2020,
      filters: {
        toggle: {
          enabled: false
        },
        class: {
          year_0: false, // 2020
          year_1: false, // 2021
          year_2: false, // 2022
          year_3: false, // 2023
        },
        school: {
          WH: false,
          COL: false,
          EAS: false,
          NUR: false,
        }
      },
      filterOptions: null,
      isLive: false,
      isApproved: false,
      modalIsOpen: false,
      modalStyle: {
        content: {
          top: '50%',
          left: '50%',
          right: '50%',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)'
        }
      }
    }

    this.updateInput = this.updateInput.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.setState = this.setState.bind(this)
    this.loadFileCrop = this.loadFileCrop.bind(this)
    this.onImageLoaded = this.onImageLoaded.bind(this)
    this.onCropComplete = this.onCropComplete.bind(this)
    this.onCropChange = this.onCropChange.bind(this)
    this.makeClientCrop = this.makeClientCrop.bind(this)
    this.getCroppedImg = this.getCroppedImg.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.saveFileCropped = this.saveFileCropped.bind(this)
    this.setupDatePicker = this.setupDatePicker.bind(this)
    this.updateDateRange = this.updateDateRange.bind(this)
    this.getImageNameFromUrl = this.getImageNameFromUrl.bind(this)
    this.setCheckBoxState = this.setCheckBoxState.bind(this)
    this.showFilters = this.showFilters.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    var accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7' // 7900fffd-0223-4381-a61d-9a16a24ca4b7
    const query = queryString.parse(this.props.location.search);
    if ('id' in query) {
      const id = query.id
      let url;
      if (dev) {
        url = 'localhost:5000/portal/post/'
      } else {
        url = 'https://api.pennlabs.org/portal/post/'
      }
      fetch(url + id + '?account=' + accountID)
      .then((response) => response.json())
      .then((json) => {
        var d = new Date();
        var n = parseInt(d.getTimezoneOffset() / 60);
        var startDateStr = json.start_date + "-0" + n + ":00";
        var endDateStr = json.end_date + "-0" + n + ":00";

        var filters = this.state.filters
        for (var filterObjKey in json.filters) {
          var filterObj = json.filters[filterObjKey]
          if (filterObj.type !== 'email-only' && filterObj.type !== 'toggle') {
            var filterKey = filterObj.filter
            if (filterObj.type === 'class') {
              filterKey = "year_" + (parseInt(filterObj.filter) - this.state.seniorClassYear)
            }
            filters[filterObj.type][filterKey] = true
          } else if (filterObj.type == 'toggle') {
            filters['toggle']['enabled'] = filterObj.filter
          }
        }

        this.setState({
          id: id,
          title: json.title,
          subtitle: json.subtitle,
          imageUrl: json.image_url,
          imageUrlCropped: json.image_url_cropped,
          imageFileName: this.getImageNameFromUrl(json.image_url),
          imageCroppedFileName: this.getImageNameFromUrl(json.image_url_cropped),
          postUrl: json.post_url,
          detailLabel: json.time_label,
          comments: json.comments,
          filters: filters,
          startDate: new Date(startDateStr),
          endDate: new Date(endDateStr),
        })
        this.setupDatePicker()
        bulmaTagsInput.attach()

        let imageURL = this.state.imageUrl;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.addEventListener("load", () => {
          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");
        
          canvas.width = img.width;
          canvas.height = img.height;
        
          ctx.drawImage(img, 0, 0);
        
          try {
            let dataUrl = canvas.toDataURL("image/png");
            this.setState({src: dataUrl})
          }
          catch(err) {
            console.log("Error: " + err);
          }
        }, false);
        img.src = imageURL;
      })
      .catch((error) => {
        this.setupDatePicker()
        bulmaTagsInput.attach()
        alert('Unable to fetch post with error message:' + error.message)
      })
    } else {
      // By default, check off all filter boxes
      var filters = this.state.filters;
      for (var type in filters) {
        // Set all filter checkboxes to FALSE
        if (!filters.hasOwnProperty(type)) continue
        for (var key in filters[type]) {
          if (!filters[type].hasOwnProperty(key)) continue
          if (type == 'toggle') {
            filters[type][key] = filters[type][key]
          } else {
            filters[type][key] = true
          }
        }
      }
    }
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);
    if (!('id' in query)) {
      this.setupDatePicker()
      bulmaTagsInput.attach()
    }
  }

  updateInput(event) {
    const name = event.target.name
    this.setState({[name] : event.target.value})
  }

  getImageNameFromUrl(imageUrl) {
    var split = imageUrl.split("penn.mobile.portal/images/")
    var imageFileName = imageUrl
    if (split.length > 1) {
      imageFileName = split[1]
      var split2 = imageFileName.split("/")
      if (split2.length > 1) {
        imageFileName = decodeURIComponent(split2[1])
      }
    }
    return imageFileName
  }

  async loadFileCrop(file) {
    const reader = new FileReader();
    reader.addEventListener("load", () =>
      this.setState({src: reader.result}),
      document.getElementById("buttonOpenCrop").style.display = "block"
    );
    reader.readAsDataURL(file)
  }

  onImageLoaded(image) {
    this.imageRef = image;
  }

  onCropComplete(crop) {
    this.makeClientCrop(crop);
  }

  onCropChange(crop) {
    this.setState({crop});
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "cropped.png"
      );
      this.setState({croppedImageUrl});
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      document.getElementById('buttonCrop').onclick = () => {    
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          resolve(this.saveFileCropped(blob, fileName));
        }, "image/png");
      }
    });
  }

  saveFile(event) {
    const file = event.target.files[0];
    const accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7' // 7900fffd-0223-4381-a61d-9a16a24ca4b7
    const formData = new FormData();
    formData.append('image', file);
    formData.append('account', accountID);
    formData.append('post_id', this.state.id);
    this.loadFileCrop(file)
    let url;
    if (dev) {
      url = 'localhost:5000/portal/post/image'
    } else {
      url = 'https://api.pennlabs.org/portal/post/image'
    }
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then((json) => {
      const imageUrl = json.image_url
      var imageFileName = this.getImageNameFromUrl(imageUrl)
      this.setState({imageFileName: imageFileName})
      this.setState({imageUrl: imageUrl})

      const imageUrlCropped = json.image_url
      var imageCroppedFileName = this.getImageNameFromUrl(imageUrlCropped)
      this.setState({imageCroppedFileName: imageCroppedFileName})
      this.setState({imageUrlCropped: imageUrlCropped})
    })
    .catch((error) => {
      alert(`Something went wrong. Please try again. ${error}`)
    })
  }

  saveFileCropped(file, fileName) {
    const accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7' // 7900fffd-0223-4381-a61d-9a16a24ca4b7
    const formData = new FormData();
    formData.append('image', file, fileName);
    formData.append('account', accountID);
    let url;
    if (dev) {
      url = 'localhost:5000/portal/post/image'
    } else {
      url = 'https://api.pennlabs.org/portal/post/image'
    }
    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then((response) => response.json())
    .then((json) => {
      const imageUrlCropped = json.image_url
      var imageCroppedFileName = this.getImageNameFromUrl(imageUrlCropped)
      this.setState({imageCroppedFileName: imageCroppedFileName})
      this.setState({imageUrlCropped: imageUrlCropped})
    })
    .catch((error) => {
      alert(`Something went wrong. Please try again. ${error}`)
    })
  }

  onSubmit() {
    if (!this.state.title) {
      alert("Please include a title.")
      return
    } else if (!this.state.imageUrl) {
      alert("Please select an image.")
      return
    } else if (!this.state.imageUrlCropped) {
      alert("Please crop your image.")
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

    var filters = []
    for (var type in this.state.filters) {
      if (!this.state.filters.hasOwnProperty(type)) continue;
      for (var key in this.state.filters[type]) {
        if (!this.state.filters[type].hasOwnProperty(key)) continue;

        const checked = this.state.filters[type][key];
        if (checked) {
          var filter = key
          if (type === 'class') {
            var addedYears = parseInt(key.split('_')[1])
            var year = this.state.seniorClassYear + addedYears
            filter = String(year)
          }

          filters.push({
            'type': type,
            'filter': filter,
          })
        }
      }
    }

    if (filters.length === 0) {
      // An empty filters array will cause post to show up for everyone (including grad students).
      // But if empty, then all boxes have been checked off.
      // This implies that the user only wants selected emails to see the post
      // TODO: implement email listserv uploading
      filters.push({
        'type': 'email-only',
        'filter': 'none',
      })
    }

    var accountID = '7900fffd-0223-4381-a61d-9a16a24ca4b7' // 7900fffd-0223-4381-a61d-9a16a24ca4b7
    let url;
    if (dev) {
      url = 'localhost:5000/portal/post'
    } else {
      url = 'https://api.pennlabs.org/portal/post'
    }
    fetch(url + (this.state.id ? '/update' : '/new'), {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: this.state.id,
        account_id: accountID,
        image_url: this.state.imageUrl,
        image_url_cropped: this.state.imageUrlCropped,
        post_url: this.state.postUrl,
        source: "Penn Labs",
        title: this.state.title,
        subtitle: this.state.subtitle,
        time_label: this.state.detailLabel,
        start_date: formatDate(this.state.startDate),
        end_date: formatDate(this.state.endDate),
        filters: filters,
        emails: [],
        testers: ["joshdo@wharton.upenn.edu", "mattrh@wharton.upenn.edu"]
      })
    })
    .then((response) => {
      if (response.status !== 200) {
        alert(`Something went wrong. Please try again. ${response.status}`)
      } else {
        alert('Submitted!')
      }
    })
    .catch((error) => {
      alert(`Something went wrong. Please try again. ${error}`)
    })
  }

  setupDatePicker() {
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

  setCheckBoxState(event) {
    const id = event.target.id;
    const name = event.target.name;
    const type = name.split("_")[0]
    const checked = event.target.checked;

    var filters = this.state.filters
    filters[type][id] = checked
    this.setState({filters: filters})
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
  
  showFilters() {
    if (!this.state.filters['toggle']['enabled']) {
      var filters = this.state.filters
      filters['toggle']['enabled'] = true
      this.setState({filters: filters})
    } else {
      var filters = this.state.filters
      filters['toggle']['enabled'] = false
      this.setState({filters: filters})
    }
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }


  render() {
    const { crop, croppedImageUrl, src } = this.state;

    if (this.state.filters['toggle']['enabled']) {
      this.showFilterBoxes = "block"
      this.filterToggleText = "Remove Filters";
      this.filterToggleColor = "#a32512";
    } else {
      this.showFilterBoxes = "none"
      this.filterToggleText = "Add Filters";
      this.filterToggleColor = "#12a340";
    }

    if (this.state.imageUrl !== null) {
      this.showCropButton = "block"
    } else {
      this.showCropButton = "none"
    }

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

                  <div style={{height: 20}} />

                  <NewPostLabel text="Post Options" single={true} />

                  <div style={{margin: "20px 40px 20px 40px"}}>
                    <input
                      className="input"
                      type="datetime"
                      ref={e => this.dateInput = e}
                    />
                  </div>

                  <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                      <button id="showHideFilters" className="buttonCrop" onClick={this.showFilters} style={{
                          margin: "16px 0px 0px 0px",
                          width: 115,
                          height: 30,
                          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                          border: "solid 0 #979797",
                          backgroundColor: this.filterToggleColor,
                          fontFamily: "HelveticaNeue-Bold",
                          fontWeight: 500,
                          fontSize: 14,
                          color: "#ffffff"
                        }}>
                          {this.filterToggleText}
                      </button>
                  </div>

                  <div id="yearBoxes" style={{margin: "0px 40px 0px 40px", display: this.showFilterBoxes}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Class Year</b>
                    <div className="field" id="yearCheck" style={{margin: "4px 0px 20px 0px", float: "center"}}>
                      <input className="is-checkradio is-small" id="year_0" type="checkbox" checked={this.state.filters.class.year_0} name="class_0" onClick={this.setCheckBoxState}/>
                      <label for="year_0">2020</label>
                      <input className="is-checkradio is-small" id="year_1" type="checkbox" checked={this.state.filters.class.year_1} name="class_1" onClick={this.setCheckBoxState}/>
                      <label for="year_1">2021</label>
                      <input className="is-checkradio is-small" id="year_2" type="checkbox" checked={this.state.filters.class.year_2} name="class_2" onClick={this.setCheckBoxState}/>
                      <label for="year_2">2022</label>
                      <input className="is-checkradio is-small" id="year_3" type="checkbox" checked={this.state.filters.class.year_3} name="class_3" onClick={this.setCheckBoxState}/>
                      <label for="year_3">2023</label>
                    </div>
                  </div>

                  <div id="schoolBoxes" style={{margin: "0px 40px 0px 40px", display: this.showFilterBoxes}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>School</b>
                    <div className="field" id="schoolCheck" style={{margin: "4px 0px 10px 0px", float: "center"}}>
                      <input className="is-checkradio is-small" id="COL" type="checkbox" checked={this.state.filters.school.COL} name="school_COL" onClick={this.setCheckBoxState}/>
                      <label for="COL">College</label>
                      <input className="is-checkradio is-small" id="WH" type="checkbox" checked={this.state.filters.school.WH} name="school_WH" onClick={this.setCheckBoxState}/>
                      <label for="WH">Wharton</label>
                      <input className="is-checkradio is-small" id="EAS" type="checkbox" checked={this.state.filters.school.EAS} name="school_EAS" onClick={this.setCheckBoxState}/>
                      <label for="EAS">SEAS</label>
                      <input className="is-checkradio is-small" id="NUR" type="checkbox" checked={this.state.filters.school.NUR} name="school_NUR" onClick={this.setCheckBoxState}/>
                      <label for="NUR">Nursing</label>
                    </div>
                  </div>

                  {/*
                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Major</b>
                    <input className="input is-small" type="tags" name="majorFilter" value="Tag1,Tag2" placeholder="Add tags" onChange={this.updateInput} />
                  </div>
                  */}
                  <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
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
                    <div className="file has-name is-small">
                      <label className="file-label" >
                        <input className="file-input" type="file" accept="image/*" onChange={this.saveFile}/>
                        <span className="file-cta">
                          <span className="file-icon">
                            <i className="fas fa-upload"></i>
                          </span>
                          <span className="file-label">
                            Choose a file…
                          </span>
                        </span>
                        <span className="file-name" style={{visibility: (this.state.imageFileName ? "visible" : "hidden")}}>
                          {this.state.imageFileName ? this.state.imageFileName : null}
                        </span>
                      </label>
                    </div>
                    <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                        <button id="buttonOpenCrop" className="buttonOpenCrop" onClick={this.openModal} style={{
                            margin: "16px 0px 0px 0px",
                            width: 115,
                            height: 30,
                            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                            border: "solid 0 #979797",
                            backgroundColor: "#2175cb",
                            fontFamily: "HelveticaNeue-Bold",
                            fontWeight: 500,
                            fontSize: 14,
                            color: "#ffffff",
                            display: this.showCropButton
                          }}>
                            Crop Image
                        </button>
                    </div>
                  </div>
                  
                  <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    style={this.state.modalStyle}
                    contentLabel="Cropping Modal">
                    <center>
                    <div id="cropping" style={{margin: "16px 40px 0px 40px"}}>
                      {src && (
                        <ReactCrop
                          src={src}
                          crop={crop}
                          onImageLoaded={this.onImageLoaded}
                          onComplete={this.onCropComplete}
                          onChange={this.onCropChange}
                        />
                      )}
                      <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                          <button id="buttonCrop" className="buttonCrop" style={{
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
                              Save Cropped Image
                          </button>
                      </div>
                    </div>
                    </center>
                  </Modal>

                  <div style={{margin: "16px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Link (optional)</b>
                    <input className="input is-small" type="text" name="postUrl" value={this.state.postUrl} placeholder="Ex: https://pennlabs.org" onChange={this.updateInput}/>
                  </div>

                  <div style={{backgroundColor: "rgba(0,0,0,0.18)", height: 1, margin: "16px 6px 0px 12px"}}/>

                  <div style={{margin: "10px 40px 0px 40px"}}>
                    <b style={{fontFamily: "HelveticaNeue-Medium", fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Any Notes for Portal Staff</b>
                    <textarea className="textarea is-small" type="text" name="comments" value={this.state.comments} placeholder="Enter any comments here." rows="2" onChange={this.updateInput}/>
                  </div>


                </div>

                <div className="column has-text-centered">
                  <NewPostLabel text="Live Preview" single={false} left={false} />
                  <Preview
                    imageUrl={this.state.imageUrlCropped}
                    title={this.state.title}
                    subtitle={this.state.subtitle}
                    source={'Penn Labs'}
                    detailLabel={this.state.detailLabel} />
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
