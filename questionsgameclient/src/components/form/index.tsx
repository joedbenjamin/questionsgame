import React, { useContext } from 'react';
import { useStyles } from './styles';
import { SliderWrapper } from './slider';
import { TextFieldWrapper } from './textfield';
import { ButtonWrapper } from './button';
import { FormContext } from '../../App';
import { FormControl } from '@material-ui/core';
import Copy from '../copy';

interface IManageGameWrapperProps {
  isInGame: boolean;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ManageGameWrapper: React.SFC<IManageGameWrapperProps> = ({
  isInGame,
  handleFormSubmit,
}) => {
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
            label="Enter GameId to Join Game"
            handleOnChange={handleOnChange}
          />
          <SliderWrapper
            value={numberOfQuestions}
            name="numberOfQuestions"
            label={`${numberOfQuestions} Questions`}
            handleOnChange={handleOnChange}
            min={5}
            max={20}
          />
          <SliderWrapper
            value={secondsPerQuestion}
            name="secondsPerQuestion"
            label={`${secondsPerQuestion} Seconds Per Question`}
            handleOnChange={handleOnChange}
            min={10}
            max={20}
          />
        </div>
      ) : null}
      <React.Fragment>
        <ButtonWrapper
          label="Create Game"
          visible={!isInGame && !!!joinGameId}
        />
        <ButtonWrapper label="Join Game" visible={!isInGame && !!joinGameId} />
        <div className={classes.buttonsWrapper}>
          <ButtonWrapper label="Start Game" visible={isInGame} />
          <Copy joinGameId={joinGameId} visible={isInGame} />
        </div>
      </React.Fragment>
    </form>
  );
};

export default ManageGameWrapper;
