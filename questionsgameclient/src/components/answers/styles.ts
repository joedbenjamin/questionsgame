import styled from 'styled-components';

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

export { AnswerWrapper, AnswersWrapper, AnswersWrapperRow };
