import styled from 'styled-components';

const GameWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  flex-direction: column;
`;

const QuestionWrapper = styled.div`
  width: 90%;
  height: 25em;
  background-color: white;
  border-radius: 0.9375em;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const QuestionMainWrapper = styled.div`
  width: 95%;
  height: 87%;
  background-color: rgba(138, 43, 226, 0.4);
  top: 3%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Question = styled.span`
  color: rgb(75, 0, 130);
  font-weight: bold;
  font-size: 2.5em;
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
`;

const QuestionsAnswered: any = styled.div`
  width: 8%;
  height: 0.625em;
  background-color: ${(props: any) =>
    props.mode === 'correct'
      ? 'green'
      : props.mode === 'incorrect'
      ? 'red'
      : 'lightgrey'};
  border-radius: 1.25em;
`;

const LeaderBoardWrapper: any = styled.div`
  width: 90%;
  background-color: white;
  border-radius: 0.9375em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6em 0;
`;

const LeaderBoard: any = styled.div`
  width: 95%;
  background-color: pink;
  display: flex;
  flex-direction: column;
`;

const Place: any = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding-bottom: 0.3em;
  font-size: 2em;

  span {
    width: 33%;
    text-align: center;
  }
`;

export {
  GameWrapper,
  QuestionsAnsweredWrapper,
  QuestionWrapper,
  QuestionMainWrapper,
  QuestionsAnswered,
  Question,
  LeaderBoardWrapper,
  LeaderBoard,
  Place,
};
