import React from 'react';
import { Button } from '@material-ui/core';

interface IButton {
  onClick: (value: any) => void;
  label: string;
  visible: boolean;
}

export const ButtonWrapper: React.SFC<IButton> = ({
  label,
  onClick,
  visible,
}) => {
  return visible ? (
    <React.Fragment>
      <Button variant="contained" color="secondary" onClick={onClick}>
        {label}
      </Button>
    </React.Fragment>
  ) : null;
};
