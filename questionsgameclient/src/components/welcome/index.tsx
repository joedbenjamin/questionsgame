import * as React from 'react';
import styled from 'styled-components';
import { useContext } from 'react';
import {FormContext} from '../../App';

interface IWelcomeProps {
  name: string;
}

const WelcomeWrapper = styled.div`
  font-size: 1.2em;
  width: 4em;
  height: 4em;
  border-radius: 3.125em;
  background-color: white;
  right: 0.2em;
  top: 0.5em;
  position: absolute;
  text-align: right;
  color: black;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  box-shadow: 0 1em 1em 0.1em rgba(0, 0, 0, 1);
`;

const WelcomeText = styled.span`
  font-size: 3em;
`;

const Welcome: React.SFC = () => {
  const {inputValues} = useContext(FormContext);
  return inputValues.name ? (
    <WelcomeWrapper>
      <WelcomeText>{inputValues.name?.toLowerCase()[0]}</WelcomeText>
    </WelcomeWrapper>
  ) : null;
};

export default Welcome;
