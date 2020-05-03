import styled, { css } from 'styled-components';

const bgColor = css`rgba(255,255,255,.85)`;

const Wrapper: any = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LeaderBoardWrapper: any = styled.div`
  width: 90%;
  max-width: 37.5em;
  background-color: ${bgColor};
  border-radius: 0.9375em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6em 0;
`;

const GameIdWRapper: any = styled.div`
  width: 95%;
  max-width: 25em;
  height: 3em;
  width: 80%;
  background-color: ${bgColor};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2em;
  text-align: center;
`;

const LeaderBoard: any = styled.div`
  width: 95%;
  /* background-color: pink; */
  display: flex;
  flex-direction: column;
`;

const PlaceHeader: any = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 2em;

  &:nth-child(2n + 1) {
    background-color: rgba(255, 0, 0, 0.2);
  }

  &:nth-child(2n) {
    background-color: rgba(150, 0, 0, 0.5);
  }
  span {
    width: 33%;
    text-align: center;
  }
`;

const Place: any = styled(PlaceHeader)`
  &::before {
    content: '';
    width: 1em;
    height: auto;
    background-color: ${(props: any) => (props.isClient ? `black` : `none`)};
  }
`;
export {
  Wrapper,
  PlaceHeader,
  Place,
  LeaderBoard,
  GameIdWRapper,
  LeaderBoardWrapper,
};
