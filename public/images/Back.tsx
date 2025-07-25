import React, { FC } from 'react';

interface BackArrowProps {
  onClickFn: () => void;
}

const Back: FC<BackArrowProps> = ({onClickFn}) => {
  return (
    <svg
      className={'-rotate-90 cursor-pointer'}
      onClick={onClickFn}
      width='30px'
      height='30px'
      fill='white'
      id='_1-Arrow_Up'
      data-name='1-Arrow Up'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 32 32'>
      <path d='M26.71,10.29l-10-10a1,1,0,0,0-1.41,0l-10,10,1.41,1.41L15,3.41V32h2V3.41l8.29,8.29Z' />
    </svg>
  );
};

export default Back;