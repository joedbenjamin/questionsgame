import React from 'react';
import {
  QuestionWrapper,
  QuestionMainWrapper,
  QuestionsAnsweredWrapper,
  Question,
  QuestionsAnswered,
} from './styles';

interface IQuestionsProps {
  question: string;
  answeredQuestions: any[];
}

const Questions: React.SFC<IQuestionsProps> = ({
  question,
  answeredQuestions,
}) => (
  <QuestionWrapper>
    <QuestionMainWrapper>
      <Question>{question}</Question>
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
);

export default Questions;
