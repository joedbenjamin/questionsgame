import { IGame, eRouteMethods } from './types';
import * as WebSocket from 'ws';
import { isClientInGame, checkGuess } from './games/helper';
import { createGame, joinGame, startGame } from './games/games';

export const handleRoute = async (
  message: string,
  games: IGame[],
  clientId: string,
  ws: WebSocket,
) => {
  try {
    const obj = JSON.parse(message);
    if (
      obj?.method === eRouteMethods.create &&
      !isClientInGame(games, clientId)
    ) {
      //hardcoding these for now but the settings can come from a react component or some other way instead of hardcoding
      await createGame(
        clientId,
        {
          questionsCount: 10,
          timePerQuestion: 7000,
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
  } catch (e) {
    //need to clearly state the errors
    console.log('errors');
  }
};
