import { IGame, eRouteMethods } from './types';
import * as WebSocket from 'ws';
import { isClientInGame, checkGuess, reconnect } from './games/helper';
import { createGame, joinGame, startGame } from './games';

export const handleRoute = async (
  message: string,
  games: IGame[],
  clientId: string,
  ws: WebSocket,
  req: any
) => {
  try {
    const obj = JSON.parse(message);
    console.log(obj);
    if (
      obj?.method === eRouteMethods.create &&
      !isClientInGame(games, clientId)
    ) {
      //hardcoding these for now but the settings can come from a react component or some other way instead of hardcoding
      await createGame(
        clientId,
        {
          questionsCount: obj?.numberOfQuestions,
          timePerQuestion: obj?.secondsPerQuestion * 1000,
          timeBreakPerQuestion: 1500,
        },
        ws,
        obj?.name,
        games,
      );
    }

    if (
      obj?.method === eRouteMethods.join &&
      !isClientInGame(games, clientId)
    ) {
      const gameId = obj?.gameId;
      joinGame(games, gameId, clientId, obj?.name, ws);
    }

    if (obj?.method === eRouteMethods.start) {
      const gameId = obj?.gameId;
      startGame(games, gameId);
    }

    if (obj?.method === eRouteMethods.guess) {
      checkGuess(games, obj.gameId, clientId, obj.answerId, obj.questionId);
    }

    if (obj?.method === 'reconnect') {
      ws.send(JSON.stringify({method: 'reconnect', message: 'tryingt to reconnect'}));
      if(!!obj?.gameId && !!obj?.clientId){
        const newClientId = req.headers['sec-websocket-key'];
        reconnect(games, obj.gameId, obj.clientId, newClientId, ws);
      }
    }
  } catch (e) {
    //need to clearly state the errors
    console.log('errors - ', e);
  }
};
