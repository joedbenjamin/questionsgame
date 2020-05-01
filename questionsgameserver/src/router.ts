import {
  isClientInGame,
  createGame,
  joinGame,
  startGame,
  checkGuess,
} from './games';
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
        obj?.name,
      );
      games.push(game);
      console.log(JSON.stringify({ gameId: game.id }));
      ws.send(JSON.stringify({ gameId: game.id, clients: game.clients }));
    }

    if (
      obj?.method === eRouteMethods.join &&
      !isClientInGame(games, clientId)
    ) {
      const gameId = obj?.gameId;
      joinGame(games, gameId, clientId, obj?.name, ws);
      games
        .find((game) => game.id === gameId)
        ?.clients.forEach((client) => {
          client?.ws?.send(
            JSON.stringify({
              gameId: games.find((game) => game.id === gameId)?.id,
              clients: games.find((game) => game.id === gameId)?.clients,
            }),
          );
        });
    }

    if (obj?.method === eRouteMethods.start) {
      const gameId = obj?.gameId;
      startGame(games, gameId);
    }

    if (obj?.method === eRouteMethods.guess) {
      checkGuess(games, obj.gameId, clientId, obj.answerId, obj.questionId);
    }
  } catch (e) {
    console.log('errors');
  }
};
