import React from 'react';
import {
  InputsWrapper,
  InputWrapper,
  Input,
  ButtonsWrapper,
  Button,
} from './styles';

interface IManageGameWrapperProps {
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  handleJoinGameIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  joinGameId: string;
  createGame: () => void;
  joinGame: () => void;
  startGame: () => void;
  isInGame: boolean;
}

const ManageGameWrapper: React.SFC<IManageGameWrapperProps> = ({
  handleNameChange,
  name,
  handleJoinGameIdChange,
  joinGameId,
  createGame,
  joinGame,
  startGame,
  isInGame,
}) => {
  return (
    <InputsWrapper>
      {!isInGame ? (
        <React.Fragment>
          <InputWrapper>
            <Input
              placeholder="Enter Name"
              value={name}
              onChange={handleNameChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              placeholder="Enter Game Id To Join"
              value={joinGameId}
              onChange={handleJoinGameIdChange}
            />
          </InputWrapper>{' '}
        </React.Fragment>
      ) : null}
      <ButtonsWrapper>
        {!isInGame ? (
          <React.Fragment>
            {!joinGameId ? (
              <Button onClick={createGame}>Create Game</Button>
            ) : null}
            {joinGameId ? <Button onClick={joinGame}>Join Game</Button> : null}
          </React.Fragment>
        ) : (
          <Button onClick={startGame}>Start Game</Button>
        )}
      </ButtonsWrapper>
    </InputsWrapper>
  );
};

export default ManageGameWrapper;