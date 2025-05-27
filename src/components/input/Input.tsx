import React, { FC } from 'react';
import styles from '../authorization/authorization.module.scss';

interface InputProps {
  name: string;
  key: string;
  placeholder: string;
  type: string;
  value: string;
  onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlurFn: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isTouched: boolean | undefined;
  error: string | undefined;
}

const Input: FC<InputProps> = ({name, key, placeholder, type, value, onChangeFn, onBlurFn, isTouched, error}) => {
  return (
    <div className={styles.form__row}>
      <input
        className={styles.form__field}
        name={name}
        key={key}
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
    </div>
  );
};

export default Input;