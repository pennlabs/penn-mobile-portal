import React from 'react'

const NoPostsMessage = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="columns is-mobile">
        <div className="row">
          <img
            src="images/desk.svg"
            alt="Penn Mobile Logo"
            width="366"
            height="321"
          ></img>
        </div>

        <div className="row" style={{ margin: '0 0 0 50px' }}>
          <h2 className="title is-2">Oh, hello there.</h2>
          <span
            style={{
              display: 'block',
              wordWrap: 'break-word',
              fontSize: '20px',
              margin: '10px 0 5px 0',
            }}
          >
            Looks like you're new here.
          </span>

          <span
            style={{
              display: 'block',
              wordWrap: 'break-word',
              fontSize: '20px',
              maxWidth: '500px',
            }}
          >
            Penn Mobile Portal allows organizations to connect and engage with
            students on the Penn Mobile app. Make posts for recruiting, events,
            or campaigns and watch in real time as users see and interact with
            your content.
          </span>

          <span
            style={{
              display: 'block',
              wordWrap: 'break-word',
              fontSize: '20px',
              margin: '15px 0 5px 0',
            }}
          >
            Ready to get started?{' '}
            <a href="/post">
              Create a new post{' '}
              <i
                className="fas fa-arrow-circle-right"
                style={{
                  fontSize: '17px',
                  paddingBottom: 3,
                  verticalAlign: 'middle',
                }}
              ></i>
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default NoPostsMessage
