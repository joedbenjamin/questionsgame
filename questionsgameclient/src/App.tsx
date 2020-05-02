import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import {
  QuestionWrapper,
  QuestionsAnsweredWrapper,
  QuestionMainWrapper,
  QuestionsAnswered,
  GameWrapper,
  Question,
  LeaderBoard,
  LeaderBoardWrapper,
  PlaceHeader,
  Place,
  AnswerWrapper,
  AnswersWrapper,
  QuestionsAndAnswersWrapper,
  AnswersWrapperRow,
  Horizontal,
  Button,
  GameIdWRapper,
  CreateGameWrapper,
  BottomWrapper,
  TimeRemaining
} from './questions';
const ws = new WebSocket(`ws://localhost:8999/`);

const GlobalStyles = createGlobalStyle`
  html, body {
    height: 100%;
    width: 100%;
    font-size: 16px;
    margin: 0;
    background-color: brown;
`;
var decodeHTML = (html: string) => {
  var el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

const App = () => {
  const [gameId, setGameId] = useState(0);
  const [joinGameId, setJoinGameId] = useState('');
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [question, setQuestion]: any = useState('');
  const [questionId, setQuestionId]: any = useState('');
  const [answers, setAnswers]: any = useState([]);
  const [correctAnswerId, setCorrectAnswerId]: any = useState(undefined);
  const [answeredQuestions, setAnsweredQuestions]: any = useState([]);
  const [seq, setSequence]: any = useState(-1);
  const [clientId, setClientId]: any = useState('');
  const [timeRemaining, setTimeRemaining]: any = useState(-1);
  useEffect(() => {
    ws.onmessage = function (event) {
      // console.log(event);
      const data = JSON.parse(event.data);
      if (data.gameId) {
        setGameId(data.gameId);
      }

      if (data.clientId) {
        setClientId(data.clientId);
      }

      if (data.clients) {
        setClients(data.clients);
        // const arry = data.clients.questionsAnswered || [];
        // setAnsweredQuestions(new Array(20).fill(arry));
        // console.log(data);
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

  const places = clients
    .sort((a: any, b: any) => b.score - a.score)
    .map((client: any, index: number) => (
      <Place key={index} isClient={client.id === clientId}>
        <span>{index + 1}</span>
        <span>{client.name}</span>
        <span>{client.score}</span>
      </Place>
    ));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const handleJoinGameIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinGameId(e.currentTarget.value);
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

  const getAnswerBackgroundColor = (answerId: string) => {
    return !!!correctAnswerId
      ? 'white'
      : correctAnswerId === answerId
      ? 'green'
      : 'red';
  };

  return (
    <React.Fragment>
      <GlobalStyles />
      <div>{name}</div>
      {gameId === 0 ? (
        <CreateGameWrapper>
          <input placeholder="Name" onChange={handleNameChange} value={name} />
          <input
            placeholder="Game Id"
            onChange={handleJoinGameIdChange}
            value={joinGameId}
          />
          <Button type="submit" value="Create Game" onClick={createGame} />
          <Button type="submit" value="Join Game" onClick={joinGame} />
        </CreateGameWrapper>
      ) : null}
      <Button type="submit" value="Start Game" onClick={startGame} />
      <GameWrapper>
        {gameId !== 0 ? (
          <React.Fragment>
            <GameIdWRapper>Game ID {gameId}</GameIdWRapper>
            <LeaderBoardWrapper>
              <LeaderBoard>
                <PlaceHeader>
                  <span>Place</span>
                  <span>Name</span>
                  <span>Score</span>
                </PlaceHeader>
                {places}
              </LeaderBoard>
            </LeaderBoardWrapper>
          </React.Fragment>
        ) : null}
        <Horizontal />
        <BottomWrapper timeRemaining={timeRemaining}>
        <TimeRemaining>{timeRemaining < 0 ? '0' : timeRemaining}</TimeRemaining>
          <QuestionWrapper>
            <QuestionMainWrapper>
              <Question>{decodeHTML(question || '')}</Question>
            </QuestionMainWrapper>
            <QuestionsAnsweredWrapper>
              {answeredQuestions.map((q: any, index: number) => (
                <QuestionsAnswered
                  key={index}
                  mode={q === 1 ? 'correct' : q === 0 ? 'incorrect' : ''}
                />
              ))}
            </QuestionsAnsweredWrapper>
          </QuestionWrapper>
          <AnswersWrapper>
            <AnswersWrapperRow>
              {answers?.slice(0, 2).map((answer: any, index: number) => (
                <AnswerWrapper
                  data-id={answer.id}
                  key={answer.id}
                  onClick={checkGuess}
                  backgroundColor={getAnswerBackgroundColor(answer.id)}>
                  <span>{decodeHTML(answer.text)}</span>
                </AnswerWrapper>
              ))}
            </AnswersWrapperRow>
            <AnswersWrapperRow>
              {answers?.slice(2, 4).map((answer: any, index: number) => (
                <AnswerWrapper
                  data-id={answer.id}
                  key={index}
                  onClick={checkGuess}
                  backgroundColor={getAnswerBackgroundColor(answer.id)}>
                  <span>{decodeHTML(answer.text)}</span>
                </AnswerWrapper>
              ))}
            </AnswersWrapperRow>
          </AnswersWrapper>
        </BottomWrapper>
      </GameWrapper>
    </React.Fragment>
  );
};

export default App;
