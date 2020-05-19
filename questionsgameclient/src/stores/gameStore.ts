import { observable, action } from 'mobx';
import { IClient, IAnswer } from './types';
import ReconnectingWebSocket from 'reconnecting-websocket';
import {getWebSocketURL} from '../utils';

class GameFormStore {
  [key: string]: any;

  @observable
  numberOfQuestions: number = 10;

  @observable
  secondsPerQuestion: number = 10;

  @observable
  joinGameId: string = '';

  @observable
  name: string = '';

  @action
  handleOnChange = (name: string, value: string | number | number[]) => {
    this[name] = value;
  }
}

class GameStore {

  ws = new ReconnectingWebSocket(getWebSocketURL());

  @observable form: GameFormStore = new GameFormStore();

  [key: string]: any;

  @observable
  gameId: string = '';

  @observable
  clients: IClient[] = [];

  @observable
  clientId: string = '';

  @observable
  isInGame: boolean = false;

  @observable
  questionsAnswered: number[] = [];

  @observable
  questionId: string = '';

  @observable
  question: string = '';

  @observable
  correctAnswerId: string = '';

  @observable
  isLoading: boolean = false;

  @observable
  answers: IAnswer[] = [];

  @observable
  timeRemaining: number = -1;

  @observable
  isGameRunning: boolean = false;

  @action
  setValuesByName = (name: any) => {
    Object.keys(name).forEach((key: string) => {
      this[key] = name[key];
    });
  };

  @action
  setValueByName = (
    name: string,
    value: string | string[] | number | number[],
  ) => {
    this[name] = value;
  };

  @action
  handleFormSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const {joinGameId} = this.form;
    if (!this.isInGame && !!!joinGameId) {
      this.createGame();
    } else if (!this.isInGame && !!joinGameId) {
      this.joinGame();
    } else if (this.isInGame) {
      this.startGame();
    }
  };

  @action
  checkGuess = (e: any) => {
    var obj = {
      method: 'guess',
      questionId: this.questionId,
      gameId: this.gameId,
      answerId: e.currentTarget.getAttribute('data-id'),
    };
    this.ws.send(JSON.stringify(obj));
  };

  createGame = () => {
    const { numberOfQuestions, secondsPerQuestion, name } = this.form;
    let obj = { method: 'create', name, numberOfQuestions, secondsPerQuestion };
    this.ws.send(JSON.stringify(obj));
  };

  joinGame = () => {
    const { name, joinGameId } = this.form;
    let obj = { method: 'join', gameId: joinGameId, name };
    this.ws.send(JSON.stringify(obj));
  };

  startGame = () => {
    const { gameId } = this;
    let obj = { method: 'start', gameId };
    this.ws.send(JSON.stringify(obj));
  };
}

export interface IGameStore {
  gameStore?: GameStore;
}

const store = new GameStore();
export default store;
