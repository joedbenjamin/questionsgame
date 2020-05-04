import * as WebSocket from 'ws';

export enum eRouteMethods {
  start = 'start',
  create = 'create',
  join = 'join',
  guess = 'guess',
}

export interface IGame {
  id: string;
  currentQuestionId: string;
  done?: boolean;
  hasStarted: boolean;
  timer: number;
  clients: IClient[];
  questions: IQuestion[];
  settings: ISettings;
}

export interface IClient {
  id: string;
  name: string;
  questionsAnswered: number[];
  score: number;
  ws?: WebSocket;
}

export interface ISettings {
  questionsCount: number;
  timePerQuestion: number;
  timeBreakPerQuestion: number;
}

export interface IQuestion {
  id: string;
  seq: number;
  text: string;
  answers: IAnswer[];
  done: boolean;
  hasFirstCorrectAnswer: boolean;
  clientIdWhoAnswered: string[];
}

export interface IAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

