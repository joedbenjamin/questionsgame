import React from 'react';
import { TextField } from '@material-ui/core';

interface ITextField {
  handleOnChange: (name: string, value: string) => void;
  value: string;
  label: string;
  name: string;
}

export const TextFieldWrapper: React.SFC<ITextField> = ({
  value,
  label,
  handleOnChange,
  name,
}) => {
  return (
    <React.Fragment>
      <TextField
        value={value}
        name={name}
        onChange={(e) => handleOnChange(name, e.target.value)}
        variant="filled"
        InputProps={{ disableUnderline: true, color: 'secondary' }}
        InputLabelProps={{ shrink: true }}
        id="standard-basic"
        label={label}
      />
    </React.Fragment>
  );
};
