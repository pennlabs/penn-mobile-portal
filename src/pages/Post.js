import React from 'react'
import Header from '../components/Header'
import NewPostLabel from '../components/NewPostLabel'
import PostStatusVisibility from '../components/PostStatusVisibility'
import Preview from '../components/Preview'
import DatesCard from '../components/DatesCard'

import '../App.sass';

import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';

import 'bulma-tagsinput/dist/css/bulma-tagsinput.min.css';
import bulmaTagsInput from 'bulma-tagsinput/dist/js/bulma-tagsinput.min.js';

import ReactCrop from 'react-image-crop';
import "react-image-crop/dist/ReactCrop.css";

import Modal from 'react-modal';
import styled from 'styled-components';

const fetch = require("node-fetch");
const FormData = require("form-data");
const queryString = require('query-string');
const Cookies = require("js-cookie");
const Redirect = require("react-router-dom").Redirect;

const dev = false;

const CardLabel = styled.div`
  margin-left: 91px;
  margin-top: 32px;
  font-size: 20px;
  text-align: left !important;
  font-weight: bold;
  color: #4a4a4a
`

const FormLabel = styled.div`
  margin-top: 26px;
  font-size: 16px;
  float: left;
  margin: 0px 0px 2px 0px;
  font-weight: 600;
`

