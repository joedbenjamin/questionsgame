import {makeStyles} from '@material-ui/core';


/*
 * create empty array - let s:objs = []
 * yank inside bracket
 * yank all of bracket
 * loop throughk
 * getreg('a')
 * create a directory - key: value
 * 
 */


export const useStyles = makeStyles((theme) => ({
  inputsWrapper: {
    width: '80%',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    marginBottom: '2em',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    margin: '2em 0'
  },
  margin: {
    height: theme.spacing(10),
  },
  buttonsWrapper: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%'
  },
}));
