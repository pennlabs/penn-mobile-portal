import React from 'react'
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'

class PostCard extends React.Component {
  render() {
    const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis);

    const regularFont = "HelveticaNeue, Helvetica, sans-serif, serif";
    const mediumFont = "HelveticaNeue-Medium, Helvetica-Medium, sans-serif, serif";
    const boldFont = "HelveticaNeue-Bold, Helvetica-Bold, sans-serif, serif";

    var dateNow = new Date();
    var statusColor;
    var statusText;
    var statusSymbol;

    if ((this.props.status.toUpperCase() == 'SUBMITTED' || this.props.status.toUpperCase() == 'UPDATED') && dateNow < this.props.endDate && !this.props.approved) {
      statusColor = '#209cee'
      statusText = 'Awaiting Approval'
      statusSymbol = 'fas fa-edit'
    }
    if (this.props.status.toUpperCase() == 'DRAFT') {
      statusColor = '#999999'
      statusText = 'Draft'
      statusSymbol = 'fas fa-edit'
    }
    if (dateNow < this.props.publishDate && this.props.approved) {
      statusColor = '#3faa6d'
      statusText = 'Approved'
      statusSymbol = 'fas fa-edit'
    }
    if (dateNow > this.props.publishDate && dateNow < this.props.endDate && this.props.approved) {
      statusColor = '#3faa6d'
      statusText = 'Live'
      statusSymbol = 'far fa-circle'
    }
    if (this.props.status.toUpperCase() == 'REJECTED' && dateNow < this.props.endDate) {
      statusColor = '#ffc520'
      statusText = 'Needs Your Review'
      statusSymbol = 'fas fa-exclamation-circle'
    }
    if (dateNow > this.props.endDate) {
      statusColor = '#999999'
      statusText = `Expired ${(this.props.endDate.getMonth() + 1) + "/" + this.props.endDate.getDate() + "/" + (this.props.endDate.getFullYear() % 2000)}`
      statusSymbol = 'fas fa-copy'
    }

    return(
      <div className="row has-text-centered">
        <div className="placeholder" style={{margin: "-15px 0px", borderRadius: 5}}>
          <div className="columns is-vcentered is-mobile" style={{padding: "0px 0px"}}>
            <div className="column has-text-centered">
              <div className="phone-preview" style={{
                //marginTop: 20,
                textAlign: 'center',
                transformOrigin: 'top center',
                transform: 'scale(0.9)'
              }}>
                <div className="placeholder" style={{
                  width: "345px"
                }}>
                  <a href={"post?id=" + this.props.id}>
                    <div className="screen" style={{
                      textAlign: 'left',
                      fontFamily: regularFont,
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}>
                      <div className="box" style={{
                        margin: 0,
                        backgroundColor: 'white',
                        boxShadow: '1px 1px 10px #ccc',
                        borderRadius: 15,
                        padding: 0,
                        minHeight: '380px'
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
                              backgroundColor: statusColor,
                              padding: 15,
                              paddingTop: 10,
                              paddingBottom: 10,
                            }}>
                              <span style={{
                                display: 'block',
                                wordWrap: 'break-word'
                              }}>
                                <b style={{
                                  color: '#fff',
                                  fontSize: 16,
                                  textAlign: 'left',
                                }}>{statusText}</b>
                                <b style={{
                                  float: 'right',
                                  color: '#fff',
                                  fontSize: 16,
                                  textAlign: 'right'
                                }}><i class={statusSymbol}></i></b>
                              </span>
                            </div>
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
                          paddingBottom: 10,
                        }}>
                            <span style={{
                              display: 'block',
                              wordWrap: 'break-word',
                              marginBottom: 4,
                            }}>
                              <span style={{
                                color: '#888',
                                fontSize: 14,
                                textAlign: 'left',
                              }}>{this.props.source}</span>
                              <span style={{
                                float: 'right',
                                color: '#888',
                                fontSize: 14,
                                textAlign: 'right',
                                marginTop: 3,
                              }}>{this.props.detailLabel}</span>
                            </span>
                            <b style={{
                              fontSize: 18,
                              lineHeight: 1.4,
                              display: 'block',
                              wordWrap: 'break-word',
                              marginBottom: 8,
                            }}>
                              <ResponsiveEllipsis
                                style={{whiteSpace: 'pre-wrap'}}
                                text={this.props.title}
                                maxLine='2'
                                ellipsis='...'
                                trimRight
                                basedOn='letters'
                              />
                            </b>
                            <span style={{
                              color: '#888',
                              lineHeight: 1.3,
                              fontSize: 14,
                              display: 'block',
                              wordWrap: 'break-word'
                            }}>
                              <ResponsiveEllipsis
                                style={{whiteSpace: 'pre-wrap'}}
                                text={this.props.subtitle}
                                maxLine='3'
                                ellipsis='...'
                                trimRight
                                basedOn='letters'
                              />
                            </span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PostCard
