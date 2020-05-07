import { useState } from 'react';

const useForm = (initialValues: any) => {
  const [inputValues, handleOnChange] = useState<any>(initialValues);
  return {
    inputValues,
    handleOnChange: (name: string, value: string | number | number[]) => {
      handleOnChange({
        ...inputValues,
        [name]: value,
      });
    },
  };
};

export default useForm;
