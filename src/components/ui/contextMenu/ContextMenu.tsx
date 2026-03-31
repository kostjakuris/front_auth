'use client';
import React, { FC, ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './contextMenu.module.scss';

export interface ContextMenuButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface MenuProps {
  contextMenu: {
    visible: boolean; x: number; y: number; dynamicPosition?: boolean;
  };
  buttons: ContextMenuButton[];
  closeContextMenu: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, buttons, closeContextMenu}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({top: contextMenu.y, left: contextMenu.x});
  
  useLayoutEffect(() => {
    if (!contextMenu.visible || !menuRef.current) return;
    const {width, height} = menuRef.current.getBoundingClientRect();
    let top = contextMenu.y;
    let left = contextMenu.x;
    if (top + height > window.innerHeight) top = contextMenu.y - height;
    if (left + width > window.innerWidth) left = contextMenu.x - width;
    setPos({top: Math.max(0, top), left: Math.max(0, left)});
  }, [contextMenu.visible, contextMenu.x, contextMenu.y]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && contextMenu.visible) {
        closeContextMenu();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);
  
  if (!contextMenu.visible && !menuRef.current) {
    return null;
  }
  
  return (
    <div
      ref={menuRef}
      className={!contextMenu.visible ? 'hidden' : styles.menu}
      style={{top: pos.top, left: pos.left}}>
      {buttons.map((btn, index) => (
        <button key={index} onClick={btn.onClick}
          className={`${styles.btn} ${index === 0 ? 'hover:rounded-t-[15px]' : ''} ${index + 1 === buttons.length ?
            'hover:rounded-b-[15px]' : ''}`}>
          {btn.icon}{btn.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