class PostPage extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      id: null,
      title: null,
      subtitle: null,
      organization: null,
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
      status: 'Not Submitted',
      seniorClassYear: 2020,
      filters: {
        options: {
          enabled: false
        },
        class: {
          year_0: false, // 2021
          year_1: false, // 2022
          year_2: false, // 2023
          year_3: false, // 2024
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
      isSubmitted: false,
      isExpired: false,
      modalIsOpen: false,
      modalStyle: {
        content: {
          top: '50%',
          left: '50%',
          right: '50%',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: 10,
          border: null,
          padding: "51px"
        },
        overlay: {
          zIndex: 10,
          backgroundColor: "rgba(174, 174, 174, 0.4)"
        }
      },
      isAdmin: false,
      accountName: null
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
    this.updateStartDate = this.updateStartDate.bind(this)
    this.updateEndDate = this.updateEndDate.bind(this)
    this.getImageNameFromUrl = this.getImageNameFromUrl.bind(this)
    this.setCheckBoxState = this.setCheckBoxState.bind(this)
    this.showFilters = this.showFilters.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentWillMount() {
    var accountID = Cookies.get('accountID')
    if (accountID) {
      var url = dev ? 'http://localhost:5000/portal/account?account_id=' : 'https://api.pennlabs.org/portal/account?account_id='
      fetch(url + accountID)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          isAdmin: json.account.is_admin,
          accountName: json.account.name
        })
      })
      .catch((error) => {
        console.log('Unable to fetch account inforation with error message:' + error.message)
      })
    }

    const query = queryString.parse(this.props.location.search);
    if ('id' in query) {
      const id = query.id
      this.setState({
        isSubmitted: true
      })
      url = dev ? 'http://localhost:5000/portal/post/' : 'https://api.pennlabs.org/portal/post/'
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
          if (filterObj.type !== 'email-only' && filterObj.type !== 'options') {
            var filterKey = filterObj.filter
            if (filterObj.type === 'class') {
              filterKey = "year_" + (parseInt(filterObj.filter) - this.state.seniorClassYear)
            }
            filters[filterObj.type][filterKey] = true
          } else if (filterObj.type === 'options') {
            filters.options.enabled = filterObj.filter
          }
        }

        this.setState({
          id: id,
          title: json.title,
          subtitle: json.subtitle,
          organization: json.organization,
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
          status: json.status,
          isApproved: json.approved
        })
        var dateNow = new Date();
        if (dateNow > this.state.startDate && dateNow < this.state.endDate && this.state.isApproved) {
          this.setState({isLive: true})
        }
        if (dateNow > this.state.endDate) {
          this.setState({isExpired: true})
        }

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
        bulmaTagsInput.attach()
        alert('Unable to fetch post with error message:' + error.message)
      })
    } else {
      // By default, uncheck all filter boxes
      var filters = this.state.filters;
      for (var type in filters) {
        // Set all filter checkboxes to FALSE
        if (!filters.hasOwnProperty(type)) continue
        for (var key in filters[type]) {
          if (!filters[type].hasOwnProperty(key)) continue
          if (type !== 'options') {
            filters[type][key] = false
          }
        }
      }
    }
  }

  componentDidMount() {
    const query = queryString.parse(this.props.location.search);
    if (!('id' in query)) {
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
    const accountID = Cookies.get('accountID')
    const formData = new FormData();
    formData.append('image', file);
    formData.append('account', accountID);
    this.loadFileCrop(file)
    var url = dev ? 'http://localhost:5000/portal/post/image' : 'https://api.pennlabs.org/portal/post/image'
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
    const accountID = Cookies.get('accountID')
    const formData = new FormData();
    formData.append('image', file, fileName);
    formData.append('account', accountID);
    var url = dev ? 'http://localhost:5000/portal/post/image' : 'https://api.pennlabs.org/portal/post/image'
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

    var accountID = Cookies.get('accountID')
    var url = dev ? 'http://localhost:5000/portal/post' : 'https://api.pennlabs.org/portal/post'
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

  setCheckBoxState(event) {
    const id = event.target.id;
    const name = event.target.name;
    const type = name.split("_")[0]
    const checked = event.target.checked;

    var filters = this.state.filters
    filters[type][id] = checked
    this.setState({filters: filters})
  }

  updateStartDate(date) {
    this.setState({
      startDate: date
    })
  }

  updateEndDate(date) {
    this.setState({
      endDate: date
    })
  }
  
  showFilters() {
    var filters = this.state.filters
    filters.options.enabled = !filters.options.enabled
    this.setState({filters: filters})
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }


  render() {
    if (!Cookies.get('accountID')) {
      return (
        <Redirect to="/login" />
      )
    }
    
    const boldFont = "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif";

    const { crop, croppedImageUrl, src } = this.state;

    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch', minHeight: '220vh', backgroundColor:"#f7f7f7"}}>
        <Header isAdmin={this.state.isAdmin}/>
        <div className="columns is-mobile" style={{display: 'flex', flex: 1}}>
          <div className="column has-text-centered">
            <div>
              <div className="columns is-mobile" style={{ margin: "60px 0px 0px 0px"}}>
                <div className="column has-text-centered is-7">
                  <div className="columns">
                    <div className="column has-text-left"> 
                      <div>
                        <b style={{fontWeight: "bold", fontSize: "30px", margin: "0px 0px 0px 91px"}}>
                          Post Details
                        </b>
                      </div>              
                    </div>
                    <div className="column">
                      <div className="buttons are-small is-right" style={{marginTop: 7}}>
                        <button 
                          className="button" 
                          style={{
                            width: "91px", 
                            height: "30px",
                            borderRadius: "17px", 
                            borderWidth: 0,
                            backgroundColor: "#ffd4d1",
                            marginRight: "15px",
                            display: this.state.isSubmitted ? "flex" : "none"
                          }}
                        >
                          <b style={{
                            width: "62px",
                            height: "24px",
                            fontFamily: boldFont,
                            fontSize: "20px",
                            color: "#e25152",
                            marginTop: -8
                          }}>
                            Delete
                          </b>
                        </button>
                        <button 
                          className="button" 
                          style={{
                            width: "158px", 
                            height: "30px",
                            borderRadius: "17px", 
                            borderWidth: 0,
                            backgroundColor: "#e3e3e3", 
                            marginRight: "15px",
                            display: this.state.isSubmitted ? "none" : "flex"
                          }}
                        >
                          <b style={{
                            width: "128px",
                            height: "24px",
                            fontWeight: "bold",
                            fontSize: "20px",
                            color: "#999999",
                            marginTop: -8
                          }}>
                            Save for later
                          </b>
                        </button>
                        <button 
                          className="button" 
                          onClick={this.onSubmit}
                          style={{
                            width: "99px",
                            height: "30px",
                            borderRadius: "17px",
                            borderWidth: 0,
                            backgroundColor: "rgba(63, 170, 109, 0.2)",
                            display: this.state.isExpired ? "none" : "flex"
                          }}
                        >
                          <b style={{
                            width: "68px",
                            height: "24px",
                            fontWeight: "bold",
                            fontSize: "20px",
                            color: "#3faa6d",
                            marginTop: -8
                          }}>
                            Submit
                          </b>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* <NewPostLabel text="Current Status" single={true} /> */}
                  {/* <PostStatusVisibility isApproved={this.state.isApproved} postStatus={this.state.status} notifyChange={this.setState}/> */}
                    <div className="columns" style={{marginTop: 10, marginLeft: 91}}>
                      <div className="column is-1" style={{
                        width: "1vw",
                        padding: "13px 0px 0px 0px",
                        zIndex: 1,
                        position: "relative",
                      }}>
                        <span className="icon" style={{color: "#2175cb", width: 20, height: 20}}>
                          <i className="fas fa-circle fa-lg" style={{fontSize: 27}}></i>
                        </span>
                        <div style={{fontSize:16, color: "#2175cb", fontWeight: "bold", marginLeft: -7, paddingTop: 6}}>
                          Draft
                        </div>
                      </div>
                      <div className="column is-2" style={{
                        backgroundColor: this.state.isSubmitted || this.state.isExpired ? "#2175cb" : "#cccccc",
                        marginLeft: 0,
                        padding: "0px 0px 0px 0px",
                        marginTop: 20,
                        height: 5,
                        width: "22%",
                        zIndex: this.state.isSubmitted || this.state.isExpired ? 2 : 0,
                        position: "relative",
                      }}></div>
                      <div className="column is-1" style={{
                        width: "1vw",
                        padding: "13px 0px 0px 0px",
                        zIndex: 1,
                        position: "relative",
                      }}>
                        <span className="icon" style={{color: this.state.isSubmitted || this.state.isExpired ? "#2175cb" : "#cccccc", width: 20, height: 20, boxShadow: this.state.isSubmitted && !this.state.isApproved ? "0 0 8px 3px #d9d9d9" : ""}}>
                          <i className="fas fa-circle fa-lg" style={{fontSize: 27}}></i>
                        </span>
                        <div style={{fontSize: 16, color: this.state.isSubmitted || this.state.isExpired ? "#2175cb" : "#999999", width: 107, fontFamily: boldFont, marginLeft: -42, paddingTop: 6}}>
                          Under Review
                        </div>
                      </div>
                      <div className="column is-2" style={{
                        backgroundColor: this.state.isApproved || this.state.isExpired ? "#2175cb" : "#cccccc",
                        marginLeft: 0,
                        padding: "0px 0px 0px 0px",
                        marginTop: 20,
                        height: 5, 
                        width: "22%",
                        zIndex: this.state.isApproved || this.state.isExpired  ? 2 : 0,
                        position: "relative",
                      }}></div>
                      <div className="column is-1" style={{
                        width: "1vw",
                        padding: "13px 0px 0px 0px",
                        zIndex: 1,
                        position: "relative",
                      }}>
                        <span className="icon" style={{color: this.state.isApproved || this.state.isExpired ? "#2175cb" : "#cccccc", width: 20, height: 20, boxShadow: this.state.isApproved && !this.state.isLive && !this.state.isExpired ? "0 0 8px 3px #d9d9d9" : ""}}>
                          <i className="fas fa-circle fa-lg" style={{fontSize: 27}}></i>
                        </span>
                        <div style={{fontSize:16, color: this.state.isApproved || this.state.isExpired ? "#2175cb" : "#999999", fontFamily: boldFont, marginLeft: -24, paddingTop: 6}}>
                          Approved
                        </div>
                      </div>
                      <div className="column is-2" style={{
                        backgroundColor: this.state.isLive || this.state.isExpired ? "#2175cb" : "#cccccc",
                        marginLeft: 0,
                        padding: "0px 0px 0px 0px",
                        marginTop: 20,
                        height: 5, 
                        width: "22%",
                        zIndex: this.state.isLive || this.state.isExpired ? 2 : 0,
                        position: "relative",
                      }}></div>
                      <div className="column is-1" style={{
                        width: "1vw",
                        padding: "13px 0px 0px 0px",
                        zIndex: 1,
                        position: "relative",
                      }}>
                        <span className="icon" style={{color: this.state.isLive || this.state.isExpired ? "#2175cb" : "#cccccc", width: 20, height: 20, boxShadow: this.state.isLive && !this.state.isExpired ? "0 0 8px 3px #d9d9d9" : ""}}>
                          <i className="fas fa-circle fa-lg" style={{fontSize: 27}}></i>
                        </span>
                        <div style={{fontSize:16, color: this.state.isLive || this.state.isExpired ? "#2175cb" : "#999999", fontFamily: boldFont, marginLeft: -3, paddingTop: 6}}>
                          Live
                        </div>
                      </div>
                      <div className="column is-2" style={{
                        backgroundColor: this.state.isExpired ? "#2175cb" : "#cccccc",
                        marginLeft: 0,
                        padding: "0px 0px 0px 0px",
                        marginTop: 20,
                        height: 5,
                        width: "22%",
                        zIndex: this.state.isExpired ? 2 : 0,
                        position: "relative",
                      }}></div>
                      <div className="column is-1" style={{
                        width: "1vw",
                        padding: "13px 0px 0px 0px",
                        zIndex: 1,
                        position: "relative",
                      }}>
                        <span className="icon" style={{color: this.state.isExpired ? "#2175cb" : "#cccccc", width: 20, height: 20, boxShadow: this.state.isExpired ? "0 0 8px 3px #d9d9d9" : ""}}>
                          <i className="fas fa-circle fa-lg" style={{fontSize: 27}}></i>
                        </span>
                        <div style={{fontSize:16, color: this.state.isExpired ? "#2175cb" : "#999999", fontFamily: boldFont, marginLeft: -16, paddingTop: 6}}>
                          Expired
                        </div>
                      </div>
                    </div>
                  
                  {/* <NewPostLabel text="Post Options" single={true} /> */}
                  <CardLabel>Content</CardLabel>
                  <div 
                    className="card" 
                    style={{borderRadius: 10, margin:"30px 0px 0px 91px", boxShadow: "0 0 8px 3px #d9d9d9", marginTop:16, padding:"18px 26px 18px 26px"}}>
                    {/* <div className="has-text-center">
                      <b style={{fontFamily: mediumFont, fontSize: "26px"}}>
                        Edit Details
                      </b>
                    </div> */}
                    <div>
                      <FormLabel>Title</FormLabel>
                      <input 
                        className="input is-small" 
                        type="text" 
                        name="title" 
                        value={this.state.title || ''} 
                        placeholder="Ex: Apply to Penn Labs!" 
                        onChange={this.updateInput}
                        style={{backgroundColor:"#f7f7f7", borderRadius:5, border:"solid 1px #e6e6e6", marginTop:8, fontSize: "14px"}} />
                    </div>

                    <div style={{marginTop: 26}}>
                      <FormLabel>Description (Optional)</FormLabel>
                      <textarea
                        className="input is-small"
                        type="text"
                        name="subtitle"
                        value={this.state.subtitle || ""}
                        placeholder="Ex: Interested in developing new features for Penn Mobile or Penn Course Review? Come out and meet the team!"
                        rows="2"
                        onChange={this.updateInput}
                        style={{backgroundColor:"#f7f7f7", borderRadius:5, border:"solid 1px #e6e6e6", marginTop:8, fontSize: "14px"}} />
                    </div>

                    <div style={{marginTop: 26}}>
                      <FormLabel>Detail Label (Optional)</FormLabel>
                      <input 
                        className="input is-small" 
                        type="text" 
                        name="detailLabel" 
                        value={this.state.detailLabel || ""} 
                        placeholder="Ex: Due Today" 
                        onChange={this.updateInput}
                        style={{backgroundColor:"#f7f7f7", borderRadius:5, border:"solid 1px #e6e6e6", marginTop:8, fontSize: "14px"}} />
                    </div>

                    <div style={{marginTop: 26}}>
                      <FormLabel>Upload Cover Image</FormLabel>
                      <div style={{height: '10px'}} />
                    </div>

                    <div style={{marginTop: 22}}>
                      <div className="file has-name is-small">
                        <label className="file-label" >
                          <input className="file-input" type="file" accept="image/*" onChange={this.saveFile}/>
                          <span className="file-cta"  style={{backgroundColor: "#2175cb", borderRadius: "16px", width: "115px", height: "30px", border: 0}}>
                            <span className="file-icon" style={{color: "#ffffff"}}>
                              <i className="fas fa-upload"></i>
                            </span>
                            <b className="file-label" style={{color: "#ffffff", fontWeight: "bold", fontSize: "14px"}}>
                              Browse...
                            </b>
                          </span>
                          <span className="file-name" style={{height: "30px", visibility: (this.state.imageFileName ? "visible" : "hidden")}}>
                            {this.state.imageFileName ? this.state.imageFileName : null}
                          </span>
                        </label>
                      </div>
                      <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                          <button id="buttonOpenCrop" className="buttonOpenCrop" onClick={this.openModal} style={{
                              margin: "16px 0px 0px 0px",
                              width: 115,
                              height: 30,
                              border: "solid 0 #979797",
                              backgroundColor: "#2175cb",
                              fontWeight: "bold",
                              fontSize: 14,
                              color: "#ffffff",
                              borderRadius: 16,
                              display: this.state.imageUrl ? "block" : "none"
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
                        <div style={{marginTop: "-16px"}}>
                          <b style={{fontFamily: boldFont, fontSize: "30px", color: "#4a4a4a"}}>
                            Crop Cover Image
                          </b>
                        </div>
                        <div id="cropping" style={{paddingTop: "27px"}}>
                          {src && (
                            <ReactCrop
                              src={src}
                              crop={crop}
                              onImageLoaded={this.onImageLoaded}
                              onComplete={this.onCropComplete}
                              onChange={this.onCropChange}
                            />
                          )}
                          <div style={{margin: "20px 0px -4px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                            <button id="buttonCrop" className="buttonCrop" style={{
                                margin: "16px 0px 0px 0px",
                                width: 190,
                                height: 32,
                                border: "solid 0 #979797",
                                backgroundColor: "#2175cb",
                                fontFamily: boldFont,
                                fontWeight: 500,
                                fontSize: 18,
                                color: "#ffffff",
                                borderRadius: 16
                              }}>
                                Crop and Upload
                            </button>
                          </div>
                        </div>
                    </Modal>

                    <div>
                      <FormLabel>Link (Optional)</FormLabel>
                      <input 
                        className="input is-small" type="text" name="postUrl" value={this.state.postUrl || ""} 
                        placeholder="Ex: https://pennlabs.org" onChange={this.updateInput}
                        style={{backgroundColor:"#f7f7f7", borderRadius:5, border:"solid 1px #e6e6e6", marginTop:8, fontSize: "14px"}} />
                    </div>

                    </div>
                    <CardLabel>Dates</CardLabel>
                    <DatesCard 
                      updateStartDate={this.updateStartDate}
                      updateEndDate={this.updateEndDate} />
                    {/* <div className="has-text-left" style={{marginLeft:91, marginTop:32, fontSize:20}}><b>Dates</b></div>
                    <div className="card" style={{borderRadius: 10, height: '7%', margin:"30px 0px 0px 91px", boxShadow: "0 0 8px 3px #d9d9d9", marginTop:16, padding:"18px 26px 0px 26px"}}>
                    {/* <div> 
                      <input
                        className="input"
                        type="datetime"
                        ref={e => this.dateInput = e}
                      />
                    </div> */}

                    <CardLabel>
                    <b style={{fontSize:20, marginRight:21, color:"#4a4a4a"}}>Filters</b>
                        <span style={{fontSize: 12, color:"#999999", fontWeight: 500, letterSpacing: .2}}>
                          <span className="icon">
                            <i className="fas fa-info-circle"></i>
                          </span>            
                          If no filters are applied, the post will be shared with all Penn Mobile users by default.
                        </span>
                    </CardLabel>
                    <div 
                      className="card has-text-left" 
                      style={{
                        borderRadius: 10, 
                        height: '13%', 
                        margin:"0px 0px 0px 91px", 
                        boxShadow: "0 0 8px 3px #d9d9d9", 
                        marginTop:16, 
                        padding:"18px 26px 0px 26px"}}>
                          
                        <div className="columns">
                          <div className = "column is-3">
                            <FormLabel>Class Year</FormLabel>
                          </div>
                          <div className="column is-2">
                            <label className="label"> 
                              <input id="year_0" type="checkbox" checked={this.state.filters.class.year_0} name="class_0" onChange={this.setCheckBoxState}/>
                              <div className="checkmark" style={{fontWeight:2000}}>2021</div>
                            </label>
                          </div>
                          <div className="column is-2">
                            <label className="label"> 
                              <input id="year_1" type="checkbox" checked={this.state.filters.class.year_1} name="class_1" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">2022</div>
                            </label>
                          </div>
                          <div className="column is-2">
                            <label className="label"> 
                            <input id="year_2" type="checkbox" checked={this.state.filters.class.year_2} name="class_2" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">2023</div>
                            </label>
                          </div>
                          <div className="column is-2">
                            <label className="label"> 
                            <input id="year_3" type="checkbox" checked={this.state.filters.class.year_3} name="class_3" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">2024</div>
                            </label>
                          </div>
                        </div>
                          
                        
                          <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                        {/* <button id="showHideFilters" className="buttonCrop" onClick={this.showFilters} style={{
                            margin: "16px 0px 0px 0px",
                            width: 115,
                            height: 30,
                            boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                            border: "solid 0 #979797",
                            backgroundColor: this.state.filters.options.enabled ? "#a32512" : "#12a340",
                            fontFamily: boldFont,
                            fontWeight: 500,
                            fontSize: 14,
                            color: "#ffffff"
                          }}>
                            {this.state.filters.options.enabled ? "Remove Filters" : "Add Filters"}
                        </button> */}
                    </div> 
                    {/* <div id="yearBoxes" style={{margin: "0px 40px 0px 40px", display: this.state.filters.options.enabled ? "block" : "none"}}> */}
                    {/* <div id="yearBoxes" style={{margin: "0px 40px 0px 40px"}}>
                      <div>                      
                        <b style={{fontFamily: mediumFont, fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Class Year</b>
                      </div>
                      <div className="field" id="yearCheck" style={{margin: "4px 0px 20px 0px", float: "center"}}>
                        

                        <input className="is-checkradio is-small" id="year_0" type="checkbox" checked={this.state.filters.class.year_0} name="class_0" onClick={this.setCheckBoxState}/>
                        <label htmlFor="year_0">2020</label>
                        <input className="is-checkradio is-small" id="year_1" type="checkbox" checked={this.state.filters.class.year_1} name="class_1" onClick={this.setCheckBoxState}/>
                        <label htmlFor="year_1">2021</label>
                        <input className="is-checkradio is-small" id="year_2" type="checkbox" checked={this.state.filters.class.year_2} name="class_2" onClick={this.setCheckBoxState}/>
                        <label htmlFor="year_2">2022</label>
                        <input className="is-checkradio is-small" id="year_3" type="checkbox" checked={this.state.filters.class.year_3} name="class_3" onClick={this.setCheckBoxState}/>
                        <label htmlFor="year_3">2023</label>
                      </div>
                    </div> */}
                    <div className="columns">
                          <div className = "column is-3">
                            <FormLabel>School</FormLabel>
                          </div>
                          <div className="column is-2">
                            <label className="label" htmlFor="COL"> 
                            <input id="COL" type="checkbox" checked={this.state.filters.school.COL} name="school_COL" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">College</div>
                            </label>
                          </div>
                          <div className="column is-2">
                            <label className="label" htmlFor="WH"> 
                              <input id="WH" type="checkbox" checked={this.state.filters.school.WH} name="school_WH" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">Wharton</div>
                            </label>
                          </div>
                          <div className="column is-2">
                            <label className="label" htmlFor="EAS"> 
                            <input id="EAS" type="checkbox" checked={this.state.filters.school.EAS} name="school_EAS" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">SEAS</div>
                              <input className="is-checkradio is-small" id="EAS" type="checkbox" checked={this.state.filters.school.EAS} name="school_EAS" onChange={this.setCheckBoxState}/>
                            </label>
                          </div>
                          <div className="column is-2">
                            <label className="label" htmlFor="NUR"> 
                            <input id="NUR" type="checkbox" checked={this.state.filters.school.NUR} name="school_NUR" onChange={this.setCheckBoxState}/>
                              <div className="checkmark">Nursing</div>
                            </label>
                            <input className="is-checkradio is-small" id="NUR" type="checkbox" checked={this.state.filters.school.NUR} name="school_NUR" onChange={this.setCheckBoxState}/>
                          </div>
                        </div>
                    {/* <div id="schoolBoxes" style={{margin: "0px 40px 0px 40px"}}>
                      <b style={{fontFamily: mediumFont, fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>School</b>
                      <div className="field" id="schoolCheck" style={{margin: "4px 0px 10px 0px", float: "center"}}>
                        <input className="is-checkradio is-small" id="COL" type="checkbox" checked={this.state.filters.school.COL} name="school_COL" onClick={this.setCheckBoxState}/>
                        <label htmlFor="COL">College</label>
                        <input className="is-checkradio is-small" id="WH" type="checkbox" checked={this.state.filters.school.WH} name="school_WH" onClick={this.setCheckBoxState}/>
                        <label htmlFor="WH">Wharton</label>
                        <input className="is-checkradio is-small" id="EAS" type="checkbox" checked={this.state.filters.school.EAS} name="school_EAS" onClick={this.setCheckBoxState}/>
                        <label htmlFor="EAS">SEAS</label>
                        <input className="is-checkradio is-small" id="NUR" type="checkbox" checked={this.state.filters.school.NUR} name="school_NUR" onClick={this.setCheckBoxState}/>
                        <label htmlFor="NUR">Nursing</label>
                      </div>
                    </div> */}
                          {/* <div className="file-cta"  
                          style={{backgroundColor:"#2175cb", borderRadius:12, border:0, height:24, marginRight:10, color:"#ffffff", fontWeight:500, fontSize:16}}>
                              Save filters
                          </div> 
                          <div className="file-cta"  
                          style={{backgroundColor:"#2175cb", borderRadius:12, border:0, height:24, marginRight:10, color:"#ffffff", fontWeight:500, fontSize:16}}>
                              Save filters
                          </div>  */}
                    </div>

                     

                    {/* <div style={{margin: "10px 40px 0px 40px"}}>
                      <b style={{fontFamily: mediumFont, fontSize: "14px", float: "left", margin: "0px 0px 2px 0px"}}>Major</b>
                      <input className="input is-small" type="tags" name="majorFilter" value="Tag1,Tag2" placeholder="Add tags" onChange={this.updateInput} />
                    </div> */}
                    <CardLabel>
                    <b style={{fontSize:20, marginRight:21, color:"#4a4a4a"}}>Notes</b>
                        <span style={{fontSize: 12, color:"#999999", fontWeight: 500, letterSpacing: .2}}>
                          <span className="icon">
                            <i className="fas fa-info-circle"></i>
                          </span>            
                          Portal administrators will see this message during the review process.
                        </span>
                    </CardLabel>
                    <div className="card" style={{borderRadius: 10, height:150, margin:"0px 0px 0px 91px", boxShadow: "0 0 8px 3px #d9d9d9", marginTop:16, padding:"26px 26px 26px 26px"}}>
                      <div style={{height:94}}>
                        <textarea 
                          className="textarea is-small" type="text" name="comments" value={this.state.comments || ""} 
                          placeholder="Enter any comments here." rows="2" onChange={this.updateInput}
                          style={{backgroundColor:"#f7f7f7", borderRadius:5, border:"solid 1px #e6e6e6", height:94, fontSize: "14px"}}/>
                      </div>
                    </div>
                    {/* <div style={{margin: "20px 0px 20px 0px", float: "center", verticalAlign: "middle", clear: "left" }}>
                        <button className="button" onClick={this.onSubmit} style={{
                          margin: "16px 0px 0px 0px",
                          width: 300,
                          height: 35,
                          boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.5)",
                          border: "solid 0 #979797",
                          backgroundColor: "#2175cb",
                          fontFamily: boldFont,
                          fontWeight: 500,
                          fontSize: 18,
                          color: "#ffffff"
                        }}>
                          Submit for Review
                        </button>
                    </div> */}

                </div>

                <div className="column has-text-centered is-5">
                  <div>
                    <b style={{fontWeight: "bold", fontSize: 30}}>Live Preview</b>
                  </div>
                  
                  {/* <NewPostLabel text="Live Preview" single={false} left={false} /> */}
                  <Preview
                    imageUrl={this.state.imageUrlCropped}
                    title={this.state.title}
                    subtitle={this.state.subtitle}
                    source={this.state.accountName}
                    detailLabel={this.state.detailLabel}/>
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
