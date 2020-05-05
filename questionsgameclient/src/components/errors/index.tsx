import React from 'react';
import { ErrorsWrapper, ErrorsSpan } from './styles';

const Errors: React.SFC<any> = () => {
  return (
    <ErrorsWrapper>
      <ErrorsSpan>some error here</ErrorsSpan>
    </ErrorsWrapper>
  );
};

export default Errors;
