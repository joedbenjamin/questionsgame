import styled from 'styled-components';

export const ErrorsWrapper = styled.div`
  position: absolute;
  top: 25%;
  left: 25%;
  width: 50%;
  height: 30%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 3.125em;
`;

export const ErrorsSpan = styled.span`
  color: red;
  font-size: 2em;
`;
