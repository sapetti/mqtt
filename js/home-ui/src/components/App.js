import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import RaisedButton from 'material-ui/RaisedButton'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import TopBar from './TopBar'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
  render() {
    return (
        <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
          <div>
            <TopBar />
            <div>
              <RaisedButton label='Default'/>
            </div>
          </div>
        </MuiThemeProvider>
    );
  }
}

export default App
