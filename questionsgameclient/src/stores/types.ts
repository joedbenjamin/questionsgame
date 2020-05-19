import * as WebSocket from 'ws';

export enum eRouteMethods {
  start = 'start',
  create = 'create',
  join = 'join',
  guess = 'guess',
  processing = 'processing',
}

export enum eQuestionAnswered {
  notAnswered = -1,
  correct = 1,
  incorrect = 0,
}

export interface IClient {
  id: string;
  name: string;
  questionsAnswered: number[];
  score: number;
  ws?: WebSocket;
}

export interface IQuestion {
  id: string;
  seq: number;
  text: string;
  answers: IAnswer[];
  done: boolean;
  hasFirstCorrectAnswer: boolean;
  clientIdsWhoAnswered: string[];
}

export interface IAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}
