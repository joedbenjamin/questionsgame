import React, { useEffect, useState } from 'react';
import {
  GameWrapper,
  Horizontal,
  BottomWrapper,
  TimeRemaining,
  GlobalStyles,
  Background,
  Game,
} from './questions';
import Welcome from './components/welcome';
import ManageGameWrapper from './components/form';
import LeaderBoardComp from './components/leaderboard';
import Questions from './components/questions';
import { decodeHTML } from './utils';
import Answers from './components/answers';
import Errors from './components/errors';
import useForm from './components/form/useForm';
import {
  Divider,
  Backdrop,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
// import { FormContext } from './components/form';
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));
const getWebSocketURL: any = () =>
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_WEBSOCKETS_URL
    : process.env.REACT_APP_DEV_WEBSOCKETS_URL;

const ws = new WebSocket(getWebSocketURL());

export const FormContext = React.createContext<any>({});
const App = () => {
  const [gameId, setGameId] = useState('');
  const [clients, setClients] = useState([]);
  const [question, setQuestion]: any = useState('');
  const [questionId, setQuestionId]: any = useState('');
  const [answers, setAnswers]: any = useState([]);
  const [correctAnswerId, setCorrectAnswerId]: any = useState(undefined);
  const [answeredQuestions, setAnsweredQuestions]: any = useState([]);
  const [clientId, setClientId]: any = useState('');
  const [timeRemaining, setTimeRemaining]: any = useState(-1);
  const [isInGame, setIsInGame]: any = useState(false);
  const [serverError, setServerError]: any = useState(false);
  const [isLoading, setIsLoading]: any = useState(false);

  const { inputValues, handleOnChange } = useForm({
    name: '',
    joinGameId: '',
    numberOfQuestions: 10,
    secondsPerQuestion: 15,
  });
  const classes = useStyles();
  const {
    name,
    numberOfQuestions,
    secondsPerQuestion,
    joinGameId,
  } = inputValues;
  useEffect(() => {
    ws.onmessage = function (event) {
      // console.log(event);
      const data = JSON.parse(event.data);

      // if (data.method === 'create') {
      //   setGameId(data.gameId);
      //   setClients(data.clients);
      //   setClientId(data.clientId);
      //   setIsInGame(data.isInGame);
      // }
      // if (data.method === 'setClient') {
      //   setClientId(data.clientId);
      //   setIsInGame(data.isInGame);
      // }
      // if (data.method === 'updateClients') {
      //   setGameId(data.gameId || gameId);
      //   setClients(data.clients);
      // }
      // if (data.questionsAnswered) {
      //   setAnsweredQuestions(data.questionsAnswered);
      // }
      // if (data.method === 'sendQuestion') {
      //   setQuestion(data.question);
      //   setQuestionId(data.questionId);
      //   setCorrectAnswerId(undefined);
      //   setAnswers(data.answers);
      // }
      // if (data.method === 'checkGuess') {
      //   setCorrectAnswerId(data.correctAnswerId);
      //   setAnsweredQuestions(data.questionsAnswered);
      // }
      //
      // if (data.timeRemaining) {
      //   setTimeRemaining(data.timeRemaining);
      // }
      //
      // if (!!data.isInGame?.toString()) {
      //   console.log('isinggame', data.isInGame);
      //   setIsInGame(data.isInGame);
      // }
      //

      if (data.method === 'create') {
        setIsLoading(data.isLoading);
        if (data.error) {
          setServerError(data.error);
        }
      }

      if (data.gameId) {
        handleOnChange('joinGameId', data.gameId);
        setGameId(data.gameId);
      }

      if (data.clientId) {
        setClientId(data.clientId);
      }

      if (data.clients) {
        setClients(data.clients);
      }

      if (data.question) {
        setQuestion(data.question);
        setQuestionId(data.questionId);
        setCorrectAnswerId(undefined);
      }

      if (data.timeRemaining) {
        setTimeRemaining(data.timeRemaining);
      }

      if (data.answers) {
        setAnswers(data.answers);
      }

      if (data.correctAnswerId) {
        console.log(data);
        setCorrectAnswerId(data.correctAnswerId);
      }

      if (data.questionsAnswered) {
        setAnsweredQuestions(data.questionsAnswered);
      }

      if (!!data.isInGame?.toString()) {
        console.log('isinggame', data.isInGame);
        setIsInGame(data.isInGame);
      }

      if (data.method === 'endGame') {
        setGameId('-1');
        handleOnChange('joinGameId', '');
        setIsInGame(data.isInGame);
      }
    };
    ws.onopen = () => {
      ws.send(JSON.stringify({ method: 'connecting' }));
      // let obj = { method: 'create' };
      // ws.send(JSON.stringify(obj));
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if(!isInGame && !!!joinGameId){
      createGame();
    }
  };

  const createGame = () => {
    let obj = { method: 'create', name, numberOfQuestions, secondsPerQuestion };
    ws.send(JSON.stringify(obj));
  };

  const joinGame = () => {
    let obj = { method: 'join', gameId: joinGameId, name };
    ws.send(JSON.stringify(obj));
  };

  const startGame = () => {
    let obj = { method: 'start', gameId: gameId };
    ws.send(JSON.stringify(obj));
  };

  const checkGuess = (e: any) => {
    var obj = {
      method: 'guess',
      questionId,
      gameId,
      answerId: e.currentTarget.getAttribute('data-id'),
    };
    ws.send(JSON.stringify(obj));
  };

  return (
    <React.Fragment>
      <FormContext.Provider value={{ inputValues, handleOnChange }}>
        <GlobalStyles />
        {isLoading ? (
          <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        {/* <Errors /> */}
        <Background>
          <Welcome />
          <GameWrapper>
            <Game>
              <ManageGameWrapper
                isInGame={isInGame}
                handleFormSubmit={handleFormSubmit}
              />
              <LeaderBoardComp
                visible={!!gameId}
                gameId={gameId}
                clients={clients}
                clientId={clientId}
              />
              <Divider />
              <BottomWrapper timeRemaining={timeRemaining}>
                <TimeRemaining>
                  {timeRemaining < 0 ? '0' : timeRemaining}
                </TimeRemaining>
                <Questions
                  question={decodeHTML(question || '')}
                  answeredQuestions={answeredQuestions}
                />
                <Answers
                  checkGuess={checkGuess}
                  answers={answers}
                  correctAnswerId={correctAnswerId}
                />
              </BottomWrapper>
            </Game>
          </GameWrapper>
        </Background>
      </FormContext.Provider>
    </React.Fragment>
  );
};

export default App;
