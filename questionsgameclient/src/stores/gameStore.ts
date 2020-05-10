import { observable, action } from 'mobx';
import {IGame, IClient, IAnswer} from './types';


class GameStore implements IGame {
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
      this[key] = name[key]
    });
  }

  @action
  setValueByName = (name: string, value: string | string[] | number | number[]) => {
    this[name] = value;
  }
}

const store = new GameStore();

export default store;
