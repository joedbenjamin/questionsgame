import React from 'react';
import { Typography, Slider } from '@material-ui/core';

interface ISlider {
  handleOnChange: (name: string, value: string | number | number[]) => void;
  value: number;
  label: string;
  name: string;
  min: number;
  max: number;
}

export const SliderWrapper: React.SFC<ISlider> = ({
  value,
  label,
  handleOnChange,
  name,
  min,
  max
}) => {
  return (
    <React.Fragment>
      <Typography color="primary" id="discrete-slider-custom" gutterBottom>
        {label}
      </Typography>
      <Slider
        aria-labelledby="discrete-slider-small-steps"
        min={min}
        max={max}
        name={name}
        valueLabelDisplay="auto"
        value={value}
        onChange={(_: any, value) => handleOnChange(name, value)}
        color="secondary"
      />
    </React.Fragment>
  );
};
