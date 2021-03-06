import { IGame, IQuestion, IAnswer, IClient, eRouteMethods } from '../types';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import questionsJson from '../questions';

import * as WebSocket from 'ws';

interface IGetAnswers {
  correctAnswer: string;
  incorrectAnswers: string[];
}

const shuffle = (array: any[], times: number = 3): any[] => {
  new Array(times).fill(1).forEach(() => {
    array.forEach((el: any, index: number) => {
      const j = Math.floor(Math.random() * index);
      const temp = el;
      array[index] = array[j];
      array[j] = temp;
    });
    if (Math.ceil(Math.random() * 100) % 2 > 0) {
      array = array.reverse();
    }
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

const getQuestions = async (
  count: number,
  ws: WebSocket,
): Promise<IQuestion[]> => {
  sendSocket({ method: eRouteMethods.processing, isLoading: true }, ws);
  const questions = await axios
    .get(`https://opentdb.com/api.php?type=multiple&amount=${100}`, {
      timeout: 2000,
    })
    .then(function (response: any) {
      return shuffle(response.data.results, 2).slice(0, count);
    })
    .catch(() => {
      return shuffle(questionsJson(), 2).slice(0, count);
    });
  const result: any = questions.map((resp: any, index: number) => ({
    id: uuidv4(),
    seq: ++index,
    answers: getAnswers({
      correctAnswer: resp.correct_answer,
      incorrectAnswers: resp.incorrect_answers,
    }),
    text: resp.question,
    clientIdsWhoAnswered: [],
  }));
  sendSocket({ method: eRouteMethods.processing, isLoading: false }, ws);
  return result;
};

const endGame = (interval: NodeJS.Timeout, game: IGame, games: IGame[]) => {
  clearInterval(interval);
  game.done = true;

  game.clients.forEach((client) =>
    sendSocket(
      {
        method: 'endGame',
        endGame: true,
        isInGame: false,
        isGameRunning: false,
      },
      client.ws,
    ),
  );
  sendClients(game);
  //using this to clear the game out, so it doesn't take up memory
  games = games.filter(g => g.id !== game.id)
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
  game.clients.forEach((client) => {
    sendSocket(
      { timeRemaining: Math.ceil((timePerQuestion - time) / 1000).toFixed() },
      client.ws,
    );
  });
};

const startInterval = (game: IGame, games: IGame[]) => {
  let start = Date.now();
  let index = 0;
  sendQuestion(game);
  const { timePerQuestion, timeBreakPerQuestion } = game.settings;

  const interval = setInterval(() => {
    let time = Date.now() - start;

    sendTimeRemaining(time, timePerQuestion, game);

    if (time >= timePerQuestion + timeBreakPerQuestion) {
      game.questions[index].done = true;
      index += 1;

      game?.clients.forEach((client) => {
        if (
          !!!game.questions[index - 1].clientIdsWhoAnswered.find(
            (id) => id == client.id,
          )
        ) {
          client.score -= 2;
        }
      });
      if (!!!game.questions[index]) {
        endGame(interval, game, games);
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
  !!question?.clientIdsWhoAnswered?.find((clientId) => clientId === id);

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
    question.clientIdsWhoAnswered.push(clientId);
    if (answerId === correctAnswerId) {
      client.score += 1;
      client.questionsAnswered[question.seq - 1] = 1;
      if (!question.hasFirstCorrectAnswer) {
        question.hasFirstCorrectAnswer = true;
        //if first to get right, gets bonus of # of players excluding self
        client.score += (game?.clients.length || 1) - 1;
      }
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

const reconnect = (
  games: IGame[],
  gameId: string,
  oldClientId: string,
  newClientId: string,
  ws: any,
) => {
  sendSocket({ method: 'reconnect' }, ws);
  const game = gameById(gameId, games);
  const client = clientById(oldClientId, game?.clients);
  if (client && game && !game.done) {
    client.id = newClientId;
    client.ws = ws;
    sendQuestion(game);
    sendClients(game);
    sendSocket(
      {
        method: 'reconnect',
        isLoading: false,
        oldClientId,
        newClientId,
        gameId,
        clientId: newClientId,
        isGameRunning: game.hasStarted,
        isInGame: true,
        questionsAnswered: client.questionsAnswered
      },
      ws,
    );
  } else {
    sendSocket({ method: 'endGame', isLoading: false, endGame: true, isInGame: false, isGameRunning: false }, ws);
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
  reconnect,
};
