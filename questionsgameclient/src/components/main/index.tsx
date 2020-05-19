import { Divider } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { GameStoreContext } from '../../App';
import {
  BottomWrapper,
  Game,
  GameWrapper,
  TimeRemaining,
} from '../../questions';
import { decodeHTML } from '../../utils';
import Answers from '../answers';
import ManageGameWrapper from '../form';
import LeaderBoardComp from '../leaderboard';
import Questions from '../questions';

const Main: React.SFC<any> = observer(() => {
  const { gameStore } = useContext(GameStoreContext);
  if (!gameStore) {
    return null;
  }

  const {
    answers,
    checkGuess,
    clientId,
    clients,
    correctAnswerId,
    gameId,
    handleFormSubmit,
    isGameRunning,
    isInGame,
    isLoading,
    question,
    questionsAnswered,
    timeRemaining,
    form: {
      handleOnChange,
      name,
      joinGameId,
      numberOfQuestions,
      secondsPerQuestion,
    },
  } = gameStore;

  return (
    <GameWrapper>
      {!isLoading ? (
        <Game>
          <ManageGameWrapper
            handleFormSubmit={handleFormSubmit}
            handleOnChange={handleOnChange}
            isGameRunning={isGameRunning}
            isInGame={isInGame}
            joinGameId={joinGameId}
            name={name}
            numberOfQuestions={numberOfQuestions}
            secondsPerQuestion={secondsPerQuestion}
          />
          <LeaderBoardComp
            clientId={clientId}
            clients={clients}
            gameId={gameId}
            visible={clients.length > 0}
          />
          <Divider />
          {isInGame ? (
            <BottomWrapper timeRemaining={timeRemaining}>
              <TimeRemaining>
                {timeRemaining < 0 ? '0' : timeRemaining}
              </TimeRemaining>
              <Questions
                answeredQuestions={questionsAnswered}
                question={decodeHTML(question || '')}
              />
              <Answers
                answers={answers}
                checkGuess={checkGuess}
                correctAnswerId={correctAnswerId}
              />
            </BottomWrapper>
          ) : null}
        </Game>
      ) : null}
    </GameWrapper>
  );
});

export default Main;
