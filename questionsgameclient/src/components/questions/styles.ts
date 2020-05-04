import styled from 'styled-components';

const QuestionWrapper: any = styled.div`
  width: 90%;
  max-width: 37.5em;
  height: 15em;
  background-color: white;
  border-radius: 0.9375em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const QuestionMainWrapper = styled.div`
  width: 95%;
  height: 87%;
  background-color: rgba(150, 0, 0, 0.5);
  top: 3%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Question = styled.span`
  color: black;
  font-weight: bold;
  font-size: 2.2em;
  text-align: center;
`;

const QuestionsAnsweredWrapper = styled.div`
  width: 95%;
  height: 7%;
  top: 4%;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
`;

const QuestionsAnswered: any = styled.div`
  width: ${(props: any) => 100 / props.count - 1}%;
  height: 0.625em;
  background-color: ${(props: any) =>
    props.mode === 'correct'
      ? 'rgba(0,255,0,.6)'
      : props.mode === 'incorrect'
      ? 'rgba(255,0,0,.6)'
      : 'lightgrey'};
  border-radius: 1.25em;
`;

export {
  Question,
  QuestionsAnswered,
  QuestionsAnsweredWrapper,
  QuestionMainWrapper,
  QuestionWrapper,
};
