import React from 'react';
import { Typography, Slider } from '@material-ui/core';

interface ISlider {
  handleOnChange: (name: string, value: string | number | number[]) => void;
  value: number;
  label: string;
  name: string;
}

export const SliderWrapper: React.SFC<ISlider> = ({
  value,
  label,
  handleOnChange,
  name,
}) => {
  return (
    <React.Fragment>
      <Typography color="primary" id="discrete-slider-custom" gutterBottom>
        {label}
      </Typography>
      <Slider
        aria-labelledby="discrete-slider-small-steps"
        min={5}
        max={25}
        name={name}
        valueLabelDisplay="auto"
        value={value}
        onChange={(_: any, newValue) => handleOnChange(name, newValue)}
        color="secondary"
      />
    </React.Fragment>
  );
};
