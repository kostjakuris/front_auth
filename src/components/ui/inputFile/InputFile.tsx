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
    <div className={'relative w-[35px] h-[35px]'}>
      <input
        type={'file'}
        onChange={onChangeFn}
        className={'opacity-0 w-full h-full absolute t-0 l-0 z-2 cursor-pointer'}
        accept='image/png, image/jpeg, .webp, .bmp, video/*'
      />
      <button className={styles.input__image}>
        <Attach />
      </button>
    </div>
  );
};

export default InputFile;