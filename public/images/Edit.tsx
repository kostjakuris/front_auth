import React, { FC } from 'react';

interface EditProps {
  class_name?: string;
}

export const Edit: FC<EditProps> = ({class_name}) => {
  return (
    <svg className={class_name} width='23' height='23' viewBox='0 0 25 20' fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M2.5 20.3125H4.25L15.0312 9.53125L13.2812 7.78125L2.5 18.5625V20.3125ZM20.375 7.71875L15.0625 2.46875L16.8125 0.71875C17.2917 0.239583 17.8804 0 18.5788 0C19.2771 0 19.8654 0.239583 20.3438 0.71875L22.0938 2.46875C22.5729 2.94792 22.8229 3.52625 22.8438 4.20375C22.8646 4.88125 22.6354 5.45917 22.1562 5.9375L20.375 7.71875ZM18.5625 9.5625L5.3125 22.8125H0V17.5L13.25 4.25L18.5625 9.5625ZM14.1562 8.65625L13.2812 7.78125L15.0312 9.53125L14.1562 8.65625Z'
        fill='white' />
    </svg>
  
  );
};

