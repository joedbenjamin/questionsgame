import { ISettings, IGame } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as WebSocket from 'ws';
import { getQuestions, startTimer, gameById, sendSocket } from './helper';

export const createGame = async (
  clientId: string,
  settings: ISettings,
  ws: WebSocket,
  name: string,
  games: IGame[],
) => {
  const questions = await getQuestions(settings.questionsCount);
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
        questionsAnswered: new Array(settings.questionsCount).fill(-1),
      },
    ],
    questions,
    currentQuestionId: questions[0].id,
    hasStarted: false,
  };
  games.push(game);
  sendSocket(
    {
      gameId: game.id,
      clients: game.clients,
      questionsCount: game.settings.questionsCount,
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
  game?.clients.push({
    id: clientId,
    name,
    score: 0,
    ws,
    questionsAnswered: new Array(game.settings.questionsCount).fill(-1),
  });
  sendSocket({ isInGame: true }, ws);
};

export const startGame = (games: IGame[], gameId: string) => {
  const game = gameById(gameId, games);
  game?.clients.forEach((client) => {
    sendSocket(
      { questionsAnswered: new Array(game.settings.questionsCount).fill(-1) },
      client?.ws,
    );
  });
  if (game && !game.hasStarted) {
    game.hasStarted = true;
    startTimer(game, games);
  }
};
