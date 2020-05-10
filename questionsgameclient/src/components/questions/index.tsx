import React from 'react';
import {
  QuestionWrapper,
  QuestionsAnsweredWrapper,
  QuestionTextWrapper,
  QuestionsAnsweredOutterWrapper,
  useStyles,
} from './styles';
import { Box } from '@material-ui/core';

interface IQuestionsProps {
  question: string;
  answeredQuestions: any[];
}

const Questions: React.SFC<IQuestionsProps> = ({
  question,
  answeredQuestions,
}) => {
  const classes = useStyles({ count: answeredQuestions.length });
  return (
    <QuestionWrapper>
      <QuestionTextWrapper>{question}</QuestionTextWrapper>
      <QuestionsAnsweredOutterWrapper>
        <QuestionsAnsweredWrapper>
          {answeredQuestions.map((aq: any, index: number) => (
            <Box
              key={index}
              className={classes.questionsAnswered}
              bgcolor={
                aq === 1
                  ? 'success.main'
                  : aq === 0
                  ? 'error.main'
                  : 'text.primary'
              }
            />
          ))}
        </QuestionsAnsweredWrapper>
      </QuestionsAnsweredOutterWrapper>
    </QuestionWrapper>
  );
};
//              // mode={q === 1 ? 'correct' : q === 0 ? 'incorrect' : ''}
//
export default Questions;
