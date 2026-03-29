import React, { FC } from 'react';
import styles from './input.module.scss';
import Attach from '../../../../public/images/Attach';

interface InputFileProps {
  onChangeFn: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputFile: FC<InputFileProps> = ({
  onChangeFn,
  
}) => {
  return (
    <div className={'relative flex items-center flex-1 h-full'}>
      <input
        type={'file'}
        onChange={onChangeFn}
        className={'opacity-0 w-full h-full absolute t-0 l-0 z-2 cursor-pointer'}
      />
      <button className={`${styles.input__image} w-full h-full flex items-center justify-center`}>
        <Attach className={'drop-shadow-[0_0_3px_#2242b4]'} />
      </button>
    </div>
  );
};

export default InputFile;