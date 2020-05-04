import React from 'react';
import { AnswersWrapper, AnswersWrapperRow, AnswerWrapper } from './styles';
import { decodeHTML } from '../../utils';

const getAnswerBackgroundColor = (
  answerId: string,
  correctAnswerId: string,
) => {
  return !!!correctAnswerId
    ? 'white'
    : correctAnswerId === answerId
    ? 'rgba(0,255,0,.6)'
    : 'rgba(255,0,0,.6)';
};

interface IAnswersProps {
  checkGuess: (e: any) => void;
  answers: any[];
  correctAnswerId: string;
}

const Answers: React.SFC<IAnswersProps> = ({
  checkGuess,
  answers,
  correctAnswerId,
}) => (
  <AnswersWrapper>
    <AnswersWrapperRow>
      {answers?.slice(0, 2).map((answer: any) => (
        <AnswerWrapper
          data-id={answer.id}
          key={answer.id}
          onClick={checkGuess}
          backgroundColor={getAnswerBackgroundColor(
            answer.id,
            correctAnswerId,
          )}>
          <span>{decodeHTML(answer.text)}</span>
        </AnswerWrapper>
      ))}
    </AnswersWrapperRow>
    <AnswersWrapperRow>
      {answers?.slice(2, 4).map((answer: any) => (
        <AnswerWrapper
          data-id={answer.id}
          key={answer.id}
          onClick={checkGuess}
          backgroundColor={getAnswerBackgroundColor(
            answer.id,
            correctAnswerId,
          )}>
          <span>{decodeHTML(answer.text)}</span>
        </AnswerWrapper>
      ))}
    </AnswersWrapperRow>
  </AnswersWrapper>
);

export default Answers;
