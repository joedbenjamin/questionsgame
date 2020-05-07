import {makeStyles} from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  inputsWrapper: {
    width: '80%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: '25em',
    marginBottom: '2em',
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '2em'
  },
  margin: {
    height: theme.spacing(10),
  },
}));
