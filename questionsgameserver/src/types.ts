import * as WebSocket from 'ws';

export enum eRouteMethods {
  start = 'start',
  create = 'create',
  join = 'join',
  guess = 'guess',
}

export interface IGame {
  id: string;
  timer: number;
  questions: IQuestion[];
  clients: IClient[];
  currentQuestionId: string;
  settings: ISettings;
  hasStarted: boolean;
}

export interface IClient {
  id: string;
  score: number;
  name: string;
  ws?: WebSocket;
}

export interface ISettings {
  questionsCount: number;
  timePerQuestion: number;
}

export interface IQuestion {
  id: string;
  seq: number;
  text: string;
  answers: IAnswer[];
  done: boolean;
}

export interface IAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

