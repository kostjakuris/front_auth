import React, { FC } from 'react';
import styles from '../authorization/authorization.module.scss';

interface InputProps {
  name: string;
  placeholder?: string;
  type: string;
  value: string;
  onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurFn?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  class_name?: string;
  isTouched?: boolean | undefined;
  error?: string | undefined;
}

const Input: FC<InputProps> = ({
  name,
  placeholder,
  type,
  value,
  onChangeFn,
  onBlurFn,
  isTouched,
  class_name,
  error
}) => {
  return (
    <>
      <input
        className={class_name ? class_name : styles.form__field}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChangeFn}
        onBlur={onBlurFn}
      />
      <div
        className={`${styles.form__unverified_text} ${isTouched && error
          ? styles.form__open
          : styles.form__close},
        `}
      >
        {error}
      </div>
    </>
  );
};

export default Input;