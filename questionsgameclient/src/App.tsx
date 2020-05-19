import React, { useEffect } from 'react';
import { useLocalStore, observer } from 'mobx-react-lite';
import { GlobalStyles, Background } from './questions';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import GameStore, { IGameStore } from './stores/gameStore';
import Main from './components/main';
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export const GameStoreContext = React.createContext<IGameStore>({});

export const FormContext = React.createContext<any>({});
const App = observer(() => {
  const gameStore = useLocalStore(() => GameStore);
  const classes = useStyles();

  useEffect(() => {
    const { ws } = gameStore;
    ws.addEventListener('message', function (event) {
      const data = JSON.parse(event.data);
      if (data.clientId) {
        window.localStorage.setItem('clientId', data.clientId);
      }
      if (data.gameId) {
        window.localStorage.setItem('gameId', data.gameId);
        gameStore?.form.handleOnChange('joinGameId', data.gameId);
      }
      if (data.question) {
        gameStore.setValuesByName({ correctAnswerId: undefined });
      }
      if (data.method === 'endGame') {
        gameStore.setValuesByName({ gameId: -1 });
        gameStore?.form.handleOnChange('joinGameId', '');
      }
      gameStore.setValuesByName(data);
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
      gameStore.setValuesByName({ isLoading: true });
    });
  }, []);

  return (
    <React.Fragment>
      <GameStoreContext.Provider value={{ gameStore }}>
        <GlobalStyles />
        {gameStore.isLoading ? (
          <Backdrop className={classes.backdrop} open={true}>
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : null}
        <Background>
          <Main />
        </Background>
      </GameStoreContext.Provider>
    </React.Fragment>
  );
});

export default App;
