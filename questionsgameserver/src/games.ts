import { ISettings, IGame, IQuestion, IAnswer } from './types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import * as WebSocket from 'ws';

interface IGetAnswers {
  correctAnswer: string;
  incorrectAnswers: string[];
}

const shuffle = (array: IAnswer[]): IAnswer[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

export const isClientInGame = (games: IGame[], clientId: string): boolean => {
  let isInGame = false;
  games.forEach((game: IGame) => {
    if (game.clients.filter((client) => client.id === clientId).length > 0) {
      isInGame = true;
    }
  });
  return isInGame;
};

const getAnswers = (answers: IGetAnswers): IAnswer[] => {
  const correctAnswer: IAnswer = {
    id: uuidv4(),
    text: answers.correctAnswer,
    isCorrect: true,
  };
  const incorrectAnswers: IAnswer[] = answers.incorrectAnswers.map(
    (answer: any) => ({
      id: uuidv4(),
      text: answer,
      isCorrect: false,
    }),
  );
  return shuffle([correctAnswer, ...incorrectAnswers]);
};

const getQuestions = async (count: number): Promise<IQuestion[]> => {
  return await axios
    .get(`https://opentdb.com/api.php?type=multiple&amount=${count}`)
    .then(function (response: any) {
      return response.data.results.map((resp: any, index: number) => ({
        id: uuidv4(),
        seq: ++index,
        answers: getAnswers({
          correctAnswer: resp.correct_answer,
          incorrectAnswers: resp.incorrect_answers,
        }),
        text: resp.question,
      }));
    })
    .catch(() => {
      return [];
    });
};

export const createGame = async (
  clientId: string,
  settings: ISettings,
  ws: WebSocket,
): Promise<IGame> => {
  const questions = await getQuestions(settings.questionsCount);
  return {
    settings: settings,
    id: uuidv4(),
    timer: settings.timePerQuestion,
    clients: [{ id: clientId, name: 'joe', score: 0, ws }],
    questions,
    currentQuestionId: 1,
    hasStarted: false,
  };
};

export const joinGame = (games: IGame[], gameId: string, clientId: string) => {
  games
    .find((game) => game.id === gameId)
    ?.clients.push({
      id: clientId,
      name: 'some name',
      score: 0,
    });
};

const startTimer = (games: IGame[], game: IGame, gameId: string) => {
  let start = Date.now();
  const interval = setInterval(() => {
    let time = Date.now() - start;
    game.clients.forEach((client) => {
      client.ws?.send(`time left - ${Math.ceil(11 - time / 1000).toFixed()}`);
    });
    if (time >= game.settings.timePerQuestion) {
      if (!!!game.questions.length) {
        games = games.filter((game) => game.id !== gameId);
        console.log(`games count = ${games.length}`);
        clearInterval(interval);
      } else {
        game.currentQuestionId =
          game.questions[1]?.seq || game.questions[0]?.seq;
        game.questions = game.questions.slice(1);
        console.log('current game ', game);
      }
      start = Date.now();
    }
  }, 1000);
};

export const startGame = (games: IGame[], gameId: string) => {
  const game = games.find((game) => game.id === gameId);
  if (game && !game.hasStarted) {
    game.hasStarted = true;
    startTimer(games, game, gameId);
  }
};
