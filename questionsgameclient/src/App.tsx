import React from 'react';
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
  Place,
} from './questions';

const GlobalStyles = createGlobalStyle`
  html, body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    font-size: 16px;
    margin: 0;
    background-color: black;
  }
`;

const App = () => {
  return (
    <React.Fragment>
      <GlobalStyles />
      <GameWrapper>
        <LeaderBoardWrapper>
          <LeaderBoard>
            <span>LeaderBoard</span>
            <Place>
              <span>Place</span>
              <span>Name</span>
              <span>Score</span>
            </Place>
            <Place>
              <span>1</span>
              <span>Joe</span>
              <span>5</span>
            </Place>
            <Place>
              <span>2</span>
              <span>Jay</span>
              <span>10</span>
            </Place>
            <Place>
              <span>3</span>
              <span>Jane</span>
              <span>4</span>
            </Place>
            <Place>
              <span>4</span>
              <span>Alexa</span>
              <span>1</span>
            </Place>
          </LeaderBoard>
        </LeaderBoardWrapper>
        <QuestionWrapper>
          <QuestionMainWrapper>
            <Question>
              By volume, which lake is the largest lake on its continent?
            </Question>
          </QuestionMainWrapper>
          <QuestionsAnsweredWrapper>
            <QuestionsAnswered mode="correct" />
            <QuestionsAnswered mode="incorrect" />
            <QuestionsAnswered mode="correct" />
            <QuestionsAnswered mode="incorrect" />
            <QuestionsAnswered />
            <QuestionsAnswered />
            <QuestionsAnswered />
            <QuestionsAnswered />
            <QuestionsAnswered />
            <QuestionsAnswered />
          </QuestionsAnsweredWrapper>
        </QuestionWrapper>
      </GameWrapper>
    </React.Fragment>
  );
};

export default App;
