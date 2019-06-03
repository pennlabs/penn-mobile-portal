import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Home from './pages/Home.js'
import Post from './pages/Post.js'

import './App.sass';

//https://reacttraining.com/react-router/web/guides/basic-components

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/post" component={Post} />
        {/* when none of the above match, <NoMatch> will be rendered */}
        <Route component={Home} />
      </Switch>
    );
  }
}

// import 'bulma-calendar/dist/css/bulma-calendar.min.css';
// import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar.min.js';

// class App extends React.Component {
//   render() {
//       return (
//         <input
//           className="input"
//           type="text"
//           ref={node => {
//             const datePicker = new bulmaCalendar(node, {
//               startDate: null, // Date selected by default
//               dateFormat: 'MMMM DD, YYYY', // the date format `field` value
//               lang: 'en', // internationalization
//               overlay: false,
//               isRange: true,
//               labelFrom: 'Start Time',
//               labelTo: 'End Time',
//               closeOnOverlayClick: true,
//               closeOnSelect: true,
//               // callback functions
//               onSelect: null,
//               onOpen: null,
//               onClose: null,
//               onRender: null
//             });
//           }}
//         />
//       )
//   }
// }

export default App;
