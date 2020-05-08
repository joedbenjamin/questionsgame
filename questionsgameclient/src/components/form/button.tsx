import React from 'react';
import { Button } from '@material-ui/core';

interface IButton {
  label: string;
  visible: boolean;
}

export const ButtonWrapper: React.SFC<IButton> = ({
  label,
  visible,
}) => {
  return visible ? (
    <React.Fragment>
      <Button type="submit" variant="contained" color="secondary">
        {label}
      </Button>
    </React.Fragment>
  ) : null;
};
