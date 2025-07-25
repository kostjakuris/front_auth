import React, { FC } from 'react';

interface DeleteProps {
  class_name?: string;
}

export const Delete:FC<DeleteProps> = ({class_name}) => {
  return (
    <svg className={class_name} width="30" height="30" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.75 22.5C8.0625 22.5 7.47375 22.255 6.98375 21.765C6.49375 21.275 6.24917 20.6867 6.25 20V3.75H5V1.25H11.25V0H18.75V1.25H25V3.75H23.75V20C23.75 20.6875 23.505 21.2763 23.015 21.7663C22.525 22.2563 21.9367 22.5008 21.25 22.5H8.75ZM21.25 3.75H8.75V20H21.25V3.75ZM11.25 17.5H13.75V6.25H11.25V17.5ZM16.25 17.5H18.75V6.25H16.25V17.5Z" fill="white"/>
    </svg>
  );
};


