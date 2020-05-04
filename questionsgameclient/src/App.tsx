import React, { useEffect, useState } from 'react';
import {
  GameWrapper,
  Horizontal,
  BottomWrapper,
  TimeRemaining,
  GlobalStyles,
  Background,
  Game,
} from './questions';
import Welcome from './components/welcome';
import ManageGameWrapper from './components/form';
import LeaderBoardComp from './components/leaderboard';
import { LeaderBoardSection } from './components/leaderboard/styles';
import Questions from './components/questions';
import { decodeHTML } from './utils';
import Answers from './components/answers';

const ws = new WebSocket(`ws://localhost:8999/`);

const App = () => {
  const [gameId, setGameId] = useState('');
  const [joinGameId, setJoinGameId] = useState('');
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [question, setQuestion]: any = useState('');
  const [questionId, setQuestionId]: any = useState('');
  const [answers, setAnswers]: any = useState([]);
  const [correctAnswerId, setCorrectAnswerId]: any = useState(undefined);
  const [answeredQuestions, setAnsweredQuestions]: any = useState([]);
  const [clientId, setClientId]: any = useState('');
  const [timeRemaining, setTimeRemaining]: any = useState(-1);
  const [isInGame, setIsInGame]: any = useState(false);
  useEffect(() => {
    ws.onmessage = function (event) {
      // console.log(event);
      const data = JSON.parse(event.data);

      // if (data.method === 'create') {
      //   setGameId(data.gameId);
      //   setClients(data.clients);
      //   setClientId(data.clientId);
      //   setIsInGame(data.isInGame);
      // }
      // if (data.method === 'setClient') {
      //   setClientId(data.clientId);
      //   setIsInGame(data.isInGame);
      // }
      // if (data.method === 'updateClients') {
      //   setGameId(data.gameId || gameId);
      //   setClients(data.clients);
      // }
      // if (data.questionsAnswered) {
      //   setAnsweredQuestions(data.questionsAnswered);
      // }
      // if (data.method === 'sendQuestion') {
      //   setQuestion(data.question);
      //   setQuestionId(data.questionId);
      //   setCorrectAnswerId(undefined);
      //   setAnswers(data.answers);
      // }
      // if (data.method === 'checkGuess') {
      //   setCorrectAnswerId(data.correctAnswerId);
      //   setAnsweredQuestions(data.questionsAnswered);
      // }
      //
      // if (data.timeRemaining) {
      //   setTimeRemaining(data.timeRemaining);
      // }
      //
      // if (!!data.isInGame?.toString()) {
      //   console.log('isinggame', data.isInGame);
      //   setIsInGame(data.isInGame);
      // }

      if (data.gameId) {
        setGameId(data.gameId);
      }

      if (data.clientId) {
        setClientId(data.clientId);
      }

      if (data.clients) {
        setClients(data.clients);
      }

      if (data.question) {
        setQuestion(data.question);
        setQuestionId(data.questionId);
        setCorrectAnswerId(undefined);
      }

      if (data.timeRemaining) {
        setTimeRemaining(data.timeRemaining);
      }

      if (data.answers) {
        setAnswers(data.answers);
      }

      if (data.correctAnswerId) {
        console.log(data);
        setCorrectAnswerId(data.correctAnswerId);
      }

      if (data.questionsAnswered) {
        setAnsweredQuestions(data.questionsAnswered);
      }

      if (!!data.isInGame?.toString()) {
        console.log('isinggame', data.isInGame);
        setIsInGame(data.isInGame);
      }

      if (data.method === 'endGame') {
        setGameId('-1');
        setJoinGameId('');
        setIsInGame(data.isInGame);
      }
    };
    ws.onopen = () => {
      // let obj = { method: 'create' };
      // ws.send(JSON.stringify(obj));
    };
  }, []);

  const createGame = () => {
    let obj = { method: 'create', name };
    ws.send(JSON.stringify(obj));
  };

  const joinGame = () => {
    let obj = { method: 'join', gameId: joinGameId, name };
    ws.send(JSON.stringify(obj));
  };

  const startGame = () => {
    let obj = { method: 'start', gameId: gameId };
    ws.send(JSON.stringify(obj));
  };

  const checkGuess = (e: any) => {
    var obj = {
      method: 'guess',
      questionId,
      gameId,
      answerId: e.currentTarget.getAttribute('data-id'),
    };
    ws.send(JSON.stringify(obj));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleJoinGameIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinGameId(e.currentTarget.value);
  };

  return (
    <React.Fragment>
      <GlobalStyles />
      <Background>
        <Welcome name={name} />
        <GameWrapper>
          <Game>
            <ManageGameWrapper
              handleNameChange={handleNameChange}
              name={name}
              handleJoinGameIdChange={handleJoinGameIdChange}
              joinGameId={joinGameId}
              createGame={createGame}
              joinGame={joinGame}
              startGame={startGame}
              isInGame={isInGame}
            />
            <LeaderBoardSection>
              <LeaderBoardComp
                visible={!!gameId}
                gameId={gameId}
                clients={clients}
                clientId={clientId}
              />
            </LeaderBoardSection>
            <Horizontal />
            <BottomWrapper timeRemaining={timeRemaining}>
              <TimeRemaining>
                {timeRemaining < 0 ? '0' : timeRemaining}
              </TimeRemaining>
              <Questions
                question={decodeHTML(question || '')}
                answeredQuestions={answeredQuestions}
              />
              <Answers
                checkGuess={checkGuess}
                answers={answers}
                correctAnswerId={correctAnswerId}
              />
            </BottomWrapper>
          </Game>
        </GameWrapper>
      </Background>
    </React.Fragment>
  );
};

export default App;
