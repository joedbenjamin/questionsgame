import React, { useEffect, useState } from 'react';
import {
  QuestionWrapper,
  QuestionsAnsweredWrapper,
  QuestionMainWrapper,
  QuestionsAnswered,
  GameWrapper,
  Question,
  AnswerWrapper,
  AnswersWrapper,
  AnswersWrapperRow,
  Horizontal,
  BottomWrapper,
  TimeRemaining,
  GlobalStyles,
  Background,
  Game,
} from './questions';
import { Welcome } from './components/welcome';
import { ManageGameWrapper } from './components/form';
import { LeaderBoardComp } from './components/leaderboard';
const ws = new WebSocket(`ws://localhost:8999/`);

var decodeHTML = (html: string) => {
  var el = document.createElement('textarea');
  el.innerHTML = html;
  return el.value;
};

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
      console.log('data', data);
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

      if (!!data.isInGame?.toString()) {
        console.log('isinggame', data.isInGame);
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
      <Background>
        <Welcome name={name} />
        <GameWrapper>
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
          <Game>
            <LeaderBoardComp
              visible={isInGame}
              gameId={gameId}
              clients={clients}
              clientId={clientId}
            />
            <Horizontal />
            <BottomWrapper timeRemaining={timeRemaining}>
              <TimeRemaining>
                {timeRemaining < 0 ? '0' : timeRemaining}
              </TimeRemaining>
              <QuestionWrapper>
                <QuestionMainWrapper>
                  <Question>{decodeHTML(question || '')}</Question>
                </QuestionMainWrapper>
                <QuestionsAnsweredWrapper>
                  {answeredQuestions.map((q: any, index: number) => (
                    <QuestionsAnswered
                      key={index}
                      mode={q === 1 ? 'correct' : q === 0 ? 'incorrect' : ''}
                      count={answeredQuestions.length}
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
          </Game>
        </GameWrapper>
      </Background>
    </React.Fragment>
  );
};

export default App;
