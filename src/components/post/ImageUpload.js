import React, { useState, useCallback } from 'react'
import ReactCrop from 'react-image-crop'
import Modal from 'react-modal'
import 'react-image-crop/dist/ReactCrop.css'
import { Button } from '../styled-components'
import { colors } from '../../utils/constants'
import { fetchApiRequest } from '../../utils/common'

const modalStyle = {
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
}

const ImageUpload = ({ setImageUrl, accountID }) => {
  const [imageData, setImageData] = useState({
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
    imageRef: null,
  })
  const [modalOpen, setModalOpen] = useState(false)

  const updateImageData = useCallback((newState) => {
    setImageData((currentState) => ({ ...currentState, ...newState }))
  }, [])

  const loadFileCrop = async (file) => {
    const reader = new FileReader()
    reader.addEventListener(
      'load',
      () => updateImageData({ src: reader.result }),
      (document.getElementById('buttonOpenCrop').style.display = 'block')
    )
    reader.readAsDataURL(file)
  }

  const makeClientCrop = async (crop) => {
    if (imageData.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageData.imageRef,
        crop,
        'cropped.png'
      )
      updateImageData({ croppedImageUrl })
    }
  }

  const getCroppedImg = (image, crop, fileName) => {
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
          resolve(saveFileCropped(blob, fileName))
        }, 'image/png')
      }
    })
  }

  const saveFileCropped = (file, fileName) => {
    const formData = new FormData()
    formData.append('image', file, fileName)
    formData.append('account', accountID)
    fetchApiRequest('post/image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        const imageUrlCropped = json.image_url
        var imageCroppedFileName = getImageNameFromUrl(imageUrlCropped)
        updateImageData({ imageCroppedFileName, imageUrlCropped })
        setImageUrl(imageUrlCropped)
      })
      .catch((error) => {
        alert(`Something went wrong. Please try again. ${error}`)
      })
  }

  const getImageNameFromUrl = (imageUrl) => {
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

  const saveFile = (event) => {
    const file = event.target.files[0]
    if (!file) {
      return
    }
    const formData = new FormData()
    formData.append('image', file)
    formData.append('account', accountID)
    loadFileCrop(file)
    fetchApiRequest('post/image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((json) => {
        const imageUrl = json.image_url
        let imageFileName = getImageNameFromUrl(imageUrl)
        updateImageData({ imageFileName, imageUrl })
        setImageUrl(imageUrl)

        const imageUrlCropped = json.image_url
        var imageCroppedFileName = getImageNameFromUrl(imageUrlCropped)
        updateImageData({ imageCroppedFileName, imageUrlCropped })
      })
      .catch((error) => {
        alert(`Something went wrong. Please try again. ${error}`)
      })
  }

  return (
    <div>
      <div className={'file is-small is-info'}>
        <label className="file-label">
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={saveFile}
          />
          <span className="file-cta" style={{ height: '35px' }}>
            <span className="file-icon">
              <i className="fas fa-upload"></i>
            </span>
            Browse...
          </span>
        </label>
      </div>
      {/* TODO: add some loading state? imageData.imageUrl should be imageUrl prop */}
      <Button
        id="buttonOpenCrop"
        onClick={() => setModalOpen(true)}
        color={colors.IMAGE_BLUE}
        hide={!imageData.imageUrl}
      >
        Crop Image
      </Button>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={modalStyle}
        contentLabel="Cropping Modal"
      >
        <div className="is-size-4">
          <b>Poll Details</b>
        </div>
        <div id="cropping" style={{ paddingTop: '27px' }}>
          {imageData.src && (
            <ReactCrop
              src={imageData.src}
              crop={imageData.crop}
              onImageLoaded={(image) => updateImageData({ imageRef: image })}
              onComplete={makeClientCrop}
              onChange={(crop) => updateImageData({ crop })}
            />
          )}
          <Button
            id="buttonCrop"
            color={colors.IMAGE_BLUE}
            onClick={() => setModalOpen(false)}
          >
            Crop and Upload
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default ImageUpload
