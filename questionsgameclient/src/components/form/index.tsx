import React, { useContext } from 'react';
import { useStyles } from './styles';
import { SliderWrapper } from './slider';
import { TextFieldWrapper } from './textfield';
import { ButtonWrapper } from './button';
import { FormContext } from '../../App';
import useForm from './useForm';

interface IManageGameWrapperProps {
  createGame: () => void;
  joinGame: () => void;
  startGame: () => void;
  isInGame: boolean;
}

const ManageGameWrapper: React.SFC<IManageGameWrapperProps> = ({
  createGame,
  joinGame,
  startGame,
  isInGame,
}) => {
  const classes = useStyles();

  const {inputValues, handleOnChange} = useContext(FormContext);
  return (
    <div className={classes.main}>
      {!isInGame ? (
        <div className={classes.inputsWrapper}>
          <TextFieldWrapper
            value={inputValues.name}
            name="name"
            label="Enter Name"
            handleOnChange={handleOnChange}
          />
          <TextFieldWrapper
            value={inputValues.joinGameId}
            name="joinGameId"
            label="Enter GameId to Join Game"
            handleOnChange={handleOnChange}
          />
          <SliderWrapper
            value={inputValues.numberOfQuestions}
            name="numberOfQuestions"
            label={`${inputValues.numberOfQuestions} Questions`}
            handleOnChange={handleOnChange}
          />
          <SliderWrapper
            value={inputValues.secondsPerQuestion}
            name="secondsPerQuestion"
            label={`${inputValues.secondsPerQuestion} Seconds Per Question`}
            handleOnChange={handleOnChange}
          />
        </div>
      ) : null}
      <React.Fragment>
        {/* <ButtonWrapper */}
        {/*   onClick={createGame} */}
        {/*   label="Create Game" */}
        {/*   visible={!isInGame && !!!joinGameId} */}
        {/* /> */}
        {/* <ButtonWrapper */}
        {/*   onClick={joinGame} */}
        {/*   label="Join Game" */}
        {/*   visible={!isInGame && !!joinGameId} */}
        {/* /> */}
        {/* <ButtonWrapper */}
        {/*   onClick={startGame} */}
        {/*   label="Start Game" */}
        {/*   visible={isInGame} */}
        {/* /> */}
      </React.Fragment>
    </div>
  );
};

export default ManageGameWrapper;
