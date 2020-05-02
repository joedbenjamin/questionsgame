import styled from 'styled-components';

const GameWrapper = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: brown;
  min-width: 30em;
`;

const BottomWrapper: any = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  width: ${(props: any) => (props.timeRemaining >= 0 ? `90%` : `0`)};
  opacity: ${(props: any) => (props.timeRemaining >= 0 ? `1` : `0`)};
  transition: width 200ms, opacity 200ms;
  overflow: hidden;
`;

const QuestionWrapper: any = styled.div`
  width: 90%;
  max-width: 37.5em;
  height: 15em;
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
`;

const QuestionsAnswered: any = styled.div`
  width: ${100 / 20 - 1}%;
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
  max-width: 37.5em;
  background-color: white;
  border-radius: 0.9375em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6em 0;
`;

const Horizontal: any = styled.div`
  height: 0.2125em;
  width: 100%;
  background-color: black;
  margin: 4em 0;
`;

const LeaderBoard: any = styled.div`
  width: 95%;
  background-color: pink;
  display: flex;
  flex-direction: column;

  /* &::before { */
  /*   content: 'Leader Board'; */
  /*   position: relative; */
  /*   background-color: white; */
  /*   text-align: center; */
  /*   font-size: 1.8em; */
  /*   padding: 0.3em 0; */
  /*   font-weight: bold; */
  /* } */
`;

const PlaceHeader: any = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 2em;

  &:nth-child(2n + 1) {
    background-color: rgba(255, 0, 0, 0.2);
  }
  span {
    width: 33%;
    text-align: center;
  }
`;

const Place: any = styled(PlaceHeader)`
  &::before {
    content: '';
    width: 0.3em;
    height: auto;
    background-color: ${(props: any) => (props.isClient ? `blue` : `none`)};
  }
`;

const QuestionsAndAnswersWrapper: any = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const AnswersWrapper: any = styled(QuestionWrapper)`
  background: none;
  align-items: center;
  margin: 0.1em 0;
  display: flex;
  flex-direction: column;
`;

const AnswersWrapperRow: any = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5em;
  justify-content: space-between;
  align-items: center;
`;

const AnswerWrapper: any = styled.div`
  min-width: 48%;
  height: 2.5em;
  background-color: ${(props: any) => props.backgroundColor};
  border: 0.05em solid black;
  border-radius: 3.125em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;

  span {
    font-size: 1.2em;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Button: any = styled.input`
  height: 2.375em;
  width: 16.25em;
  border-radius: 3.125em;
  background-color: green;
`;

const GameIdWRapper: any = styled.div`
  width: 95%;
  max-width: 25em;
  height: 3em;
  width: 80%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2em;
  text-align: center;
`;

const CreateGameWrapper: any = styled.div`
  width: 60%;
  margin: 0 auto;
  height: 5.125em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  padding: 1em 0;
`;

const TimeRemaining: any = styled.div`
  font-size: 1em;
  color: white;
  margin: .3em;
`

export {
  GameWrapper,
  QuestionsAnsweredWrapper,
  QuestionWrapper,
  QuestionMainWrapper,
  QuestionsAnswered,
  Question,
  LeaderBoardWrapper,
  LeaderBoard,
  PlaceHeader,
  Place,
  AnswersWrapper,
  QuestionsAndAnswersWrapper,
  AnswerWrapper,
  AnswersWrapperRow,
  Horizontal,
  Button,
  GameIdWRapper,
  CreateGameWrapper,
  BottomWrapper,
  TimeRemaining
};
