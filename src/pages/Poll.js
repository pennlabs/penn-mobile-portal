import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Preview from '../components/Preview'
import DatePickerCard from '../components/DatePickerCard'
import StatusBar from '../components/StatusBar'
import {
  Button,
  ToggleButton,
  CardLabel,
  FormLabel,
  Card,
} from '../components/styled-components'
import colors from '../colors'

import '../App.sass'

import 'bulma-checkradio/dist/css/bulma-checkradio.min.css'

import 'bulma-tagsinput/dist/css/bulma-tagsinput.min.css'
import bulmaTagsInput from 'bulma-tagsinput/dist/js/bulma-tagsinput.min.js'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import Modal from 'react-modal'

const fetch = require('node-fetch')
const FormData = require('form-data')
const queryString = require('query-string')
const Cookies = require('js-cookie')
const Redirect = require('react-router-dom').Redirect

const dev = false

class PollPage extends React.Component {
  constructor(props) {
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
        unit: '%',
        width: 30,
        aspect: 18 / 9, // This is the aspect ratio that was previously being used
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
          enabled: false,
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
        },
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
          padding: '51px',
        },
        overlay: {
          zIndex: 10,
          backgroundColor: 'rgba(174, 174, 174, 0.4)',
        },
      },
      isAdmin: false,
      accountName: null,
      numOptions: 2,
      pollOptions: { 0: '', 1: '' },
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
    this.updatePollOption = this.updatePollOption.bind(this)
    this.addPollOption = this.addPollOption.bind(this)
    this.deletePollOption = this.deletePollOption.bind(this)
  }

  componentWillMount() {
    var accountID = Cookies.get('accountID')
    if (accountID) {
      var url = dev
        ? 'http://localhost:5000/portal/account?account_id='
        : 'https://api.pennlabs.org/portal/account?account_id='
      fetch(url + accountID)
        .then((response) => response.json())
        .then((json) => {
          this.setState({
            isAdmin: json.account.is_admin,
            accountName: json.account.name,
          })
        })
        .catch((error) => {
          console.log(
            'Unable to fetch account inforation with error message:' +
              error.message
          )
        })
    }

    const query = queryString.parse(this.props.location.search)
    if ('id' in query) {
      const id = query.id
      this.setState({
        isSubmitted: true,
      })
      url = dev
        ? 'http://localhost:5000/portal/post/'
        : 'https://api.pennlabs.org/portal/post/'
      fetch(url + id + '?account=' + accountID)
        .then((response) => response.json())
        .then((json) => {
          var d = new Date()
          var n = parseInt(d.getTimezoneOffset() / 60)
          var startDateStr = json.start_date + '-0' + n + ':00'
          var endDateStr = json.end_date + '-0' + n + ':00'

          var filters = this.state.filters
          for (var filterObjKey in json.filters) {
            var filterObj = json.filters[filterObjKey]
            if (
              filterObj.type !== 'email-only' &&
              filterObj.type !== 'options'
            ) {
              var filterKey = filterObj.filter
              if (filterObj.type === 'class') {
                filterKey =
                  'year_' +
                  (parseInt(filterObj.filter) - this.state.seniorClassYear)
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
            imageCroppedFileName: this.getImageNameFromUrl(
              json.image_url_cropped
            ),
            postUrl: json.post_url,
            detailLabel: json.time_label,
            comments: json.comments,
            filters: filters,
            startDate: new Date(startDateStr),
            endDate: new Date(endDateStr),
            status: json.status,
            isApproved: json.approved,
          })
          var dateNow = new Date()
          if (
            dateNow > this.state.startDate &&
            dateNow < this.state.endDate &&
            this.state.isApproved
          ) {
            this.setState({ isLive: true })
          }
          if (dateNow > this.state.endDate) {
            this.setState({ isExpired: true })
          }

          bulmaTagsInput.attach()

          let imageURL = this.state.imageUrl

          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.addEventListener(
            'load',
            () => {
              let canvas = document.createElement('canvas')
              let ctx = canvas.getContext('2d')

              canvas.width = img.width
              canvas.height = img.height

              ctx.drawImage(img, 0, 0)

              try {
                let dataUrl = canvas.toDataURL('image/png')
                this.setState({ src: dataUrl })
              } catch (err) {
                console.log('Error: ' + err)
              }
            },
            false
          )
          img.src = imageURL
        })
        .catch((error) => {
          bulmaTagsInput.attach()
          alert('Unable to fetch post with error message:' + error.message)
        })
    } else {
      // By default, uncheck all filter boxes
      var filters = this.state.filters
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
    const query = queryString.parse(this.props.location.search)
    if (!('id' in query)) {
      bulmaTagsInput.attach()
    }
  }

  updateInput(event) {
    const name = event.target.name
    this.setState({ [name]: event.target.value })
  }

  getImageNameFromUrl(imageUrl) {
    var split = imageUrl.split('penn.mobile.portal/images/')
    var imageFileName = imageUrl
    if (split.length > 1) {
      imageFileName = split[1]
      var split2 = imageFileName.split('/')
      if (split2.length > 1) {
        imageFileName = decodeURIComponent(split2[1])
      }
    }
    return imageFileName
  }

  async loadFileCrop(file) {
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => this.setState({ src: reader.result }),
      (document.getElementById('buttonOpenCrop').style.display = 'block')
    )
    reader.readAsDataURL(file)
  }

  onImageLoaded(image) {
    this.imageRef = image
  }

  onCropComplete(crop) {
    this.makeClientCrop(crop)
  }

  onCropChange(crop) {
    this.setState({ crop })
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'cropped.png'
      )
      this.setState({ croppedImageUrl })
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

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
    )

    return new Promise((resolve, reject) => {
      document.getElementById('buttonCrop').onclick = () => {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Canvas is empty')
            return
          }
          resolve(this.saveFileCropped(blob, fileName))
        }, 'image/png')
      }
    })
  }

  saveFile(event) {
    const file = event.target.files[0]
    const accountID = Cookies.get('accountID')
    const formData = new FormData()
    formData.append('image', file)
    formData.append('account', accountID)
    this.loadFileCrop(file)
    var url = dev
      ? 'http://localhost:5000/portal/post/image'
      : 'https://api.pennlabs.org/portal/post/image'
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        const imageUrl = json.image_url
        var imageFileName = this.getImageNameFromUrl(imageUrl)
        this.setState({ imageFileName: imageFileName })
        this.setState({ imageUrl: imageUrl })

        const imageUrlCropped = json.image_url
        var imageCroppedFileName = this.getImageNameFromUrl(imageUrlCropped)
        this.setState({ imageCroppedFileName: imageCroppedFileName })
        this.setState({ imageUrlCropped: imageUrlCropped })
      })
      .catch((error) => {
        alert(`Something went wrong. Please try again. ${error}`)
      })
  }

  saveFileCropped(file, fileName) {
    const accountID = Cookies.get('accountID')
    const formData = new FormData()
    formData.append('image', file, fileName)
    formData.append('account', accountID)
    var url = dev
      ? 'http://localhost:5000/portal/post/image'
      : 'https://api.pennlabs.org/portal/post/image'
    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        const imageUrlCropped = json.image_url
        var imageCroppedFileName = this.getImageNameFromUrl(imageUrlCropped)
        this.setState({ imageCroppedFileName: imageCroppedFileName })
        this.setState({ imageUrlCropped: imageUrlCropped })
      })
      .catch((error) => {
        alert(`Something went wrong. Please try again. ${error}`)
      })
  }

  onSubmit() {
    if (!this.state.title) {
      alert('Please include a title.')
      return
    } else if (!this.state.imageUrl) {
      alert('Please select an image.')
      return
    } else if (!this.state.startDate || !this.state.endDate) {
      alert('Please select a start and end date.')
      return
    }

    function formatDate(date) {
      function paddedString(amt) {
        return amt < 10 ? '0' + amt : amt
      }

      var month = paddedString(date.getMonth() + 1)
      var day = paddedString(date.getDate())
      var hours = paddedString(date.getHours())
      var minutes = paddedString(date.getMinutes())

      var strTime = hours + ':' + minutes + ':00'
      return date.getFullYear() + '-' + month + '-' + day + 'T' + strTime
    }

    var filters = []
    for (var type in this.state.filters) {
      if (!this.state.filters.hasOwnProperty(type)) continue
      for (var key in this.state.filters[type]) {
        if (!this.state.filters[type].hasOwnProperty(key)) continue

        const checked = this.state.filters[type][key]
        if (checked) {
          var filter = key
          if (type === 'class') {
            var addedYears = parseInt(key.split('_')[1])
            var year = this.state.seniorClassYear + addedYears
            filter = String(year)
          }

          filters.push({
            type: type,
            filter: filter,
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
        type: 'email-only',
        filter: 'none',
      })
    }

    var accountID = Cookies.get('accountID')
    var url = dev
      ? 'http://localhost:5000/portal/post'
      : 'https://api.pennlabs.org/portal/post'
    fetch(url + (this.state.id ? '/update' : '/new'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: this.state.id,
        account_id: accountID,
        image_url: this.state.imageUrl,
        image_url_cropped: this.state.imageUrlCropped,
        post_url: this.state.postUrl,
        source: 'Penn Labs',
        title: this.state.title,
        subtitle: this.state.subtitle,
        time_label: this.state.detailLabel,
        start_date: formatDate(this.state.startDate),
        end_date: formatDate(this.state.endDate),
        filters: filters,
        emails: [],
        testers: ['joshdo@wharton.upenn.edu', 'mattrh@wharton.upenn.edu'],
      }),
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
    const id = event.target.id
    const name = event.target.name
    const type = name.split('_')[0]
    const checked = event.target.checked

    var filters = this.state.filters
    filters[type][id] = checked
    this.setState({ filters: filters })
  }

  updateStartDate(date) {
    this.setState({
      startDate: date,
    })
  }

  updateEndDate(date) {
    this.setState({
      endDate: date,
    })
  }

  showFilters() {
    var filters = this.state.filters
    filters.options.enabled = !filters.options.enabled
    this.setState({ filters: filters })
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  addPollOption() {
    // maximum number of options = 6
    if (Object.keys(this.state.pollOptions).length < 6) {
      this.setState({ numOptions: this.state.numOptions + 1 })
      this.setState({
        pollOptions: { ...this.state.pollOptions, [this.state.numOptions]: '' },
      })
    }
  }

  deletePollOption(key) {
    let oldOptions = this.state.pollOptions
    delete oldOptions[key]
    this.setState({ pollOptions: oldOptions })
  }

  updatePollOption(event) {
    const key = event.target.name
    this.setState({
      pollOptions: { ...this.state.pollOptions, [key]: event.target.value },
    })
  }

  render() {
    if (!Cookies.get('accountID')) {
      return <Redirect to="/login" />
    }

    const { crop, src } = this.state

    const pollOptionDivs = Object.entries(this.state.pollOptions).map(
      ([key, value]) => (
        <div key={key} className="control has-icons-right">
          <input
            className="input"
            type="text"
            name={key}
            value={value || ''}
            placeholder={'Ex: Poll Option'}
            onChange={this.updatePollOption}
            style={{
              border: 'solid 1px #e6e6e6',
              fontSize: '14px',
              borderRadius: '5px',
              marginBottom: '6px',
            }}
          />
          {key >= 2 && (
            <div onClick={() => this.deletePollOption(key)}>
              <span
                className="icon is-small is-right"
                key={key}
                style={{
                  height: '2em',
                  borderLeft: '1px solid #e5e5e5',
                  pointerEvents: 'initial',
                }}
              >
                <i className="fas fa-times"></i>
              </span>
            </div>
          )}
        </div>
      )
    )

    return (
      <>
        <Header isAdmin={this.state.isAdmin} />
        <div
          className="columns is-mobile"
          style={{ margin: '20px 0px 0px 91px' }}
        >
          <div className="column has-text-centered">
            <div>
              <div className="columns is-mobile">
                <div className="column has-text-centered is-7">
                  <div className="level-left" style={{ marginBottom: '24px' }}>
                    <Link to="/post">
                      <ToggleButton isActive={false} isLeft={true}>
                        New Post
                      </ToggleButton>
                    </Link>
                    <ToggleButton isActive={true} isLeft={false}>
                      New Poll
                    </ToggleButton>
                  </div>
                  <div className="level">
                    <div className="level-left is-size-4 has-text-left">
                      <b>Poll Details</b>
                    </div>
                    <div className="level-right">
                      <Button color={'#ffd4d1'} hide={!this.state.isSubmitted}>
                        Delete
                      </Button>
                      <Button color={colors.GRAY}>Save</Button>
                      <Button color={colors.GREEN} onClick={this.onSubmit}>
                        Submit
                      </Button>
                    </div>
                  </div>
                  <StatusBar
                    isExpired={this.state.isExpired}
                    isSubmitted={this.state.isSubmitted}
                    isApproved={this.state.isApproved}
                    isLive={this.state.isLive}
                  />
                  {/* <NewPostLabel text="Current Status" single={true} /> */}
                  {/* <PostStatusVisibility isApproved={this.state.isApproved} postStatus={this.state.status} notifyChange={this.setState}/> */}
                  {/* <NewPostLabel text="Post Options" single={true} /> */}
                  <CardLabel>Content</CardLabel>
                  <Card>
                    <FormLabel>Question</FormLabel>
                    <input
                      className="input"
                      type="text"
                      name="title"
                      value={this.state.title || ''}
                      placeholder="Ex: What do you think about Penn's COVID response?"
                      onChange={this.updateInput}
                      style={{
                        border: 'solid 1px #e6e6e6',
                        fontSize: '14px',
                      }}
                    />

                    <div style={{ marginTop: 18 }}>
                      <FormLabel>Upload Cover Image</FormLabel>
                    </div>
                    {/* no right-side border radius when file name displayed */}
                    <div
                      className={
                        this.state.imageFileName
                          ? 'file has-name is-small is-info'
                          : 'file is-small is-info'
                      }
                    >
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          accept="image/*"
                          onChange={this.saveFile}
                        />
                        <span className="file-cta" style={{ height: '35px' }}>
                          <span className="file-icon">
                            <i className="fas fa-upload"></i>
                          </span>
                          Browse...
                        </span>
                        <span
                          className="file-name"
                          style={{
                            height: '35px',
                            lineHeight: '35px',
                            visibility: this.state.imageFileName
                              ? 'visible'
                              : 'hidden',
                          }}
                        >
                          {this.state.imageFileName || ''}
                        </span>
                      </label>
                    </div>
                    <Button
                      id="buttonOpenCrop"
                      onClick={this.openModal}
                      color={colors.IMAGE_BLUE}
                      hide={!this.state.imageUrl}
                    >
                      Crop Image
                    </Button>

                    <Modal
                      isOpen={this.state.modalIsOpen}
                      onRequestClose={this.closeModal}
                      style={this.state.modalStyle}
                      contentLabel="Cropping Modal"
                    >
                      <div className="is-size-4">
                        <b>Poll Details</b>
                      </div>
                      <div id="cropping" style={{ paddingTop: '27px' }}>
                        {src && (
                          <ReactCrop
                            src={src}
                            crop={crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                          />
                        )}
                        <Button
                          id="buttonCrop"
                          color={colors.IMAGE_BLUE}
                          onClick={this.closeModal}
                        >
                          Crop and Upload
                        </Button>
                      </div>
                    </Modal>
                    <div>
                      <FormLabel style={{ paddingTop: '12px' }}>
                        Poll Options
                      </FormLabel>
                      {pollOptionDivs}
                    </div>
                    <div className="level">
                      <div className="level-left">
                        <Button
                          onClick={this.addPollOption}
                          color={colors.MEDIUM_BLUE}
                        >
                          <span style={{ height: '35px', marginRight: '6px' }}>
                            <i className="fas fa-plus"></i>
                          </span>
                          Add Option
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <CardLabel>Dates</CardLabel>
                  <Card>
                    <DatePickerCard
                      updateStartDate={this.updateStartDate}
                      updateEndDate={this.updateEndDate}
                    />
                  </Card>

                  <CardLabel>
                    Filters
                    <span
                      style={{
                        marginLeft: 21,
                        fontSize: 12,
                        color: '#999999',
                        fontWeight: 500,
                        letterSpacing: 0.2,
                      }}
                    >
                      <span className="icon">
                        <i className="fas fa-info-circle"></i>
                      </span>
                      If no filters are applied, the post will be shared with
                      all Penn Mobile users by default.
                    </span>
                  </CardLabel>
                  <Card>
                    <div className="columns">
                      <div className="column is-3">
                        <FormLabel>Class Year</FormLabel>
                      </div>
                      <div className="column is-2">
                        <label className="label">
                          <input
                            id="year_0"
                            type="checkbox"
                            checked={this.state.filters.class.year_0}
                            name="class_0"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">2021</div>
                        </label>
                      </div>
                      <div className="column is-2">
                        <label className="label">
                          <input
                            id="year_1"
                            type="checkbox"
                            checked={this.state.filters.class.year_1}
                            name="class_1"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">2022</div>
                        </label>
                      </div>
                      <div className="column is-2">
                        <label className="label">
                          <input
                            id="year_2"
                            type="checkbox"
                            checked={this.state.filters.class.year_2}
                            name="class_2"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">2023</div>
                        </label>
                      </div>
                      <div className="column is-2">
                        <label className="label">
                          <input
                            id="year_3"
                            type="checkbox"
                            checked={this.state.filters.class.year_3}
                            name="class_3"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">2024</div>
                        </label>
                      </div>
                    </div>

                    <div
                      style={{
                        margin: '20px 0px 20px 0px',
                        float: 'center',
                        verticalAlign: 'middle',
                        clear: 'left',
                      }}
                    ></div>
                    <div className="columns">
                      <div className="column is-3">
                        <FormLabel>School</FormLabel>
                      </div>
                      <div className="column is-2">
                        <label className="label" htmlFor="COL">
                          <input
                            id="COL"
                            type="checkbox"
                            checked={this.state.filters.school.COL}
                            name="school_COL"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">College</div>
                        </label>
                      </div>
                      <div className="column is-2">
                        <label className="label" htmlFor="WH">
                          <input
                            id="WH"
                            type="checkbox"
                            checked={this.state.filters.school.WH}
                            name="school_WH"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">Wharton</div>
                        </label>
                      </div>
                      <div className="column is-2">
                        <label className="label" htmlFor="EAS">
                          <input
                            id="EAS"
                            type="checkbox"
                            checked={this.state.filters.school.EAS}
                            name="school_EAS"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">SEAS</div>
                          <input
                            className="is-checkradio is-small"
                            id="EAS"
                            type="checkbox"
                            checked={this.state.filters.school.EAS}
                            name="school_EAS"
                            onChange={this.setCheckBoxState}
                          />
                        </label>
                      </div>
                      <div className="column is-2">
                        <label className="label" htmlFor="NUR">
                          <input
                            id="NUR"
                            type="checkbox"
                            checked={this.state.filters.school.NUR}
                            name="school_NUR"
                            onChange={this.setCheckBoxState}
                          />
                          <div className="checkmark">Nursing</div>
                        </label>
                        <input
                          className="is-checkradio is-small"
                          id="NUR"
                          type="checkbox"
                          checked={this.state.filters.school.NUR}
                          name="school_NUR"
                          onChange={this.setCheckBoxState}
                        />
                      </div>
                    </div>
                  </Card>
                  <CardLabel>
                    Notes
                    <span
                      style={{
                        marginLeft: 21,
                        fontSize: 12,
                        color: '#999999',
                        fontWeight: 500,
                        letterSpacing: 0.2,
                      }}
                    >
                      <span className="icon">
                        <i className="fas fa-info-circle"></i>
                      </span>
                      Portal administrators will see this message during the
                      review process.
                    </span>
                  </CardLabel>
                  <Card>
                    <div style={{ height: 94 }}>
                      <textarea
                        className="textarea is-small"
                        type="text"
                        name="comments"
                        value={this.state.comments || ''}
                        placeholder="Enter any comments here."
                        rows="2"
                        onChange={this.updateInput}
                        style={{
                          border: 'solid 1px #e6e6e6',
                          height: 94,
                          fontSize: '14px',
                        }}
                      />
                    </div>
                  </Card>
                </div>

                <div className="column has-text-centered is-5">
                  <Preview
                    imageUrl={this.state.imageUrlCropped}
                    title={this.state.title}
                    subtitle={this.state.subtitle}
                    source={this.state.accountName}
                    detailLabel={this.state.detailLabel}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default PollPage
