import { IGame, IQuestion, IAnswer, IClient } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import * as WebSocket from 'ws';

interface IGetAnswers {
  correctAnswer: string;
  incorrectAnswers: string[];
}

const shuffle = (array: IAnswer[]): IAnswer[] => {
  array.forEach((el: any, index: number) => {
    const j = Math.floor(Math.random() * index);
    const temp = el;
    array[index] = array[j];
    array[j] = temp;
  });
  return array;
};

const isClientInGame = (games: IGame[], clientId: string): boolean => {
  let isInGame = false;
  games.forEach((game: IGame) => {
    if (!game.done && !!game.clients.find((client) => client.id === clientId)) {
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
    .get(
      `https://opentdb.com/api.php?type=multiple&amount=${count}&category=18`,
    )
    .then(function (response: any) {
      return response.data.results.map((resp: any, index: number) => ({
        id: uuidv4(),
        seq: ++index,
        answers: getAnswers({
          correctAnswer: resp.correct_answer,
          incorrectAnswers: resp.incorrect_answers,
        }),
        text: resp.question,
        clientIdWhoAnswered: [],
      }));
    })
    .catch(() => {
      return [];
    });
};

const endGame = (interval: NodeJS.Timeout, game: IGame) => {
  clearInterval(interval);
  game.done = true;

  game.clients.forEach((client) =>
    sendSocket(
      {
        method: 'endGame',
        endGame: true,
        isInGame: false,
      },
      client.ws,
    ),
  );
  sendClients(game);
};

const updateQuestion = (game: IGame, index: number) => {
  game.currentQuestionId = game.questions[index]?.id;
  sendQuestion(game);
  sendClients(game);
};

const sendTimeRemaining = (
  time: number,
  timePerQuestion: number,
  game: IGame,
) => {
  game.clients.forEach((client) =>
    sendSocket(
      { timeRemaining: Math.ceil((timePerQuestion - time) / 1000).toFixed() },
      client.ws,
    ),
  );
};

const startInterval = (game: IGame) => {
  let start = Date.now();
  let index = 0;
  sendQuestion(game);

  const interval = setInterval(() => {
    let time = Date.now() - start;
    const { timePerQuestion, timeBreakPerQuestion } = game.settings;

    sendTimeRemaining(time, timePerQuestion, game);

    if (time >= timePerQuestion + timeBreakPerQuestion) {
      game.questions[index].done = true;
      index += 1;

      game?.clients.forEach((client) => {
        if (
          !!!game.questions[index - 1].clientIdWhoAnswered.find(
            (id) => id == client.id,
          )
        ) {
          client.score -= 2;
        }
      });
      if (!!!game.questions[index]) {
        endGame(interval, game);
      } else {
        updateQuestion(game, index);
      }
      start = Date.now();
    }
  }, 500);
};

const gameById = (id: string, games: IGame[]) =>
  games.find((game) => game.id === id);

const questionById = (id: string, questions?: IQuestion[]) =>
  questions?.find((question) => question.id === id);

const clientById = (id: string, clients?: IClient[]) =>
  clients?.find((client) => client.id === id);

const getCorrectAnswerId = (answers?: IAnswer[]) =>
  answers?.find((answer) => answer.isCorrect)?.id;

const getClientsToSend = (game?: IGame): any =>
  game?.clients && {
    method: 'updateClients',
    clients: game.clients.map(({ id, name, score }) => ({
      id,
      name,
      score,
    })),
  };

const sendClients = (game?: IGame) => {
  const mappedClients = getClientsToSend(game);
  game?.clients.forEach((client) => sendSocket(mappedClients, client?.ws));
};

const sendQuestion = (game: IGame) => {
  const questionId = game.currentQuestionId;
  const question = questionById(questionId, game.questions);

  game.clients.forEach((client) => {
    client.ws?.send(
      JSON.stringify({
        method: 'sendQuestion',
        question: question?.text,
        questionId,
        answers: question?.answers.map((answer) => ({
          id: answer.id,
          text: answer.text,
        })),
      }),
    );
  });
};

const hasClientAnsweredQuestion = (id: string, question?: IQuestion) =>
  !!question?.clientIdWhoAnswered?.find((clientId) => clientId === id);

const checkGuess = (
  games: IGame[],
  gameId: string,
  clientId: string,
  answerId: string,
  questionId: string,
) => {
  const game = gameById(gameId, games);
  const question = questionById(questionId, game?.questions);
  const client = clientById(clientId, game?.clients);
  const correctAnswerId = getCorrectAnswerId(question?.answers);

  if (client && question && !hasClientAnsweredQuestion(clientId, question)) {
    question.clientIdWhoAnswered.push(clientId);
    if (answerId === correctAnswerId) {
      if (!question.hasFirstCorrectAnswer) {
        question.hasFirstCorrectAnswer = true;
        //if first to get right, gets bonus of # of players excluding yourself
        client.score += (game?.clients.length || 1) - 1;
      }
      client.score += 1;
      client.questionsAnswered[question.seq - 1] = 1;
    } else {
      client.score -= 1;
      client.questionsAnswered[question.seq - 1] = 0;
    }
    client?.ws?.send(
      JSON.stringify({
        method: 'checkGuess',
        correctAnswerId,
        questionsAnswered: client?.questionsAnswered,
      }),
    );
  }
};

const sendSocket = (obj: {}, ws?: WebSocket) =>
  ws && ws.send(JSON.stringify(obj));

export {
  gameById,
  getAnswers,
  getQuestions,
  isClientInGame,
  sendSocket,
  startInterval,
  checkGuess,
};
