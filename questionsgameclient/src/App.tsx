import React, { useEffect } from 'react';
import { useLocalStore, observer } from 'mobx-react-lite';
import {
  GameWrapper,
  BottomWrapper,
  TimeRemaining,
  GlobalStyles,
  Background,
  Game,
} from './questions';
import ManageGameWrapper from './components/form';
import LeaderBoardComp from './components/leaderboard';
import Questions from './components/questions';
import { decodeHTML, getWebSocketURL } from './utils';
import Answers from './components/answers';
import ReconnectingWebSocket from 'reconnecting-websocket';
import useForm from './components/form/useForm';
import {
  Divider,
  Backdrop,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import GameStore from './stores/gameStore';
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ws = new ReconnectingWebSocket(getWebSocketURL());

export const FormContext = React.createContext<any>({});
const App = observer(() => {
  const store = useLocalStore(() => GameStore);
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
    ws.addEventListener('message', function (event) {
      const data = JSON.parse(event.data);
      if (data.clientId) {
        window.localStorage.setItem('clientId', data.clientId);
      }
      if (data.gameId) {
        window.localStorage.setItem('gameId', data.gameId);
        handleOnChange('joinGameId', data.gameId);
      }
      if (data.question) {
        store.setValuesByName({ correctAnswerId: undefined });
      }
      if (data.method === 'endGame') {
        store.setValuesByName({ gameId: -1 });
        handleOnChange('joinGameId', '');
      }
      store.setValuesByName(data);
    });
    ws.addEventListener('open', () => {
      ws.send(JSON.stringify({ method: 'connecting' }));
      const clientId = window.localStorage.getItem('clientId');
      const gameId = window.localStorage.getItem('gameId');
      if (!!clientId && !!gameId) {
        const obj = {
          method: 'reconnect',
          clientId,
          gameId,
        };
        ws.send(JSON.stringify(obj));
      }
    });
    ws.addEventListener('close', () => {
      store.setValuesByName({ isLoading: true });
    });
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!store.isInGame && !!!joinGameId) {
      createGame();
    } else if (!store.isInGame && !!joinGameId) {
      joinGame();
    } else if (store.isInGame) {
      startGame();
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
    let obj = { method: 'start', gameId: store.gameId };
    ws.send(JSON.stringify(obj));
  };

  const checkGuess = (e: any) => {
    var obj = {
      method: 'guess',
      questionId: store.questionId,
      gameId: store.gameId,
      answerId: e.currentTarget.getAttribute('data-id'),
    };
    ws.send(JSON.stringify(obj));
  };

  return (
    <React.Fragment>
      <FormContext.Provider value={{ inputValues, handleOnChange }}>
        <GlobalStyles />
        {store.isLoading ? (
          <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <Background>
          <GameWrapper>
            {!store.isLoading ? (
              <Game>
                <ManageGameWrapper
                  isInGame={store.isInGame}
                  handleFormSubmit={handleFormSubmit}
                  isGameRunning={store.isGameRunning}
                />
                <LeaderBoardComp
                  visible={store.clients.length > 0}
                  gameId={store.gameId}
                  clients={store.clients}
                  clientId={store.clientId}
                />
                <Divider />
                {store.isInGame ? (
                  <BottomWrapper timeRemaining={store.timeRemaining}>
                    <TimeRemaining>
                      {store.timeRemaining < 0 ? '0' : store.timeRemaining}
                    </TimeRemaining>
                    <Questions
                      question={decodeHTML(store.question || '')}
                      answeredQuestions={store.questionsAnswered}
                    />
                    <Answers
                      checkGuess={checkGuess}
                      answers={store.answers}
                      correctAnswerId={store.correctAnswerId}
                    />
                  </BottomWrapper>
                ) : null}
              </Game>
            ) : null}
          </GameWrapper>
        </Background>
      </FormContext.Provider>
    </React.Fragment>
  );
});

export default App;
