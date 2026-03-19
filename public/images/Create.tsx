import React from 'react';
import { IconProps } from './Edit';

export const Create = ({className, ...props}: IconProps) => {
  return (
    <svg className={className} {...props} fill='#ffffff' width='38px' height='38px' viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg'
      id='memory-plus' stroke='#ffffff'>
      <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
      <g id='SVGRepo_iconCarrier'>
        <path d='M12 17H10V12H5V10H10V5H12V10H17V12H12Z'></path>
      </g>
    </svg>
  );
};



