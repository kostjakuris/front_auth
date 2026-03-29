import React from 'react';
import { IconProps } from './Edit';

const Search = ({className, ...props}: IconProps) => {
  return (
    <svg className={className} {...props} width='20px' height='20px' viewBox='0 0 512 512'
      xmlns='http://www.w3.org/2000/svg' fill='#FFFFFFB3'
      stroke='#FFFFFFB3'>
      <g id='SVGRepo_bgCarrier' strokeWidth='0' />
      <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' />
      <g id='SVGRepo_iconCarrier'>
        <title>ionicons-v5-f</title>
        <path d='M221.09,64A157.09,157.09,0,1,0,378.18,221.09,157.1,157.1,0,0,0,221.09,64Z'
          style={{fill: 'none', stroke: '#FFFFFFB3', strokeMiterlimit: 10, strokeWidth: '32px'}} />
        <line x1='338.29' y1='338.29' x2='448' y2='448'
          style={{
            fill: 'none',
            stroke: '#FFFFFFB3',
            strokeLinecap: 'round',
            strokeMiterlimit: '10',
            strokeWidth: '32px'
          }} />
      </g>
    </svg>
  );
};

export default Search;