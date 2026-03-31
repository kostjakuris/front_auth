import React, { FC } from 'react';
import styles from './input.module.scss';
import Attach from '../../../../public/images/Attach';
import Camera from '../../../../public/images/Camera';

interface InputFileProps {
  onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonImage: React.ReactNode;
}

const InputFile: FC<InputFileProps> = ({
  onChangeFn,
  buttonImage
}) => {
  return (
    <div className={'relative flex items-center h-full'}>
      <input
        type={'file'}
        onChange={onChangeFn}
        className={'opacity-0 w-full h-full absolute t-0 l-0 z-2 cursor-pointer'}
      />
      <button className={`${styles.input__image} w-fit h-fit flex items-center justify-center`}>
        {buttonImage}
      </button>
    </div>
  );
};

export default InputFile;