import styled, { createGlobalStyle, css } from 'styled-components';
import imgBg from '../bg6.jpg';
import loadingGif from '../lg.gif';

const GlobalStyles = createGlobalStyle`
  html, body {
    overflow: hidden;
    width: 100vw;
    height: 100vh;
    margin: 0;
    font-size: 12px;
    transition: font-size 500ms;

    @media(min-width: 768px) {
      font-size: 16px;
    }
  }
`;
interface ILoading {
  isLoading: boolean;
}
export const Loading = styled.div<ILoading>`
  width: ${(props) => (props.isLoading ? '100%' : '0')};
  opacity: ${(props) => (props.isLoading ? '1' : '0')};
  height: 100%;
  position: absolute;
  margin: 0 auto;
  z-index: 20;
  background-color: rgba(0, 0, 0, 0.8);
  background-image: url(${loadingGif});
  background-repeat: no-repeat;
  background-position: center;
  background-size: 3em 3em;
  transition: width 500ms, opacity 500ms;
`;

const bg_stuff = css`
  background-image: url(${imgBg});
  background-position: left;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100vw;
`;

const flex_center = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Background = styled.div`
  ${bg_stuff}
  ${flex_center}
  filter: brightness(0.7);
`;

const GameWrapper = styled.div`
  ${flex_center}
  flex-direction: column;
  height: 95%;
  width: 95%;
  overflow: hidden;
  position: absolute;
  box-shadow: 0 1em 1em 0 rgba(0, 0, 0, 1);

  &::after {
    ${bg_stuff}
    content: '';
    position: absolute;
    filter: blur(1.2em) brightness(1.1);
  }
`;

const Game = styled.div`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const BottomWrapper: any = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: ${(props: any) => (props.timeRemaining >= 0 ? `100%` : `0`)};
  opacity: ${(props: any) => (props.timeRemaining >= 0 ? `1` : `0`)};
  transition: width 200ms, opacity 200ms;
  overflow: hidden;
`;

const Horizontal: any = styled.div`
  height: 0.1em;
  width: 100%;
  background-color: black;
  margin: 4em 0;
`;

const QuestionsAndAnswersWrapper: any = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const AnswersWrapper: any = styled.div`
  width: 90%;
  max-width: 37.5em;
  height: 15em;
  background-color: white;
  border-radius: 0.9375em;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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
  width: 48%;
  height: 3em;
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

const CreateGameWrapper: any = styled.div`
  width: 60%;
  margin: 0 auto;
  height: 5.125em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  padding: 1em 0;
  z-index: 1;
`;

const TimeRemaining: any = styled.div`
  font-size: 2em;
  color: white;
  margin: 0.3em;
`;

export {
  GameWrapper,
  AnswersWrapper,
  QuestionsAndAnswersWrapper,
  AnswerWrapper,
  AnswersWrapperRow,
  Horizontal,
  Button,
  CreateGameWrapper,
  BottomWrapper,
  TimeRemaining,
  GlobalStyles,
  Background,
  Game,
};
