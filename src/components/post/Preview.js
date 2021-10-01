import React from 'react'

class Preview extends React.Component {
  render() {
    const regularFont = "HelveticaNeue, Helvetica, sans-serif, serif";

    return (
      <div className="phone-preview" style={{
        marginTop: 20,
        textAlign: 'center',
        transformOrigin: 'top center',
        transform: 'scale(0.8)'
      }}>
        <div className="marvel-device iphone-x">
          <div className="notch" style={{marginTop: -1}}>
            <div className="camera"></div>
            <div className="speaker"></div>
          </div>
          <div className="top-bar"></div>
          <div className="sleep"></div>
          <div className="bottom-bar"></div>
          <div className="volume"></div>
          <div className="overflow">
            <div className="shadow shadow--tr"></div>
            <div className="shadow shadow--tl"></div>
            <div className="shadow shadow--br"></div>
            <div className="shadow shadow--bl"></div>
          </div>
          <div className="inner-shadow"></div>
          <div className="screen" style={{
            textAlign: 'left',
            fontFamily: regularFont,
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            <img src="images/phone_header.png" style={{width: '100%'}} alt="Phone Header" />
            <div className="box" style={{
              backgroundColor: 'white',
              boxShadow: '1px 1px 10px #ccc',
              borderRadius: 15,
              padding: 0,
              margin: "15px 20px 15px 20px"
            }}>
              <div className="img-wrapper" style={{
                backgroundColor: '#eee',
                borderRadius: '15px 15px 0 0',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  height: 175,
                  backgroundImage: 'url("' + this.props.imageUrl + '")'
                }} />
              </div>
              
              <div style={{
                padding: 15,
                paddingTop: 8,
                paddingBottom: 10
              }}>
                <span style={{
                  display: 'block',
                  wordWrap: 'break-word',
                  marginBottom: 4
                }}>
                  <span style={{
                    color: '#888',
                    fontSize: 14,
                    textAlign: 'left'
                  }}>
                    {this.props.source}
                  </span>

                  <span style={{
                    float: 'right',
                    color: '#888',
                    fontSize: 14,
                    textAlign: 'right',
                    marginTop: 3
                  }}>
                    {this.props.detailLabel}
                  </span>
                </span>
                
                <b style={{
                  fontSize: 18,
                  lineHeight: 1.4,
                  display: 'block',
                  wordWrap: 'break-word',
                  marginBottom: 8
                }}>
                  {this.props.title}
                </b>

                <span style={{
                  color: '#888',
                  lineHeight: 1.3,
                  fontSize: 14,
                  display: 'block',
                  wordWrap: 'break-word'
                }}>
                  {this.props.subtitle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Preview;
