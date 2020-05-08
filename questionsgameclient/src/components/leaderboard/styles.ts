import { withStyles, makeStyles } from '@material-ui/styles';
import { TableRow, TableCell, fade } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    width: '100%',
    margin: '2em 0',
    border: 'none'
  },
  container: {
    maxHeight: '35%',
  },
  currentUser: {
    position: 'relative',
    left:0,
    top: -5,
    width: '2em',
    height: '2em',
    zIndex: 1
  },
});
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: fade(theme.palette.common.black, 0.6),
    },
    '&:nth-of-type(even)': {
      backgroundColor: fade(theme.palette.common.black, 0.4),
    },
    border: 'none'
  },
}))(TableRow);

export { useStyles, StyledTableRow, StyledTableCell };
