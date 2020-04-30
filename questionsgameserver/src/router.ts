import { isClientInGame, createGame, joinGame, startGame } from './games';
import { IGame, eRouteMethods } from './types';
import * as WebSocket from 'ws';

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
      const game = await createGame(
        clientId,
        {
          questionsCount: 5,
          timePerQuestion: 10000,
        },
        ws,
      );
      games.push(game);
      console.log('game created ', game.id);
    }

    if (
      obj?.method === eRouteMethods.join &&
      !isClientInGame(games, clientId)
    ) {
      const gameId = obj?.gameId;
      joinGame(games, gameId, clientId);
    }

    if (obj?.method === eRouteMethods.start) {
      const gameId = obj?.gameId;
      startGame(games, gameId);
    }
  } catch (e) {
    console.log('errors');
  }
};
