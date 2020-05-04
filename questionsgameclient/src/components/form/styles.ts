import styled, { css } from 'styled-components';

const flex_center = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputsWrapper = styled.div`
  ${flex_center}
  flex-direction: column;
  width: 100%;
  height: auto;
  margin-top: 2em;
`;

const InputWrapper = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border: none;
  margin-bottom: 0.5em;
  background-color: rgba(0, 0, 0, 0.7);
  height: 2.5em;

  @media (max-width: 38.4em) {
    width: 90%;
  }
`;

const Input = styled.input`
  color: white;
  border: none;
  outline: none;
  background: none;
  font-size: 1.2em;
  text-align: center;

  &::placeholder {
    color: lightgrey;
  }
`;

const ButtonsWrapper = styled.div`
  width: 80%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  font-size: 1.3em;
  margin-bottom: 1em;
`;

const Button = styled.div`
  width: 40%;
  max-width: 200px;
  height: 2em;
  background-color: brown;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 3.125em;
  color: white;
  box-shadow: 0 1em 1em 0 rgba(0, 0, 0, 1);
  margin: 0 1em;

  &:hover {
    cursor: pointer;
  }
`;

export { Input, InputsWrapper, InputWrapper, Button, ButtonsWrapper };

