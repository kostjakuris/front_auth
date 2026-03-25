import React from 'react';
import { IconProps } from './Edit';

const File = ({className, ...props}: IconProps) => {
  return (
    <svg className={className} {...props} width='25px' height='25px' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg' fill='#000000'>
      <g id='SVGRepo_bgCarrier' strokeWidth='0' />
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
      <g id='SVGRepo_iconCarrier'>
        <title>default_file</title>
        <path d='M20.414,2H5V30H27V8.586ZM7,28V4H19v6h6V28Z' style={{fill: '#c5c5c5'}} />
      </g>
    </svg>
  );
};

export default File;