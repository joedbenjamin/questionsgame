import React, { useContext } from 'react';
import { useStyles } from './styles';
import { SliderWrapper } from './slider';
import { TextFieldWrapper } from './textfield';
import { ButtonWrapper } from './button';
import { FormContext } from '../../App';
import { FormControl } from '@material-ui/core';
import Copy from '../copy';
import { observer } from 'mobx-react-lite';

interface IManageGameWrapperProps {
  isInGame: boolean;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isGameRunning: boolean;
}

const ManageGameWrapper: React.SFC<IManageGameWrapperProps> = observer(
  ({ isInGame, handleFormSubmit, isGameRunning }) => {
    const classes = useStyles();

    const {
      inputValues: { name, joinGameId, numberOfQuestions, secondsPerQuestion },
      handleOnChange,
    } = useContext(FormContext);
    return (
      <form onSubmit={handleFormSubmit} className={classes.main}>
        {!isInGame ? (
          <div className={classes.inputsWrapper}>
            <FormControl>
              <TextFieldWrapper
                value={name}
                name="name"
                label="Enter Name"
                handleOnChange={handleOnChange}
                required={true}
                maxLength={15}
              />
            </FormControl>
            <TextFieldWrapper
              value={joinGameId}
              name="joinGameId"
              label="Join a game with GameId"
              handleOnChange={handleOnChange}
            />
            <SliderWrapper
              value={numberOfQuestions}
              name="numberOfQuestions"
              label={`${numberOfQuestions} Questions`}
              handleOnChange={handleOnChange}
              min={5}
              max={20}
              visible={!!!joinGameId}
            />
            <SliderWrapper
              value={secondsPerQuestion}
              name="secondsPerQuestion"
              label={`${secondsPerQuestion} Seconds Per Question`}
              handleOnChange={handleOnChange}
              min={3}
              max={20}
              visible={!!!joinGameId}
            />
          </div>
        ) : null}
        <React.Fragment>
          <ButtonWrapper
            label="Create Game"
            visible={!isGameRunning && !isInGame && !!!joinGameId}
          />
          <ButtonWrapper
            label="Join Game"
            visible={!isGameRunning && !isInGame && !!joinGameId}
          />
          <div className={classes.buttonsWrapper}>
            <ButtonWrapper label="Start Game" visible={!isGameRunning && isInGame} />
            <Copy joinGameId={joinGameId} visible={!isGameRunning && isInGame} />
          </div>
        </React.Fragment>
      </form>
    );
  },
);

export default ManageGameWrapper;
