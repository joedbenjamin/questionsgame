import { ISettings, IGame, IQuestion, IAnswer, IClient } from './types';
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
        clientIdWhoAnswered: [],
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
  name: string,
): Promise<IGame> => {
  const questions = await getQuestions(settings.questionsCount);
  return {
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
};

export const joinGame = (
  games: IGame[],
  gameId: string,
  clientId: string,
  name: string,
  ws: WebSocket,
) => {
  games
    .find((game) => game.id === gameId)
    ?.clients.push({
      id: clientId,
      name,
      score: 0,
      ws,
      questionsAnswered: new Array(20).fill(-1),
    });
};

const startTimer = (game: IGame) => {
  let start = Date.now();
  let index = 0;
  sendQuestion(game);
  const interval = setInterval(() => {
    let time = Date.now() - start;
    game.clients.forEach((client) => {
      client.ws?.send(
        JSON.stringify({
          timeRemaining: Math.ceil(10 - time / 1000).toFixed(),
        }),
      );
    });
    const question = game.questions[index];
    if (time >= game.settings.timePerQuestion) {
      game.questions[index].done = true;
      index += 1;
      if (!!!game.questions[index]) {
        clearInterval(interval);
      } else {
        game?.clients.forEach((client) => {
          if (
            !!!game.questions[index - 1].clientIdWhoAnswered.find(
              (id) => id == client.id,
            )
          ) {
            client.score -= 2;
          }
        });
        console.log('index', index);
        game.currentQuestionId = game.questions[index]?.id;
        sendQuestion(game);
        sendClients(game);
        console.log('current game ', game);
      }
      start = Date.now();
    }
  }, 500);
};

export const startGame = (games: IGame[], gameId: string) => {
  const game = gameById(gameId, games);
  if (game && !game.hasStarted) {
    game.hasStarted = true;
    startTimer(game);
  }
};

const gameById = (id: string, games: IGame[]) =>
  games.find((game) => game.id === id);

const questionById = (id: string, questions?: IQuestion[]) =>
  questions?.find((question) => question.id === id);

const clientById = (id: string, clients?: IClient[]) =>
  clients?.find((client) => client.id === id);

const getCorrectAnswerId = (answers?: IAnswer[]) =>
  answers?.find((answer) => answer.isCorrect)?.id;

const sendClients = (game?: IGame) => {
  game?.clients.forEach((client) => {
    client?.ws?.send(
      JSON.stringify({
        clients: game.clients.map(({ id, name, score }) => ({
          id,
          name,
          score,
        })),
      }),
    );
  });
};

const sendQuestion = (game: IGame) => {
  const questionId = game.currentQuestionId;
  const question = questionById(questionId, game.questions);

  game.clients.forEach((client) => {
    client.ws?.send(
      JSON.stringify({
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

export const checkGuess = (
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
        correctAnswerId,
        questionsAnswered: client?.questionsAnswered,
      }),
    );
    // sendClients(game);
  }
};
