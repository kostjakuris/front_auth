import { FC, ReactNode } from 'react';

export interface ModalContextProps {
  openModal: (content: ReactNode | FC) => void;
  closeModal: () => void;
}
