import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {purple, deepOrange} from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#FFF8DC',
    },
    secondary: deepOrange,
    type: 'dark',
    contrastThreshold: 4
  },
  typography: {
    fontWeightRegular: 500,
    fontSize: 22,
  },
  overrides: {
    // MuiInput: {
    //   underline: {
    //     display: 'none'
    //   }
    // }
  }
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
