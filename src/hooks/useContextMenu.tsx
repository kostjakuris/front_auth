'use client';
import { useState } from 'react';

type ContextMenuBase = {
  visible: boolean;
  x: number;
  y: number;
  messageText: string;
};

type ContextMenuExtra = Record<string, any>;

type ContextMenuState<T extends ContextMenuExtra = {}> = ContextMenuBase & T;

export function useContextMenu<T extends ContextMenuExtra = {}>(
  initialExtra: T = {} as T
) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState<T>>({
    visible: false,
    x: 0,
    y: 0,
    messageText: '',
    ...initialExtra,
  });
  const handleContextMenu = (
    event: any,
    messageText: string,
    extraData?: Partial<T>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      visible: true,
      x: event.pageX,
      y: event.pageY,
      messageText,
      ...initialExtra,
      ...extraData,
    });
  };
  
  const closeContextMenu = () => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };
  
  
  return {
    contextMenu,
    setContextMenu,
    handleContextMenu,
    closeContextMenu,
  };
}
