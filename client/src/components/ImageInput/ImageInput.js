import React from 'react'
import PropTypes from 'prop-types'
import './ImageInput.css'
import {Button} from "@material-ui/core";

const readFileAsDataURL = (file) =>
  new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = (event) => {
      resolve(event.target.result)
    }

    reader.readAsDataURL(file)
  })

const resizeImage = (imageURL, canvas, maxValue, side) =>
  new Promise(resolve => {
    const image = new Image()
      image.crossOrigin="anonymous"
      image.onload = () => {
      const context = canvas.getContext('2d')
      
      if (side === 'width'){
          if (image.width > maxValue) {
              image.height *= maxValue / image.width
              image.width = maxValue
          }
      }else{
          if (image.height > maxValue) {
              image.width *= maxValue / image.height
              image.height = maxValue
          }
      }
    
      context.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = image.width
      canvas.height = image.height

      context.drawImage(image, 0, 0, image.width, image.height)

      resolve(canvas.toDataURL('image/jpeg'))
    }

    image.src = imageURL
  })

/**
 * A custom <input> that dynamically reads and resizes image files before
 * submitting them to the server as data URLs. Also, shows a preview of the image.
 */
class ImageInput extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    maxHeight: PropTypes.number
  }
  
  constructor(props){
     super(props)
     this.fileInput = React.createRef();
     this.changeButton = React.createRef();
  }
  state = {
    value: ''
  }
  
  showImg = () => {
      resizeImage(this.props.value, this.canvas, this.props.maxValue, "width").then(url => {
          this.setState({ value: url })
      })
  }

  handleFileChange = (event) => {
    const file = event.target.files[0]

    if (file && file.type.match(/^image\//)) {
      readFileAsDataURL(file).then(originalURL => {
        resizeImage(originalURL, this.canvas, this.props.maxValue, "width").then(url => {
          this.setState({ value: url })
        })
      })
    } else {
      this.setState({ value: '' })
    }
  }

  handleFormReset = () => {
    this.setState({ value: '' })
  }
  
  handleChangePhoto = (e) => {
     e.preventDefault()
     e.stopPropagation()
     this.fileInput.current.click()
  }

  componentDidMount() {
    this.canvas = document.createElement('canvas')
    this.fileInput.current.form.addEventListener('reset', this.handleFormReset)
    resizeImage(this.props.value, this.canvas, this.props.maxValue, "width").then(url => {
      this.setState({ value: url })
    })
  }

  componentWillUnmount() {
    this.fileInput.current.form.removeEventListener('reset', this.handleFormReset)
  }

  render() {
    const { className, name, maxValue } = this.props
    const { value } = this.state
   
    const style = {
        width:maxValue,
        height:maxValue
    }
    if (value) {
      style.backgroundImage = `url("${value}")`
    }

    return (
          <div className={className} style={style}>
            <input type="hidden" name={name} value={value} />
            <input
              ref={this.fileInput}
              type="file"
              onChange={this.handleFileChange}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
              }}
            />
              <Button ref={this.changeButton} className={"edit-photo-button"} onClick={this.handleChangePhoto}>Change Photo
              </Button>
          </div>
    )
  }
}

export default ImageInput
