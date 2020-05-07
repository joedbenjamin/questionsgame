import { ISettings, IGame, eRouteMethods, eQuestionAnswered } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';
import { getQuestions, startInterval, gameById, sendSocket } from './helper';

export const createGame = async (
  clientId: string,
  settings: ISettings,
  ws: WebSocket,
  name: string,
  games: IGame[],
) => {
  const questions = await getQuestions(settings.questionsCount, ws);
  console.log('questions ', questions);
  const game = {
    settings: settings,
    id: uuidv4(),
    timer: settings.timePerQuestion,
    clients: [
      {
        id: clientId,
        name,
        score: 0,
        ws,
        questionsAnswered: new Array(settings.questionsCount).fill(
          eQuestionAnswered.notAnswered,
        ),
      },
    ],
    questions,
    currentQuestionId: questions[0].id,
    hasStarted: false,
  };
  games.push(game);
  sendSocket(
    {
      method: eRouteMethods.create,
      gameId: game.id,
      clients: game.clients,
      clientId,
      isInGame: true,
    },
    ws,
  );
};

export const joinGame = (
  games: IGame[],
  gameId: string,
  clientId: string,
  name: string,
  ws: WebSocket,
) => {
  const game = gameById(gameId, games);
  if (game && !game.hasStarted) {
    game?.clients.push({
      id: clientId,
      name,
      score: 0,
      ws,
      questionsAnswered: new Array(game.settings.questionsCount).fill(
        eQuestionAnswered.notAnswered,
      ),
    });
    sendSocket(
      { method: 'setClient', clientId, isInGame: true, gameId: game?.id },
      ws,
    );
    game?.clients.forEach((client) => {
      sendSocket(
        {
          method: 'updateClients',
          clients: game?.clients,
        },
        client?.ws,
      );
    });
  }
};

export const startGame = (games: IGame[], gameId: string) => {
  const game = gameById(gameId, games);
  if (game && !game.hasStarted) {
    game.hasStarted = true;
    game?.clients.forEach((client) => {
      sendSocket(
        {
          questionsAnswered: new Array(game.settings.questionsCount).fill(
            eQuestionAnswered.notAnswered,
          ),
        },
        client?.ws,
      );
    });
    startInterval(game);
  }
};
