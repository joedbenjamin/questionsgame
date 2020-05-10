import { withStyles } from '@material-ui/styles';
import { fade, Box, makeStyles } from '@material-ui/core';

const QuestionWrapper = withStyles((theme) => ({
  root: {
    backgroundColor: fade(theme.palette.secondary.main, 0.43),
    border: 'none',
    // borderRadius: '1em',
    width: '85%',
    minHeight: '15em',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: '1.5em',
    boxShadow: '0 1em 1.5em .5em rgba(0, 0, 0, .8)',
  },
}))(Box);

const QuestionTextWrapper = withStyles(() => ({
  root: {
    width: '90%',
    color: 'black',
    textAlign: 'center',
    fontSize: '2.8em',
    padding: '1em 0',
  },
}))(Box);

const QuestionsAnsweredOutterWrapper = withStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '4em',
    backgroundColor: 'rgba(0,0,0,.9)',
    width: '100%',
  },
}))(Box);

const QuestionsAnsweredWrapper = withStyles(() => ({
  root: {
    width: '95%',
    height: '5%',
    top: '5%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
}))(Box);

const useStyles = makeStyles({
  questionsAnswered: {
    width: (props: any) => `${100 / props.count - 1}%`,
    height: '.625em',
    borderRadius: '1.25em',
    zIndex: 10,
  },
});

export {
  useStyles,
  QuestionsAnsweredOutterWrapper,
  QuestionsAnsweredWrapper,
  QuestionWrapper,
  QuestionTextWrapper,
};
